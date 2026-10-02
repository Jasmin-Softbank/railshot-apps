# Chatbot demo

RAILSHOT 배포 경로를 검증하는 작은 챗봇 웹앱이다. Node.js 표준 라이브러리만 사용하며 DB, 외부 LLM, 비밀키가 필요 없다. 챗봇 응답은 규칙 기반이다.

## 로컬 실행

```sh
node server.mjs
```

브라우저에서 `http://127.0.0.1:8080`을 연다. 서버는 `PORT` 환경 변수를 사용할 수 있다.

```sh
curl -fsS http://127.0.0.1:8080/health
curl -fsS http://127.0.0.1:8080/api/chat \
  -H 'content-type: application/json' \
  -d '{"message":"안녕"}'
```

## RAILSHOT PoC

`Railshot apps/dashboard`의 대시보드에서 이 폴더를 선택하거나, MCP `deploy` 도구의 `source`에 이 폴더의 절대 경로를 전달한다. MCP의 로컬 경로 허용 범위(`RAILSHOT_SOURCE_ROOT`)에 이 폴더가 포함되어야 한다. 앱 이름은 폴더 이름에서 `chatbot-demo`로 자동 생성된다.

배포 성공은 Actions의 `loop`, `release`, `gitops`가 통과하고 반환된 URL에서 `/health`와 채팅 요청이 응답할 때 확인한다. 현재 진입점 PoC는 같은 앱 이름의 두 번째 배포를 거부한다.
