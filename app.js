const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
var cors = require('cors')

//serving static files
app.use('/uploads', express.static('uploads'))

app.use(cors())
// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express-validator
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event');
const contactRouter = require('./routes/contact')


app.use('/', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/event', eventRouter)
app.use('/api/user', userRouter)
app.use('/api/contact', contactRouter)

module.exports = app