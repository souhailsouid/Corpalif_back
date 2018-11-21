const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation

const validateAnnuaireInput = require('../../../../validation/annuaire')

// Load Annuaire Model

const Had = require('../../../../models/Annuaire/ValDeMarne/had')
// Load User Model

// @route   GET api/annuaire/test
// @desc    Tests annuaire route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Annuaire Works' }))

// @route   GET api/annuaire/valdemarne/had
// @desc    Get current Annuaire
// @access  Public
router.get('/valdemarne/had', passport.authenticate('jwt', { session: false }), (req, res) => {
	Had.find()
		.then((had) => {
			res.json(had)
		})
		.catch((err) => res.status(404).json(err))
})
// @route   GET api/annuaire/valdemarne/had
// @desc    Get current Annuaire
// @access  Public

router.post('/valdemarne/had', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)

	// Check Validation
	if (!isValid) {
		// If any errors, send 400 with errors object
		return res.status(400).json(errors)
	}

	const newPost = new Had({
		name: req.body.name,
		adresse: req.body.adresse,
		phone: req.body.phone,
		responsable: req.body.responsable,
		email: req.body.email
	})

	newPost.save().then((post) => res.json(post))
})
// @route   GET api/annuaire/valdemarne/had/:id
// @desc    Get valdemarne/had by id
// @access  Public
router.get('/valdemarne/had/:id', (req, res) => {
	Had.findById(req.params.id)
		.then((had) => res.json(had))
		.catch((err) => res.status(404).json({ nohadfound: 'No had found with that ID' }))
})

// @route   UPDATE api/annuaire/valdemarne/had/:id
// @desc    update post
// @access  Private
router.put('/valdemarne/had/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)
	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors)
	}

	Had.findByIdAndUpdate({ _id: req.params.id }, req.body).then((had) => {
		Had.findOne({ _id: req.params.id }).then((had) => res.send(had))
	})
})

// @route   DELETE api/annuaire/valdemarne/had/:id
// @desc    Delete post
// @access  Private
router.delete('/valdemarne/had/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Had.findOne({ user: req.user.id }).then((had) => {
		Had.findById(req.params.id)
			.then((had) => {
				// Delete
				had.remove().then(() => res.json({ success: true }))
			})
			.catch((err) => res.status(404).json({ hadnotfound: 'No had found' }))
	})
})
module.exports = router
