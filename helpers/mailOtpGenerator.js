const otplib = require('otplib');
var crypto = require('crypto')

var algorithm = 'aes-256-cbc';
var key = 'fwrgreergeg'

var otpEncrypt = function (otp) {
    var cipher = crypto.createCipher(algorithm, key)
    var crypted = cipher.update(otp, 'utf8', 'hex')
    crypted += cipher.final('hex');
    console.log("cryped"+crypted)
    return crypted;
}
var compareOtp = function (otp, hashotp) {
    var decipher = crypto.createDecipher(algorithm, key)
    var dec = decipher.update(hashotp, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return otplib.authenticator.verify({secret:dec,token:otp});
};
exports.generateOtpMail = async function () {
    const secret = await otplib.authenticator.generateSecret();
    const token = await otplib.authenticator.generate(secret);
    var encryptyotp = await otpEncrypt(secret)
    return { token: token, encryptyotp: encryptyotp }
}
exports.checkOtpMail = function (otp, hashotp) {
    return compareOtp(otp, hashotp)
} 
