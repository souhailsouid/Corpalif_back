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
		.select('file picture theme lieu rue city when')
		.exec()
		.then((agenda) => res.json(agenda))
		.catch((err) => res.status(404).json({ noagendafound: 'No agenda found with that ID' }))
})

router.patch('/:id', upload.fields([]), (req, res) => {
	const updateOps = {
		when: req.body.when,
		theme: req.body.theme,
		lieu: req.body.lieu,
		rue: req.body.rue,
		city: req.body.city
	}
	for (const [ key, value ] of Object.entries(updateOps)) {
		console.log(key, value)
	}
	Agenda2.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }).then((agenda) => {
		Agenda2.findOne({ _id: req.params.id }).then((agenda) => res.send(agenda))
	})
})

module.exports = router
