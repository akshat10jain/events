const Event = require('../models/Event');
const moment = require('moment')
const tokenHelper = require('../helpers/tokenHelper')
const Comment = require('../models/Comments')

exports.addNewEvent = async (req, res) => {
    if (req.file != null) {
        req.body.eventImage = '/uploads/' + req.file.filename
    } else {
        req.body.eventImage = '/uploads/samepleimage'
    }
    var today = new Date(req.body.date)
    // req.body.author = tokenHelper.decodejwt(req.headers['authorization'])
    req.body.date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
    const event = new Event(req.body)
    event.save().then((resp) => {
        if (resp) {
            res.json({ error: false, errors: [], data: resp });
        }
    }).catch((err) => {
        res.json({ error: true, errors: [{ "param": event, msg: "err.message" }], data: [] })
    })
}

exports.updateEvent = async (req, res) => {
  //  let checkevent = await Event.findOne({ _id: req.params.id })
    // if (checkevent && checkevent.author.equals(tokenHelper.decodejwt(req.headers['authorization']))) {
    let checkevent = req.body    
    if (req.file != null) {
            console.log(req.file)
            checkevent.eventImage = '/uploads/' + req.file.filename
        }else{
            delete checkevent.eventImage;
        }
        delete checkevent.comments
        // for (let key in req.body) {
        //     if (checkevent[key] && key != '_id' && key != 'comments' && key != 'eventImage') {
        //         checkevent[key] = req.body[key]
        //     }
        // }
        const updatedResult = await Event.findOneAndUpdate({ _id: req.params.id }, checkevent, { new: true }).exec(function (err, updatedResult) {
            if (updatedResult) res.json({ error: false, errors: [], data: updatedResult });
            else res.json({ error: false, errors: [{ params: "event", msg: err.message }], data: [] });
        })
    }
    // } else {
    //     res.json({ error: false, errors: [{ params: "event", msg: "you are not authorized to update this store" }], data: [] });
    // }

exports.getEventsList = async (req, res) => {
    const eventsList = await Event.getEventsList();
    res.json({ error: false, errors: [], data: eventsList });
};

exports.validateEventDetails = function (req, res, next) {
    req.checkBody("eventName", "Must add event name.").notEmpty();
    req.checkBody("place", "Ohhh!! you forgot to tell where to come").notEmpty();
    //req.checkBody("date", "Ohh!! pls add date").notEmpty();
    req.checkBody("location.address", "Address cant be empty").notEmpty()
    req.checkBody("location.coordinates", "Please enter proper coordinates").notEmpty()
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
}
exports.deleteEvent = async (req, res) => {
    const userData = await Event.findOneAndRemove({ _id: req.params.id })
    res.json({ error: false, errors: [], data: userData });
}

exports.getEventByDate = function (req, res) {
    Event.aggregate([
        {
            $group: {
                _id: "$date",
                data: {
                    $push: {
                        date: "$date",
                        eventName: "$eventName",
                        time: "$time",
                        location: "$location",
                        publishedBy: "$publishedBy",
                        published: "$published",
                        tags: "$tags",
                        eventImage: "$eventImage",
                        publishedOn: "$publishedOn",
                        description: "$description",
                        contact: "$contact",
                        likes: "$likes",
                        _id: "$_id"
                    }
                }
            }
        }, { $sort: { "_id": 1 } }])
        .exec((err, data) => {
            if (data) res.json({ error: false, errors: [], data: data });
            else res.json("error")
        })
}

exports.addComment = async function (req, res) {
    req.body.event = req.params.id
    var comment = new Comment(req.body)
    comment.save().then((resp) => {
        if (resp) {
            res.json({ error: false, errors: [], data: resp });
        }
    }).catch((err) => {
        res.json({ error: true, errors: [{ "param": comment, msg: "err.message" }], data: [] })
    })
}
exports.getEvent = async function (req, res) {
    let result = await Event.findOne({ _id: req.params.id }).populate('comments');
    res.json({ error: false, errors: [], data: result });
}