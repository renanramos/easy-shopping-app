const express = require('express');

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static('./dist/easy-shopping-app'));

app.get('/*', (req, res) => {
  res.sendFile('index.html', {root: 'dist/easy-shopping-app/'});
});

app.listen(port);