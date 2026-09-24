import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
let child,dir,cookie;const base='http://127.0.0.1:4312';
const request=(path,method='GET',body,extra={})=>fetch(base+path,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...extra},body:body?JSON.stringify(body):undefined});
before(async()=>{dir=await mkdtemp(join(tmpdir(),'cnfdnt-test-'));child=spawn(process.execPath,['server.mjs'],{cwd:import.meta.dirname+'/..',env:{...process.env,PORT:'4312',ANTHROPIC_API_KEY:'',ANTHROPIC_MODEL:'',DB_PATH:join(dir,'test.sqlite')}});await new Promise((res,rej)=>{const timeout=setTimeout(()=>rej(Error('Server startup timed out')),10000);child.stdout.on('data',()=>{clearTimeout(timeout);res()});child.on('error',rej);child.on('exit',c=>{if(c)rej(Error('Server exited '+c))})});});
after(async()=>{child?.kill();await new Promise(r=>setTimeout(r,100));await rm(dir,{recursive:true,force:true})});
test('anonymous access is rejected',async()=>assert.equal((await request('/api/state')).status,401));
test('incorrect password is rejected',async()=>assert.equal((await request('/api/login','POST',{email:'amechi@addcolormedia.com',password:'wrong'})).status,401));
test('both test password variants work and sessions use HttpOnly cookies',async()=>{for(const password of ['VANTA','vanta']){const r=await request('/api/login','POST',{email:'amechi@addcolormedia.com',password});assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/HttpOnly; SameSite=Strict/);cookie=r.headers.get('set-cookie').split(';')[0]}});
test('profile writes survive subsequent requests',async()=>{const data=await(await request('/api/state')).json();data.items.push({id:'persist-test',title:'Persistence test',type:'note',world:'w1'});assert.equal((await request('/api/state','PUT',data)).status,200);assert.ok((await(await request('/api/state')).json()).items.some(i=>i.id==='persist-test'))});
test('invalid state is rejected',async()=>assert.equal((await request('/api/state','PUT',{items:[]})).status,400));
test('cross-origin writes are rejected',async()=>assert.equal((await request('/api/state','PUT',{}, {Origin:'https://untrusted.example'})).status,403));
test('static app and manifest are available',async()=>{assert.equal((await request('/')).status,200);assert.equal((await request('/manifest.webmanifest')).status,200)});
test('delivery catalog and unauthenticated delivery page are available',async()=>{
  const catalog=await request('/api/delivery/catalog');
  assert.equal(catalog.status,200);
  const body=await catalog.json();
  assert.equal(body.products.length,68);
  assert.ok(body.products.every(p=>p.stripePaymentLink.startsWith('https://buy.stripe.com/')));
  const page=await fetch(base+'/delivery');
  assert.equal(page.status,200);
  assert.match(await page.text(),/CNFDNT DELIVERY/);
  assert.equal((await fetch(base+'/delivery/access?token=bad')).status,403);
});
test('logout revokes session',async()=>{assert.equal((await request('/api/logout','POST')).status,200);assert.equal((await request('/api/state')).status,401)});

test('new sessions reject stale revisions without overwriting',async()=>{const login=await request('/api/login','POST',{email:'amechi@addcolormedia.com',password:'vanta'});cookie=login.headers.get('set-cookie').split(';')[0];const original=await(await request('/api/state')).json();assert.equal((await request('/api/state','PUT',original)).status,200);assert.equal((await request('/api/state','PUT',original)).status,409)});
test('uploads preserve originals and searchable text with server provenance',async()=>{const r=await request('/api/upload','POST',{name:'meeting.txt',data:Buffer.from('Action: review the community plan.').toString('base64')});assert.equal(r.status,200);const f=await r.json();assert.match(f.extracted_text,/review the community/);assert.ok(f.uploaded_at);const original=await request('/api/files/'+f.file_id);assert.equal(await original.text(),'Action: review the community plan.');});
test('Output draft has traceable sources and does not mutate records',async()=>{const before=await(await request('/api/state')).json();const r=await request('/api/output','POST',{template:'What Should I Do Today'});assert.equal(r.status,200);const result=await r.json();assert.ok(result.sources.every(s=>[...before.items,...before.worlds,...before.projects].some(i=>i.id===s.id)));assert.equal((await(await request('/api/state')).json()).revision,before.revision)});

test('Knowledge API reports setup truthfully and validates scope before answering',async()=>{const before=await(await request('/api/state')).json();const result=await request('/api/knowledge','POST',{question:'What do my notes say?',world:'w1'});assert.equal(result.status,503);assert.match((await result.json()).error,/needs a configured conversational model/);assert.equal((await request('/api/knowledge','POST',{question:'Anything?',world:'missing'})).status,400);assert.equal((await request('/api/knowledge','POST',{question:'Anything?',threadId:'unknown'})).status,400);assert.equal((await(await request('/api/state')).json()).revision,before.revision)});
test('portable backup includes stored originals and conversation records',async()=>{const r=await request('/api/backup');assert.equal(r.status,200);const backup=await r.json();assert.equal(backup.version,3);assert.ok(Array.isArray(backup.knowledgeThreads));assert.ok(backup.files.length)});
test('simultaneous edits cannot overwrite each other',async()=>{const s=await(await request('/api/state')).json();const a=structuredClone(s),b=structuredClone(s);a.name='First editor';b.name='Second editor';const results=await Promise.all([request('/api/state','PUT',a),request('/api/state','PUT',b)]);assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);});
test('chunked files preserve all bytes and reject incomplete uploads',async()=>{const bytes=Buffer.alloc(5*1024*1024+17,65);const begin=await request('/api/upload/start','POST',{name:'large.txt',size:bytes.length});assert.equal(begin.status,200);const upload=await begin.json();assert.equal((await request('/api/upload','POST',{id:upload.id})).status,400);for(let offset=0,index=0;offset<bytes.length;offset+=upload.chunkSize,index++){const r=await request('/api/upload/chunk','POST',{id:upload.id,index,data:bytes.subarray(offset,offset+upload.chunkSize).toString('base64')});assert.equal(r.status,200)}const finish=await request('/api/upload','POST',{id:upload.id});assert.equal(finish.status,200);const f=await finish.json();assert.equal(f.file_size,bytes.length);assert.deepEqual(Buffer.from(await(await request('/api/files/'+f.file_id)).arrayBuffer()),bytes);assert.equal((await request('/api/upload','POST',{id:upload.id})).status,400);});
test('music configuration includes all eight tracks and supports seeking',async()=>{const config=await(await request('/api/config')).json();assert.equal(config.tracks.length,8);assert.ok(config.tracks.some(t=>t.name==='The Confidant 2044'));const r=await fetch(base+config.tracks[0].url,{headers:{Range:'bytes=0-99'}});assert.equal(r.status,206);assert.equal((await r.arrayBuffer()).byteLength,100)});
