var junkDrawer = require('./junk-drawer');
var mongoClient = require('./mongo-client');
var faces = require('./faces');


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

exports.createMissingPartnerData = createMissingPartnerData;
