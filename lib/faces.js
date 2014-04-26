var fs = require('fs');
var cv = require('opencv');
var gm = require('gm');
var Q = require('Q');
var path = require('path');


var createFacesFromPhotos = function(users){
  var deferred = Q.defer();
  var complete = 0;

  var checkForDone = function(){
    complete++;

    if(complete == partners.length)
      deferred.resolve(newRecords);
  };

  var writeImage = function(user){
    var outputDir = path.join(process.cwd(), 'faces/' + user.id);
    // TODO - I should know what number to write here...
    var outputPath = outputDir + '/0.jpg';

    if(user.face){
      var face = user.face;
      gm(user.fullPhoto)
        .crop(face.width, face.height, face.x, face.y)
        .write(outputPath, function(err){
          checkForDone();
        }
      );
    } else checkForDone();
  };

  // TODO - queue this...
  users.forEach(function(user){
    findFace(user).then(writeImage);
  });

  return deferred.promise;
};


var findFace = function(user){
  var deferred = Q.defer();

  var detectFace = function(err, img){
    if(img){
      img.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
        if(faces && faces[0])
          user.face = faces[0];

        deferred.resolve(user);
      });
    } else{
      console.log('no faces in photo', user.firstName, user.lastName);
      deferred.resolve(user);
    }
  };

  cv.readImage(user.fullPhoto, detectFace);

  return deferred.promise;
};


exports.createFacesFromPhotos = createFacesFromPhotos;
