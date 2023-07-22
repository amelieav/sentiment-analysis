// https://www.npmjs.com/package/sentiment


let arrayOfPhrases = ["hello I am super excited", "I am so fucking mad", "I don't really feel anything"]

var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var result = sentiment.analyze(arrayOfPhrases[0]);
console.dir(result)
console.dir(getScoreAsString(result.score))


function getScoreAsString(score){
    if(score < -3){
        return "Really bad"
    }
    else if (score > -3 && score < 0){
        return "bad"
    }
    else if (score > 0 && score < 3){
        return "good"
    }
    else {
        return "Really good"
    }
}