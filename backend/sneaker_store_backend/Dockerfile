# Build stage
FROM gradle:8.14.3-jdk21 AS build
WORKDIR /app

COPY . .
RUN ./gradlew clean bootJar -x test

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]


