var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.redirect('/face-verifier.html');
});

console.log('web app listening on port', port);
app.listen(port);
