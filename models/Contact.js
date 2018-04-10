var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({
	description: {
		type: String,
	},
	from: {
		type: String
	},
	name:{
		type:String
	},
	status:{
		type:Boolean,
		default:false
	},
	subject: {
		type: String
	},
	submittedOn: {
		type: Date,
		default: Date.now
	}
})

contactSchema.statics.getQueries = function () {
	return this.find()
		.then((result) => {
			return result
		})
}

const Contact = module.exports = mongoose.model('Contact', contactSchema);
