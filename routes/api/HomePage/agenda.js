const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/agenda')
	},
	filename: function(req, files, cb) {
		cb(null, new Date().toISOString() + files.originalname)
	}
})

const upload = multer({
	storage: storage
})

const Agenda = require('../../../models/HomePage/agenda/agenda')

const Agenda2 = require('../../../models/HomePage/agenda/agenda2')
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
		const post = new Agenda({
			_id: new mongoose.Types.ObjectId(),
			date: req.body.date,
			theme: req.body.theme,
			lieu: req.body.lieu,
			rue: req.body.rue,
			city: req.body.city,
			file: req.files['file'][0].path,
			picture: req.files['picture'][0].path
		})
		post
			.save()
			.then((result) => {
				console.log(result)
				res.status(201).json({
					message: 'Created product successfully',
					createdfile: {
						_id: result._id,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/api/agenda/' + result._id
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
	Agenda.find()
		.then((agenda) => {
			res.json(agenda)
		})
		.catch((err) => res.status(404).json(err))
})

router.get('/:id', (req, res) => {
	Agenda.findById(req.params.id)
		.select('file picture theme lieu rue city date')
		.exec()
		.then((agenda) => res.json(agenda))
		.catch((err) => res.status(404).json({ noagendafound: 'No agenda found with that ID' }))
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
			date: req.body.date,
			theme: req.body.theme,
			lieu: req.body.lieu,
			rue: req.body.rue,
			city: req.body.city,

			file: req.files['file'][0].path,
			picture: req.files['picture'][0].path
		}
		for (const [ key, value ] of Object.entries(updateOps)) {
			console.log(key, value)
		}
		Agenda.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }).then((agenda) => {
			Agenda.findOne({ _id: req.params.id }).then((agenda) => res.send(agenda))
		})
	}
)

router.delete('/:id', (req, res, next) => {
	const id = req.params.id
	Agenda.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Product deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:5000/api/agenda'
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
