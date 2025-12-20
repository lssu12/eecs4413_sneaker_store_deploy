# Build stage
FROM gradle:8.14.3-jdk21 AS build
WORKDIR /app

COPY . .

RUN chmod +x gradlew
RUN ./gradlew clean bootJar -x test

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar


ENV PORT=10000
EXPOSE 10000

CMD ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]