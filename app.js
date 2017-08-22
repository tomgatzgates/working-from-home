var express = require('express');
var bodyParser = require('body-parser');
var chrono = require('chrono-node')
var redis = require("redis");

var app = express();
var db = redis.createClient({url: process.env.REDIS_URL});

function SlackRequest(data) {
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

SlackRequest.prototype = {
  date: getDate,
  perform: perform,
};

function getDate() {
  return chrono.parseDate(this.text);
};

function perform() {
  switch(this.action) {
    case 'add':
      dbSet(this.date(), this.userId);
      this.response.text = "Great, I'll let your team know";
      break;
    case 'who':
      const wfhomers = dbGet(new Date());

      if (wfhomers.length) {
        this.response.attachments = wfhomers.map(id => {text: id});
        this.response.text = 'These people are working from home today';
      } else {
        this.response.text = 'No one is working from home today';
      }
      break;
    default:
      break;
  }

  return this.response;
};

// Common interface to add and list from the DB
function keyFromDate(date) {
  return date.toLocaleDateString();
}
function dbSet(date, value) {
  const key = keyFromDate(date);
  console.log('Set', key);
  return db.sadd(key, value);
}
function dbGet(date) {
  const key = keyFromDate(date);
  console.log('Get', key);
  let members = [];
  let foo = db.smembers(key, function(_err, data) { return data});
  console.log('members', members, foo);
  return members;
}

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', (process.env.PORT || 8080));

app.post('/', function(request, response) {
  var slackRequest = new SlackRequest(request.body);

  response.send(slackRequest.perform());
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
