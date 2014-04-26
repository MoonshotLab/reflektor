var MongoClient = require('mongodb').MongoClient;
var Q = require('q');
var EE = require('events').EventEmitter;
var db = null;
var events = new EE();


MongoClient.connect(process.env.REFLEKTOR_DB_CONNECTOR, function(err, client){
  if(err) throw err;
  db = client;
  events.emit('ready');
});


var conditionallyCreatePartners = function(partners){
  var deferred = Q.defer();
  console.log('conditionally creating user records...');

  var complete = 0;
  var newRecords = [];
  var existingPartners = db.collection('partners');

  var checkForDone = function(){
    complete++;

    if(complete == partners.length){
      console.log('fetched', partners.length,
        'partners. Created', newRecords.length, 'new records');
      deferred.resolve(newRecords);
    }
  };

  partners.forEach(function(partner){
    existingPartners.findOne({barkleyId : partner.barkleyId}, function(err, record){

      if(record === null){
        existingPartners.insert(partner, function(err, docs){
          if(docs && docs[0])
            newRecords.push(docs[0]);
          checkForDone();
        });
      } else checkForDone();
    });
  });

  return deferred.promise;
};


var getAllPartners = function(opts, next){
  if(typeof opts == 'function') next = opts;

  var partners = db.collection('partners');
  partners.find().toArray(function(err, results){
    if(next) next(err, results);
  });
};


var getUserRecord = function(id){
  // Retrieve user record and return
}


var getQueueItem = function(){
  // Retrieve the next itme in the qeueue where working is false
  // Set this retrieved item's property to working and save
  // Allocate a timed event which will cause the working attr
  // to expire *if* it's still in the DB
};


var deleteQueueItem = function(){
  // Find the resource which has a timer allocated.
  // clear the timer
  // delete the record
};


var close = function(){
  console.log('closing database connection...');
  db.close();
};


exports.conditionallyCreatePartners = conditionallyCreatePartners;
exports.getAllPartners = getAllPartners;
exports.getQueueItem = getQueueItem;
exports.deleteQueueItem = deleteQueueItem;
exports.close = close;
exports.events = events;
