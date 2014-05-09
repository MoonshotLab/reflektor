var gpio = require('gpio');
var ee = require('events').EventEmitter;
var device = new EE();

var detectable = true;
var detectableTimeout = null;

var motionDetector = gpio.export(4, {
  direction: 'in',
  ready: function(){
    console.log('detectiong motion');
  }
});


var resetMotionTimeout = function(val){
  if(val === 1 && detectable === true){
    console.log('motion detected...');
    detector.emit('motion');

    // Deal with the timeout
    clearTimeout(detectableTimeout);
    detectableTimeout = setTimeout(function(){
      detectable = true;
    }, 5000);
    detectable = false;
  }
};

motionDetector.on('change', resetMotionTimeout);
exports.device = device;
