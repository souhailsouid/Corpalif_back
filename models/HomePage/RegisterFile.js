const mongoose = require('mongoose')

const RegisterFileSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId
	},

	file: {
		type: String
	}
})

module.exports = mongoose.model('RegisterFile', RegisterFileSchema)
