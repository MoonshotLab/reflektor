var MongoClient = require('mongodb').MongoClient;
var EE = require('events').EventEmitter;
var db = null;
var events = new EE();


MongoClient.connect(process.env.REFLEKTOR_DB_CONNECTOR, function(err, client){
  if(err) throw err;
  db = client;
  events.emit('ready');
});


exports.updatePartner = function(opts){
  var partners = db.collection('partners');
  partners.findOne({barkleyId : opts.partner.barkleyId}, function(err, record){
    // Create a new record if one doesn't exist
    if(record == null){
      partners.insert(opts.partner, function(err, docs){
        if(err) console.error(err);
      });
    }
  });
};


exports.events = events;
