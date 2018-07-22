var parse = require('csv-parse');
var fs = require('fs');
var readline = require('readline');

var bigrams = {};
var reviews = [];
var parser = parse({});
var numCorpusBigrams = 0;
var collocations = [];
var possibleHighlights = [];

const splitReviewIntoCleanSentences = function(review){
  return review.toLowerCase().replace(/[!\':\,\$\(\)\?\;\&\"]/g, '').split('.');
}

const indexCorpusBigrams = function(sentence, bigrams) {
  let numBigrams = 0;

  sentence = sentence.split(/\s+/);
  for (let j = 0; j < sentence.length - 1; j++)
  {
    if (!bigrams[sentence[j]])
      bigrams[sentence[j]] = {};
    if (!bigrams[sentence[j]][sentence[j + 1]])
      bigrams[sentence[j]][sentence[j+1]] = 1;
    else
      bigrams[sentence[j]][sentence[j+1]]++;
    numBigrams++;
  }
  return numBigrams;
}

parser.on('readable', function(){
  while(r = parser.read()){
    reviews.push(splitReviewIntoCleanSentences(r[5]));
  }
});

parser.on('finish', () => {
  reviews.shift();
  for (let review of reviews) {
    for (let sentence of review) {
      numCorpusBigrams += indexCorpusBigrams(sentence, bigrams);
    }
  }
});

exports.printReviewHighlights = function(path, num) {
  let lineReader = readline.createInterface({
    input: fs.createReadStream(path)
  });

  lineReader.on('line', (line) => {
    let thisReview = line.split('.');
    let cleanSentences = splitReviewIntoCleanSentences(review);
    for (let i = 0; i < thisReview.length; i++) {
      possibleHighlights.push({
        original: thisReview[i] + '.',
        clean: cleanSentences[i]
      });
    }
  });

  lineReader.on('close', () => {
    console.log('closed...');
    // fs.createReadStream('reviews/ten-thousand.csv').pipe(parser);
  });
};

















//
