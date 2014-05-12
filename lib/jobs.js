var junkDrawer = require('./junk-drawer');
var mongoClient = require('./mongo-client');
var faceDetector = require('./face-detector');
var motionDetector = require('./motion-detector');
var camera = require('./camera');
var utils = require('./utils');


var createMissingPartnerData = function(){
  mongoClient.events.once('ready', function(){
    junkDrawer.retrieveAllPartnerData()
      .then(junkDrawer.conditionallyCreatePartners)
      .then(junkDrawer.fetchPartnerPhotos)
      .then(faceDetector.createFacesFromPhotos)
      .then(mongoClient.close);
  });
};


var captureMovement = function(){
  motionDetector.listen();
  motionDetector.device.on('motion', function(){
    camera.takePicture()
      .then(faceDetector.findFaces)
      .then(function(filename, faces){
        if(!faces.length)
          utils.deleteFile(fileName);
        else
          mongoClient.addQueueItem(fileName);
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
