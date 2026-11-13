import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContactHandler, sheetSafe, sendEmailJS, EmailDeliveryError, type EmailRequest } from '../netlify/functions/lib/contact-handler';
import { contactSchema } from '../src/lib/contact-schema';
const env = { SITE_URL: 'https://example.test', EMAILJS_SERVICE_ID: 'test-service', EMAILJS_NOTIFICATION_TEMPLATE_ID: 'test-notify', EMAILJS_ACK_TEMPLATE_ID: 'test-ack', EMAILJS_PUBLIC_KEY: 'test-public', CONTACT_TO_EMAIL: 'inbox@example.test', CONTACT_REPLY_TO_EMAIL: 'business@example.test' };
const valid = { name: 'Sample Person', email: 'person@example.test', company: 'Sample Company', interest: 'digital-products', message: 'We would like to discuss a new customer portal.', consent: true };
const req = (data: unknown, origin = env.SITE_URL) => new Request('https://example.test/api/contact', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(data) });
const noDelay = async () => {};
test('rejects invalid contact data on the server', async () => { const h = createContactHandler(env); for (const change of [{ email:'bad' },{ consent:false },{ message:'short' }]) assert.equal((await h(req({ ...valid, ...change }))).status,400); });
test('rejects cross-origin and missing-origin submissions', async () => { const h=createContactHandler(env); assert.equal((await h(req(valid,'https://other.test'))).status,403); const r=req(valid);r.headers.delete('origin');assert.equal((await h(r)).status,403); });
test('rejects oversized, malformed, unsupported and spam requests', async () => { const h=createContactHandler(env);assert.equal((await h(req({...valid,message:'x'.repeat(17000)}))).status,413);assert.equal((await h(req({...valid,honey:'spam'}))).status,400);const bad=new Request('https://example.test/api/contact',{method:'POST',headers:{origin:env.SITE_URL,'content-type':'application/json'},body:'{invalid'});assert.equal((await h(bad)).status,400);const r=req(valid);r.headers.set('content-type','text/plain');assert.equal((await h(r)).status,415); });
test('unconfigured delivery returns 503 and configured false', async () => { const h=createContactHandler({});assert.equal((await h(req(valid))).status,503);assert.deepEqual(await (await h(new Request('https://example.test/api/contact'))).json(),{configured:false}); });
test('notification includes all inquiry fields, uses fixed recipient, then sends acknowledgement', async () => {
  const emails:EmailRequest[]=[];const delays:number[]=[];
  const h=createContactHandler(env,{sendEmail:async email=>{emails.push(email);},delay:async ms=>{delays.push(ms);}});
  const r=await h(req({...valid,phone:'+1 555 010 1234',budget:'$5,000–$15,000',referral:'A business introduction'}));
  assert.deepEqual(await r.json(),{accepted:true,acknowledgementSent:true});assert.equal(emails.length,2);
  assert.equal(emails[0].template,env.EMAILJS_NOTIFICATION_TEMPLATE_ID);assert.equal(emails[0].params.to_email,env.CONTACT_TO_EMAIL);assert.equal(emails[0].params.reply_to,valid.email);assert.equal(emails[0].params.message,valid.message);assert.match(emails[0].params.details,/\$5,000–\$15,000/);assert.match(emails[0].params.details,/A business introduction/);
  assert.equal(emails[1].template,env.EMAILJS_ACK_TEMPLATE_ID);assert.equal(emails[1].params.to_email,valid.email);assert.equal(emails[1].params.reply_to,env.CONTACT_REPLY_TO_EMAIL);assert.ok(!emails[1].params.message.includes(valid.message));assert.deepEqual(delays,[1100]);
  for (const [index, file] of ['notification.html','acknowledgement.html'].entries()) {
    const html=readFileSync(new URL(`../emailjs/${file}`,import.meta.url),'utf8');
    for(const match of html.matchAll(/\{\{([a-z_]+)\}\}/g))assert.ok(match[1] in emails[index].params,`Missing template parameter ${match[1]} in ${file}`);
    assert.ok(!/<script\b|javascript:/i.test(html),'Email templates must work without JavaScript');
  }
});
test('notification failure does not send acknowledgement or claim success', async () => {let calls=0;const h=createContactHandler(env,{sendEmail:async()=>{calls++;throw new Error('test rejection');},delay:noDelay});assert.equal((await h(req(valid))).status,502);assert.equal(calls,1);});
test('acknowledgement failure preserves accepted inquiry and does not invite resubmission', async () => {const h=createContactHandler(env,{sendEmail:async email=>{if(email.template===env.EMAILJS_ACK_TEMPLATE_ID)throw new Error('test ack failure');},delay:noDelay});const r=await h(req(valid));assert.equal(r.status,200);assert.deepEqual(await r.json(),{accepted:true,acknowledgementSent:false});});
test('provider throttling before acceptance returns retryable 429',async()=>{const h=createContactHandler(env,{sendEmail:async()=>{throw new EmailDeliveryError(429);}});assert.equal((await h(req(valid))).status,429);});
test('CRM failure does not lose accepted email',async()=>{const h=createContactHandler(env,{sendEmail:async()=>{},delay:noDelay,append:async()=>{throw new Error('test CRM failure');}});assert.equal((await h(req(valid))).status,200);});
test('visitor cannot override notification recipient or template',async()=>{const h=createContactHandler(env);assert.equal((await h(req({...valid,to_email:'other@example.test',template_id:'other'}))).status,400);});
test('durable limiter can reject sending before any provider call',async()=>{let called=false;const h=createContactHandler(env,{sendEmail:async()=>{called=true;},limit:async()=>new Response(null,{status:429})});assert.equal((await h(req(valid))).status,429);assert.equal(called,false);});
test('REST adapter uses private authorization only on the server and handles text success',async()=>{
  const mockFetch:typeof fetch=async(input,init)=>{assert.equal(input,'https://api.emailjs.com/api/v1.0/email/send');const body=JSON.parse(String(init?.body));assert.equal(body.accessToken,'test-private-not-real');assert.equal(body.user_id,env.EMAILJS_PUBLIC_KEY);assert.equal(body.template_id,'test-notify');return new Response('OK',{status:200});};
  await sendEmailJS({...env,EMAILJS_PRIVATE_KEY:'test-private-not-real'},{template:'test-notify',params:{to_email:env.CONTACT_TO_EMAIL}},mockFetch);
});
test('strips attribution unless opted in and protects sheet text',()=>{const d=contactSchema.parse({...valid,attributionConsent:false,attribution:{utm_source:'sample'}});assert.equal(d.attribution,undefined);const yes=contactSchema.parse({...valid,attributionConsent:true,attribution:{utm_source:'sample'}});assert.equal(yes.attribution?.utm_source,'sample');assert.equal(sheetSafe('=FORMULA()'),"'=FORMULA()");assert.equal(sheetSafe('ordinary text'),'ordinary text');});
