// This code tries to recreate the workload of a customer.
// They are observing an abrupt increase in connections when a secondary is shutdown forcefully. This 
// has ocurred three times during Atlas maintenance.
 
const database = require('./connect');
const yargs = require('yargs')


const dbContext = {
    
    replicasetMachines: 'localhost:31000,localhost:31001,localhost:31002',
    replicasetName: 'rs',
    userName: 'user',
    password: 'password',
    useAtlas: false
};

const namespaceTitle = 'test';
const relationTitle = 'unified_perf_test';

console.log(process.argv);
var arguments = process.argv.slice(2);

var readPreference = { readPreference: 'Primary'};
switch( arguments[0]) {
  case 'secondary' : 
      ;
  case 'secondaryPreferred' :
      ;
  case 'primaryPreferred':
      readPref = arguments[0]
      break;
};
   

setInterval( ()=>  
{ 
    database.getCollection(namespaceTitle, relationTitle, undefined, dbContext)
        .then(collection => {

            console.log("TS: " + Date.now()); 
            var n = Math.ceil(Math.random() * 100000);
            console.log('\tFind ' + n);

            query = { "siteCode" : n  };
        
            collection.findOne( query, readPref ).then( res => { 
                if (res)
                    console.log('\tFound ' + res.siteCode);
            });
        });

}, 50,0);  // Every 50ms
