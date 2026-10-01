FROM node:22-slim

WORKDIR /app
COPY server.mjs ./
COPY public ./public

ENV PORT=8080
EXPOSE 8080
USER 65532:65532
CMD ["node", "server.mjs"]
