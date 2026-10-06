FROM nginxinc/nginx-unprivileged:stable-alpine
# Controlled repair demo: game files are at the repository root, not public/.
COPY public/ /usr/share/nginx/html/
USER 65532
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
