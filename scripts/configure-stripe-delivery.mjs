import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const key=process.env.STRIPE_SECRET_KEY;
const base=(process.env.PUBLIC_BASE_URL||process.env.NEXT_PUBLIC_APP_URL||'').replace(/\/$/,'');
if(!key)throw Error('Set STRIPE_SECRET_KEY before running this script.');
if(!base)throw Error('Set PUBLIC_BASE_URL, for example https://cnfdnt.co.');

const catalog=JSON.parse(await readFile(resolve(import.meta.dirname,'../data/delivery-products.json'),'utf8'));
const wanted=new Map(catalog.products.map(p=>p.stripePaymentLink).filter(Boolean).map(url=>[url,true]));

async function stripe(path,body){
  const response=await fetch('https://api.stripe.com/v1'+path,{
    method:body?'POST':'GET',
    headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/x-www-form-urlencoded'},
    body
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(data.error?.message||'Stripe request failed.');
  return data;
}

let starting_after,updated=0,seen=0,skipped=0;
do{
  const query=new URLSearchParams({limit:'100'});
  if(starting_after)query.set('starting_after',starting_after);
  const page=await stripe('/payment_links?'+query);
  for(const link of page.data||[]){
    if(!wanted.has(link.url)){skipped++;continue}
    seen++;
    const body=new URLSearchParams();
    body.set('after_completion[type]','redirect');
    body.set('after_completion[redirect][url]',`${base}/delivery?session_id={CHECKOUT_SESSION_ID}`);
    await stripe('/payment_links/'+link.id,body);
    updated++;
    console.log(`Updated ${link.id} ${link.url}`);
  }
  starting_after=page.has_more?page.data.at(-1)?.id:null;
}while(starting_after);

console.log(JSON.stringify({matched:seen,updated,skipped},null,2));
