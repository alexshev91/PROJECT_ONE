var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),
  db = require("./models/index"),
  flash = require('connect-flash'),
  app = express(),
  OAuth = require('oauth'),
  async = require('async'),
	_ = require('lodash');
// Middleware for ejs, grabbing HTML and including static files
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}) ); 
app.use(express.static(__dirname + '/public'));



// we are going to create a cookie that will store our session data
// ideally we want this secret to be a string of random numbers 
// we use the secret to parse the data from the cookie
// This is cookie-based session middleware so technically this creates a session
// This session can expire and doesn't live on our server

// The session middleware implements generic session functionality with in-memory storage by default. It allows you to specify other storage formats, though.
// The cookieSession middleware, on the other hand, implements cookie-backed storage (that is, the entire session is serialized to the cookie, rather than just a session key. It should really only be used when session data is going to stay relatively small.
// And, as I understand, it (cookie-session) should only be used when session data isn't sensitive. It is assumed that a user could inspect the contents of the session, but the middleware will detect when the data has been modified.
app.use(cookieSession( {
  secret: 'thisismysecretkey',
  name: 'session with cookie data',
  // this is in milliseconds
  maxage: 3600000000
  })
);

// get passport started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// prepare our serialize functions
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
      where: {
        id: id
      }
    })
    .done(function(error,user){ 
      done(error, user);
    });
});

var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.TWITTER_KEY,
  process.env.TWITTER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
);
// var data_array = [];
// var searchBeginningURL = "https://api.twitter.com/1.1/search/tweets.json";
// var searchFor = "%23got";
// // var searchURL = searchBeginningURL + "?q=%23GoT&geocode=37.771393,-122.444938,100km&since=2014-08-05&until=2014-08-06&lang=en&count=100&result_type=recent"; //SF coords
// var aug06url = searchBeginningURL + "?q="+searchFor+"&geocode=34.1664043,-118.1132171,100km&lang=en&since=2014-08-06&until=2014-08-07&count=100&result_type=recent";
// var aug05url = searchBeginningURL + "?q="+searchFor+"&geocode=34.1664043,-118.1132171,100km&lang=en&since=2014-08-05&until=2014-08-06&count=100&result_type=recent";
// var aug04url = searchBeginningURL + "?q="+searchFor+"&geocode=34.1664043,-118.1132171,100km&lang=en&since=2014-08-04&until=2014-08-05&count=100&result_type=recent";
// var aug03url = searchBeginningURL + "?q="+searchFor+"&geocode=34.1664043,-118.1132171,100km&lang=en&since=2014-08-03&until=2014-08-04&count=100&result_type=recent";
// var aug02url = searchBeginningURL + "?q="+searchFor+"&geocode=34.1664043,-118.1132171,100km&lang=en&since=2014-08-02&until=2014-08-03&count=100&result_type=recent";
// var aug01url = searchBeginningURL + "?q="+searchFor+"&geocode=34.1664043,-118.1132171,100km&lang=en&since=2014-08-01&until=2014-08-02&count=100&result_type=recent";


// // &geocode=34.1664043,-118.1132171,100km
// // &geocode=34.1664043,-118.1132171,100km
// // &geocode=34.1664043,-118.1132171,100km
// // &geocode=34.1664043,-118.1132171,100km
// // &geocode=34.1664043,-118.1132171,100km
// // &geocode=34.1664043,-118.1132171,100km

// // lang=en&
// // lang=en&
// // lang=en&
// // lang=en&
// // lang=en&
// // lang=en&

// var getTweets = function (url, callback) {
//     oauth.get(url, null, null, function (e, data, res){
//       var allTweets = JSON.parse(data).statuses;
// //       var allTweets = JSON.parse(data).search_metadata.next_results;
// // 			var secondPg = searchBeginningURL + allTweets;
//       callback(allTweets);
//     });
//   };

// getTweets(aug06url, function(x){ 
// 	// console.log(_.pluck(x, "created_at"));
// 	console.log("There are " + x.length + " twitts for Aug06");
// 	data_array.push(x.length);
// 	console.log("the array is now: " + data_array);

