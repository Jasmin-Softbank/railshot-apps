FROM node:22-slim
WORKDIR /app
COPY package.json server.mjs ./
USER 65532
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.mjs"]
