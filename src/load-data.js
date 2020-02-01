'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const random = max => Math.floor(Math.random() * max);
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log(`connecting to: ${config.url}`);
  if (config.options.useUnifiedTopology) {
    console.log('using unified topology');
  } else {
    console.log('using legacy topology');
  }

  const client = new MongoClient(config.url, config.options);
  await client.connect();

  console.log('loading test data into database');
  console.log('  > generating data');
  const docs = [];
  for (let i = 0; i < 100000; ++i) {
    docs.push({
      siteCode: random(100000),
      status: randomChoice(['pending', 'active', 'deployed']),
      startAfter: random(100000),
      periodDuration: random(100000),
      periodStarting: random(100000)
    });
  }

  console.log('  > inserting data...');
  const coll = client.db().collection('unified_perf_test');
  await coll.deleteMany();
  await coll.insertMany(docs);
  await client.close();

  console.log('  > complete');
}

main().catch(console.dir);
