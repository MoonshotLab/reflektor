var junkDrawer = require('./junk-drawer');
var mongoClient = require('./mongo-client');
var faces = require('./faces');
var photoSnap = require('./photo-snap');


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


// Activeate a motion sensor which listens for movement.
// Upon sensing, the camera will be activate and will
// snap a photo of the passer by...
var captureMovement = function(){
  photoSnap.activate();
};


exports.captureMovement = captureMovement;
exports.createMissingPartnerData = createMissingPartnerData;
