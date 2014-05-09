var mongoClient = require('../lib/mongo-client');
var path = require('path');


exports.home = function(req, res){
  res.redirect('/face-verifier.html');
};


exports.talkingPoints = function(req, res){
  res.redirect('/talking-points.html');
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


exports.nextPhotoInQueue = function(req, res){
  mongoClient.getQueueItem()
    .then(function(queueItem){
      res.send(queueItem);
    });
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
