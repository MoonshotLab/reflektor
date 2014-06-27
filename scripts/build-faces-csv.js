// Face recognition needs a CSV to compare images to people's names
// This script build the file from the user database

var Q = require('q');
var fs = require('fs');
var path = require('path');
var mongoClient = require('../lib/mongo-client');


mongoClient.events.once('ready', function(){
  mongoClient.getAllUsers()
    .then(generateCsvFromUsers)
    .then(writeFile)
    .then(function(filePath){
      console.log('done creating csv. file at', filePath);
    })
    .catch(handleErrors)
    .fin(process.kill);
});


var handleErrors = function(err){
  console.log(err);
};


var writeFile = function(csvString){
  var deferred = Q.defer();
  var filePath = path.join(process.cwd(), 'config', 'faces.csv');

  fs.writeFile(filePath, csvString, function(err){
    if(err) console.log(err);
    deferred.resolve(filePath);
  });

  return deferred.promise;
};


var generateCsvFromUsers = function(users){
  var deferred = Q.defer();
  var csvString = '';

  users.forEach(function(user){
    if(user.photos){
      user.photos.forEach(function(photo){
        csvString += [
          photo,
          ';',
          user._id,
          '\n'
        ].join('');
      });
    }
  });

  deferred.resolve(csvString);
  return deferred.promise;
};
