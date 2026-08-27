package com.drishti.kon.repository;

import com.drishti.kon.dynamo.UserItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbIndex;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;

import java.util.Optional;

/**
 * DynamoDB-backed repository for User accounts.
 *
 * Access patterns:
 *  - findByEmail(email)  → GetItem on PK=USER#email (primary auth path, O(1))
 *  - findById(userId)    → Query on GSI1 PK=USER#ID#userId (used by JWT filter)
 *  - save(item)          → PutItem (upsert)
 *  - existsById(userId)  → Query on GSI1, check if any item returned
 */
@Repository
public class UserRepository {

    private static final Logger log = LoggerFactory.getLogger(UserRepository.class);

    private final DynamoDbTable<UserItem> table;
    private final DynamoDbIndex<UserItem> gsi1;

    public UserRepository(DynamoDbEnhancedClient client,
                          @Value("${dynamodb.table-name:DrishtiKon-Main}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(UserItem.class));
        this.gsi1  = table.index("GSI1");
    }

    public Optional<UserItem> findByEmail(String email) {
        Key key = Key.builder()
                .partitionValue(UserItem.buildPk(email))
                .sortValue("METADATA")
                .build();
        return Optional.ofNullable(table.getItem(key));
    }

    public Optional<UserItem> findById(Long userId) {
        return gsi1.query(r -> r.queryConditional(
                QueryConditional.keyEqualTo(k -> k.partitionValue(UserItem.buildGsi1Pk(userId)))))
                .stream()
                .flatMap(page -> page.items().stream())
                .findFirst();
    }

    public boolean existsById(Long userId) {
        return findById(userId).isPresent();
    }

    public UserItem save(UserItem item) {
        table.putItem(item);
        log.debug("Saved user: {}", item.getEmail());
        return item;
    }
}
