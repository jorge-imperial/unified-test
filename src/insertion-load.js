 

 // This code tries to recreate the workload of a customer.
// They are observing an abrupt increase in connections when a secondary is shutdown forcefully. This 
// has ocurred three times during Atlas maintenance.
const argv = require('yargs').argv

const database = require('./connect');

const host_list = argv.hosts_list  
const rs_name = argv.rs_name  
const user_name = argv.user  
const pwd = argv.pwd  

const dbContext = {
    replicasetMachines: host_list,
    replicasetName: rs_name,
    userName:  user_name,
    password: pwd,
    useAtlas: false
};
console.log(dbContext);

const namespaceTitle = 'test';
const relationTitle = 'unified_perf_test';


var readPref = { readPreference: 'primary'};
switch(argv.read_pref) {
  case 'primaryPreferred':
      readPref = { readPreference: argv.read_pref }
};
   

const random = max => Math.floor(Math.random() * max);
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];


setInterval( () =>  
{ 
    database.getCollection(namespaceTitle, relationTitle, undefined, dbContext)
        .then(collection => {

            console.log("Insertion\tTS\t " + Date.now() ); 

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


