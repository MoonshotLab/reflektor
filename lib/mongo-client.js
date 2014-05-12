var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
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
  var deferred = Q.defer();

  var partners = db.collection('partners');
  partners.findOne({_id : new ObjectID(id)}, function(err, user){
    deferred.resolve(user);
  });

  return deferred.promise;
};


var getQueueItem = function(){
  var deferred = Q.defer();

  // Retrieve the next itme in the qeueue where working is false
  // Set this retrieved item's property to working and save
  // Allocate a timed event which will cause the working attr
  // to expire *if* it's still in the DB
  deferred.resolve({});

  return deferred.promise;
};


var deleteQueueItem = function(){
  var deferred = Q.defer();

  // Find the resource which has a timer allocated.
  // clear the timer
  // delete the record
  deferred.resolve({});

  return deferred.promise;
};


var addQueueItem = function(queueItem){
  var deferred = Q.defer();

  var photoQueue = db.collection('photo-queue');
  photoQueue.insert(queueItem, function(err, docs){
    deferred.resolve(docs);
  });

  return deferred.promise;
};


var addTalkingPoint = function(opts){
  var deferred = Q.defer();

  var collection = db.collection('partners');
  getUserRecord(opts.userId).then(function(record){
    if(!record.talkingPoints) record.talkingPoints = [];
    record.talkingPoints.push(opts.talkingPoint);

    collection.update(
      { _id: new ObjectID(record._id) },
      { $set: { talkingPoints: record.talkingPoints } },
      function(){
        deferred.resolve(record);
      }
    );
  });

  return deferred.promise;
};


var destroyTalkingPoint = function(opts){
  var deferred = Q.defer();

  var collection = db.collection('partners');
  getUserRecord(opts.userId).then(function(record){
    record.talkingPoints.splice(opts.index, 1);

    collection.update(
      { _id: new ObjectID(record._id) },
      { $set: { talkingPoints: record.talkingPoints } },
      function(){
        deferred.resolve(record);
      }
    );
  });

  return deferred.promise;
};


var close = function(){
  console.log('closing database connection...');
  db.close();
};


exports.getAllPartners = getAllPartners;
exports.getUserRecord = getUserRecord;
exports.getQueueItem = getQueueItem;
exports.addTalkingPoint = addTalkingPoint;
exports.destroyTalkingPoint = destroyTalkingPoint;
exports.deleteQueueItem = deleteQueueItem;
exports.db = db;
exports.close = close;
exports.events = events;
