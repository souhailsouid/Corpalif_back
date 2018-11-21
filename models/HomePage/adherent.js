const mongoose = require('mongoose')

const AdhesionSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId
	},

	picture: {
		type: String
	},

	title: {
		type: String
	},

	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Adhesion', AdhesionSchema)
