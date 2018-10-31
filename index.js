// application execution file

//import infrastructure package
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const Twitter = require('twitter');
const app = express();

//handlebars front end framework
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//frontend middleware
app.use(express.static(__dirname + '/public'));

var client = new Twitter({
  consumer_key: 'uDRdaSrMzHUsTAWV5M95GvlnD',
  consumer_secret: 'Z99B5f8PtWlCPc90M0XqqPpRB1KAPT46N4PA9bHA0gDetjvjfF',
  access_token_key: '1056288155232419841-qw855TT9lRkXbnX4XnxYyoMCyna4fS',
  access_token_secret: 'yiDmPs0TrcV961KOHrXu7ZWROgtxogqpkvShKlIGTazAk'
});

// var params = {
//   q: '#nodejs',
//   count: 10,
//   result_type: 'recent',
//   lang: 'en'
// }
var params = {
  screen_name:"@tintinjia88",
  count: 10
}


client.get('statuses/user_timeline', params , function(err, data, response) {
  // If there is no error, proceed
  if(!err){
    // console.log(data);
    // // Loop through the returned tweets
    for(let i = 0; i < data.length; i++){
      console.log(data[i].text);
      console.log("----------------------");
      // // Get the tweet Id from the returned data
      // let id = { id: data.statuses[i].id_str }
      // // Try to Favorite the selected Tweet
      // client.post('favorites/create', id, function(err, response){
      //   // If the favorite fails, log the error message
      //   if(err){
      //     console.log(err[0].message);
      //   }
      //   // If the favorite is successful, log the url of the tweet
      //   else{
      //     let username = response.user.screen_name;
      //     let tweetId = response.id_str;
      //     console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`)
      //   }
      // });
    }
  } else {
    console.log(err);
  }
})

app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
})
