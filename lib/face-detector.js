var fs = require('fs');
var cv = require('opencv');
var gm = require('gm');
var Q = require('q');
var crypto = require('crypto');
var path = require('path');


var createFacesFromPhotos = function(users){
  var deferred = Q.defer();
  console.log('looking for faces in photos...');

  var complete = 0;
  var withFace = 0;

  var checkForDone = function(){
    if(users[complete])
      findFaces(users[complete]).then(writeImage);

    complete++;

    if(complete >= users.length){
      console.log('created', withFace, 'faces out of', complete);
      deferred.resolve(users);
    }
  };

  var writeImage = function(user){
    var outputDir = path.join(process.cwd(), 'faces/' + user._id);
    var fileName = crypto.randomBytes(6).toString('hex');
    var outputPath = outputDir + '/' + fileName;

    var face = user.face;
    if(face){
      withFace++;
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


var checkForFaces = function(filePath){
  var deferred = Q.defer();

  cv.readImage(filePath, function(err, img){
    if(err) deferred.reject(err);
    else{
      img.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
        if(err) deferred.reject(err);

        deferred.resolve({
          faces: faces,
          filePath: filePath
        });
      });
    }
  });

  return deferred.promise;
};


exports.checkForFaces = checkForFaces;
exports.createFacesFromPhotos = createFacesFromPhotos;
