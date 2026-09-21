import {randomBytes} from 'node:crypto';
import {basename,extname} from 'node:path';
const CHUNK=2*1024*1024;
export async function uploadChunks(db,req,body,session,limits){
  const fail=message=>{throw Object.assign(Error(message),{status:400})};
  if(req==='/api/upload/start'){
    if(typeof body.name!=='string'||!limits.extensions[extname(body.name).toLowerCase()])fail('Choose a supported file.');
    if(!Number.isInteger(body.size)||body.size<1||body.size>limits.file)fail('Maximum file size is 20 MB.');
    await db.prepare('DELETE FROM upload_parts WHERE upload_id IN (SELECT id FROM uploads WHERE expires<?)').run(Date.now());
    await db.prepare('DELETE FROM uploads WHERE expires<?').run(Date.now());
    const used=Number((await db.prepare('SELECT COALESCE(SUM(size),0) AS used FROM files').get()).used),pending=Number((await db.prepare('SELECT COALESCE(SUM(size),0) AS used FROM uploads').get()).used);
    if(used+pending+body.size>limits.account)fail('The account’s 200 MB storage quota is full.');
    const id=randomBytes(16).toString('hex');await db.prepare('INSERT INTO uploads VALUES(?,?,?,?,?)').run(id,session,basename(body.name),body.size,Date.now()+3600000);return {id,chunkSize:CHUNK};
  }
  const row=await db.prepare('SELECT * FROM uploads WHERE id=? AND session=? AND expires>?').get(String(body.id||''),session,Date.now());if(!row)fail('Upload expired. Please choose the file again.');
  const count=Math.ceil(Number(row.size)/CHUNK);
  if(req==='/api/upload/chunk'){
    const index=body.index;if(!Number.isInteger(index)||index<0||index>=count||typeof body.data!=='string')fail('Invalid upload part.');
    const bytes=Buffer.from(body.data,'base64'),expected=index===count-1?Number(row.size)-CHUNK*index:CHUNK;if(bytes.length!==expected)fail('Upload part has an unexpected size.');
    await db.prepare('INSERT INTO upload_parts VALUES(?,?,?) ON CONFLICT(upload_id,part) DO UPDATE SET content=excluded.content').run(row.id,index,bytes);return {ok:true};
  }
  const parts=await db.prepare('SELECT part,content FROM upload_parts WHERE upload_id=? ORDER BY part').all(row.id);if(parts.length!==count||parts.some((p,i)=>Number(p.part)!==i))fail('Upload is incomplete. Please try again.');
  const bytes=Buffer.concat(parts.map(p=>Buffer.from(p.content)));if(bytes.length!==Number(row.size))fail('Upload size does not match.');return {id:row.id,name:row.name,bytes};
}
