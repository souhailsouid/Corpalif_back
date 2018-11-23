const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const AgendaSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},

	theme: {
		type: String
	},
	lieu: {
		type: String
	},
	rue: {
		type: String
	},
	city: {
		type: String
	},
	when: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}
})
module.exports = Agenda1 = mongoose.model('Agenda1', AgendaSchema)
