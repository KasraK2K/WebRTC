const express = require('express');
const app = express();

// express config
app.set('view engine', 'ejs');
app.use(express.static('public'));

// routes
app.get('/', function (req, res) {
  res.render('index');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server started on port ${port}`));
