

var parse = require('csv-parse');
var fs = require('fs');
var words = {};

var output = [];
var parser = parse({});
parser.on('readable', function(){
  while(r = parser.read()){
    arr = r[5].toLowerCase().replace(/[!\':\,\$\(\)\?\;\&\"]/g, '').split('.')
    // arr = arr.map(x => x.split(/\s+/))
    output.push(arr);

  }
});

parser.on('finish', () => {
  output.shift();
  for (let review of output)
  {
    for (let i = 0; i < review.length; i++)
    {
      sentence = review[i];
      sentence = sentence.split(/\s+/);
      // console.log(sentence);
      for (let j = 0; j < sentence.length - 1; j++)
      {
        if (!words[sentence[j]])
          words[sentence[j]] = {};
        if (!words[sentence[j]][sentence[j + 1]])
          words[sentence[j]][sentence[j+1]] = 1;
        else
          words[sentence[j]][sentence[j+1]]++;
      }
    }
  }
  console.log(words);

  var lineReader = require('readline').createInterface({
    input: fs.createReadStream('reviews/test.csv')
  });

  lineReader.on('line', function (line) {
    console.log(line);
  });

});



fs.createReadStream('reviews/ten-thousand.csv').pipe(parser);
