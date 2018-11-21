const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ProfileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	structure: {
		type: String,
		required: true
	},
	fonction: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	company: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)
