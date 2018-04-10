const User = require('../models/User');
const tokenHelper = require('../helpers/tokenHelper')
const mailHelper = require('../helpers/mailHelper')
const mailOtp = require('../helpers/mailOtpGenerator')


exports.validateAuthCredentials = (req, res, next) => {
    if (req.path == '/signup')
        req.chekBody("name", "name cannot be empty.").notEmpty();
    req.checkBody("email", "email cannot be empty.").notEmpty();
    req.checkBody("email", "email is invalid.").isEmail();
    req.checkBody("password", "Password cannot be empty").notEmpty();
    req.checkBody("password", "Must be between 6 to 20 characters").len(6, 20);
    req.getValidationResult()
        .then((result) => {
            if (!result.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    errors: result.array(),
                    data: []
                });
            }
            next();
        });
};

exports.signUp = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    User.checkIfUserExists(email, 'email')
        .then((result) => {
            console.log(result)
            if (result && result._id) {
                return res.status(200).json({
                    error: true,
                    errors: [{
                        param: "username",
                        msg: "User already exist"
                    }],
                    data: {}
                });
            }

            let userObj = { email: email, password: password, name: name };
            let user = new User(userObj);

            user.save()
                .then((user) => {
                    mailHelper.sendMail({
                        to: user.email,
                        subject: 'Account created',
                        html: mailHelper.mailTemplateForSignup()
                    })
                    return res.status(200).json({
                        error: false,
                        errors: [],
                        data: user
                    });
                })
        })
        .catch((err) => {
            return res.status(500).json({
                error: true,
                errors: [{
                    param: "DB_ERROR",
                    msg: err.message
                }],
                data: {}
            });
        });
};

exports.signIn = (req, res) => {
    console.log(req.body)
    let email = req.body.email;
    let password = req.body.password;

    User.checkIfUserExists(email, 'email')
        .then((existingUser) => {
            if (!existingUser || !existingUser._id) {
                return res.status(400).json({
                    error: true,
                    errors: [{
                        param: "User",
                        msg: "Please SignUp first."
                    }],
                    msg: "USER_NOT_SIGNED_UP",
                    data: []
                });

            }
            existingUser.comparePassword(password)
                .catch((err) => {
                    return res.status(500).json({
                        error: true,
                        errors: [{
                            param: "Database Error",
                            msg: err.message
                        }],
                        data: {}
                    });
                })
                .then((isMatch) => {
                    if (isMatch) {
                        const token = tokenHelper.sign({
                            _id: existingUser._id,
                            name: existingUser.name || null,
                            email: existingUser.email,
                        });
                        return res.json({
                            error: false,
                            errors: [],
                            data: token
                        });
                    } else {
                        return res.status(401).json({
                            error: true,
                            errors: [{
                                param: "password",
                                msg: "Password did not matched."
                            }],
                            msg: "Incorrect password."
                        });
                    }
                });

        });
};

exports.getUsersList = async (req, res) => {
    const usersList = await User.getUsersList();
    console.log(usersList + "123")
    res.json({ error: false, errors: [], data: usersList });
};

exports.removeUser = async (req, res) => {
    const userData = await User.findOneAndRemove({ _id: req.params.id })
    res.json({ error: false, errors: [], data: userData });
}

exports.generateOtp = async function (req, res) {
    var otp = await mailOtp.generateOtpMail()
    mailHelper.sendMail({
        to: req.body.email,
        subject: 'otp',
        html: mailHelper.mailTemplateForOtp(otp.token)
    }).then((response) => {
        console.log(otp)
        res.json({ error: false, errors: [], data: [{ encryptyotp: otp.encryptyotp }] });
    })
}
exports.resetPassword = function (req, res) {
     var response = mailOtp.checkOtpMail(req.body.otp, req.body.hashOtp)
        if (response) {
            res.json("it worked")
        } else {
            res.json({ error: true, errors: [{ "param": "otp", "msg": "otp doesnt match" }], data: [] });
        }
}
