 

 // This code tries to recreate the workload of a customer.
// They are observing an abrupt increase in connections when a secondary is shutdown forcefully. This 
// has ocurred three times during Atlas maintenance.
 
const database = require('./connect');
const dbContext = {
    replicasetMachines: 'localhost:31000,localhost:31001,localhost:31002',
    replicasetName: 'rs',
    userName: 'user',
    password: 'password',
    useAtlas: false
};

const namespaceTitle = 'test';
const relationTitle = 'unified_perf_test';

 
const random = max => Math.floor(Math.random() * max);
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];


setInterval( () =>  
{ 
    database.getCollection(namespaceTitle, relationTitle, undefined, dbContext)
        .then(collection => {

            console.log("TS: " + Date.now()); 

            var doc = {
                siteCode:  random(100000),
                status: randomChoice(['pending', 'active', 'deployed']),
                startAfter: random(100000),
                periodDuration: random(100000),
                periodStarting: random(100000)
            };

            collection.insertOne(doc);
           
        });

}, 100,0);  // Every 50ms


