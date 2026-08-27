package com.drishti.kon.repository;

import com.drishti.kon.dynamo.CommentItem;
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

/**
 * DynamoDB-backed repository for Comments.
 *
 * Comments are co-located with their parent Post (same PK=POST#<postId>).
 * Fetching all comments for a post is a single Query — no JOIN needed.
 *
 * Sort key format: COMMENT#<createdAtISO>#<commentId>
 * This gives chronological ordering for free via lexicographic sort.
 */
@Repository
public class CommentRepository {

    private static final Logger log = LoggerFactory.getLogger(CommentRepository.class);

    private final DynamoDbTable<CommentItem> table;
    private final DynamoDbIndex<CommentItem> gsi1;  // author comment history

    public CommentRepository(DynamoDbEnhancedClient client,
                             @Value("${dynamodb.table-name:DrishtiKon-Main}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(CommentItem.class));
        this.gsi1  = table.index("GSI1");
    }

    /** All comments for a post in chronological order (single Query — no JOINs). */
    public List<CommentItem> findByPostIdOrderByCreatedAtAsc(Long postId) {
        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
                .queryConditional(QueryConditional.sortBeginsWith(k -> k
                        .partitionValue("POST#" + postId)
                        .sortValue("COMMENT#")))
                .scanIndexForward(true) // ascending = chronological
                .build();
        return table.query(request).stream()
                .flatMap(page -> page.items().stream())
                .toList();
    }

    /** Find a specific comment by postId and a comment SK. */
    public Optional<CommentItem> findByCommentIdAndPostId(String commentId, Long postId) {
        return findByPostIdOrderByCreatedAtAsc(postId).stream()
                .filter(c -> commentId.equals(c.getCommentId()))
                .findFirst();
    }

    public Optional<CommentItem> findByCommentId(String commentId) {
        return table.scan().items().stream()
                .filter(c -> commentId.equals(c.getCommentId()))
                .findFirst();
    }

    public Optional<CommentItem> findById(String commentId, Long postId) {
        return findByCommentIdAndPostId(commentId, postId);
    }

    /** Comments written by a specific author, newest first, via GSI1. */
    public List<CommentItem> findByAuthorIdOrderByCreatedAtDesc(Long authorId) {
        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
                .queryConditional(QueryConditional.sortBeginsWith(k -> k
                        .partitionValue(CommentItem.buildGsi1Pk(authorId))
                        .sortValue("COMMENT#")))
                .scanIndexForward(false)
                .build();
        return gsi1.query(request).stream()
                .flatMap(page -> page.items().stream())
                .toList();
    }

    public CommentItem save(CommentItem item) {
        if (item.getCommentId() == null) {
            item.setCommentId(UUID.randomUUID().toString());
        }
        if (item.getPk() == null) {
            item.setPk("POST#" + item.getPostId());
            item.setSk(CommentItem.buildSk(item.getCreatedAt(), item.getCommentId()));
            item.setGsi1Pk(CommentItem.buildGsi1Pk(Long.parseLong(item.getAuthorId())));
            item.setGsi1Sk("COMMENT#" + item.getCreatedAt());
        }
        table.putItem(item);
        log.debug("Saved comment: id={} postId={}", item.getCommentId(), item.getPostId());
        return item;
    }

    public void delete(CommentItem item) {
        Key key = Key.builder()
                .partitionValue(item.getPk())
                .sortValue(item.getSk())
                .build();
        table.deleteItem(key);
        log.debug("Deleted comment: id={}", item.getCommentId());
    }
}
