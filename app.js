const express = require('express');
const app = express();

const SlackRequest = function(data) {
  const {action, ...text} = data.text;
  this.action = action;
  this.text = text;
};

SlackRequest.prototype.response = function() {
  let response_type = 'ephemeral';
  let text;
  let attachments = [];

  switch(this.action) {
    case 'add':
      text = "Great, I'll let your team know";
    default:
      text = "Uh oh, something went wrong";
  }

  return { response_type, text, attachments };
};

app.set('port', (process.env.PORT || 8080));
app.post('/', function(request, response) {
  const slackResponse = new SlackRequest(request.body).response();
  response.send(slackResponse);
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
