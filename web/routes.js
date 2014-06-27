var mongoClient = require('../lib/mongo-client');
var faceDetector = require('../lib/face-detector');
var utils = require('../lib/utils');


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
  mongoClient.getQueueItem(queueId)
    .then(function(queueItem){
      utils.deleteFile(queueItem.path);
    });
  mongoClient.deleteQueueItem(queueId).then(function(recordId){
    res.send({ deletedRecord : recordId });
  });
};


// Meh... this is a real mess. Could be better
exports.assignQueueItem = function(req, res){
  mongoClient.getQueueItem(req.params.queueId)
    .then(function(queueItem){

      faceDetector.createFace(queueItem.path)
        .then(function(faceFilePath){
          mongoClient.addFaceToUser({
            faceFilePath: faceFilePath,
            userId: req.query.userId
          })
          .then(function(user){
            mongoClient.deleteQueueItem(queueItem._id);
            utils.deleteFile(queueItem.path);
            console.log('made a new face for', user.firstName, user.lastName, 'at', faceFilePath);
            res.send({
              user: user,
              faceFile: faceFilePath
            });
          });
        });
    }).fail(function(e){
      console.log(e);
    });
};
