var junkDrawer = require('./junk-drawer');
var mongoClient = require('./mongo-client');
var faceDetector = require('./face-detector');
var motionDetector = require('./motion-detector');
var camera = require('./camera');
var utils = require('./utils');


var createMissingPartnerData = function(){
  junkDrawer.retrieveAllPartnerData()
    .then(junkDrawer.conditionallyCreatePartners)
    .then(junkDrawer.fetchPartnerPhotos)
    .then(mongoClient.close)
    .fail(function(e){
      console.log('could not complete missing partner data', e);
    })
    .fin(function(){
      process.kill();
    });
};


var captureMovement = function(){
  motionDetector.listen();
  motionDetector.device.on('motion', function(){
    camera.takePicture()
      .then(faceDetector.checkForFace)
      .then(function(opts){
        if(!opts.faces.length || opts.faces.length > 1)
          utils.deleteFile(opts.filePath);
        else
          mongoClient.addQueueItem(opts.filePath);
      });
  });
};


var startServer = function(){
  var server = require('../web/server');
};


exports.captureMovement = {
  description: "Activate a motion sensor and take pictures when motion occurs",
  fn: captureMovement
};

exports.createMissingPartnerData = {
  description: "Update all Barkley partner data",
  fn: createMissingPartnerData
};

exports.startServer = {
  description: "Start the web server",
  fn: startServer
};
