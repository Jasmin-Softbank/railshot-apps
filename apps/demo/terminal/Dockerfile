FROM python:3.13-slim-trixie
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 HOME=/tmp TERM=xterm-256color UV_PYTHON_DOWNLOADS=never
RUN apt-get update && apt-get install -y --no-install-recommends ttyd ca-certificates && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir uv==0.12.18
WORKDIR /app
COPY pyproject.toml uv.lock README.md LICENSE LICENSES_DATA.md ./
COPY terminal_games ./terminal_games
RUN uv sync --frozen --no-dev --no-editable --python /usr/local/bin/python3.13
USER 65532:65532
EXPOSE 8080
CMD ["ttyd", "-i", "0.0.0.0", "-p", "8080", "-W", "-O", "-m", "16", "/app/.venv/bin/terminal-games"]
