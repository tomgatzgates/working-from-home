const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 8080));

app.get('/', function (request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
