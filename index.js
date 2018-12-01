// application execution file

//import infrastructure package
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const Twitter = require('twitter');
const app = express();
const Classifier = require("./classifier/classifier");
let classifier = new Classifier();
let lang = new Classifier();
//handlebars front end framework
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//frontend middleware
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.get('/',(req, res, next)=>{
  res.render('lang_classifier');
});

app.post('/lang', (req, res, next)=>{
  // console.log(req.body.lang);
  var cate = lang.classifiy(req.body.data);
  console.log(cate)
   return res.send(cate);
});

app.post('/twitter', (req, res, next)=>{
  var user = req.body.user;
  console.log(user);
  var params = {
    screen_name:req.body.user,
    count: 10
  };

  client.get('statuses/user_timeline', params , function(err, data, response) {
     // If there is no error, proceed
     if(!err){
        var tweets = [];
       for(var i = 0; i<data.length; i++){
         // console.log(data[i].text);
          var tweet ={};
          var cate = classifier.classifiy(data[i].text);
          tweet.text = data[i].text;
          tweet.class = cate;
          tweets.push(tweet);
       }
        return res.send(tweets);
     } else {
       console.log(err);
       return res.sendStatus(400);
     }
   })
})
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});


var business = {
    q: '#business',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:"business"
  };
var life =   {
    q: '#life',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:"life"
  };
var technology =  {
    q: '#technology',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:"technology"
  };
var social =  {
    q: '#social',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:"social"
  };
var entertainment =   {
    q: '#entertainment',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:'entertainment'
  }

client.get('search/tweets', business, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){
        classifier.training(data.statuses[j].text+" business", "business");
      }
    }else{
      console.log(err);
    }
});

client.get('search/tweets', life, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){
        classifier.training(data.statuses[j].text+" life", "life");
      }
    }else{
      console.log(err);
    }
});

client.get('search/tweets', social, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){

        classifier.training(data.statuses[j].text+" social", "social");
      }
    }else{
      console.log(err);
    }
});

client.get('search/tweets', entertainment, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){
        classifier.training(data.statuses[j].text+" entertainment", "entertainment");
      }
    }else{
      console.log(err);
    }
});
client.get('search/tweets', technology, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){
        classifier.training(data.statuses[j].text+" technology", "technology");
      }
    }else{
      console.log(err);
    }
});


lang.training("Ce texte est en francais", "fr");
lang.training("Celui ci est aussi en francais", "fr");
lang.training("La nouvelle inattendue a déconcerté tout le monde.", "fr");
lang.training("J'ai versé des larmes de joie en apprenant la nouvelle.", "fr");
lang.training("Je lis le journal pour me tenir informé des dernières nouvelles.", "fr");
lang.training("Il regarde les nouvelles à la télévision.", "fr");
lang.training("Le but d'un journal est de diffuser les informations..", "fr");
lang.training("Elle lit les informations tous les matins dans le journal.", "fr");

lang.training("The unexpected news bewildered everyone.", "en");
lang.training("I shed tears of joy when I heard the news", "en");
lang.training("I read the newspaper to keep up with the latest news.", "en");
lang.training("He is watching the news on the television.", "en");
lang.training("I like to be the bearer of good news.", "en");
lang.training("The goal of a newspaper is to circulate the news.", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("Republican candidate Brian Kemp currently leads Abrams with 50.3% of the vote. If Kemp's share dips below 50%, the race automatically goes into a run-off on December 4, even if Kemp is the top vote-getter. For now, Kemp's lead stands at nearly 59,000 votes.", "en");

app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
})
