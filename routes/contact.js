const express = require('express');
const router = express();
const validate = require('../helpers/tokenHelper').validate

const contactController = require("../controllers/contactController");

router.post('/submitquery', contactController.submitQuery)
router.get('/getqueries', validate, contactController.getQueries)
router.get('/getquery/:id', validate, contactController.getQuery)
router.post('/reply', validate, contactController.sendMail)

module.exports = router