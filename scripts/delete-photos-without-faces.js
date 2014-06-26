var fs = require('fs');
var path = require('path');

var faceDetector = require('../lib/face-detector');
var utils = require('../lib/utils');
var mongoClient = require('../lib/mongo-client');

var dir = 'photo-queue';


var checkForFace = function(filename, next){
  var filePath = path.join(dir, filename);

  if(filePath.indexOf('.jpg') != -1){
    faceDetector.checkForFaces(filePath).then(function(opts){
      if(!opts.faces.length || opts.faces.length > 1){
        console.log('deleted', filePath);
        utils.deleteFile(opts.filePath);
      } else{
        console.log('adding', filePath);
        mongoClient.addQueueItem(opts.filePath);
      }

      if(next) next();
    }).fail(function(e){
      console.log(e);
    });
  } else {
    next();
  }
};


mongoClient.events.once('ready', function(){
  var files = null;

  fs.readdir(dir, function(err, photos){
    files = photos;
    dewIt(0);
  });

  var dewIt = function(i){
    if(files[i]){
      checkForFace(files[i], function(){
        dewIt(i+1);
      });
    }
  };
});
