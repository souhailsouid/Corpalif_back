const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation

const validateAnnuaireInput = require('../../../../validation/annuaire')

// Load Annuaire Model

const Reseaux = require('../../../../models/Annuaire/Essonne/reseaux')
// Load User Model

// @route   GET api/annuaire/test
// @desc    Tests annuaire route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Annuaire Works' }))

// @route   GET api/annuaire/essonne/reseaux
// @desc    Get current Annuaire
// @access  Public
router.get('/essonne/reseaux', passport.authenticate('jwt', { session: false }), (req, res) => {
	Reseaux.find()
		.then((reseaux) => {
			res.json(reseaux)
		})
		.catch((err) => res.status(404).json(err))
})
// @route   GET api/annuaire/essonne/reseaux
// @desc    Get current Annuaire
// @access  Public

router.post('/essonne/reseaux', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)

	// Check Validation
	if (!isValid) {
		// If any errors, send 400 with errors object
		return res.status(400).json(errors)
	}

	const newPost = new Reseaux({
		name: req.body.name,
		adresse: req.body.adresse,
		phone: req.body.phone,
		responsable: req.body.responsable,
		email: req.body.email
	})

	newPost.save().then((post) => res.json(post))
})
// @route   GET api/annuaire/essonne/reseaux/:id
// @desc    Get essonne/reseaux by id
// @access  Public
router.get('/essonne/reseaux/:id', (req, res) => {
	Reseaux.findById(req.params.id)
		.then((reseaux) => res.json(reseaux))
		.catch((err) => res.status(404).json({ noreseauxfound: 'No reseaux found with that ID' }))
})

// @route   UPDATE api/annuaire/essonne/reseaux/:id
// @desc    update post
// @access  Private
router.put('/essonne/reseaux/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)
	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors)
	}

	Reseaux.findByIdAndUpdate({ _id: req.params.id }, req.body).then((reseaux) => {
		Reseaux.findOne({ _id: req.params.id }).then((reseaux) => res.send(reseaux))
	})
})

// @route   DELETE api/annuaire/essonne/reseaux/:id
// @desc    Delete post
// @access  Private
router.delete('/essonne/reseaux/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Reseaux.findOne({ user: req.user.id }).then((reseaux) => {
		Reseaux.findById(req.params.id)
			.then((reseaux) => {
				// Delete
				reseaux.remove().then(() => res.json({ success: true }))
			})
			.catch((err) => res.status(404).json({ reseauxnotfound: 'No reseaux found' }))
	})
})
module.exports = router