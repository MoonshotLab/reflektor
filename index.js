var junkDrawer = require('./lib/junk-drawer');
var mongoClient = require('./lib/mongo-client');

mongoClient.events.once('ready', function(){
  junkDrawer.createPartnerRecords();
});
