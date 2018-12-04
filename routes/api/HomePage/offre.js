const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const Offre = require('../../../models/HomePage/offre/notificationOffre')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/offredemploi')
	},
	filename: function(req, files, cb) {
		cb(null, new Date().toISOString() + files.originalname)
	}
})

const upload = multer({
	storage: storage
})

router.post('/notification/', upload.fields([]), (req, res, next) => {
	console.log(req.files)
	const post = new Offre({
		_id: new mongoose.Types.ObjectId(),
		when: req.body.when,
		titre: req.body.titre,
		lieu: req.body.lieu,
		company: req.body.company,
		poste: req.body.poste
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
						url: 'http://localhost:3000/api/Offre/' + result._id
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
router.get('/notification', (req, res) => {
	Offre.find()
		.then((offre) => {
			res.json(offre)
		})
		.catch((err) => res.status(404).json(err))
})

router.get('/notification/:id', (req, res) => {
	Offre.findById(req.params.id)
		.select('file picture titre lieu company poste when')
		.exec()
		.then((offre) => res.json(offre))
		.catch((err) => res.status(404).json({ nooffrefound: 'No offre found with that ID' }))
})

router.patch('/notification/:id', upload.fields([]), (req, res) => {
	const updateOps = {
		when: req.body.when,
		titre: req.body.titre,
		lieu: req.body.lieu,
		company: req.body.company,
		poste: req.body.poste
	}
	for (const [ key, value ] of Object.entries(updateOps)) {
		console.log(key, value)
	}
	Offre.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }).then((offre) => {
		Offre.findOne({ _id: req.params.id }).then((offre) => res.send(offre))
	})
})

router.delete('/notification/:id', (req, res, next) => {
	const id = req.params.id
	Offre.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Product deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:5000/api/offre'
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
