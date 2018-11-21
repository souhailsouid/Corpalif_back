const mongoose = require('mongoose')

const CarousselSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId
	},

	picture: {
		type: String
	},
	picture2: {
		type: String
	},
	picture3: {
		type: String
	},
	title: {
		type: String
	},
	title2: {
		type: String
	},
	title3: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Caroussel', CarousselSchema)
