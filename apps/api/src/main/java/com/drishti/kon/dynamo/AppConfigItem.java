package com.drishti.kon.dynamo;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

/**
 * DynamoDB item representing an AppConfig (key-value pair).
 *
 * Key design:
 *   PK = CONFIG#<key>
 *   SK = METADATA
 */
@DynamoDbBean
public class AppConfigItem {

    private String pk;
    private String sk;
    private String configKey;
    private String configValue;

    @DynamoDbPartitionKey
    @DynamoDbAttribute("PK")
    public String getPk() { return pk; }
    public void setPk(String pk) { this.pk = pk; }

    @DynamoDbSortKey
    @DynamoDbAttribute("SK")
    public String getSk() { return sk; }
    public void setSk(String sk) { this.sk = sk; }

    public String getConfigKey() { return configKey; }
    public void setConfigKey(String configKey) { this.configKey = configKey; }

    public String getConfigValue() { return configValue; }
    public void setConfigValue(String configValue) { this.configValue = configValue; }

    public static String buildPk(String key) { return "CONFIG#" + key; }
    public static final String SK_METADATA = "METADATA";
}
