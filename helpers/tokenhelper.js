const jwt = require('jsonwebtoken');
var jwtDecode = require('jwt-decode');

exports.sign = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '2d'
    });
};

exports.validate = (req, res, next) => {
    let token = req.headers['authorization'];
    console.log(token)
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                return res.status(403).json({
                    error: true,
                    errors: [{ param: 'AUTH_TOKEN', msg: err.message }]
                });
            } else {
                req.user = decoded;
                next();
            }
        });

    }
    else {
        return res.status(403).json({
            error: true,
            errors: [{ param: 'AUTH_TOKEN', msg: 'No token supplied' }]
        });
    }
};

exports.decodejwt = function (token) {
    return jwtDecode(token)._id
}