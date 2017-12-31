const User = require('../models/User');
const tokenHelper = require('../helpers/tokenHelper')

exports.validateAuthCredentials = (req, res, next) => {
    if(req.path == '/signup')
    req.assert("name", "name cannot be empty.").notEmpty();
    req.assert("email", "email cannot be empty.").notEmpty();
    req.assert("password", "Password cannot be empty").notEmpty();
    req.assert("password", "Must be between 6 to 20 characters").len(6, 20);
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


// user  signup
exports.signUp = (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name ;

    User.checkIfUserExists(email, 'email')
        .then((result) => {
            if (result && result._id) {
                return res.status(400).json({
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
                .then(() => {
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


// user signin
exports.signIn = (req, res) => {
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
                        return res.status(200).json({
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


// user list
exports.getUsersList = async (req, res) => {
    const usersList = await User.getUsersList();
    console.log(usersList+"123")
	res.json({ error: false, errors: [], data: usersList });
};


// user remove  
exports.removeUser = async (req,res) => {
    const userData = await User.findOneAndRemove({_id:req.params.id})
    res.json({ error: false, errors: [], data: userData });
}

// user update 
exports.updateUser = async (req, res) => {
   
    const updatedResult = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).exec()
    res.json({ error: false, errors: [], data: updatedResult });
}
