var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var Q = require('q');
var path = require('path');
var mongoClient = require('./mongo-client');


var retrieveAllPartnerData = function(){
  var deferred = Q.defer();
  console.log('retrieving all partner data...');

  request.get(
    'https://junkdrawer.barkleyus.com/info/partnerinfo.asp',
    {
      auth: {
        username: process.env.BARKLEY_USERNAME,
        password: process.env.BARKLEY_PASSWORD
      }
    },
    function(err, res, body){
      var partners = [];
      if(body){
        $ = cheerio.load(body);

        // Loop over all barkley partners, check to see if a
        // URL exists to help verify that we're parsing the DOM
        // correctly.
        $('a.body').each(function(i, partner){
          if($(this).attr('href').indexOf('partner.asp') != -1){
            var names = $(this).text().split(',');
            var userId = $(this).attr('href').replace('partner.asp?Employeeid=', '');

            // Trim the space off the beginning of the first name
            var firstName = names[1];
            if(firstName[0] == ' ')
              firstName = firstName.substring(1, firstName.length);

            partners.push({
              firstName: firstName,
              lastName: names[0],
              barkleyId: userId
            });
          }
        });
      }

      deferred.resolve(partners);
    }
  );

  return deferred.promise;
};


var fetchPartnerPhotos = function(partners){
  var deferred = Q.defer();
  console.log('fetching', partners.length, 'partner photos...');

  var complete = 0;
  var newPartners = [];

  var checkForDone = function(){
    complete++;

    if(complete >= partners.length){
      console.log('fetched', newPartners.length, 'new partner photos');
      deferred.resolve(newPartners);
    }
  };

  var requestAndWriteFile = function(partner, url, opts, next){

    var writeFile = function(err, res, body){
      if(res.statusCode == 200){
        var filePath = 'tmp/' + partner._id + '.jpg';
        fs.writeFile(filePath, body, 'binary', function(){
          var fullPath = path.join(process.cwd(), filePath);
          partner.fullPhoto = fullPath;
          newPartners.push(partner);
          next();
        });
      } else next();
    };

    request.get(url, opts, writeFile);
  };

  if(!partners.length) checkForDone();
  partners.forEach(function(partner){
    var url = [
      'https://junkdrawer.barkleyus.com/info/emppics/',
      partner.lastName,
      ',%20',
      partner.firstName,
      '.jpg'
    ].join('');

    var reqOpts = {
      auth: {
        username: process.env.BARKLEY_USERNAME,
        password: process.env.BARKLEY_PASSWORD
      },
      encoding: null
    };

    requestAndWriteFile(partner, url, reqOpts, checkForDone);
  });

  return deferred.promise;
};


var conditionallyCreatePartners = function(partners){
  var deferred = Q.defer();
  console.log('conditionally creating user records...');

  var complete = 0;
  var newRecords = [];
  var existingPartners = mongoClient.getDb().collection('partners');

  var checkForDone = function(){
    complete++;

    if(complete == partners.length){
      console.log('fetched', partners.length,
        'partners. Created', newRecords.length, 'new records');
      deferred.resolve(newRecords);
    }
  };

  partners.forEach(function(partner){
    existingPartners.findOne({barkleyId : partner.barkleyId}, function(err, record){

      if(record === null){
        existingPartners.insert(partner, function(err, docs){
          if(docs && docs[0])
            newRecords.push(docs[0]);
          checkForDone();
        });
      } else checkForDone();
    });
  });

  return deferred.promise;
};


exports.retrieveAllPartnerData = retrieveAllPartnerData;
exports.fetchPartnerPhotos = fetchPartnerPhotos;
exports.conditionallyCreatePartners = conditionallyCreatePartners;
