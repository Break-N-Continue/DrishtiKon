package com.drishti.kon.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

import java.net.URI;

/**
 * Configures and exposes the AWS DynamoDB clients as Spring beans.
 *
 * <p>Uses the lightweight {@code UrlConnectionHttpClient} instead of
 * the default Netty client to minimize startup time inside Lambda.
 *
 * <p>If {@code DYNAMODB_ENDPOINT} env var is set (e.g. for local Docker testing
 * with DynamoDB Local), the client points to that endpoint. Otherwise, it uses
 * the real AWS service in the configured region.
 */
@Configuration
public class DynamoDbConfig {

    @Value("${aws.region:ap-south-1}")
    private String awsRegion;

    @Value("${dynamodb.endpoint:}")
    private String dynamoDbEndpoint;

    /**
     * Low-level DynamoDB client.
     */
    @Bean
    public DynamoDbClient dynamoDbClient() {
        var builder = DynamoDbClient.builder()
                .region(Region.of(awsRegion))
                .httpClient(UrlConnectionHttpClient.builder().build())
                .credentialsProvider(DefaultCredentialsProvider.create());

        if (dynamoDbEndpoint != null && !dynamoDbEndpoint.isBlank()) {
            builder.endpointOverride(URI.create(dynamoDbEndpoint));
        }

        return builder.build();
    }

    /**
     * Higher-level Enhanced client that maps Java beans to DynamoDB items.
     */
    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
    }
}
