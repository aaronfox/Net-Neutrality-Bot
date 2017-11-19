console.log('test');
var fs = require('fs-extra');

function csvHandler(){
  fs.readFile('115th-Congress-House-seeds.csv', function (err,data) {

  if (err) {
    return console.log(err);
  }

  //Convert and store csv information into a buffer. 
  bufferString = data.toString(); 

  //Store information for each individual person in an array index. Split it by every newline in the csv file. 
  arr = bufferString.split('\n'); 
  console.log(arr); 
      for (var i = 0; i < arr.length; i++)
          {
              console.log(arr[i].substr(0, arr[i].length - 2));
          }
});
};

csvHandler();
