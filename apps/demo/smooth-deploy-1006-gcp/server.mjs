import http from 'node:http';
const marker='railshot-smooth-20261006-v1';
const page=`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Railshot 배포 확인</title><style>body{font:18px system-ui;background:#f1f5f5;color:#152f36;max-width:680px;margin:10vh auto;padding:24px}main{background:white;padding:32px;border-radius:18px}small{color:#526b70}input,button{font:inherit;padding:12px;border:1px solid #8caaa8;border-radius:8px}input{width:100px}button{background:#17685c;color:white;cursor:pointer}output{display:block;margin:24px 0;font-size:32px}footer{margin-top:32px;font-size:13px}</style><main><small>RAILSHOT · LIVE DEPLOYMENT</small><h1>작은 계산기</h1><p>숫자 두 개를 입력하면 서버에서 계산합니다.</p><form><label>첫 번째 숫자 <input name="a" type="number" step="any" required value="7"></label> <label>두 번째 숫자 <input name="b" type="number" step="any" required value="11"></label><p><button>계산하기</button></p></form><output aria-live="polite">준비됐습니다.</output><footer>${marker}</footer></main><script>document.querySelector('form').onsubmit=async e=>{e.preventDefault();const out=document.querySelector('output');out.textContent='계산 중…';try{const r=await fetch('/api/sum?'+new URLSearchParams(new FormData(e.target)));const d=await r.json();out.textContent=r.ok?d.sum:'숫자를 확인해 주세요.'}catch{out.textContent='연결을 확인하고 다시 시도해 주세요.'}};</script></html>`;
http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost');
 console.log(JSON.stringify({event:'http_request',method:req.method,path:u.pathname,marker}));
 const json=(code,value)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({marker,...value}));};
 if(req.method!=='GET')return json(405,{error:'method_not_allowed'});
 if(u.pathname==='/health')return json(200,{status:'ok'});
 if(u.pathname==='/api/sum'){
  const a=Number(u.searchParams.get('a')),b=Number(u.searchParams.get('b'));
  if(!u.searchParams.get('a')?.trim()||!u.searchParams.get('b')?.trim()||![a,b,a+b].every(Number.isFinite))return json(400,{error:'invalid_number'});
  return json(200,{sum:a+b});
 }
 if(u.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(page);}
 json(404,{error:'not_found'});
}).listen(Number(process.env.PORT||8080),'0.0.0.0');
