var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE, { useMongoClient: true });

module.exports = { mongoose }