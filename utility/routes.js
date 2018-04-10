var express = require('express');
var routes = express();
const multer = require('multer')
var jwt = require('jsonwebtoken')
var { User } = require('../models/user')
var { Event } = require('../models/event')
var { errorgenerator } = require('./errorgenerator')
var { generatedata } = require('./generatedata')
const upload = multer({ dest: './uploads/' });
var _ = require('lodash');
const bcrypt = require('bcrypt');

//homeroute 
routes.get('/', function (req, res) {
	res.send('<h1>Hello world</h1>')
});


//signup route
routes.post('/api/signup', (req, res) => {
	var body = _.pick(req.body, ['email', 'password', 'name'])
	if (body.password.length < 6) {
		res.status(400).json({
			error: true,
			errors: [{msg:"Password must be 6 characters long"}],
			data: []
		})
	} else {
		body.password = bcrypt.hashSync(body.password, 4)
		var user = new User(body);
		console.log(user.password)
		user.save().then((user) => {
			res.status(200).json({
				error: false,
				errors: [],
				data: generatedata(user)
			})
		}).catch((e) => {
			console.log(e)
			res.status(400).json({
				error: true,
				errors: errorgenerator(e.errors),
				data: []
			})
		});
	}
});


//login


routes.post('/api/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	User.findOne({ email: body.email }, function (err, docs) {
		if (err) {
			console.log(err)
			res.status(400).json("something went wrong")
		} if (!!docs) {
			bcrypt.compare(body.password, docs.password, function (err, result) {
				console.log(result)
				if (result) {
					var token = jwt.sign(_.pick(docs, ['email', 'createdAt', '_id']), 'dbbjqbdjbqjbdjqb');
					res.status(200).json({
						error: false,
						errors: [],
						data: token
					});
				} else {
					res.status(400).json({
						error: true,
						errors: [{
							msg: "Password doesn't match"
						}],
						data: []
					})
				}
			});
		} else {
			res.status(400).json({
				error: true,
				errors: [{
					msg: "Email doesn't exist"
				}],
				data: []
			})
		}
	});
});

routes.use((req, res, next) => {
	var token = req.headers['token'];
	if (token) {
		jwt.verify(token,'dbbjqbdjbqjbdjqb', function (err, resp) {
			if (err) {
				res.status(500).send('Token Invalid');
			} else {
				next();
			}
		})
	} else {
		res.send('Please send a token')
	}

})
//getallevents
routes.get('/api/getevents', (req, res) => {
	Event.find(function (err, events) {
		if (err) {
			res.send(err)
		} else {
			res.status(200).json({
				error: false,
				errors: [],
				data: generatedata(events)
			})
		}
	})
});

//addevent
routes.post('/api/addevent', upload.single('eventImage'), (req, res) => {
	console.log(req.file)
	var event = new Event({
		event_name: req.body.event_name,
		place: req.body.place,
		date: req.body.date,
		time: req.body.time,
		publishedBy: req.body.publishedBy,
		tags: req.body.tags,
		published: req.body.published,
		image: req.file.originalname
	});
	event.save().then((events) => {
		res.status(200).json({
			error: false,
			errors: [],
			data: generatedata(events)
		})
	}).catch((e) => {
		res.status(400).json({
			error: true,
			errors: errorgenerator(e.errors),
			data: []
		})
	});
});

//getallusers
routes.get('/api/getusers', (req, res) => {
	User.find(function (err, users) {
		if (err) {
			res.send(err)
		} else {
			res.status(200).json({
				error: false,
				errors: [],
				data: generatedata(users)
			})
		}
	})
});

//geteventdetails
routes.get('/api/getevent/:id', (req, res) => {
	Event.findOne({ _id: req.params.id }, function (err, result) {
		if (err) {
			res.send(err);
		}
		else {
			res.status(200).json({
				error: false,
				errors: [],
				data: generatedata(result)
			})
		}
	});
});

//deleteevent
routes.delete('/api/delevent/:id', (req, res) => {
	Event.remove({ _id: req.params.id }, function (err, result) {
		if (err) {
			res.send(err);
		}
		else {
			res.status(200).json({
				error: false,
				errors: [],
				data: generatedata(result)
			})
		}
	});
});

//updateevent

routes.put('/api/updateevent/:id', upload.single('eventImage'), (req, res) => {
	Event.findOneAndUpdate({ _id: req.params.id }, {
		$set: {
			event_name: req.body.event_name,
			place: req.body.place,
			date: req.body.date,
			time: req.body.time,
			publishedBy: req.body.publishedBy,
			tags: req.body.tags,
			published: req.body.published,
			image: req.file.originalname
		}
	}, function (err, result) {
		if (err) {
			res.json(err);
		}
		else {
			res.status(200).json({
				error: false,
				errors: [],
				data: generatedata(result)
			})
		}

	})

});


module.exports = { routes }


// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, __dirname + '/uploads/')
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, new Date().toISOString() + file.originalname)
// 	}
// });

// const fileFilter = function (req, file, cb) {
// 	if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype == 'image/jpeg') {
// 		cb(null, true)
// 	} else
// 		cb(null, false)
