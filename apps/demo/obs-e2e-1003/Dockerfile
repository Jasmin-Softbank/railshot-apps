FROM node:22.23.3-bookworm-slim
WORKDIR /app
COPY app.js ./app.js
RUN node --check app.js
USER 65532
EXPOSE 8080
CMD ["node", "app.js"]
