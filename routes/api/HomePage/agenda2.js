const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const Agenda2 = require('../../../models/HomePage/agenda/agenda2')
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

router.get('/', (req, res) => {
	Agenda2.find()
		.then((agenda) => {
			res.json(agenda)
		})
		.catch((err) => res.status(404).json(err))
})

router.get('/:id', (req, res) => {
	Agenda2.findById(req.params.id)
		.select('file picture theme lieu rue city when, line')
		.exec()
		.then((agenda) => res.json(agenda))
		.catch((err) => res.status(404).json({ noagendafound: 'No agenda found with that ID' }))
})
router.post('/notification/', upload.fields([]), (req, res, next) => {
	console.log(req.files)
	const post = new Agenda2({
		_id: new mongoose.Types.ObjectId(),
		when: req.body.when,
		theme: req.body.theme,
		lieu: req.body.lieu,
		rue: req.body.rue,
		city: req.body.city,
		line: req.body.line
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
						url: 'http://localhost:3000/api/agenda2	/' + result._id
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
router.patch('/:id', upload.fields([]), (req, res) => {
	const updateOps = {
		when: req.body.when,
		theme: req.body.theme,
		lieu: req.body.lieu,
		rue: req.body.rue,
		city: req.body.city,
		line: req.body.line
	}
	for (const [ key, value ] of Object.entries(updateOps)) {
		console.log(key, value)
	}
	Agenda2.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }).then((agenda) => {
		Agenda2.findOne({ _id: req.params.id }).then((agenda) => res.send(agenda))
	})
})

module.exports = router
