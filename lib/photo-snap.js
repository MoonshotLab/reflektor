var gpio = require('gpio');
var exec = require('child_process').exec;


var activate = function(){
  var detectable = true;
  var detectableTimeout = null;

  var motionDetector = gpio.export(4, {
    direction: 'in',
    ready: function(){
      console.log('detectiong motion');
    }
  });

  motionDetector.on('change', function(val){
    if(val === 1 && detectable === true){

      // Deal with the timeout
      clearTimeout(detectableTimeout);
      detectableTimeout = setTimeout(function(){
        detectable = true;
      }, 3000);

      // Trigger the webcam
      var filename = new Date().getTime() + '.jpg';
      var command = 'fswebcam -c ~/.fswebcam.conf ' + filename;
      console.log('motion detected, taking a picture');
      detectable = false;
    }
  });
};


exports.activate = activate;
