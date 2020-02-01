'use strict';

const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

const random = max => Math.floor(Math.random() * max);
const calculateDurationInMs = started => {
  const hrtime = process.hrtime(started);
  return (hrtime[0] * 1e9 + hrtime[1]) / 1e6;
};

async function main() {
  console.log(`connecting to: ${config.url}`);
  if (config.options.useUnifiedTopology) {
    console.log('using unified topology');
  } else {
    console.log('using legacy topology');
  }


  const client = new MongoClient(config.url, config.options);
  await client.connect();

  const coll = client.db().collection('unified_perf_test');

  let requestId = 0;
  const server = http.createServer(async (req, res) => {
    if (req.url !== '/') {
      res.end();
      return;
    }

    requestId++;

    try {
      const start = process.hrtime();
      const docs = await coll.distinct('siteCode', { status: 'pending', startAfter: { $lt: random(100000) }});
      console.log(`request[${requestId}] completed in ${calculateDurationInMs(start)} ms`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(docs));
    } catch(err) {
      console.error(err);
    }
  });

  console.log('listening for connections on http://localhost:3000');
  server.listen(3000);
}

main().catch(console.dir);
