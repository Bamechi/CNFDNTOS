import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=resolve(import.meta.dirname,'public');
await mkdir(resolve(import.meta.dirname,'.data'),{recursive:true});
const db=new DatabaseSync(process.env.DB_PATH||resolve(import.meta.dirname,'.data/cnfdnt.sqlite'));
db.exec('CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY, salt TEXT, hash TEXT, data TEXT); CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER)');
const date=n=>new Date(Date.now()+n*86400000).toISOString().slice(0,10);
const seed={name:'Amechi',onboarding:0,theme:'dark',vocabulary:'World',worlds:[{id:'w1',name:'CNFDNT Community',purpose:'Build a space where confidence becomes a way of life.',status:'on',tone:0},{id:'w2',name:'High Lvl Media',purpose:'Ideas into stories. Stories into impact.',status:'on',tone:1},{id:'w3',name:'Personal Growth',purpose:'Become the person the vision requires.',status:'on',tone:2},{id:'w4',name:'Creative Studio',purpose:'Make room for the work only you can make.',status:'off',tone:3}],items:[{id:'r1',world:'w1',type:'rock',title:'Launch the founding community',description:'Welcome the first 100 members with a complete onboarding experience.',due:date(60),status:'on',created:date(0),comments:[]},{id:'r2',world:'w2',type:'rock',title:'Build the next chapter of High Lvl',description:'Publish the new portfolio and three flagship stories.',due:date(75),status:'on',created:date(0),comments:[]},{id:'t1',world:'w1',rock:'r1',type:'todo',title:'Outline the founding member experience',due:date(2),created:date(0),done:false,comments:[]},{id:'t2',world:'w2',type:'todo',title:'Collect references for the next film',due:date(4),created:date(0),done:false,comments:[]},{id:'t3',world:'w3',type:'todo',title:'Make space for a weekly reflection',due:date(6),created:date(0),done:false,comments:[]},{id:'n1',world:'w1',type:'note',title:'The community north star',description:'A place to think bigger, build together, and follow through. Start with connection. Make the first experience personal.',created:date(0)}],captures:[],connections:[]};
if(!db.prepare('SELECT id FROM profile WHERE id=1').get()){const salt=randomBytes(16).toString('hex');db.prepare('INSERT INTO profile VALUES(1,?,?,?)').run(salt,scryptSync(process.env.TEST_PASSWORD||'vanta',salt,64).toString('hex'),JSON.stringify(seed));}
const failures=new Map();
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/api/')){
  if(req.method!=='GET'&&req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==`https://${req.headers.host}`)return send(res,403,{error:'Origin rejected'});
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8*1024*1024)return send(res,413,{error:'Upload is too large. Limit: 8 MB.'});}let body={};try{body=raw?JSON.parse(raw):{}}catch{return send(res,400,{error:'Invalid JSON'})}
  if(url.pathname==='/api/login'&&req.method==='POST'){
   const ip=req.socket.remoteAddress, f=failures.get(ip);if(f&&f.count>=12&&Date.now()-f.time<60000)return send(res,429,{error:'Please wait a minute before trying again.'});
   const p=db.prepare('SELECT * FROM profile WHERE id=1').get();const pass=String(body.password||'');const valid=['VANTA','vanta'].includes(pass)?'vanta':pass;
   if(String(body.email||'').toLowerCase()!=='amechi@addcolormedia.com'||!timingSafeEqual(scryptSync(valid,p.salt,64),Buffer.from(p.hash,'hex'))){failures.set(ip,{count:(f?.count||0)+1,time:Date.now()});return send(res,401,{error:'Email or password is incorrect.'})}
   failures.delete(ip);const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?)').run(token,Date.now()+604800000);res.setHeader('Set-Cookie',`cnfdnt=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${process.env.SECURE_COOKIE==='1'?'; Secure':''}`);return send(res,200,{ok:true});
  }
  const token=req.headers.cookie?.match(/(?:^|; )cnfdnt=([a-f0-9]+)/)?.[1];if(!token||!db.prepare('SELECT token FROM sessions WHERE token=? AND expires>?').get(token,Date.now()))return send(res,401,{error:'Please sign in.'});
  if(url.pathname==='/api/logout'){db.prepare('DELETE FROM sessions WHERE token=?').run(token);res.setHeader('Set-Cookie','cnfdnt=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return send(res,200,{ok:true})}
  if(url.pathname==='/api/state'&&req.method==='GET')return send(res,200,JSON.parse(db.prepare('SELECT data FROM profile WHERE id=1').get().data));
  if(url.pathname==='/api/state'&&req.method==='PUT'){
   if(!Array.isArray(body.worlds)||!Array.isArray(body.items)||!Array.isArray(body.captures)||body.worlds.some(w=>!w.id||typeof w.name!=='string')||body.items.some(i=>!i.id||!['todo','rock','note','resource','event'].includes(i.type)||typeof i.title!=='string'))return send(res,400,{error:'Invalid profile data'});
   db.prepare('UPDATE profile SET data=? WHERE id=1').run(JSON.stringify(body));return send(res,200,{ok:true});
  }return send(res,404,{error:'Not found'});
 }
 const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!path.startsWith(root+'/')){res.writeHead(403);return res.end()}
 try{const content=await readFile(path);res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'});res.end(content)}catch{res.writeHead(404);res.end('Not found')}
}catch(e){console.error(e.message);send(res,500,{error:'Could not complete the request.'})}});
server.listen(Number(process.env.PORT||4310),process.env.HOST||'127.0.0.1',()=>console.log(`CNFDNT OS http://localhost:${process.env.PORT||4310}`));
