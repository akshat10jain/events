const mongoose = require('mongoose');
const validator = require('validator');
var bcrypt = require('bcrypt')

var userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});
userSchema.pre('save', function (next) {
	var user = this;
	const saltRounds = 12;
	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.hash(user.password, saltRounds, function (err, hash) {
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	});
});
userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};
userSchema.statics.checkIfUserExists = function (username, kind) {
	console.log({ email: username })
	return this
		.findOne({ email: username })
		.then((result) => {
			return result;
		})
		.catch((err) => {
			throw err;
		});
};

userSchema.statics.getUser = (userId) => {
	return this
		.findOne({ _id: userId }, { password: 0, _v: 0 })
		.then((result) => {
			return result;
		})
};
userSchema.statics.getUsersList = function () {
	return this.find()
		.then((result) => {
			return result;
		})
};

const User = module.exports = mongoose.model('User', userSchema);