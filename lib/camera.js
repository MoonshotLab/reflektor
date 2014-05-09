var exec = require('child_process').exec;
var Q = require('q');


var takePicture = function(){
  var deferred = Q.defer();

  var filename = 'photo-queue/' + new Date().getTime() + '.jpg';
  var command = 'fswebcam -c ~/.fswebcam.conf ' + filename;

  exec(command, function(error, stdout, stderr){
    if(error) console.error(error);
    else if(stderr) console.error(stderr);
    else {
      console.log(stdout);
      deferred.resolve(filename);
    }
  });

  return deferred.promise;
};


exports.takePicture = takePicture;
