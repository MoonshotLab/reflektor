var Q = require('q');
var fs = require('fs');

var deleteFile = function(filename){
  var deferred = Q.defer();

  fs.unlink(filename, function(){
    console.log('deleting file', filename);
    deferred.resolve(filename);
  });

  return deferred.promise;
};


exports.deleteFile = deleteFile;
