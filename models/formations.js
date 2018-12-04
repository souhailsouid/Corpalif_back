const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const FormationsSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	theme: {
		type: String
	},
	title: {
		type: String
	},
	message: {
		type: String
	},
	picture: {
		type: String
	},
	fileName: {
		type: String
	},
	file: { type: String },
	date: {
		type: Date,
		default: Date.now
	}
})
module.exports = Formations = mongoose.model('Formations', FormationsSchema)
