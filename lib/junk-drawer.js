var request = require('request');
var cheerio = require('cheerio');
var db = require('./mongo-client');


var requestPage = function(opts, next){
  request.get(
    opts.url,
    {
      'auth': {
        username: process.env.BARKLEY_USERNAME,
        password: process.env.BARKLEY_PASSWORD
      }
    },
    function(err, res, body){
      next(err, body);
    }
  );
};


var retrievePartnerData = function(opts, next){
  if(typeof opts == 'function') next = opts;

  requestPage({
    url: 'https://junkdrawer.barkleyus.com/info/partnerinfo.asp'
  }, function(err, body){

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

    if(next) next(partners);
  });
};


var retrievePartnerPic = function(opts, next){
  var url = [
    'https://junkdrawer.barkleyus.com/info/emppics/',
    opts.partner.lastName,
    ',%20',
    opts.partner.firstName,
    '.jpg'
  ].join('');

  requestPage({
    url: url
  }, function(err, body){
    if(next) next(err, body);
  });
};



exports.updatePartnerRecords = function(){
  retrievePartnerData(function(partners){
    partners.forEach(function(partner){
      db.updatePartner({ partner: partner });
    });
  });
};
