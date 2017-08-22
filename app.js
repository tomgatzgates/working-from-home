var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var SlackRequest = function(data) {
  var splitText = data.text.split(' ');
  var action = splitText[0];
  var text = splitText.join(' ');

  this.action = action;
  this.text = text;
  this.data = data;
};

SlackRequest.prototype.response = function() {
  var responseType = 'ephemeral';
  var text;
  var attachments = [];

  switch(this.action) {
    case 'add':
      text = "Great, I'll let your team know";
      break;
    default:
      text = "Uh oh, something went wrong";
      break;
  }

  return { response_type: responseType, text: text, attachments: attachments };
};

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', (process.env.PORT || 8080));
app.post('/', function(request, response) {
  console.log(request.body);
  const slackResponse = new SlackRequest(request.body).response();

  response.send(slackResponse);
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
