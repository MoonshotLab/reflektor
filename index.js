var colors = require('colors');
var util = require('util');
var jobs = require('./lib/jobs');

console.log('\n');

var iterator = 1;
for(var key in jobs){
  jobs[key].id = iterator;

  console.log(
    iterator.toString().magenta.bold,
    '-'.grey,
    jobs[key].description.grey
  );

  iterator+=1;
};

console.log('\nwassup what you wanna do?...'.rainbow);

process.stdin.setEncoding('utf8');
process.stdin.on('data', function(text){
  var input = parseInt(util.inspect(text)
    .replace('\\n', '')
    .replace('\'', ''));

  for(var key in jobs){
    if(jobs[key].id == input){
      jobs[key].fn();
    }
  }
});
