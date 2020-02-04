'use strict';

module.exports = {
  url: 'mongodb://user:password@localhost:31000/test?replicaSet=rs&authSource=admin',
  options: { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10 }
};
