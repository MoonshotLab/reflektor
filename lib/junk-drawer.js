var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var db = require('./mongo-client');


var retrievePartnerData = function(opts, next){
  if(typeof opts == 'function') next = opts;

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

      if(next) next(null, partners);
    }
  );
};


var retrievePartnerPic = function(opts, next){
  var url = [
    'https://junkdrawer.barkleyus.com/info/emppics/',
    opts.partner.lastName,
    ',%20',
    opts.partner.firstName,
    '.jpg'
  ].join('');

  request.get(url,
    {
      auth: {
        username: process.env.BARKLEY_USERNAME,
        password: process.env.BARKLEY_PASSWORD
      },
      encoding: null
    },
    function(err, res, body){
      if(next) next(err, body);
    }
  );
};


var createPartnerRecords = function(){
  retrievePartnerData(function(err, partners){
    partners.forEach(function(partner){
      db.updatePartner({ partner: partner });
    });
  });
};


var fetchPartnerPhoto = function(opts){
  retrievePartnerPic(opts, function(err, body){
    if(body){
      var fileName = [
        'tmp/',
        opts.partner._id,
        '.jpg'
      ].join('');

      fs.writeFile(fileName, body, 'binary');
    }
  });
};


exports.createPartnerRecords = createPartnerRecords;
exports.fetchPartnerPhoto = fetchPartnerPhoto;
