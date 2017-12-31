const Event = require('../models/Event');

//add event
exports.addNewEvent = async (req, res) => {
    if (req.file != null) {
        console.log(req.file)
        req.body.eventImage = '/uploads/' + req.file.filename
    } else {
        req.body.eventImage = '/uploads/samepleimage'
    }
    const event = new Event(req.body)
    const newEvent = await event.save()
    res.json({ error: false, errors: [], data: newEvent });
}


// update event
exports.updateEvent = async (req, res) => {
    if (req.file != null) {
        console.log(req.file)
        req.body.eventImage = '/uploads/' + req.file.filename
    } else {
        req.body.eventImage = '/uploads/samepleimage'
    }
    const updatedResult = await Event.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).exec()
    res.json({ error: false, errors: [], data: updatedResult });
}

// event details
exports.getEventsList = async (req, res) => {
    const eventsList = await Event.getEventsList();
    res.json({ error: false, errors: [], data: eventsList });
};


// particular event details 
exports.getEvent = async (req,res) => {
    const eventData = await Event.findOne({_id:req.params.id})
    res.json({ error: false, errors: [], data: userData });
}



exports.validateEventDetails = function (req, res, next) {
    req.checkBody("eventName", "Must add event name.").notEmpty();
    req.checkBody("place", "Ohhh!! you forgot to tell where to come").notEmpty();
    req.checkBody("date", "Ohh!! pls add date").notEmpty();
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


// delete event
exports.deleteEvent = async (req, res) => {
    const userData = await Event.findOneAndRemove({ _id: req.params.id })
    res.json({ error: false, errors: [], data: userData });
}