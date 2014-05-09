var deleteFile = function(filename){
  var deferred = Q.defer();

  fs.unlink(filename, function(){
    console.log('deleting file', filename);
    deferred.resolve();
  });

  return deferred.promise;
};
