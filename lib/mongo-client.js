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


var getAllUsers = function(){
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


var getQueueItem = function(id){
  var deferred = Q.defer();
  var queueItems = db.collection('photo-queue');

  queueItems.findOne({_id : new ObjectID(id)}, function(err, queueItem){
    deferred.resolve(queueItem);
  });

  return deferred.promise;
};


var getRandomQueueItem = function(){
  var deferred = Q.defer();
  var queueItems = db.collection('photo-queue');

  queueItems.count(function(err, count){
    var randomNum = Math.floor((Math.random()*(count-1)));
    queueItems.findOne(
      {},
      {
        skip: randomNum,
        limit: 1
      },
      function(err, item){
        if(err) deferred.reject(err);
        deferred.resolve(item);
      }
    );
  });

  return deferred.promise;
};


var addQueueItem = function(fileName){
  var deferred = Q.defer();
  var photoQueue = db.collection('photo-queue');

  photoQueue.insert({path : fileName}, function(err, docs){
    deferred.resolve(docs);
  });

  return deferred.promise;
};


var deleteQueueItem = function(recordId){
  var deferred = Q.defer();
  var photoQueue = db.collection('photo-queue');

  photoQueue.remove(
    { _id: new ObjectID(recordId) },
    { justOne: true },
    function(err, res){
      if(err) deferred.reject(err);
      deferred.resolve(recordId);
    }
  );

  return deferred.promise;
};


var addFaceToUser = function(opts){
  var deferred = Q.defer();
  var partners = db.collection('partners');

  getUserRecord(opts.userId).then(function(record){
    if(!record.photos) record.photos = [];
    record.photos.push(opts.faceFilePath);

    partners.update(
      { _id: new ObjectID(opts.userId) },
      { $set: { photos: record.photos }},
      function(err, res){
        deferred.resolve(record);
      }
    );
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


var getDb = function(){
  return db;
};


var close = function(){
  console.log('closing database connection...');
  db.close();
};


exports.getAllUsers = getAllUsers;
exports.getUserRecord = getUserRecord;
exports.addFaceToUser = addFaceToUser;

exports.addQueueItem = addQueueItem;
exports.getQueueItem = getQueueItem;
exports.deleteQueueItem = deleteQueueItem;
exports.getRandomQueueItem = getRandomQueueItem;

exports.addTalkingPoint = addTalkingPoint;
exports.destroyTalkingPoint = destroyTalkingPoint;

exports.getDb = getDb;
exports.close = close;
exports.events = events;