// });
// getTweets(aug05url, function(x){ 
// 	// console.log(x.created_at);
// 	console.log("There are " + x.length + " twitts for Aug05");
// 	data_array.push(x.length);
// 	console.log("the array is now: " + data_array);

// });
// getTweets(aug04url, function(x){ 
// 	// console.log(x);
// 	console.log("There are " + x.length + " twitts for Aug04");
// 	data_array.push(x.length);
// 	console.log("the array is now: " + data_array);

// });
// getTweets(aug03url, function(x){ 
// 	// console.log(x);
// 	console.log("There are " + x.length + " twitts for Aug03");
// 	data_array.push(x.length);
// 	console.log("the array is now: " + data_array);

// });
// getTweets(aug02url, function(x){ 
// 	// console.log(_.pluck(x, "created_at"));
// 	console.log("There are " + x.length + " twitts for Aug02");
// 	data_array.push(x.length);
// 	console.log("the array is now: " + data_array);

// });
// getTweets(aug01url, function(x){ 
// 	// console.log(x);
// 	console.log("There are " + x.length + " twitts for Aug01");
// 	data_array.push(x.length);
// 	console.log("the array is now: " + data_array);

// });




app.get('/', function(req,res){
  // check if the user is logged in
  if(!req.user) {
    res.render("index");
  }
  else{
    res.redirect('/home');
  }
});

app.get('/signup', function(req,res){
  if(!req.user) {
    res.render("signup", { username: ""});
  }
  else{
    res.redirect('/home');
  }
});

app.get('/login', function(req,res){
  // check if the user is logged in
  if(!req.user) {
    res.render("login", {message: req.flash('loginMessage'), username: ""});
  }
  else{
    res.redirect('/home');
  }
});

app.get('/home', function(req,res){
  res.render("home", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});

// on submit, create a new users using form values
app.post('/submit', function(req,res){  
  
  db.user.createNewUser({username: req.body.username, password: req.body.password}, 
  function(err){
    res.render("signup", {message: err.message, username: req.body.username});
  }, 
  function(success){
    res.render("index", {message: success.message});
  });
});

// authenticate users when logging in - no need for req,res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home', 
  failureRedirect: '/login', 
  failureFlash: true
}));

app.get('/logout', function(req,res){
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/');
});

//find the tweets and send them to chart.js
app.post('/search', function(req,res){
	var tag = req.body.searchTerm;
	var searchTagUrl= "https://api.twitter.com/1.1/search/tweets.json?q=%23"+tag+"&geocode=34.1664043,-118.1132171,100km&lang=en&count=100&result_type=mixed";
	var aug06url = searchTagUrl +"&since=2014-08-06&until=2014-08-07",
			aug05url = searchTagUrl +"&since=2014-08-05&until=2014-08-06",
			aug04url = searchTagUrl +"&since=2014-08-04&until=2014-08-05",
			aug03url = searchTagUrl +"&since=2014-08-03&until=2014-08-04",
			aug02url = searchTagUrl +"&since=2014-08-02&until=2014-08-03",
			aug01url = searchTagUrl +"&since=2014-08-01&until=2014-08-02";
	var qry_array = [aug06url,aug05url,aug04url,aug03url,aug02url,aug01url];


	// console.log("Showing searched hashtag: " +tag);
	// console.log("Showing the url array: " + qry_array);
	var getTweets = function (url, done ) {
    oauth.get(url, null, null, function (e, data, res){
		//å	console.log(data)
      var allTweets = JSON.parse(data).statuses;
			//console.log(allTweets)
			//console.log(allTweets.length)
      done(null, allTweets.length);
    });
  };



	async.map(qry_array, getTweets, function(err, results){
		console.log("The results are in:", results)
		res.render("graphresult", {
			qry_array: qry_array,
			data_array: results,
			isAuthenticated: req.isAuthenticated(),
			user: req.user

		})
	})

	//console.log(data_array	)

});


// catch-all for 404 errors 
app.get('*', function(req,res){
  res.status(404);
  res.render('404');
});


app.listen(3000, function(){
  console.log("get this party started on port 3000");  
});
