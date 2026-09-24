import {uploadChunks} from './lib/uploads.mjs';
import express from 'express';
import {openDatabase,conflict} from './lib/database.mjs';
import {randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import {readFile,mkdir,writeFile,unlink,readdir} from 'node:fs/promises';
import {resolve,extname,basename} from 'node:path';
import {normalize,validateState,promotionMessages,activeRocks} from './public/domain.js';
import {answerKnowledge,knowledgeRecords} from './lib/knowledge.mjs';
import {generateOutput} from './lib/output.mjs';
import {googleIntegration} from './lib/google.mjs';
import {checkoutProducts,createAccessToken,deliveryCatalog,productsForLineItems,publicProduct,renderDeliveryPage,stripeRequest,tokenProducts,verifyAccessToken,verifyStripeSignature,accessUrl} from './lib/fulfillment.mjs';
try { process.loadEnvFile(resolve(import.meta.dirname,'.env')); } catch {}
const root=resolve(import.meta.dirname,'public');
const db=await openDatabase(process.env.DB_PATH||resolve(import.meta.dirname,'.data/cnfdnt.sqlite'));
await db.exec('CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY, salt TEXT, hash TEXT, data TEXT); CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER); CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, name TEXT, type TEXT, size INTEGER, uploaded_at TEXT, content BLOB)');
await db.exec('CREATE TABLE IF NOT EXISTS knowledge_threads (id TEXT PRIMARY KEY, scope TEXT, messages TEXT)');
await db.exec('CREATE TABLE IF NOT EXISTS uploads (id TEXT PRIMARY KEY, session TEXT, name TEXT, size INTEGER, expires INTEGER); CREATE TABLE IF NOT EXISTS upload_parts (upload_id TEXT, part INTEGER, content BLOB, PRIMARY KEY(upload_id,part))');
await db.exec('CREATE TABLE IF NOT EXISTS stripe_orders (session_id TEXT PRIMARY KEY, customer_email TEXT, product_ids TEXT, access_token TEXT, created_at TEXT)');
const date=n=>new Date(Date.now()+n*86400000).toISOString().slice(0,10);
const seed={name:'Amechi',onboarding:0,theme:'dark',vocabulary:'World',worlds:[{id:'w1',name:'CNFDNT Community',purpose:'Build a space where confidence becomes a way of life.',status:'on',tone:0},{id:'w2',name:'High Lvl Media',purpose:'Ideas into stories. Stories into impact.',status:'on',tone:1},{id:'w3',name:'Personal Growth',purpose:'Become the person the vision requires.',status:'on',tone:2},{id:'w4',name:'Creative Studio',purpose:'Make room for the work only you can make.',status:'off',tone:3}],items:[{id:'r1',world:'w1',type:'rock',title:'Launch the founding community',description:'Welcome the first 100 members with a complete onboarding experience.',due:date(60),status:'on',created:date(0),comments:[]},{id:'r2',world:'w2',type:'rock',title:'Build the next chapter of High Lvl',description:'Publish the new portfolio and three flagship stories.',due:date(75),status:'on',created:date(0),comments:[]},{id:'t1',world:'w1',rock:'r1',type:'todo',title:'Outline the founding member experience',due:date(2),created:date(0),done:false,comments:[]},{id:'t2',world:'w2',type:'todo',title:'Collect references for the next film',due:date(4),created:date(0),done:false,comments:[]},{id:'t3',world:'w3',type:'todo',title:'Make space for a weekly reflection',due:date(6),created:date(0),done:false,comments:[]},{id:'n1',world:'w1',type:'note',title:'The community north star',description:'A place to think bigger, build together, and follow through. Start with connection. Make the first experience personal.',created:date(0)}],captures:[],connections:[]};
if(!(await db.prepare('SELECT id FROM profile WHERE id=1').get())){const salt=randomBytes(16).toString('hex');(await db.prepare('INSERT INTO profile VALUES(1,?,?,?) ON CONFLICT(id) DO NOTHING').run(salt,scryptSync(process.env.TEST_PASSWORD||'vanta',salt,64).toString('hex'),JSON.stringify(normalize(seed))));}
const FILE_LIMIT=20*1024*1024, ACCOUNT_LIMIT=200*1024*1024;
const extensions={'.pdf':'application/pdf','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.txt':'text/plain','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.mp3':'audio/mpeg','.wav':'audio/wav','.m4a':'audio/mp4','.ogg':'audio/ogg','.webm':'audio/webm'};
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.mp3':'audio/mpeg','.wav':'audio/wav','.m4a':'audio/mp4','.woff2':'font/woff2','.jpg':'image/jpeg','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.csv':'text/csv'};
async function rawState(){return JSON.parse((await db.prepare('SELECT data FROM profile WHERE id=1').get()).data);}
async function storeState(s,previous){const data=JSON.stringify(s);if(previous){const result=await db.prepare('UPDATE profile SET data=? WHERE id=1 AND data=?').run(data,JSON.stringify(previous));if(!Number(result.changes))throw conflict();}else await db.prepare('UPDATE profile SET data=? WHERE id=1').run(data);return s;}
async function readState(){for(let n=0;n<3;n++){const raw=await rawState(),s=normalize(raw);if(JSON.stringify(raw)===JSON.stringify(s))return s;s.revision++;try{return await storeState(s,raw)}catch(e){if(e.status!==409)throw e}}throw conflict();}
async function writeState(s,previous){const raw=await rawState();if(s.revision!==raw.revision||(previous&&previous.revision!==raw.revision))throw conflict();s=normalize(s);s.revision=raw.revision+1;return storeState(s,raw);}
// Idempotent one-time migration preserves legacy uploaded originals and relationship data.
const legacy=await rawState();if(!legacy.schema||legacy.schema<2){if(!process.env.VERCEL){await mkdir(resolve(import.meta.dirname,'.data/backups'),{recursive:true});await writeFile(resolve(import.meta.dirname,'.data/backups/migration-v1-'+Date.now()+'.json'),JSON.stringify(legacy));}for(const i of legacy.items){if(i.file?.startsWith('data:')){const [,type,data]=i.file.match(/^data:([^;]+);base64,(.*)$/s)||[];if(data){const id=randomBytes(16).toString('hex'),buf=Buffer.from(data,'base64');(await db.prepare('INSERT INTO files VALUES(?,?,?,?,?,?)').run(id,i.filename||i.title,type,buf.length,i.created?i.created+'T12:00:00Z':new Date().toISOString(),buf));i.file_id=id;i.filename||=i.title;i.file_size=buf.length;i.uploaded_at=i.created?i.created+'T12:00:00Z':new Date().toISOString();delete i.file;}}if(i.title?.startsWith('Checkpoint:'))i.description||=i.title; }await storeState(normalize(legacy));}
if(legacy.schema===2){if(!process.env.VERCEL){await mkdir(resolve(import.meta.dirname,'.data/backups'),{recursive:true});await writeFile(resolve(import.meta.dirname,'.data/backups/migration-v2-'+Date.now()+'.json'),JSON.stringify(legacy));}await storeState(normalize(legacy));}
const google=await googleIntegration(db,readState,writeState);
const failures=new Map();
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
async function maybeSendDeliveryEmail({email,products,link}){
  if(!email||!process.env.RESEND_API_KEY)return;
  const html=`<p>Thanks for your CNFDNT purchase.</p><p>Your delivery page is ready: <a href="${link}">${link}</a></p><ul>${products.map(p=>`<li>${p.title}</li>`).join('')}</ul><p>If anything looks off, reply to cnfdnt.ai@gmail.com.</p>`;
  await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.DELIVERY_EMAIL_FROM||'CNFDNT <delivery@cnfdnt.co>',to:email,subject:'Your CNFDNT product access',html})}).catch(error=>console.error('Delivery email failed:',error.message));
}
async function extract(buf,ext){
  if(!['.txt','.docx','.pdf'].includes(ext))return {text:'',status:'Original preserved. Audio transcription and image OCR are not connected.'};
  try{let text='';if(ext==='.txt')text=buf.toString('utf8');else if(ext==='.docx'){const mammoth=await import('mammoth');text=(await mammoth.extractRawText({buffer:buf})).value;}else{const {PDFParse}=await import('pdf-parse');const parser=new PDFParse({data:new Uint8Array(buf)});try{text=(await parser.getText()).text}finally{await parser.destroy()}}
    return {text:text.slice(0,400000),status:text.trim()?'Original preserved. Text extracted.':'Original preserved. No searchable text found.'};
  }catch{return {text:'',status:'Original preserved. Text extraction is unavailable for this file.'}}
}

