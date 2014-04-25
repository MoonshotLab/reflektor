var MongoClient = require('mongodb').MongoClient;
var junkDrawer = require('./junk-drawer');
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
        // Only need to do fetch the photo the very first time
        if(docs && docs[0])
          junkDrawer.fetchPartnerPhoto({ partner: docs[0] });
      });
    }

    // TODO - update a record if the props don't match
  });
};


exports.getAllPartners = function(opts, next){
  if(typeof opts == 'function') next = opts;

  var partners = db.collection('partners');
  partners.find.toArray(function(err, results){
    if(next) next(err, results);
  });
};


exports.events = events;
