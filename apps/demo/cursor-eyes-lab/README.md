# Cursor Eyes Lab

커서 위치를 따라보는 두 눈의 빌드 없는 정적 웹 앱입니다.

## Local preview

```bash
cd /Users/llokr/Desktop/softbank-hackathon/cursor-eyes-lab
python3 -m http.server 4173 --directory dist
```

브라우저에서 `http://localhost:4173`을 엽니다.

`dist/`만 정적 호스팅 서비스(Cloudflare Pages, Netlify, Vercel 등)에 업로드하면 배포됩니다.