const app=express();
app.disable('x-powered-by');
app.use(express.static(root,{index:false}));
app.use(async(req,res)=>{try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/')){
    if(url.pathname==='/api/stripe/webhook'&&req.method==='POST'){
      let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1024*1024)return send(res,413,{error:'Webhook payload too large.'});}
      verifyStripeSignature(raw,req.headers['stripe-signature']);
      const event=JSON.parse(raw);
      if(['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)){
        const session=event.data.object;
        const lineItems=await stripeRequest('/checkout/sessions/'+encodeURIComponent(session.id)+'/line_items?limit=100');
        const products=productsForLineItems(lineItems.data||[]);
        if(products.length){
          const token=createAccessToken({sessionId:session.id,email:session.customer_details?.email||session.customer_email||'',productIds:products.map(p=>p.id),expires:Date.now()+1000*60*60*24*30});
          const email=session.customer_details?.email||session.customer_email||'';
          await db.prepare('INSERT INTO stripe_orders VALUES(?,?,?,?,?) ON CONFLICT(session_id) DO UPDATE SET customer_email=excluded.customer_email,product_ids=excluded.product_ids,access_token=excluded.access_token').run(session.id,email,JSON.stringify(products.map(p=>p.id)),token,new Date().toISOString());
          await maybeSendDeliveryEmail({email,products,link:accessUrl(req,token)});
        }
      }
      return send(res,200,{received:true});
    }
    if(url.pathname==='/api/delivery/catalog'&&req.method==='GET')return send(res,200,{...deliveryCatalog(),products:deliveryCatalog().products.map(publicProduct)});
    if(req.method!=='GET'&&req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==`https://${req.headers.host}`)return send(res,403,{error:'Origin rejected'});
    let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>30*1024*1024)return send(res,413,{error:'Request too large. Maximum file size is 20 MB.'});}
    let body={};try{body=raw?JSON.parse(raw):{}}catch{return send(res,400,{error:'Invalid JSON'})}
    if(url.pathname==='/api/login'&&req.method==='POST'){
      const ip=req.socket.remoteAddress,f=failures.get(ip);if(f&&f.count>=12&&Date.now()-f.time<60000)return send(res,429,{error:'Please wait a minute before trying again.'});
      const p=(await db.prepare('SELECT * FROM profile WHERE id=1').get());const pass=String(body.password||'');const valid=['VANTA','vanta'].includes(pass)?'vanta':pass;
      if(String(body.email||'').toLowerCase()!=='amechi@addcolormedia.com'||!timingSafeEqual(scryptSync(valid,p.salt,64),Buffer.from(p.hash,'hex'))){failures.set(ip,{count:(f?.count||0)+1,time:Date.now()});return send(res,401,{error:'Email or password is incorrect.'})}
      failures.delete(ip);const token=randomBytes(32).toString('hex');(await db.prepare('INSERT INTO sessions VALUES(?,?)').run(token,Date.now()+604800000));res.setHeader('Set-Cookie',`cnfdnt=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${(process.env.SECURE_COOKIE==='1'||process.env.VERCEL)?'; Secure':''}`);return send(res,200,{ok:true});
    }
    let token=req.headers.cookie?.match(/(?:^|; )cnfdnt=([a-f0-9]+)/)?.[1];if(url.pathname==='/api/google/callback'){const nonce=url.searchParams.get('state'),oauthCookie=req.headers.cookie?.match(/(?:^|; )cnfdnt_oauth=([a-f0-9]+)/)?.[1];if(nonce&&nonce===oauthCookie)token=(await db.prepare('SELECT session FROM oauth_states WHERE nonce=? AND expires>?').get(nonce,Date.now()))?.session;}if(!token||!(await db.prepare('SELECT token FROM sessions WHERE token=? AND expires>?').get(token,Date.now())))return send(res,401,{error:'Please sign in.'});
    if(url.pathname==='/api/logout'&&req.method==='POST'){(await db.prepare('DELETE FROM sessions WHERE token=?').run(token));res.setHeader('Set-Cookie','cnfdnt=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return send(res,200,{ok:true})}
    if(url.pathname==='/api/state'&&req.method==='GET')return send(res,200,await readState());
    if(url.pathname==='/api/state'&&req.method==='PUT'){
      if(!Array.isArray(body.worlds)||!Array.isArray(body.projects)||!Array.isArray(body.items)||!Array.isArray(body.captures))return send(res,400,{error:'Invalid profile data.'});const previous=await readState();if(body.revision!==previous.revision)return send(res,409,{error:'Your workspace changed in another tab. Refresh to load the latest version; your unsaved work is available in this tab’s recovery copy.',conflict:true});
      const next=validateState(body,previous);for(const i of next.items.filter(i=>i.file_id)){const f=(await db.prepare('SELECT uploaded_at,size,name FROM files WHERE id=?').get(i.file_id));if(!f)return send(res,400,{error:'Uploaded file is missing.'});i.uploaded_at=f.uploaded_at;i.file_size=f.size;i.filename=f.name;}
      const promotions=promotionMessages(previous,next);for(const w of next.worlds){const old=activeRocks(previous,w.id).map(r=>r.id);for(const r of activeRocks(next,w.id))if(!old.includes(r.id)&&previous.items.some(i=>i.id===r.id))r.promotion_review=true;}return send(res,200,{state:await writeState(next,previous),promotions});
    }
    if(url.pathname==='/api/config'){
      const tracks=await readdir(resolve(root,'music')).catch(()=>[]);
      return send(res,200,{fileLimit:FILE_LIMIT,accountLimit:ACCOUNT_LIMIT,used:(await db.prepare('SELECT COALESCE(SUM(size),0) AS used FROM files').get()).used,ai:!!(process.env.ANTHROPIC_API_KEY&&process.env.ANTHROPIC_MODEL),google:await google.status(),tracks:tracks.filter(n=>['.mp3','.wav','.m4a'].includes(extname(n).toLowerCase())).map(n=>({name:basename(n,extname(n)),url:'/music/'+encodeURIComponent(n)}))});
    }
    if(['/api/upload/start','/api/upload/chunk'].includes(url.pathname)&&req.method==='POST')return send(res,200,await uploadChunks(db,url.pathname,body,token,{extensions,file:FILE_LIMIT,account:ACCOUNT_LIMIT}));
    if(url.pathname==='/api/upload'&&req.method==='POST'){
      const assembled=body.id?await uploadChunks(db,'/api/upload/finish',body,token,{extensions,file:FILE_LIMIT,account:ACCOUNT_LIMIT}):null;
      if(assembled)body.name=assembled.name;
      if(!assembled&&(typeof body.name!=='string'||typeof body.data!=='string'))return send(res,400,{error:'Choose a file.'});
      const ext=extname(body.name).toLowerCase();if(!extensions[ext])return send(res,400,{error:'Supported: PDF, DOCX, TXT, JPG, PNG, MP3, WAV, M4A, OGG and WEBM.'});
      const bytes=assembled?.bytes||Buffer.from(body.data,'base64');if(bytes.length>FILE_LIMIT)return send(res,413,{error:'This file exceeds the 20 MB per-file limit.'});
      const used=Number((await db.prepare('SELECT COALESCE(SUM(size),0) AS used FROM files').get()).used);if(used+bytes.length>ACCOUNT_LIMIT)return send(res,413,{error:'The account’s 200 MB storage quota is full.'});
      const id=randomBytes(16).toString('hex'),at=new Date().toISOString();(await db.prepare('INSERT INTO files VALUES(?,?,?,?,?,?)').run(id,basename(body.name),extensions[ext],bytes.length,at,bytes));
      if(assembled){await db.prepare('DELETE FROM upload_parts WHERE upload_id=?').run(assembled.id);await db.prepare('DELETE FROM uploads WHERE id=?').run(assembled.id);}
      const extraction=await extract(bytes,ext);return send(res,200,{file_id:id,filename:basename(body.name),file_size:bytes.length,uploaded_at:at,extracted_text:extraction.text,extraction_status:extraction.status});
    }
    if(url.pathname.startsWith('/api/files/')&&req.method==='GET'){
      const f=(await db.prepare('SELECT * FROM files WHERE id=?').get(url.pathname.split('/').at(-1)));if(!f)return send(res,404,{error:'File not found.'});res.writeHead(200,{'Content-Type':f.type,'Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(f.name)}`,'X-Content-Type-Options':'nosniff','Cache-Control':'private, no-store'});return res.end(Buffer.from(f.content));
    }
    if(url.pathname==='/api/backup'&&req.method==='GET'){
      const backup={format:'CNFDNT OS portable backup',version:3,knowledgeThreads:(await db.prepare('SELECT * FROM knowledge_threads').all()).map(t=>({...t,scope:JSON.parse(t.scope),messages:JSON.parse(t.messages)})),exported_at:new Date().toISOString(),state:await readState(),files:(await db.prepare('SELECT * FROM files').all()).map(f=>({...f,content:Buffer.from(f.content).toString('base64')}))};res.setHeader('Content-Disposition','attachment; filename="cnfdnt-portable-backup.json"');return send(res,200,backup);
    }
    if(url.pathname==='/api/knowledge'&&req.method==='POST'){
      const state=await readState(),scope={world:String(body.world||''),project:String(body.project||'')};knowledgeRecords(state,scope);
      const previous=body.threadId?(await db.prepare('SELECT * FROM knowledge_threads WHERE id=?').get(String(body.threadId))):null;
      if(body.threadId&&(!previous||previous.scope!==JSON.stringify(scope)))return send(res,400,{error:'Start a new conversation when changing scope.'});
      const history=previous?JSON.parse(previous.messages):[],result=await answerKnowledge(state,{...scope,question:body.question},history);
      const id=previous?.id||randomBytes(16).toString('hex');const message={question:String(body.question).slice(0,4000),...result,at:new Date().toISOString()};
      (await db.prepare('INSERT INTO knowledge_threads VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET scope=excluded.scope,messages=excluded.messages').run(id,JSON.stringify(scope),JSON.stringify([...history,message].slice(-30))));
      return send(res,200,{threadId:id,...message});
    }
    if(url.pathname==='/api/output'&&req.method==='POST')return send(res,200,await generateOutput(await readState(),body));
    if(url.pathname==='/api/google/auth'&&req.method==='POST'){const result=await google.auth(token),nonce=new URL(result.url).searchParams.get('state');res.setHeader('Set-Cookie',`cnfdnt_oauth=${nonce}; HttpOnly; SameSite=Lax; Path=/api/google; Max-Age=600${(process.env.SECURE_COOKIE==='1'||process.env.VERCEL)?'; Secure':''}`);return send(res,200,result);}
    if(url.pathname==='/api/google/callback'){await google.callback(url.searchParams.get('code'),url.searchParams.get('state'),token);res.setHeader('Set-Cookie','cnfdnt_oauth=; HttpOnly; SameSite=Lax; Path=/api/google; Max-Age=0');res.writeHead(302,{Location:'/?google=connected'});return res.end();}
    if(url.pathname==='/api/google/calendars')return send(res,200,await google.calendars());
    if(url.pathname==='/api/google/sync'&&req.method==='POST')return send(res,200,await google.sync(body.selected));
    if(url.pathname==='/api/google/disconnect'&&req.method==='POST')return send(res,200,await google.disconnect());
    return send(res,404,{error:'Not found'});
  }
  if(url.pathname==='/delivery'&&req.method==='GET'){
    const sessionId=url.searchParams.get('session_id');
    if(!sessionId){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(renderDeliveryPage({products:[],message:'Paste a Stripe checkout session ID into the delivery URL after payment.'}))}
    const result=await checkoutProducts(sessionId);
    const email=result.session.customer_details?.email||result.session.customer_email||'';
    const token=createAccessToken({sessionId,email,productIds:result.products.map(p=>p.id),expires:Date.now()+1000*60*60*24*30});
    await db.prepare('INSERT INTO stripe_orders VALUES(?,?,?,?,?) ON CONFLICT(session_id) DO UPDATE SET customer_email=excluded.customer_email,product_ids=excluded.product_ids,access_token=excluded.access_token').run(sessionId,email,JSON.stringify(result.products.map(p=>p.id)),token,new Date().toISOString());
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store'});
    return res.end(renderDeliveryPage({...result,token}));
  }
  if(url.pathname==='/delivery/access'&&req.method==='GET'){
    const payload=verifyAccessToken(url.searchParams.get('token'));
    if(!payload){res.writeHead(403,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(renderDeliveryPage({products:[],message:'This delivery link is missing, expired, or invalid.'}))}
    const products=tokenProducts(payload);
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store'});
    return res.end(renderDeliveryPage({products,session:{customer_email:payload.email},token:url.searchParams.get('token')}));
  }
  const routed=url.pathname==='/'?'/index.html':(url.pathname==='/app'||url.pathname==='/app/')?'/os.html':url.pathname;const path=resolve(root,'.'+decodeURIComponent(routed));if(!path.startsWith(root+'/')){res.writeHead(403);return res.end()}
  try{const content=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','Cache-Control':'no-cache'});res.end(content)}catch{res.writeHead(404);res.end('Not found')}
}catch(e){console.error(e.message);send(res,e.status||500,{error:e.status?e.message:'Could not complete the request. '+(e.message.startsWith('Google')?e.message:'')})}});
if(!process.env.VERCEL)app.listen(Number(process.env.PORT||4310),process.env.HOST||'127.0.0.1',()=>console.log(`CNFDNT OS http://localhost:${process.env.PORT||4310}`));

export default app;
