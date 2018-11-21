const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/carousel')
	},
	filename: function(req, files, cb) {
		cb(null, new Date().toISOString() + files.originalname)
	}
})

const upload = multer({
	storage: storage
})

const Adherent = require('../../../models/HomePage/adherent')

router.post('/', upload.single('picture'), (req, res, next) => {
	console.log(req.files)
	const caroussel = new Adherent({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,

		picture: req.file.path
	})
	caroussel
		.save()
		.then((result) => {
			console.log(result)
			res.status(201).json({
				message: 'Created product successfully',
				createdcaroussel: {
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/api/adherent/' + result._id
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
	Adherent.find()
		.then((caroussel) => {
			res.json(caroussel)
		})
		.catch((err) => res.status(404).json(err))
})

router.get('/:id', (req, res) => {
	Adherent.findById(req.params.id)
		.select('picture  title ')
		.exec()
		.then((caroussel) => res.json(caroussel))
		.catch((err) => res.status(404).json({ nopostfound: 'No post found with that ID' }))
})
router.patch('/:id', upload.single('picture'), (req, res) => {
	const updateOps = {
		title: req.body.title,
		picture: req.file.path
	}
	for (const [ key, value ] of Object.entries(updateOps)) {
		console.log(key, value)
	}
	Adherent.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }).then((caroussel) => {
		Adherent.findOne({ _id: req.params.id }).then((caroussel) => res.send(caroussel))
	})
})

router.delete('/:id', (req, res, next) => {
	const id = req.params.id
	Adherent.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Product deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:5000/api/caroussel',
					body: { title: 'String' }
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

module.exports = router
