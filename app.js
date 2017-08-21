const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 8080));

app.get('/', function (request, response) {
  response.send('Hello World!');
});

app.post('/add', function(request, response) {
  response.send({
    response_type: "ephemeral",
    text: "Thanks! We'll let the team know you're working from home!",
  });
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
