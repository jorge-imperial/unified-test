
## Start up a replicaset
```
mlaunch init --replicaset --arbiter --name rs --hostname localhost --port 31000
```

## Modify the MongoDB url
open the `config.js` and replace the URI if necessary

## Load Data into replica set
```
node load-data.js
```
## Run test
```
node server.js
```

This will run a server on `localhost:3000`, now you can point your browser at that
url and see how long is takes to complete the operation.s
