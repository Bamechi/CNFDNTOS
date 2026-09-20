/** Shared rules: browser previews and server-authoritative validation use the same model. */
export const DAY = 86400000;
export const ITEM_TYPES = ['rock', 'todo', 'issue', 'note', 'resource', 'event', 'checkpoint'];
export const WORLD_ICONS = ['orb', 'brand', 'spark', 'compass', 'leaf', 'studio'];
export const WORLD_COLORS = ['#7298ff', '#65bbcf', '#a294e8', '#91bc9c', '#dab27b', '#de91a6'];
export const OUTPUT_TEMPLATES = ['What Should I Do Today', 'World Weekly Brief', 'Meeting Agenda', 'Meeting Prep', 'Project Status', 'What Is Off Track', 'Plan My Week', 'Decisions This Week', 'Turn This Into a Plan'];
export const today = (now = new Date()) => localDate(now);
export function localDate(value) { const d = new Date(value); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function datePlus(date, days) { const d = new Date(date+'T12:00:00'); d.setDate(d.getDate()+days); return localDate(d); }
export const itemDate = i => i.type === 'event' ? (i.start_at || '').slice(0,10) : i.due_at || '';
export const complete = i => !!i.completed_at || i.status === 'solved';
export function scopeKey(world, project) { return project ? `project:${project}` : world ? `world:${world}` : 'global'; }
export function ordered(state, items, scope = 'global') {
  const order = state.orders?.[scope] || [];
  return [...items].sort((a,b) => {
    const ai = order.indexOf(a.id), bi = order.indexOf(b.id);
    return (ai < 0 ? 100000 + state.items.indexOf(a) : ai) - (bi < 0 ? 100000 + state.items.indexOf(b) : bi);
  });
}
export function activeRocks(state, world) {
  if(state.worlds.find(w=>w.id===world)?.archived_at)return [];
  return ordered(state,state.items.filter(i=>i.type==='rock'&&i.world===world&&!i.archived_at&&!complete(i)&&!i.deactivated),'world:'+world).slice(0,3);
}
export function rockState(state, i) {
  if(i.archived_at) return 'Archived'; if(complete(i)) return 'Finished';
  return activeRocks(state,i.world).some(r=>r.id===i.id)?'Active':'Inactive';
}
export function worldStatus(state, w) {
  if(w.status_override) return {status:w.status_override,reason:'Owner override: '+(w.status_override==='off'?'off track':'on track')};
  const rocks=activeRocks(state,w.id), on=rocks.filter(i=>i.status!=='off').length, off=rocks.length-on;
  return {status:on===off?'review':off>on?'off':'on',reason:rocks.length?`${on} on track / ${off} off track among ${rocks.length} Active Rocks${on===off?' — tied':''}`:'No Active Rocks yet'};
}
export function calendarDate(value, timeZone) {
  if(!timeZone)return localDate(value);
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
  return ['year','month','day'].map(k=>parts.find(p=>p.type===k).value).join('-');
}
export function todoDateError(i, previous, now=new Date(), timeZone) {
  if(i.type!=='todo'||!i.due_at||(previous&&previous.due_at===i.due_at)||(previous?.due_at?.includes('T')&&i.due_at.includes('T')&&+new Date(previous.due_at)===+new Date(i.due_at)))return '';
  const created=calendarDate(previous?.created_at||now,timeZone), day=calendarDate(now,timeZone);
  const dueDay=i.due_at.includes('T')?calendarDate(i.due_at,timeZone):i.due_at;
  if(dueDay<day||dueDay>datePlus(created,14))return 'A To-Do date must be today through 14 calendar days after creation. Keep or clear an existing date, or review this work as a Project, Rock checkpoint, or future event.';
  return '';
}
export function scheduledCheckpoint(i, now=new Date()) {return (i.type==='checkpoint'||!!i.checkpoint_id)&&!complete(i)&&i.due_at>datePlus(today(now),14);}
export function attention(i, now = new Date(), timeZone=i.timeZone) {
  const day=calendarDate(now,timeZone), created=i.created_at?calendarDate(i.created_at,timeZone):day;
  const age=Math.max(0,Math.round((Date.parse(day)-Date.parse(created))/DAY));
  const due=itemDate(i),overdue=!complete(i)&&!!due&&(due.length===10?due<day:+new Date(due)<+now);
  return {age,level:age>=14?'critical':age>=7?'attention':'normal',overdue,legacyLongDate:i.type==='todo'&&!!due&&(due.includes('T')?calendarDate(due,timeZone):due)>datePlus(created,14),snoozed:!!i.review_snooze_until&&new Date(i.review_snooze_until)>now};
}
export function isVisible(state, i) {
  const w=state.worlds.find(w=>w.id===i.world),p=state.projects.find(p=>p.id===i.project);
  return !i.archived_at&&!w?.archived_at&&!p?.archived_at;
}
export function normalize(input, now = new Date()) {
  const s=structuredClone(input), stamp=now.toISOString();
  s.schema=3; s.revision=Number(s.revision)||0;s.projects||=[];s.orders||={};s.focusThree||=[];s.audit||=[];s.outputs||=[];s.captures||=[];s.connections||=[];
  s.preferences={notifications:{enabled:false,categories:['due','overdue','offtrack'],leadDays:1,frequency:'daily',quietStart:'22:00',quietEnd:'08:00',digestTime:'09:00',weekDay:1},music:{track:'',remember:false},...s.preferences};
  s.worlds.forEach((w,n)=>{w.created_at||=stamp;w.summary??=w.purpose||'';w.headline||='';w.icon=WORLD_ICONS.includes(w.icon)?w.icon:'orb';w.color=WORLD_COLORS.includes(w.color)?w.color:WORLD_COLORS[(w.tone||n)%WORLD_COLORS.length]; if(w.status_override===undefined)w.status_override=w.status==='off'?'off':null;delete w.purpose;delete w.status;});
  // Legacy Inbox is retained as a review World; no captured item is discarded.
  if(s.items.some(i=>!s.worlds.some(w=>w.id===i.world))){s.worlds.push({id:'legacy-inbox',name:'Inbox',headline:'Unclassified items from the previous version',summary:'Review each item and choose the ongoing World it belongs to.',created_at:stamp,icon:'compass',color:WORLD_COLORS[0],status_override:null});s.items.forEach(i=>{if(!s.worlds.some(w=>w.id===i.world))i.world='legacy-inbox'});}
  s.projects.forEach(p=>{p.created_at||=stamp;p.status||='open';});
  s.items.forEach(i=>{
    i.created_at||=i.created?new Date(i.created+'T12:00:00').toISOString():stamp;
    i.updated_at||=i.created_at;
    if(i.due_at===undefined)i.due_at=['rock','todo'].includes(i.type)?i.due||'':'';
    if(i.type==='event')i.start_at||=i.due?i.due+'T09:00':'';
    if(i.done&&!i.completed_at)i.completed_at=stamp; // Unknown legacy completion time: retain seven days from migration.
    if(i.type==='resource')i.uploaded_at||=i.created_at;
    if(i.type==='rock')delete i.project;
    i.comments||=[];
    if(i.type==='todo'&&i.rock&&i.title.startsWith('Checkpoint:')&&!i.checkpoint_id){i.checkpoint_id='cp-'+i.id;i.description||=i.title;}
    if(['todo','rock'].includes(i.type)&&i.completed_at&&+now-new Date(i.completed_at)>=7*DAY&&!i.archived_at){i.archived_at=stamp;s.audit.push({id:'archive-'+i.id+'-'+stamp,at:stamp,item:i.id,action:'Automatically archived seven days after completion'});}
    delete i.created;delete i.due;delete i.done;
  });
  s.focusThree=s.focusThree.filter(id=>s.items.some(i=>i.id===id&&i.type==='rock'&&rockState(s,i)==='Active')).slice(0,3);
  delete s.vocabulary;
  return s;
}
export function validateState(next, previous, now = new Date()) {
  const fail=message=>{throw Object.assign(Error(message),{status:400})};
  if(!next||!Array.isArray(next.worlds)||!Array.isArray(next.items)||!Array.isArray(next.projects)||!Array.isArray(next.captures))fail('Invalid profile data.');
  if(next.worlds.filter(w=>!w.archived_at).length>10)fail('You can have at most ten active Worlds. Archive a World first.');
  // A reviewed actionable task and its checkpoint share edits and completion.
  for(const task of next.items.filter(i=>i.linked_checkpoint)){
    const checkpoint=next.items.find(i=>i.id===task.linked_checkpoint&&i.type==='checkpoint');if(!checkpoint)continue;
    const oldTask=previous.items.find(i=>i.id===task.id),oldCheckpoint=previous.items.find(i=>i.id===checkpoint.id);
    for(const key of ['title','description','due_at','world','project','rock','completed_at']){
      if(oldTask&&task[key]!==oldTask[key]){if(task[key]===undefined)delete checkpoint[key];else checkpoint[key]=task[key]}
      else if(oldCheckpoint&&checkpoint[key]!==oldCheckpoint[key]){if(checkpoint[key]===undefined)delete task[key];else task[key]=checkpoint[key]}
    }
  }
  const all=[...next.worlds,...next.projects,...next.items];
  if(all.some(x=>typeof x.id!=='string'||!x.id||x.id.length>150)||new Set(all.map(x=>x.id)).size!==all.length)fail('Every record needs a unique identifier.');
  for(const w of next.worlds){if(typeof w.name!=='string'||!w.name.trim())fail('World name is required.');if(!WORLD_ICONS.includes(w.icon)||!WORLD_COLORS.includes(w.color))fail('Select a built-in World icon and color.');}
  for(const p of next.projects){if(p.due_at&&!validDate(p.due_at))fail('Enter a valid Project due date.');if(!p.name?.trim()||!next.worlds.some(w=>w.id===p.world))fail('Each Project requires a name and one World.');if(p.rock&&!next.items.some(i=>i.id===p.rock&&i.type==='rock'&&i.world===p.world))fail('A Project’s primary Rock must belong to its World.');}
  try{if(next.timeZone)new Intl.DateTimeFormat('en-US',{timeZone:next.timeZone}).format(now)}catch{fail('Choose a valid time zone.')}
  if(!Array.isArray(next.focusThree)||new Set(next.focusThree).size!==next.focusThree.length||next.focusThree.length>3)fail('Only three overall MVP Rocks may be selected. Unstar one first.');
  for(const id of next.focusThree){const r=next.items.find(i=>i.id===id);const was=previous.focusThree?.includes(id);if(!r||rockState(next,r)!=='Active'){if(!was)fail('Only an Active Rock can be marked overall MVP.');}}
  for(const i of next.items){
    if(!ITEM_TYPES.includes(i.type)||typeof i.title!=='string'||!i.title.trim()||!next.worlds.some(w=>w.id===i.world))fail('Every item requires a title, type and World.');
    if(i.project&&!next.projects.some(p=>p.id===i.project&&p.world===i.world))fail('The selected Project must belong to this World.');
    if(i.type==='rock'&&(i.project||!i.description?.trim()||!validDate(i.due_at)))fail('Rocks require a World, definition of done and due date, and cannot belong to a Project.');
    if(i.rock&&!next.items.some(r=>r.id===i.rock&&r.type==='rock'&&r.world===i.world))fail('The supporting Rock must belong to this World.');
    if(i.due_at&&!validDate(i.due_at)&&!(i.type==='todo'&&/^\d{4}-\d{2}-\d{2}T.*(Z|[+-]\d{2}:\d{2})$/.test(i.due_at)&&Number.isFinite(+new Date(i.due_at))))fail('Enter a valid due date.');
    if(i.type==='event'&&(!i.start_at||!Number.isFinite(+new Date(i.start_at))))fail('Events require a start date and time.');
    if(i.reminder_at&&!Number.isFinite(+new Date(i.reminder_at)))fail('Enter a valid reminder time.');
    if(i.type==='checkpoint'&&(!i.rock||!i.description?.trim()||!validDate(i.due_at)))fail('A checkpoint requires a Rock, description and date.');
    const prior=previous.items.find(x=>x.id===i.id);const dateError=todoDateError(i,prior,now,next.timeZone);if(dateError)fail(dateError);
    if(i.linked_checkpoint&&!next.items.some(c=>c.id===i.linked_checkpoint&&c.type==='checkpoint'&&c.rock===i.rock&&c.world===i.world))fail('The checkpoint must belong to the same Rock and World.');
    if(i.checkpoint_id&&(i.type!=='todo'||!i.rock||!i.description?.trim()||!i.due_at))fail('A checkpoint requires a Rock, description and date.');
  }
  const linked=next.items.filter(i=>i.linked_checkpoint).map(i=>i.linked_checkpoint);if(new Set(linked).size!==linked.length)fail('A checkpoint already has an actionable To-Do.');
  const checkpoints=next.items.filter(i=>i.checkpoint_id).map(i=>i.checkpoint_id);if(new Set(checkpoints).size!==checkpoints.length)fail('Each checkpoint must have exactly one linked To-Do.');
  const old=new Map([...previous.worlds,...previous.projects,...previous.items].map(i=>[i.id,i]));
  for(const item of all){const before=old.get(item.id);item.created_at=before?.created_at||now.toISOString();if(item.type==='todo')item.timeZone=before?.timeZone||next.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone;if(before?.uploaded_at)item.uploaded_at=before.uploaded_at;if(item.type==='resource'&&!before)item.uploaded_at=now.toISOString();if(before){const beforeComparable={...before};const comparable={...item};delete beforeComparable.updated_at;delete comparable.updated_at;item.updated_at=JSON.stringify(beforeComparable)!==JSON.stringify(comparable)?now.toISOString():before.updated_at; if(['rock','todo'].includes(item.type)){if(!before.completed_at&&item.completed_at)item.completed_at=now.toISOString();else if(before.completed_at&&item.completed_at)item.completed_at=before.completed_at;}}else if(item.completed_at)item.completed_at=now.toISOString();}
  // Clients cannot rewrite audit history, uploaded-file provenance or external Google events.
  next.audit=[...previous.audit,...(next.audit||[]).filter(a=>!previous.audit.some(x=>x.id===a.id)).map(a=>({...a,at:now.toISOString()}))];
  for(const prior of previous.items.filter(i=>i.external)) { const candidate=next.items.find(i=>i.id===prior.id); if(!candidate||JSON.stringify(candidate)!==JSON.stringify(prior))fail('Google Calendar events are read-only. Change them in Google Calendar.'); }
  return normalize(next,now);
}
function validDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(s||'')&&Number.isFinite(+new Date(s+'T12:00:00'))&&localDate(new Date(s+'T12:00:00'))===s;}
export function promotionMessages(before, after) {
  return after.worlds.flatMap(w=>{
    const old=activeRocks(before,w.id).map(r=>r.id);
    return activeRocks(after,w.id).filter(r=>!old.includes(r.id)&&before.items.some(x=>x.id===r.id)).map(r=>`${r.title} is now Active in ${w.name}. Review its due date (${r.due_at}).`);
  });
}
export function reorder(state, id, direction, scope) {
  const item=state.items.find(i=>i.id===id);if(!item)return;
  let list=state.items.filter(i=>i.type===item.type&&!i.archived_at&&!complete(i));
  if(scope.startsWith('world:'))list=list.filter(i=>i.world===scope.slice(6));
  if(scope.startsWith('project:'))list=list.filter(i=>i.project===scope.slice(8));
  list=ordered(state,list,scope);const n=list.findIndex(i=>i.id===id),other=n+direction;
  if(n<0||other<0||other>=list.length)return;
  [list[n],list[other]]=[list[other],list[n]];
  const ids=list.map(i=>i.id);state.orders[scope]=[...ids,...(state.orders[scope]||[]).filter(x=>!ids.includes(x))];
}
