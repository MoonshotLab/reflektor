var gpio = require('gpio');


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

      clearTimeout(detectableTimeout);
      detectableTimeout = setTimeout(function(){
        detectable = true;
      }, 3000);

      console.log('motion detected');
      detectable = false;
    }
  });
};


exports.activate = activate;
