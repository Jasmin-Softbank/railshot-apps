FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY src/Main.java src/Main.java
RUN javac --release 17 -d /build/classes src/Main.java

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/classes /app/classes
COPY public /app/public
ENV HOST=0.0.0.0 PORT=8080
USER 65532:65532
EXPOSE 8080
CMD ["java", "-cp", "/app/classes", "Main"]
