const nodemailer = require("nodemailer");
const request = require("request");


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'yg835007@gmail.com', // generated ethereal user
        pass: 'akshat@1234' // generated ethereal password
    }
});

exports.sendMail = function (details) {
    console.log(details)
    const mailOptions = {
        to: details.to,
        subject: details.subject,
        html: details.html,
        from: 'yg835007@gmail.com'
    };
    return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }

        });

    });
};

exports.mailTemplateForOtp = function (otp) {
    let content = `Hi there! Please use <b>${otp}</b> as the token to change your password. It expires in next 10 minutes!`;
    return `<html>
                  <head>
                      <title>otp verificarion</title>
                  </head>
                     <body>${content}</body>
            </html>`
};

exports.mailTemplateForSignup = function () {
    let content = `Hi there! Your account has been successfully created`;
    return `<html>
                  <head>
                      <title>otp verificarion</title>
                  </head>
                     <body>${content}</body>
            </html>`
}


exports.replyMailTemplate = function (content) {
    return `<html>
               <head>
                   <title>otp verificarion</title>
                </head>
                   <body>${content}</body>
            </html>`
}