var express = require('express');
var routes = require('./routes');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname.replace('/web', '') + '/photo-queue'));

app.get('/', routes.home);
app.get('/all-users', routes.allUsers);
app.get('/talking-points', routes.talkingPoints);
app.get('/talking-points/new', routes.createTalkingPoint);
app.get('/talking-points/destroy', routes.destroyTalkingPoint);
app.get('/user/:id', routes.getUser);
app.get('/get-random-photo-in-queue', routes.getRandomPhotoInQueue);
app.get('/mark-record/:queueId', routes.markRecords);

console.log('web app listening on port', port);
app.listen(port);
