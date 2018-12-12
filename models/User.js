const mongoose = require('mongoose')
const Schema = mongoose.Schema

var passportLocalMongoose = require('passport-local-mongoose')

// Create Schema
const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},

	status: {
		type: String,
		required: true
	},
	complete: {
		type: String
	},
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	},
	isAdmin: { type: String },
	date: {
		type: Date,
		default: Date.now
	}
})

UserSchema.plugin(passportLocalMongoose)

// module.exports = mongoose.model('user', UserSchema)

module.exports = User = mongoose.model('users', UserSchema)
