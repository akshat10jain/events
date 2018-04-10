const express = require('express');
const router = express();
const validate = require('../helpers/tokenHelper').validate
const multer = require('multer')


// storing path for event images
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

var fileFilter = function (req, file, cb) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
//multer object
var upload = multer({ storage: storage, limits: { fileSize: 10234 * 1024 * 5 }, fileFilter: fileFilter })


//event controller
const eventController = require("../controllers/eventController");

router.get("/get/list", eventController.getEventsList);
router.get("/getevent/:id", eventController.getEvent);
router.get("/delete/:id", validate, eventController.deleteEvent);
router.get("/listbydate", eventController.getEventByDate);
router.post("/update/:id", validate, upload.single('eventImage'), eventController.updateEvent);
router.post("/add/event", validate, upload.single('eventImage'), eventController.addNewEvent);
router.post("/addcomment/:id", eventController.addComment)

module.exports = router;