import {createHmac,timingSafeEqual} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const productsPath=resolve(import.meta.dirname,'../data/delivery-products.json');
const catalog=JSON.parse(await readFile(productsPath,'utf8'));
const products=Object.freeze(catalog.products.map(p=>Object.freeze({...p,delivery:Object.freeze(p.delivery||[])})));
const byProduct=new Map(products.filter(p=>p.stripeProductId).map(p=>[p.stripeProductId,p]));
const byPrice=new Map(products.filter(p=>p.stripePriceId).map(p=>[p.stripePriceId,p]));
const byId=new Map(products.map(p=>[p.id,p]));
const bySlug=new Map(products.map(p=>[p.slug,p]));
function norm(value){return String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
const byText=new Map();
for(const product of products){
  for(const value of [product.id,product.name,product.title,product.slug]){
    const key=norm(value);
    if(key&&!byText.has(key))byText.set(key,product);
  }
}

export function deliveryCatalog(){return {assetFolderUrl:catalog.assetFolderUrl,products};}
export function productBySlug(slug){return bySlug.get(slug)||byId.get(slug);}
export function publicProduct(product){
  if(!product)return null;
  return {
    id:product.id,
    slug:product.slug,
    name:product.name,
    title:product.title,
    amount:product.amount,
    billing:product.billing,
    stripePaymentLink:product.stripePaymentLink,
    delivery:product.delivery.map(item=>({
      label:item.label,
      type:item.type,
      fileName:item.fileName,
      assetUrl:item.assetUrl||'',
      configured:!!item.assetUrl
    }))
  };
}

export function productsForLineItems(lineItems=[]){
  const found=new Map();
  for(const item of lineItems){
    const price=item.price?.id||item.price||item.priceId;
    const stripeProduct=item.price?.product||item.product||item.productId;
    const textMatches=[
      item.description,
      item.name,
      item.price?.nickname,
      item.price?.lookup_key,
      item.price?.product?.name,
      item.product?.name
    ].map(norm).filter(Boolean);
    const product=(price&&byPrice.get(price))||(stripeProduct&&byProduct.get(stripeProduct))||textMatches.map(key=>byText.get(key)).find(Boolean);
    if(product)found.set(product.id,product);
  }
  return [...found.values()];
}

function secret(){
  return process.env.DELIVERY_TOKEN_SECRET||process.env.STRIPE_WEBHOOK_SECRET||process.env.TEST_PASSWORD||'cnfdnt-development-only';
}
function base64url(input){return Buffer.from(input).toString('base64url');}
function signPayload(encoded){return createHmac('sha256',secret()).update(encoded).digest('base64url');}
export function createAccessToken(payload){
  const encoded=base64url(JSON.stringify(payload));
  return encoded+'.'+signPayload(encoded);
}
export function verifyAccessToken(token){
  const [encoded,signature]=String(token||'').split('.');
  if(!encoded||!signature)return null;
  const expected=signPayload(encoded);
  const a=Buffer.from(signature),b=Buffer.from(expected);
  if(a.length!==b.length||!timingSafeEqual(a,b))return null;
  const payload=JSON.parse(Buffer.from(encoded,'base64url').toString('utf8'));
  if(payload.expires&&Date.now()>payload.expires)return null;
  return payload;
}

export async function stripeRequest(path,options={}){
  const key=process.env.STRIPE_SECRET_KEY;
  if(!key)throw Object.assign(Error('Stripe fulfillment is not configured. Set STRIPE_SECRET_KEY on the server.'),{status:503});
  const response=await fetch('https://api.stripe.com/v1'+path,{
    ...options,
    headers:{
      Authorization:`Bearer ${key}`,
      'Content-Type':'application/x-www-form-urlencoded',
      ...(options.headers||{})
    }
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Object.assign(Error(data.error?.message||'Stripe request failed.'),{status:response.status});
  return data;
}

export async function checkoutProducts(sessionId){
  const session=await stripeRequest('/checkout/sessions/'+encodeURIComponent(sessionId));
  const paid=session.payment_status==='paid'||session.payment_status==='no_payment_required';
  if(session.status!=='complete'||!paid)throw Object.assign(Error('This checkout session is not paid yet.'),{status:402});
  const lineItems=await stripeRequest('/checkout/sessions/'+encodeURIComponent(sessionId)+'/line_items?limit=100');
  const purchased=productsForLineItems(lineItems.data||[]);
  if(!purchased.length)throw Object.assign(Error('No delivery products were mapped for this Stripe checkout.'),{status:404});
  return {session,lineItems:lineItems.data||[],products:purchased};
}

export function verifyStripeSignature(raw,signatureHeader){
  const secret=process.env.STRIPE_WEBHOOK_SECRET;
  if(!secret)throw Object.assign(Error('Stripe webhook signing secret is not configured.'),{status:503});
  const parts=Object.fromEntries(String(signatureHeader||'').split(',').map(part=>part.split('=')));
  if(!parts.t||!parts.v1)throw Object.assign(Error('Missing Stripe signature.'),{status:400});
  const signed=parts.t+'.'+raw;
  const expected=createHmac('sha256',secret).update(signed).digest('hex');
  const a=Buffer.from(parts.v1),b=Buffer.from(expected);
  if(a.length!==b.length||!timingSafeEqual(a,b))throw Object.assign(Error('Invalid Stripe signature.'),{status:400});
  const age=Math.abs(Date.now()/1000-Number(parts.t));
  if(age>300)throw Object.assign(Error('Expired Stripe signature.'),{status:400});
}

export function accessUrl(req,token){
  const proto=req.headers['x-forwarded-proto']||((process.env.SECURE_COOKIE==='1'||process.env.VERCEL)?'https':'http');
  const host=req.headers['x-forwarded-host']||req.headers.host||process.env.NEXT_PUBLIC_APP_URL||process.env.PUBLIC_BASE_URL||'localhost:4310';
  return `${proto}://${host}/delivery/access?token=${encodeURIComponent(token)}`;
}

function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function assetHref(item){
  return item.assetUrl||process.env.DELIVERY_FALLBACK_URL||catalog.assetFolderUrl;
}
export function renderDeliveryPage({products,session,token,message}){
  const customer=session?.customer_details?.email||session?.customer_email||'';
  const cards=products.map(product=>`<article class="delivery-card">
    <p class="eyebrow">${esc(product.id)}</p>
    <h2>${esc(product.title)}</h2>
    <p>${esc(product.name)}</p>
    <div class="delivery-actions">${product.delivery.map(item=>`<a class="button" href="${esc(assetHref(item))}" target="_blank" rel="noopener">${item.assetUrl?'Open download':'Open asset folder'}</a>`).join('')||`<a class="button" href="${esc(catalog.assetFolderUrl)}" target="_blank" rel="noopener">Open asset folder</a>`}</div>
    ${product.delivery.some(item=>!item.assetUrl)?`<p class="note">Delivery URL needs final product-specific file link. The button currently opens the configured asset folder.</p>`:''}
  </article>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your CNFDNT Products</title><link rel="stylesheet" href="/delivery.css"></head><body><main class="delivery-shell"><section class="hero"><p class="eyebrow">CNFDNT DELIVERY</p><h1>Your products are ready.</h1><p>${esc(message||'Thanks for your purchase. Keep this page open while you download or save your access links.')}</p>${customer?`<p class="muted">Receipt email: ${esc(customer)}</p>`:''}${token?`<p class="muted">Private access link: <a href="/delivery/access?token=${encodeURIComponent(token)}">reopen this delivery page</a></p>`:''}</section><section class="delivery-grid">${cards}</section><footer>Need help? Email <a href="mailto:cnfdnt.ai@gmail.com">cnfdnt.ai@gmail.com</a>.</footer></main></body></html>`;
}

export function tokenProducts(payload){
  const ids=Array.isArray(payload?.productIds)?payload.productIds:[];
  return ids.map(id=>byId.get(id)).filter(Boolean);
}
