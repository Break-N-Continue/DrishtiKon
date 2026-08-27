package com.drishti.kon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * DrishtiKon API — Spring Boot application entry point.
 *
 * JPA/DataSource auto-configuration is explicitly excluded because this
 * application uses DynamoDB (via AWS SDK) instead of a relational database.
 *
 * @EnableScheduling is removed — post expiry is now handled by DynamoDB TTL,
 * which requires zero code and zero running processes.
 *
 * In production, this class is not called directly. Instead,
 * {@link StreamLambdaHandler} is the Lambda entry point, which calls
 * {@link SpringApplication#run} internally via the serverless container.
 */
@SpringBootApplication(exclude = {
        DataSourceAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class
})
@EnableConfigurationProperties
public class DrishtiKonApplication {

    public static void main(String[] args) {
        SpringApplication.run(DrishtiKonApplication.class, args);
    }
}
