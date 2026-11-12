import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { limitContact, type RateDatabase } from '../server/rate-limit';
test('SQL rate limiter enforces quota across independent handler calls and expires old windows',async()=>{
  const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync('drizzle/0000_contact_rate_limits.sql','utf8'));
  const database:RateDatabase={prepare(sql){let values:(string|number)[]=[];return{bind(...args){values=args;return this;},async first<T>(){return (sqlite.prepare(sql).get(...values) as T)||null;},async run(){return sqlite.prepare(sql).run(...values);}};}};
  const request=new Request('https://example.test/api/contact',{headers:{'cf-connecting-ip':'192.0.2.1'}});
  for(let i=0;i<5;i++)assert.equal(await limitContact(request,database,1000),null);
  assert.equal((await limitContact(request,database,1000))?.status,429);
  assert.equal(await limitContact(request,database,181000),null);
  const other=new Request('https://example.test/api/contact',{headers:{'cf-connecting-ip':'192.0.2.2'}});assert.equal(await limitContact(other,database,181000),null);
  const rows=sqlite.prepare('SELECT key FROM contact_rate_limits').all();assert.ok(rows.every(row=>!/192\.0\.2/.test(String(row.key))));sqlite.close();
});
test('missing durable storage fails closed',async()=>{assert.equal((await limitContact(new Request('https://example.test'),undefined))?.status,503);});
