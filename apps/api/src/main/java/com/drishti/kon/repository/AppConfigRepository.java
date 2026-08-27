package com.drishti.kon.repository;

import com.drishti.kon.dynamo.AppConfigItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.*;

import java.util.Optional;

/**
 * DynamoDB-backed repository for AppConfig key-value pairs.
 */
@Repository
public class AppConfigRepository {

    private static final Logger log = LoggerFactory.getLogger(AppConfigRepository.class);

    private final DynamoDbTable<AppConfigItem> table;

    public AppConfigRepository(DynamoDbEnhancedClient client,
                               @Value("${dynamodb.table-name:DrishtiKon-Main}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(AppConfigItem.class));
    }

    public Optional<AppConfigItem> findByKey(String key) {
        Key ddbKey = Key.builder()
                .partitionValue(AppConfigItem.buildPk(key))
                .sortValue(AppConfigItem.SK_METADATA)
                .build();
        return Optional.ofNullable(table.getItem(ddbKey));
    }

    public boolean existsByKey(String key) {
        return findByKey(key).isPresent();
    }

    public AppConfigItem save(AppConfigItem item) {
        if (item.getPk() == null) {
            item.setPk(AppConfigItem.buildPk(item.getConfigKey()));
            item.setSk(AppConfigItem.SK_METADATA);
        }
        table.putItem(item);
        log.debug("Saved config: {}={}", item.getConfigKey(), item.getConfigValue());
        return item;
    }
}
