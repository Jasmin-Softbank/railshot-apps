FROM node:22.23.3-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --global npm@12.2.0 --ignore-scripts --no-audit --no-fund && test "$(npm --version)" = 12.2.0 && npm ci --omit=dev --ignore-scripts --no-audit --no-fund
COPY src/app.js src/server.js ./src/
COPY dist/ ./dist/
RUN test -s dist/index.html && chmod -R a=rX /app
USER 65532:65532
EXPOSE 8080
CMD ["node", "src/server.js"]
