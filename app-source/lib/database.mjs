import {mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
// The same parameterized statements run locally on SQLite and in hosted Postgres.
export async function openDatabase(path){
  const url=process.env.DATABASE_URL||process.env.POSTGRES_URL;
  if(!url){if(process.env.VERCEL)throw Error('Connect a Postgres database before deploying CNFDNT OS.');await mkdir(dirname(path),{recursive:true});const {DatabaseSync}=await import('node:sqlite');return new DatabaseSync(path);}
  const {neon}=await import('@neondatabase/serverless');const sql=neon(url);
  function convert(query){let index=0;return query.replace(/\?/g,()=>'$'+(++index)).replace(/\bBLOB\b/g,'BYTEA').replace(/expires INTEGER/g,'expires BIGINT');}
  return {async exec(ddl){for(const statement of ddl.split(';').filter(s=>s.trim()))await sql.query(convert(statement),[]);},prepare(query){const text=convert(query);return {async get(...params){return (await sql.query(text,params))[0]},async all(...params){return sql.query(text,params)},async run(...params){const result=await sql.query(text,params,{fullResults:true});return {changes:result.rowCount}}}}};
}
export function conflict(){return Object.assign(Error('Your workspace changed in another tab. Refresh to load the latest version; your unsaved work is available in this tab’s recovery copy.'),{status:409})}
