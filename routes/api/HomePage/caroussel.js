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

const Caroussel = require('../../../models/HomePage/caroussel')

router.post(
	'/',
	upload.fields([
		{
			name: 'picture',
			maxCount: 1
		},
		{
			name: 'picture2',
			maxCount: 1
		},
		{
			name: 'picture3',
			maxCount: 1
		}
	]),
	(req, res, next) => {
		console.log(req.files)
		const caroussel = new Caroussel({
			_id: new mongoose.Types.ObjectId(),
			title: req.body.title,
			title2: req.body.title2,
			title3: req.body.title3,
			picture: req.files['picture'][0].path,
			picture2: req.files['picture2'][0].path,
			picture3: req.files['picture3'][0].path
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
							url: 'http://localhost:3000/api/caroussel/' + result._id
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
	}
)
router.get('/', (req, res) => {
	Caroussel.find()
		.then((caroussel) => {
			res.json(caroussel)
		})
		.catch((err) => res.status(404).json(err))
})

router.get('/:id', (req, res) => {
	Caroussel.findById(req.params.id)
		.select('picture picture2 picture3 title title2 title3')
		.exec()
		.then((caroussel) => res.json(caroussel))
		.catch((err) => res.status(404).json({ nopostfound: 'No post found with that ID' }))
})
router.patch(
	'/:id',
	upload.fields([
		{
			name: 'picture',
			maxCount: 1
		},
		{
			name: 'picture2',
			maxCount: 1
		},
		{
			name: 'picture3',
			maxCount: 1
		}
	]),
	(req, res) => {
		const updateOps = {
			title: req.body.title,
			title2: req.body.title2,
			title3: req.body.title3,
			picture: req.files['picture'][0].path,
			picture2: req.files['picture2'][0].path,
			picture3: req.files['picture3'][0].path
		}
		for (const [ key, value ] of Object.entries(updateOps)) {
			console.log(key, value)
		}
		Caroussel.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }).then((caroussel) => {
			Caroussel.findOne({ _id: req.params.id }).then((caroussel) => res.send(caroussel))
		})
	}
)

router.delete('/:id', (req, res, next) => {
	const id = req.params.id
	Caroussel.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Product deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:5000/api/caroussel',
					body: { title: 'String', title2: 'String', title3: 'String' }
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
