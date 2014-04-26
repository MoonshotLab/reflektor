var express = require('express');
var path = require('path');
var mongoClient = require('./lib/mongo-client');
var faces = require('./lib/faces');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/photo-queue'));

app.get('/', function(req, res){
  res.redirect('/face-verifier.html');
});

app.get('/next-photo-in-queue', function(req, res){
  mongoClient.getQueueItem()
    .then(function(queueItem){
      res.send(queueItem);
    });
});

app.get('/mark-record/:queueId', function(req, res){
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
  });

console.log('web app listening on port', port);
app.listen(port);
