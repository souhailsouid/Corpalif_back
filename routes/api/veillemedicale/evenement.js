const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/veillemedicale/evenement')
	},
	filename: function(req, files, cb) {
		cb(null, new Date().toISOString() + files.originalname)
	}
})

const upload = multer({
	storage: storage
})

const Evenement = require('../../../models/veillemedicale/evenement')
router.get('/', (req, res) => {
	Evenement.find()
		.then((evenement) => {
			res.json(evenement)
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
		const evenement = new Evenement({
			_id: new mongoose.Types.ObjectId(),
			theme: req.body.theme,
			title: req.body.title,
			message: req.body.message,
			fileName: req.body.fileName,
			picture: req.files['picture'][0].path,
			file: req.files['file'][0].path
		})
		evenement
			.save()
			.then((result) => {
				console.log(result)
				res.status(201).json({
					message: 'Created product successfully',
					createdevenement: {
						theme: result.theme,
						title: result.title,
						message: result.message,
						fileName: result.fileName,
						_id: result._id,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/api/evenement/' + result._id
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
	Evenement.findById(req.params.id)
		.select('theme title message _id picture file fileName')
		.exec()
		.then((evenement) => res.json(evenement))
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
		Evenement.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }).then((evenement) => {
			Evenement.findOne({ _id: req.params.id }).then((evenement) => res.send(evenement))
		})
	}
)

router.delete('/:id', (req, res, next) => {
	const id = req.params.id
	Evenement.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Product deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:5000/api/evenement',
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
