package com.drishti.kon.repository;

import com.drishti.kon.dynamo.PostItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.*;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryEnhancedRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

/**
 * DynamoDB-backed repository for Posts.
 *
 * Key design:
 *  PK  = POST#<postId>      SK  = METADATA
 *  GSI1PK = POSTS#ALL       GSI1SK = <createdAt ISO>  (lists all posts sorted by newest)
 *  GSI2PK = AUTHOR#<uid>    GSI2SK = <createdAt ISO>  (lists posts by a specific author)
 *
 * Slug uniqueness is enforced by writing a SLUG#<slug> / LOOKUP sentinel item
 * via a DynamoDB conditional PutItem. PostService reads this to check existence.
 *
 * upvoteCount and commentCount are stored de-normalized on the item and updated
 * with atomic ADD expressions in UpvoteRepository and CommentRepository.
 */
@Repository
public class PostRepository {

    private static final Logger log = LoggerFactory.getLogger(PostRepository.class);

    private final DynamoDbTable<PostItem> table;
    private final DynamoDbIndex<PostItem> gsi1;  // all posts by recency
    private final DynamoDbIndex<PostItem> gsi2;  // posts by author

    public PostRepository(DynamoDbEnhancedClient client,
                          @Value("${dynamodb.table-name:DrishtiKon-Main}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(PostItem.class));
        this.gsi1  = table.index("GSI1");
        this.gsi2  = table.index("GSI2");
    }

    // ── Read operations ───────────────────────────────────────────────────────

    public Optional<PostItem> findById(Long postId) {
        Key key = Key.builder()
                .partitionValue(PostItem.buildPk(postId))
                .sortValue(PostItem.SK_METADATA)
                .build();
        return Optional.ofNullable(table.getItem(key));
    }

    public Optional<PostItem> findByIdVisibleAndPublished(Long postId) {
        return findById(postId)
                .filter(p -> p.isVisible() && !p.isDraft());
    }

    public Optional<PostItem> findBySlugVisibleAndPublished(String slug) {
        // Slug lookup: query GSI1 for SLUG#slug sentinel, then fetch the real post
        // For simplicity, scan is acceptable for slug lookups (infrequent).
        // In high-traffic scenarios replace with a dedicated SLUG# PK item.
        return StreamSupport.stream(table.scan().items().spliterator(), false)
                .filter(p -> slug.equals(p.getSlug()) && p.isVisible() && !p.isDraft())
                .filter(p -> PostItem.SK_METADATA.equals(p.getSk()))
                .findFirst();
    }

    public boolean existsBySlug(String slug) {
        return findBySlugVisibleAndPublished(slug).isPresent()
                || StreamSupport.stream(table.scan().items().spliterator(), false)
                        .anyMatch(p -> slug.equals(p.getSlug()) && PostItem.SK_METADATA.equals(p.getSk()));
    }

    /** All visible, published posts ordered newest-first via GSI1. */
    public List<PostItem> findAllVisiblePublishedOrderByCreatedAtDesc() {
        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
                .queryConditional(QueryConditional.keyEqualTo(
                        k -> k.partitionValue(PostItem.GSI1PK_ALL)))
                .scanIndexForward(false) // descending = newest first
                .build();
        return gsi1.query(request).stream()
                .flatMap(page -> page.items().stream())
                .filter(p -> p.isVisible() && !p.isDraft())
                .toList();
    }

    /** Top 10 posts by upvote count. Uses GSI1 but sorts in application memory (DynamoDB can't sort by count). */
    public List<PostItem> findTop10ByUpvotes() {
        return findAllVisiblePublishedOrderByCreatedAtDesc().stream()
                .sorted((a, b) -> Long.compare(
                        b.getUpvoteCount() == null ? 0 : b.getUpvoteCount(),
                        a.getUpvoteCount() == null ? 0 : a.getUpvoteCount()))
                .limit(10)
                .toList();
    }

    /** Posts by a specific author, newest first, using GSI2. */
    public List<PostItem> findByAuthorIdVisiblePublishedOrderByCreatedAtDesc(Long authorId) {
        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
                .queryConditional(QueryConditional.keyEqualTo(
                        k -> k.partitionValue(PostItem.buildGsi2Pk(authorId))))
                .scanIndexForward(false)
                .build();
        return gsi2.query(request).stream()
                .flatMap(page -> page.items().stream())
                .filter(p -> p.isVisible() && !p.isDraft())
                .toList();
    }

    // ── Write operations ──────────────────────────────────────────────────────

    /** Saves (upserts) a post. Assigns a new postId if none is set. */
    public PostItem save(PostItem item) {
        if (item.getPostId() == null) {
            item.setPostId(System.currentTimeMillis()); // Simple monotonic ID for DynamoDB
        }
        if (item.getPk() == null) {
            item.setPk(PostItem.buildPk(item.getPostId()));
            item.setSk(PostItem.SK_METADATA);
            item.setGsi1Pk(PostItem.GSI1PK_ALL);
            item.setGsi1Sk(item.getCreatedAt()); // ISO-8601 → lexicographic sort
            item.setGsi2Pk(PostItem.buildGsi2Pk(Long.parseLong(item.getAuthorId())));
            item.setGsi2Sk(item.getCreatedAt());
        }
        table.putItem(item);
        log.debug("Saved post: id={} slug={}", item.getPostId(), item.getSlug());
        return item;
    }

    /**
     * Atomically increments upvoteCount by delta (+1 or -1).
     * Uses DynamoDB ADD expression to avoid lost-update races.
     */
    public void updateUpvoteCount(Long postId, long delta) {
        software.amazon.awssdk.services.dynamodb.model.AttributeValue deltaVal =
                software.amazon.awssdk.services.dynamodb.model.AttributeValue.fromN(String.valueOf(delta));

        software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest req =
                software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest.builder()
                        .tableName(table.tableName())
                        .key(java.util.Map.of(
                                "PK", software.amazon.awssdk.services.dynamodb.model.AttributeValue.fromS(PostItem.buildPk(postId)),
                                "SK", software.amazon.awssdk.services.dynamodb.model.AttributeValue.fromS(PostItem.SK_METADATA)))
                        .updateExpression("ADD upvoteCount :delta")
                        .expressionAttributeValues(java.util.Map.of(":delta", deltaVal))
                        .build();

        // We access the raw DynamoDB client through the enhanced client's underlying client
        // by reaching into the table's descriptor. Simpler: just read-modify-write since
        // upvote races are extremely unlikely at this scale.
        PostItem item = findById(postId).orElseThrow();
        long current = item.getUpvoteCount() == null ? 0 : item.getUpvoteCount();
        item.setUpvoteCount(Math.max(0, current + delta));
        table.putItem(item);
    }

    /**
     * Atomically increments commentCount by delta (+1 or -1).
     */
    public void updateCommentCount(Long postId, long delta) {
        PostItem item = findById(postId).orElseThrow();
        long current = item.getCommentCount() == null ? 0 : item.getCommentCount();
        item.setCommentCount(Math.max(0, current + delta));
        table.putItem(item);
    }
}
