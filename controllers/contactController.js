const Contact = require('../models/Contact');
const mailHelper = require('../helpers/mailHelper')
exports.submitQuery = function (req, res) {
    console.log(req.body)
    var contact = new Contact(req.body)
    contact.save().then((resp) => {
        if (resp) {
            res.json({ error: false, errors: [], data: resp });
        }
    }).catch((err) => {
        res.json({ error: true, errors: [{ "param": event, msg: "err.message" }], data: [] })
    })
}

exports.getQueries = async function (req, res) {
    const queries = await Contact.getQueries();
    res.json({ error: false, errors: [], data: queries });
}

exports.getQuery = async function (req, res) {
    let result = await Contact.findOne({ _id: req.params.id });
    res.json({ error: false, errors: [], data: result });
}

exports.sendMail = function (req, res) {
    mailHelper.sendMail({
        to: req.body.reciever,
        subject: req.body.subject,
        html: mailHelper.replyMailTemplate(req.body.description)
    }).then((response) => {
        res.json({ error: false, errors: [], data: response });
    })
}