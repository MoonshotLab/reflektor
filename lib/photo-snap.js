var gpio = require('gpio');
var fs = require('fs');
var exec = require('child_process').exec;
var Q = require('q');

var detectable = true;
var detectableTimeout = null;


var monitor = function(){
  var motionDetector = gpio.export(4, {
    direction: 'in',
    ready: function(){
      console.log('detectiong motion');
    }
  });

  motionDetector.on('change', function(val){
    resetMotionTimeout(val)
      .then(takePicture)
      .then(checkForFaces)
      .then(conditionallyDeleteFile);
  });
};


var resetMotionTimeout = function(val){
  var deferred = Q.defer();

  if(val === 1 && detectable === true){

    // Deal with the timeout
    clearTimeout(detectableTimeout);
    detectableTimeout = setTimeout(function(){
      detectable = true;
    }, 5000);
    detectable = false;

    console.log('motion detected, attempting to take a picture');
    deferred.resolve();
  }

  return deferred.promise;
};


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


var checkForFaces = function(filename){
  var deferred = Q.defer();

  img.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
    if(!!faces)
      deferred.resolve(filename);
    else
      console.log('faces detected in', filename);
  });

  return deferred.promise;
};


var conditionallyDeleteFile = function(filename){
  var deferred = Q.defer();

  fs.unlink(filename, function(){
    console.log('deleting file', filename);
    deferred.resolve();
  });

  return deferred.promise;
};


exports.monitor = monitor;
