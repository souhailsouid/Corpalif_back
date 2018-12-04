const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const OffresSchema = new Schema({
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
module.exports = Offres = mongoose.model('Offres', OffresSchema)
