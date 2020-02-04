#!/bin/bash

# Start new replica set. 
killall mongod
rm -fr ./data
m 4.2.2

mlaunch init --replicaset --nodes 3 --auth --username user --password P4ssw0rd --name rs 

# Two query clients: one reading from secondary
node src/query-load.js --hosts_list "localhost:27018,localhost:27017,localhost:27019"  --user user --pwd P4ssw0rd --rs_name rs --read_pref secondaryPreferred >q0.log  2>&1 &
node src/query-load.js --hosts_list "localhost:27018,localhost:27017,localhost:27019"  --user user --pwd P4ssw0rd --rs_name rs --read_pref >q1.log  2>&1 &

# One insertion process
node src/query-load.js --hosts_list "localhost:27018,localhost:27017,localhost:27019"  --user user --pwd P4ssw0rd --rs_name rs >ins0.log  2>&1  &

sleep 30

# Kill one secondary here.
echo "Please kill a secondary and watch the world burn."


