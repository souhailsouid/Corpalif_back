const mongoose = require('mongoose')

const Agenda2Schema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId
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

module.exports = mongoose.model('Agenda2', Agenda2Schema)
