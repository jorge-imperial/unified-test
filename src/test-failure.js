// This code tries to recreate the workload of a customer.
// They are observing an abrupt increase in connections when a secondary is shutdown forcefully. This 
// has ocurred three times during Atlas maintenance.
 
const database = require('./connect');
const dbContext = {
    //replicasetMachines: 'prod-shard-00-00-litpp.gcp.mongodb.net:27017,prod-shard-00-01-litpp.gcp.mongodb.net:27017,prod-shard-00-02-litpp.gcp.mongodb.net:27017',
    replicasetMachines: 'localhost:31000,localhost:31001,localhost:31002',
    replicasetName: 'rs',
    userName: 'user',
    password: 'password',
    useAtlas: false
};

const namespaceTitle = 'test';
const relationTitle = 'unified_perf_test';


// Regular execution
//setInterval( ()=>  { console.log("TS: " + Date.now()); }, 500,0);

return database.getCollection(namespaceTitle, relationTitle, undefined, dbContext)
    .then(collection => {

        setInterval( ()=>  { 
            console.log("TS: " + Date.now()); 
            var n = Math.ceil(Math.random() * 100000);
            console.log('\tFind ' + n);

            query = { "siteCode" : n  };
            
            collection.findOne( query ).then( res => { 
                if (res)
                    console.log('\tFound ' + res.siteCode);
            });
        }, 100,0);

    })
    
 