var junkDrawer = require('./junk-drawer');
var mongoClient = require('./mongo-client');
var faces = require('./faces');
var motionDetector = require('./motion-detector');
var camera = require('./camera');
var utils = require('./utils');


// Retrieves all Barkley Partner data, and creates a new
// record for a partner if they do not yet exist. After
// complete, will fetch the photo if necessary and create
// a new dir with the face picture
var createMissingPartnerData = function(){
  mongoClient.events.once('ready', function(){
    junkDrawer.retrieveAllPartnerData()
      .then(mongoClient.conditionallyCreatePartners)
      .then(junkDrawer.fetchPartnerPhotos)
      .then(faces.createFacesFromPhotos)
      .then(mongoClient.close);
  });
};


// Activate a motion sensor which listens for movement.
// Upon sensing, the camera will activate and snap a photo
// of the passer by. If a faces is detected, it will be
// added to the the photo-queue, otherwise it will be deleted.
var captureMovement = function(){
  motionDetector.device.on('motion', function(){
    camera.takePicture()
      .then(faces.findFaces)
      .then(function(filename, faces){
        if(!faces.length)
          utils.deleteFile(fileName);
        else
          mongoClient.addPhotoToQueue(fileName);
      });
  });
};


exports.captureMovement = captureMovement;
exports.createMissingPartnerData = createMissingPartnerData;
