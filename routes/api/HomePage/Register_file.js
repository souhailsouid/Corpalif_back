const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "./uploads/formulaired'admission")
	},
	filename: function(req, files, cb) {
		cb(null, new Date().toISOString() + files.originalname)
	}
})

const upload = multer({
	storage: storage
})

const File = require('../../../models/HomePage/RegisterFile')

router.post('/', upload.single('file'), (req, res, next) => {
	console.log(req.files)
	const file = new File({
		_id: new mongoose.Types.ObjectId(),
		file: req.file.path
	})
	file
		.save()
		.then((result) => {
			console.log(result)
			res.status(201).json({
				message: 'Created product successfully',
				createdfile: {
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/api/file/' + result._id
					}
				}
			})
		})
		.catch((err) => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})
router.get('/', (req, res) => {
	File.find()
		.then((file) => {
			res.json(file)
		})
		.catch((err) => res.status(404).json(err))
})

router.get('/:id', (req, res) => {
	File.findById(req.params.id)
		.select('file')
		.exec()
		.then((file) => res.json(file))
		.catch((err) => res.status(404).json({ nopostfound: 'No post found with that ID' }))
})
router.patch('/:id', upload.single('file'), (req, res) => {
	const updateOps = {
		file: req.file.path
	}
	for (const [ key, value ] of Object.entries(updateOps)) {
		console.log(key, value)
	}
	File.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }).then((file) => {
		File.findOne({ _id: req.params.id }).then((file) => res.send(file))
	})
})

// router.delete('/:id', (req, res, next) => {
// 	const id = req.params.id
// 	File.remove({ _id: id })
// 		.exec()
// 		.then((result) => {
// 			res.status(200).json({
// 				message: 'Product deleted',
// 				request: {
// 					type: 'POST',
// 					url: 'http://localhost:5000/api/file',

// 				}
// 			})
// 		})
// 		.catch((err) => {
// 			console.log(err)
// 			res.status(500).json({
// 				error: err
// 			})
// 		})
// })

module.exports = router
