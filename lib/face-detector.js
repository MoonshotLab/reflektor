var fs = require('fs');
var cv = require('opencv');
var gm = require('gm');
var Q = require('q');
var path = require('path');


var createFace = function(filePath){
  var deferred = Q.defer();
  var outputPath = path.join('faces', filePath.replace('photo-queue', ''));

  cv.readImage(filePath, function(err, img){
    img.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
      if(err) deferred.reject(err);
      else if(faces && faces[0]){
        var face = faces[0];

        gm(filePath)
          .crop(face.width, face.height, face.x, face.y)
          .resize(125, 125)
          .write(outputPath, function(err){
            deferred.resolve(outputPath);
          });
      }
    });
  });

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
exports.createFace = createFace;
