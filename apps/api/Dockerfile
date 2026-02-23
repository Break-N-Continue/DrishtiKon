# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Download AWS RDS CA certificate bundle for SSL connections
RUN apk add --no-cache curl && \
    mkdir -p /certs && \
    curl -sSL -o /certs/global-bundle.pem \
      https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem && \
    apk del curl

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]