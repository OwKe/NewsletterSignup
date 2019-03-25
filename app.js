//jshint esversion: 6

// REQUIRING MODULES TO BE USED IN PROJECT

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// DEFINE APP AS BEING AN EXPRESS APP

const app = express();

// USE STATIC INTERNAL RESOURCES LIKE IMAGES AND CSS (FROM PUBLIC FOLDER)

app.use(express.static('public'));

// INITIALISE THE ABILITY TO RECIEVE INPUTS FROM THE FORM

app.use(bodyParser.urlencoded({
  extended: true
}));

// ON GET REQUEST AT ROOT URL DO SOMETHING

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/signup.html');
});

// ON POST REQUEST AT ROOT URL DO SOMETHING ELSE

app.post('/', function(req, res) {

  // SUBMITING DATA TO THE MAILCHIMP API

  var data = {
    members: [{
      email_address: req.body.email,
      merge_fields: {
        FNAME: req.body.firstname,
        LNAME: req.body.surname
      },
      status: 'subscribed'
    }]

  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: 'https://us13.api.mailchimp.com/3.0/lists/ee22e9e708',
    method: 'POST',
    headers: {
      'Authorization': 'ok1 b5803addfb9284ac87767c50446efbbc-us13'
    },
    body: jsonData
  };

  request(options, function(error, responce, body) {

    if (error) {
      res.send('Got ' + error + 'error mate!');
    } else {

      if (responce.statusCode === 200) {
        res.sendFile(__dirname + '/success.html');
      } else {
        res.sendFile(__dirname + '/failure.html');
      }

    }

  });

});

// REDIRECT BACK TO THE ROOT ROUTE

app.post('/failure', function(req, res){
  res.redirect('/');
});

// LISTEN TO MAKE SURE THE SERVER IS RUNNING CORRECTLY

app.listen(process.env.PORT || 3000, function() {
  console.log('Server Running...');
});
