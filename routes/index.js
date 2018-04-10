var express = require('express');
var router = express();

/* GET users listing. */

router.get('/test', function(req, res) {
  res.send('Hurray!');
});

module.exports = router;
