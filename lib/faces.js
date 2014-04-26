var fs = require('fs');
var cv = require('opencv');
var gm = require('gm');
var Q = require('Q');
var path = require('path');


var createFacesFromPhotos = function(users){
  var deferred = Q.defer();
  var complete = 0;

  var checkForDone = function(){
    if(users[complete])
      findFace(users[complete]).then(writeImage);

    complete++;

    if(complete >= users.length)
      deferred.resolve(users);
  };

  var writeImage = function(user){
    var outputDir = path.join(process.cwd(), 'faces/' + user._id);
    // TODO - I should know what number to write here...
    var outputPath = outputDir + '/0.jpg';

    var face = user.face;
    if(face){
      fs.mkdir(outputDir, function(err){
        gm(user.fullPhoto)
          .crop(face.width, face.height, face.x, face.y)
          .write(outputPath, function(err){
            checkForDone();
          }
        );
      });

    } else checkForDone();
  };

  checkForDone();
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
