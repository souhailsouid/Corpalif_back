if (process.env.NODE_ENV === 'production') {
	module.exports = require('./keys_prod')
} else {
	module.exports = require('./keys_dev')
}

// module.exports = {
// 	mongoURI: process.env.DB_DATABASE,
// 	secretOrKey: process.env.DB_secretOrKey
// }
