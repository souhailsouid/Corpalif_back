const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/veillemedicale/rencontre')
	},
	filename: function(req, files, cb) {
		cb(null, new Date().toISOString() + files.originalname)
	}
})

const upload = multer({
	storage: storage
})

const Rencontre = require('../../../models/veillemedicale/rencontre')
router.get('/', (req, res) => {
	Rencontre.find()
		.then((rencontre) => {
			res.json(rencontre)
		})
		.catch((err) => res.status(404).json(err))
})

router.post(
	'/',
	upload.fields([
		{
			name: 'picture',
			maxCount: 1
		},
		{
			name: 'file',
			maxCount: 1
		}
	]),
	(req, res, next) => {
		console.log(req.files)
		const rencontre = new Rencontre({
			_id: new mongoose.Types.ObjectId(),
			theme: req.body.theme,
			title: req.body.title,
			message: req.body.message,
			fileName: req.body.fileName,
			picture: req.files['picture'][0].path,
			file: req.files['file'][0].path
		})
		rencontre
			.save()
			.then((result) => {
				console.log(result)
				res.status(201).json({
					message: 'Created product successfully',
					createdrencontre: {
						theme: result.theme,
						title: result.title,
						message: result.message,
						fileName: result.fileName,
						_id: result._id,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/api/rencontre/' + result._id
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
router.get('/:id', (req, res) => {
	Rencontre.findById(req.params.id)
		.select('theme title message _id picture file fileName')
		.exec()
		.then((rencontre) => res.json(rencontre))
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
			name: 'file',
			maxCount: 1
		}
	]),
	(req, res) => {
		const updateOps = {
			theme: req.body.theme,
			title: req.body.title,
			message: req.body.message,
			picture: req.files['picture'][0].path,
			file: req.files['file'][0].path,
			fileName: req.body.fileName
		}
		for (const [ key, value ] of Object.entries(updateOps)) {
			console.log(key, value)
		}
		Rencontre.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }).then((rencontre) => {
			Rencontre.findOne({ _id: req.params.id }).then((rencontre) => res.send(rencontre))
		})
	}
)

router.delete('/:id', (req, res, next) => {
	const id = req.params.id
	Rencontre.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Product deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:5000/api/rencontre',
					body: { title: 'String', theme: 'String', message: 'String', fileName: 'String' }
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
