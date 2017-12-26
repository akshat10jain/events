const mongoose = require('mongoose');
const validator = require('validator');
var bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

var userSchema = mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email cant be left blank"],
		trim: true,
		minlength: 1
	},
	password: {
		type: String,
		required: [true, "Password cant be left blank"],
	},
	name:{
		type:String,
		required:true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})




userSchema.methods.generateToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({ _id: user._id.toHexString(), access }, 'gnekgnegweerjg').toString();
	user.tokens.push({ access, token })
	return user.save().then(() => {
		return token;
	})
}
userSchema.path('email').validate(function (value, respond) {
	if (validator.isEmail(value)) {
		return respond(true)
	}
	return respond(false)
}, "Email is invalid");
userSchema.path('email').validate(function (value, respond) {
	var self = this;
	this.constructor.findOne({ email: value }, function (err, user) {
		if (err) {
			return respond(false);
		}
		if (user) {
			if (self.id === user.id) {
				return respond(true);
			}
			return respond(false);
		}
		respond(true);
	});
}, 'Email Already exists');


userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);
module.exports = { User }