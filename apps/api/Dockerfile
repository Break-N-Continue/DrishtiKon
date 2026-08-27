# Build stage — compile the Spring Boot JAR
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# ── Production Lambda stage ────────────────────────────────────────────────
# This image is uploaded to ECR and used by the Lambda function when
# deploying via container image (instead of zip). The Lambda runtime
# calls StreamLambdaHandler::handleRequest directly.
FROM public.ecr.aws/lambda/java:21 AS lambda
COPY --from=build /app/target/*.jar ${LAMBDA_TASK_ROOT}/lib/app.jar
CMD ["com.drishti.kon.StreamLambdaHandler::handleRequest"]

# ── Local development stage ────────────────────────────────────────────────
# Used by docker-compose for local dev. Runs as a regular Spring Boot app
# (not Lambda) pointing at DynamoDB Local.
FROM eclipse-temurin:21-jre-alpine AS local
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]