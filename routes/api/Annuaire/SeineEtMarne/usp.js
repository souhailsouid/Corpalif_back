const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation

const validateAnnuaireInput = require('../../../../validation/annuaire')

// Load Annuaire Model

const Usp = require('../../../../models/Annuaire/SeineEtMarne/usp')
// Load User Model

// @route   GET api/annuaire/test
// @desc    Tests annuaire route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Annuaire Works' }))

// @route   GET api/annuaire/seineetmarne/usp
// @desc    Get current Annuaire
// @access  Public
router.get('/seineetmarne/usp', passport.authenticate('jwt', { session: false }), (req, res) => {
	Usp.find()
		.then((usp) => {
			res.json(usp)
		})
		.catch((err) => res.status(404).json(err))
})
// @route   GET api/annuaire/seineetmarne/usp
// @desc    Get current Annuaire
// @access  Public

router.post('/seineetmarne/usp', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)

	// Check Validation
	if (!isValid) {
		// If any errors, send 400 with errors object
		return res.status(400).json(errors)
	}

	const newPost = new Usp({
		name: req.body.name,
		adresse: req.body.adresse,
		phone: req.body.phone,
		responsable: req.body.responsable,
		email: req.body.email
	})

	newPost.save().then((post) => res.json(post))
})
// @route   GET api/annuaire/seineetmarne/usp/:id
// @desc    Get seineetmarne/usp by id
// @access  Public
router.get('/seineetmarne/usp/:id', (req, res) => {
	Usp.findById(req.params.id)
		.then((usp) => res.json(usp))
		.catch((err) => res.status(404).json({ nouspfound: 'No usp found with that ID' }))
})

// @route   UPDATE api/annuaire/seineetmarne/usp/:id
// @desc    update post
// @access  Private
router.put('/seineetmarne/usp/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)
	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors)
	}

	Usp.findByIdAndUpdate({ _id: req.params.id }, req.body).then((usp) => {
		Usp.findOne({ _id: req.params.id }).then((usp) => res.send(usp))
	})
})

// @route   DELETE api/annuaire/seineetmarne/usp/:id
// @desc    Delete post
// @access  Private
router.delete('/seineetmarne/usp/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Usp.findOne({ user: req.user.id }).then((usp) => {
		Usp.findById(req.params.id)
			.then((usp) => {
				// Delete
				usp.remove().then(() => res.json({ success: true }))
			})
			.catch((err) => res.status(404).json({ uspnotfound: 'No usp found' }))
	})
})
module.exports = router
