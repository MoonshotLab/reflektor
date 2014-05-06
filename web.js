var express = require('express');
var path = require('path');
var mongoClient = require('./lib/mongo-client');
var faces = require('./lib/faces');
var routes = require('./lib/routes');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/photo-queue'));

app.get('/', routes.home);
app.get('/all-users', routes.allUsers);
app.get('/next-photo-in-queue', routes.nextPhotoInQueue);
app.get('/mark-record/:queueId', routes.markRecords);

console.log('web app listening on port', port);
app.listen(port);
