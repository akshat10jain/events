var mongoose = require('mongoose');
const Schema = mongoose.Schema

var commentSchema = mongoose.Schema({
    comment: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
    }
})

const Comment = module.exports = mongoose.model('Comment', commentSchema);