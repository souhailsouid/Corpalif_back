const mongoose = require('mongoose')

const AgendaSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId
	},

	picture: {
		type: String
	},
	file: {
		type: String
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
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Agenda', AgendaSchema)
