const mongoose = require('mongoose')

const ActualiteSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId
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

module.exports = mongoose.model('Actualite', ActualiteSchema)
