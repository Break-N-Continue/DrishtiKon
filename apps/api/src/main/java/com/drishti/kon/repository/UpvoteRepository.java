package com.drishti.kon.repository;

import com.drishti.kon.dynamo.UpvoteItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.*;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryEnhancedRequest;

import java.util.List;
import java.util.Optional;

/**
 * DynamoDB-backed repository for Upvotes.
 *
 * Upvotes are co-located with their post (PK=POST#<postId>, SK=UPVOTE#<userId>).
 * The PK+SK composite naturally enforces one upvote per user per post.
 * Counting upvotes for a post = Query with filter on SK beginning with "UPVOTE#".
 */
@Repository
public class UpvoteRepository {

    private static final Logger log = LoggerFactory.getLogger(UpvoteRepository.class);

    private final DynamoDbTable<UpvoteItem> table;

    public UpvoteRepository(DynamoDbEnhancedClient client,
                            @Value("${dynamodb.table-name:DrishtiKon-Main}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(UpvoteItem.class));
    }

    public Optional<UpvoteItem> findByPostIdAndUserId(Long postId, Long userId) {
        Key key = Key.builder()
                .partitionValue(UpvoteItem.buildPk(postId))
                .sortValue(UpvoteItem.buildSk(userId))
                .build();
        return Optional.ofNullable(table.getItem(key));
    }

    public boolean existsByPostIdAndUserId(Long postId, Long userId) {
        return findByPostIdAndUserId(postId, userId).isPresent();
    }

    /**
     * Counts upvotes for a post by querying all items under POST#<postId>
     * that have SK beginning with "UPVOTE#".
     */
    public long countByPostId(Long postId) {
        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
                .queryConditional(QueryConditional.sortBeginsWith(k -> k
                        .partitionValue(UpvoteItem.buildPk(postId))
                        .sortValue("UPVOTE#")))
                .build();
        return table.query(request).stream()
                .flatMap(page -> page.items().stream())
                .count();
    }

    public UpvoteItem save(UpvoteItem item) {
        if (item.getPk() == null) {
            item.setPk(UpvoteItem.buildPk(item.getPostId()));
            item.setSk(UpvoteItem.buildSk(item.getUserId()));
            item.setGsi1Pk(UpvoteItem.buildGsi1Pk(item.getUserId()));
            item.setGsi1Sk(UpvoteItem.buildGsi1Sk(item.getCreatedAt()));
        }
        table.putItem(item);
        log.debug("Saved upvote: postId={} userId={}", item.getPostId(), item.getUserId());
        return item;
    }

    public void delete(UpvoteItem item) {
        Key key = Key.builder()
                .partitionValue(item.getPk())
                .sortValue(item.getSk())
                .build();
        table.deleteItem(key);
        log.debug("Deleted upvote: postId={} userId={}", item.getPostId(), item.getUserId());
    }

    /** Posts upvoted by a user, newest-upvoted first, via GSI1. Returns postIds. */
    public List<Long> findUpvotedPostIdsByUserIdOrderByCreatedAtDesc(Long userId) {
        DynamoDbIndex<UpvoteItem> gsi1 = table.index("GSI1");
        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
                .queryConditional(QueryConditional.sortBeginsWith(k -> k
                        .partitionValue(UpvoteItem.buildGsi1Pk(userId))
                        .sortValue("UPVOTE#")))
                .scanIndexForward(false)
                .build();
        return gsi1.query(request).stream()
                .flatMap(page -> page.items().stream())
                .map(UpvoteItem::getPostId)
                .toList();
    }
}
