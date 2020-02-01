'use strict';

module.exports = {
  url: 'mongodb://localhost:31000/test?replicaSet=rs',
  options: { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10 }
};
