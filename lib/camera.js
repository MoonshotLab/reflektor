var exec = require('child_process').exec;
var Q = require('q');


var takePicture = function(){
  var deferred = Q.defer();

  var filename = 'photo-queue/' + new Date().getTime() + '.jpg';
  var command = 'gphoto2 --capture-image-and-download --filename "' + filename + '"';

  exec(command, function(error, stdout, stderr){
    if(error) console.error('error', error);
    else if(stderr) console.error('stderr', stderr);
    else {
      console.log(stdout);
      deferred.resolve(filename);
    }
  });

  return deferred.promise;
};


exports.takePicture = takePicture;
