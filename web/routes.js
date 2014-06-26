var mongoClient = require('../lib/mongo-client');
var path = require('path');


exports.home = function(req, res){
  res.redirect('/face-verifier.html');
};


exports.talkingPoints = function(req, res){
  res.redirect('/talking-points.html');
};


exports.createTalkingPoint = function(req, res){
  mongoClient.addTalkingPoint(req.query)
    .then(function(record){
      res.send(record);
    });
};


exports.destroyTalkingPoint = function(req, res){
  mongoClient.destroyTalkingPoint(req.query)
    .then(function(record){
      res.send(record);
    });
};


exports.getUser = function(req, res){
  mongoClient.getUserRecord(req.params.id)
    .then(function(user){
      res.send(user);
    });
};


exports.allUsers = function(req, res){
  mongoClient.getAllPartners()
    .then(function(partners){

      partners.sort(function(a, b){
        if(a.lastName < b.lastName) return -1;
        if(a.lastName > b.lastName) return 1;
        return 0;
      });

      res.send(partners);
    });
};


exports.getRandomPhotoInQueue = function(req, res){
  mongoClient.getRandomQueueItem()
    .then(function(queueItem){
      res.send(queueItem);
    });
};


exports.deleteQueueItem = function(req, res){
  var queueId = req.params.queueId;

  mongoClient.deleteQueueItem(queueId).then(function(recordId){
    res.send({ deletedRecord : recordId });
  });
};


exports.assignQueueItem = function(req, res){
  mongoClient.assignQueueItem({
    userId: req.query.userId,
    queueId: req.params.queueId
  }).then(res.send);
};


exports.markRecords = function(req, res){
  var userId = req.query.userId;
  var queueId = req.params.queueId;
  var fullPhotoPath = path.join(process.cwd(), 'photo-queue', queueId + '.jpg');

  // If no user id is supplied, assume it's a non record
  // and just delete it from the qeueue
  if(!userId){
    mongoClient.deleteQueueItem({
      queueId: queueId
    }).then( res.send({ 'updated' : true }) );
  } else {

    mongoClient.getUserRecord(userId)
      .then(function(user){
        user.fullPhoto = fullPhotoPath;
        createFacesFromPhotos([user]);
      })
      .then(function(){
        mongoClient.deleteQueueItem({
          queueId: queueId
        });
      })
      .then( res.send({ 'updated' : true }) );
  }
};
