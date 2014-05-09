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


var getAllPartners = function(){
  var deferred = Q.defer();

  var partners = db.collection('partners');
  partners.find().toArray(function(err, results){
    deferred.resolve(results);
  });

  return deferred.promise;
};


var getUserRecord = function(id){
  // Retrieve user record and return
};


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


var addQueueItem = function(queueItem){
  var deferred = Q.defer();

  var photoQueue = db.collection('photo-queue');
  photoQueue.insert(queueItem, function(err, docs){
    deferred.resolve(docs);
  });

  return deferred.promise;
};


var close = function(){
  console.log('closing database connection...');
  db.close();
};


exports.conditionallyCreatePartners = conditionallyCreatePartners;
exports.getAllPartners = getAllPartners;
exports.getQueueItem = getQueueItem;
exports.deleteQueueItem = deleteQueueItem;
exports.db = db;
exports.close = close;
exports.events = events;
