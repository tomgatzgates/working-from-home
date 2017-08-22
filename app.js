var express = require('express');
var bodyParser = require('body-parser');
var chrono = require('chrono-node')
var redis = require("redis");

var app = express();
var db = redis.createClient({url: process.env.REDIS_URL}
);

var SlackRequest = function(data) {
  var splitText = data.text.split(' ');
  var action = splitText[0];
  var text = splitText.slice(1, splitText.length).join(' ');


  this.action = action;
  this.text = text;
  this.data = data;
  this.userId = data.user_id;
  this.response = {
    text: "Uh oh, we haven't processed your request",
    attachments: [],
    response_type: 'ephemeral',
  };
};

SlackRequest.prototype.date = function() {
  return chrono.parseDate(this.text);
};

SlackRequest.prototype.perform = function() {
  var epoch = this.date().valueOf();

  switch(this.action) {
    case 'add':
      db.sadd(epoch, this.userId);
      this.text = "Great, I'll let your team know";
      break;
    default:
      break;
  }

  return this.response;
};

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', (process.env.PORT || 8080));

app.post('/', function(request, response) {
  var slackRequest = new SlackRequest(request.body);

  response.send(slackRequest.perform());
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
