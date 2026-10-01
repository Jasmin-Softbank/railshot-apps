import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const port = Number(process.env.PORT || 8080);
const assets = new Map(await Promise.all([
  ['/', 'index.html', 'text/html; charset=utf-8'],
  ['/app.js', 'app.js', 'text/javascript; charset=utf-8'],
  ['/styles.css', 'styles.css', 'text/css; charset=utf-8'],
].map(async ([path, file, type]) => [path, { body: await readFile(new URL(`./public/${file}`, import.meta.url)), type }])));

function send(response, status, body, type = 'application/json; charset=utf-8') {
  response.writeHead(status, {
    'content-type': type,
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}

function reply(message) {
  if (/안녕|반가|hello|hi\b/i.test(message)) return '안녕하세요! 저는 RAILSHOT 배포 데모 챗봇입니다.';
  if (/배포|클라우드|railshot/i.test(message)) return '저는 같은 코드로 배포 경로를 확인하기 위한 샘플 앱이에요. 지금 이 응답이 보이면 앱이 실행 중입니다.';
  if (/도움|기능|help/i.test(message)) return '인사하거나 배포에 관해 물어보세요. 이 데모는 외부 AI 서비스 없이 동작합니다.';
  return '메시지를 받았어요. 인사, 배포, 도움말 중 하나를 물어보세요.';
}

async function readMessage(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) throw { status: 415, error: 'JSON 요청이 필요합니다.' };
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 4096) throw { status: 413, error: '요청이 너무 큽니다.' };
    chunks.push(chunk);
  }
  let data;
  try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw { status: 400, error: '올바른 JSON을 보내세요.' }; }
  const message = data && typeof data.message === 'string' ? data.message.trim() : '';
  if (!message || message.length > 500) throw { status: 400, error: '메시지는 1~500자로 입력하세요.' };
  return message;
}

createServer(async (request, response) => {
  try {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (request.method === 'GET' && path === '/health') {
      send(response, 200, { ok: true });
    } else if (request.method === 'POST' && path === '/api/chat') {
      send(response, 200, { reply: reply(await readMessage(request)) });
    } else if (request.method === 'GET' && assets.has(path)) {
      const asset = assets.get(path);
      send(response, 200, asset.body, asset.type);
    } else {
      send(response, 404, { error: '경로를 찾을 수 없습니다.' });
    }
  } catch (error) {
    send(response, error.status || 500, { error: error.error || '요청을 처리하지 못했습니다.' });
  }
}).listen(port, '0.0.0.0', () => console.log(`Chatbot demo: http://127.0.0.1:${port}`));
