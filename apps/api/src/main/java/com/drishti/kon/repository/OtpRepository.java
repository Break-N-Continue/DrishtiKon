package com.drishti.kon.repository;

import com.drishti.kon.dynamo.OtpItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.Optional;

/**
 * DynamoDB-backed repository for OTP verification records.
 *
 * DynamoDB TTL (expiresAtTtl attribute) automatically deletes expired OTP
 * items within ~48 hours of expiry. The application-level expiry check
 * in OtpService still validates the expiryTime string field for correctness
 * during the OTP window, but cleanup requires zero code.
 */
@Repository
public class OtpRepository {

    private static final Logger log = LoggerFactory.getLogger(OtpRepository.class);

    private final DynamoDbTable<OtpItem> table;

    public OtpRepository(DynamoDbEnhancedClient client,
                         @Value("${dynamodb.table-name:DrishtiKon-Main}") String tableName) {
        this.table = client.table(tableName, TableSchema.fromBean(OtpItem.class));
    }

    /** Returns the most recent OTP for the email (there is at most one, enforced by deleteByEmail before save). */
    public Optional<OtpItem> findTopByEmailOrderByCreatedAtDesc(String email) {
        Key key = Key.builder()
                .partitionValue(OtpItem.buildPk(email))
                .sortValue(OtpItem.SK_METADATA)
                .build();
        return Optional.ofNullable(table.getItem(key));
    }

    public OtpItem save(OtpItem item) {
        table.putItem(item);
        return item;
    }

    /** Deletes any existing OTP for the given email before creating a new one. */
    public void deleteByEmail(String email) {
        Key key = Key.builder()
                .partitionValue(OtpItem.buildPk(email))
                .sortValue(OtpItem.SK_METADATA)
                .build();
        table.deleteItem(key);
        log.debug("Deleted OTP for email={}", email);
    }

    /**
     * No-op — DynamoDB TTL handles expired OTP cleanup automatically.
     * This method exists only to satisfy the OtpService#cleanupExpired call signature.
     */
    public void deleteExpired() {
        log.debug("deleteExpired() — no-op: DynamoDB TTL handles OTP expiry cleanup automatically");
    }
}
