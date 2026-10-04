FROM python:3.13-slim-bookworm AS ttyd-build
RUN apt-get update && apt-get install -y --no-install-recommends build-essential cmake pkg-config libjson-c-dev libwebsockets-dev libuv1-dev && rm -rf /var/lib/apt/lists/*
ADD https://github.com/tsl0922/ttyd/archive/refs/tags/1.7.7.tar.gz /tmp/ttyd.tar.gz
RUN mkdir /tmp/ttyd && tar -xzf /tmp/ttyd.tar.gz -C /tmp/ttyd --strip-components=1 && cmake -S /tmp/ttyd -B /tmp/ttyd/build -DCMAKE_BUILD_TYPE=Release && cmake --build /tmp/ttyd/build --parallel 2

FROM python:3.13-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 HOME=/tmp TERM=xterm-256color UV_PYTHON_DOWNLOADS=never
RUN apt-get update && apt-get install -y --no-install-recommends libjson-c5 libwebsockets17 libwebsockets-evlib-uv libuv1 ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=ttyd-build /tmp/ttyd/build/ttyd /usr/local/bin/ttyd
RUN pip install --no-cache-dir uv==0.12.18
WORKDIR /app
COPY pyproject.toml uv.lock README.md LICENSE LICENSES_DATA.md ./
COPY terminal_games ./terminal_games
RUN uv sync --frozen --no-dev --no-editable --python /usr/local/bin/python3.13
USER 65532:65532
EXPOSE 8080
CMD ["ttyd", "-i", "0.0.0.0", "-p", "8080", "-W", "-O", "-m", "16", "/app/.venv/bin/terminal-games"]
