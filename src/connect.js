
const mongoClient = require('mongodb').MongoClient;

let _cache;

function getCollection(databaseName, collectionName, poolsize, dbContext) {
    if (dbContext && dbContext.skipCache) {
        return makeConnection(databaseName, poolsize, dbContext).then(client =>
            client.db(databaseName).collection(collectionName)
        );
    }

    _cache = _cache || makeConnection(databaseName, poolsize, dbContext);
    return _cache.then(client => {
        return client.db(databaseName).collection(collectionName);
    });
}

function makeConnection(databaseName, poolSize, dbContext) {
    let { url, safeUrl } = getConnectionString(databaseName, dbContext);
    console.log(`Opening database connection to: ${safeUrl || url}`);
    //if poolsize is null, mongo will default it to 5 consecutive connections
    return (
        mongoClient
            //https://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#.connect
            .connect(url, {
                appname: databaseName,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                poolSize
            })
            .then(client => {
                client.on('close', err => {
                    const errMessage = err ? err.message : '';
                    console.log('Database connection closed. ' + errMessage);
                    _cache = undefined;
                });
                return client;
            })
    );
}

// https://docs.mongodb.com/manual/reference/connection-string/  (be sure to select the correct mongodb version in the navigation bar)
function getConnectionString(dbName, dbContext = {}) {
    let env = process.env;
    let replicasetMachines;
    let replicasetName;
    let userName;
    let password;
    let useAtlas;
    // Allow connection info to be overridden in dbContext, but only if replicasetMachines is passed in
    // Otherwise, sometimes identity silo gets messed up because userName is in the dbContext.
    if (dbContext.replicasetMachines) {
        replicasetMachines = dbContext.replicasetMachines || env.DB_REPLICASET_TCP_ADDRS_PORTS;
        replicasetName = dbContext.replicasetName || env.DB_REPLICASET_NAME;
        userName = dbContext.userName || env.DB_USER_NAME;
        password = dbContext.password || env.DB_PASSWORD;
        useAtlas = dbContext.useAtlas || env.DB_ATLAS;
    } else {
        replicasetMachines = env.DB_REPLICASET_TCP_ADDRS_PORTS;
        replicasetName = env.DB_REPLICASET_NAME;
        userName = env.DB_USER_NAME;
        password = env.DB_PASSWORD;
        useAtlas = env.DB_ATLAS;
    }
    password = encodeURIComponent(password);
    if (replicasetMachines && replicasetName) {
        if (useAtlas) {
            return {
                url: `mongodb://${userName}:${password}@${replicasetMachines}/${dbName}?ssl=true&replicaSet=${replicasetName}&authSource=admin`,
                safeUrl: `mongodb://${userName}:password@${replicasetMachines}/${dbName}?ssl=true&replicaSet=${replicasetName}&authSource=admin`
            };
        } else if (userName && password) {
            return {
                url: `mongodb://${userName}:${password}@${replicasetMachines}/${dbName}?replicaSet=${replicasetName}&authSource=admin`,
                safeUrl: `mongodb://${userName}:password@${replicasetMachines}/${dbName}?replicaSet=${replicasetName}&authSource=admin`
            };
        } else {
            return { url: `mongodb://${replicasetMachines}/${dbName}?replicaSet=${replicasetName}` };
        }
    } else {
        let mongoSingleHost = env.DB_1_PORT_27017_TCP_ADDR || '127.0.0.1';
        let mongoSinglePort = env.DB_1_PORT_27017_TCP_PORT || '27017';
        return { url: `mongodb://${mongoSingleHost}:${mongoSinglePort}/${dbName}` };
    }
}

module.exports = { getCollection, getConnectionString };


// - -- - 

 