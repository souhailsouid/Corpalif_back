const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation

const validateAnnuaireInput = require('../../../../validation/annuaire')

// Load Annuaire Model

const Association = require('../../../../models/Annuaire/SeineEtMarne/association')
// Load User Model

// @route   GET api/annuaire/test
// @desc    Tests annuaire route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Annuaire Works' }))

// @route   GET api/annuaire/seineetmarne/association
// @desc    Get current Annuaire
// @access  Public
router.get('/seineetmarne/association', (req, res) => {
	Association.find()
		.then((association) => {
			res.json(association)
		})
		.catch((err) => res.status(404).json(err))
})
// @route   GET api/annuaire/seineetmarne/association
// @desc    Get current Annuaire
// @access  Public

router.post('/seineetmarne/association', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)

	// Check Validation
	if (!isValid) {
		// If any errors, send 400 with errors object
		return res.status(400).json(errors)
	}

	const newPost = new Association({
		name: req.body.name,
		adresse: req.body.adresse,
		phone: req.body.phone,
		responsable: req.body.responsable,
		email: req.body.email
	})

	newPost.save().then((post) => res.json(post))
})
// @route   GET api/annuaire/seineetmarne/association/:id
// @desc    Get seineetmarne/association by id
// @access  Public
router.get('/seineetmarne/association/:id', (req, res) => {
	Association.findById(req.params.id)
		.then((association) => res.json(association))
		.catch((err) => res.status(404).json({ noassociationfound: 'No association found with that ID' }))
})

// @route   UPDATE api/annuaire/seineetmarne/association/:id
// @desc    update post
// @access  Private
router.put('/seineetmarne/association/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)
	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors)
	}

	Association.findByIdAndUpdate({ _id: req.params.id }, req.body).then((association) => {
		Association.findOne({ _id: req.params.id }).then((association) => res.send(association))
	})
})

// @route   DELETE api/annuaire/seineetmarne/association/:id
// @desc    Delete post
// @access  Private
router.delete('/seineetmarne/association/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Association.findOne({ user: req.user.id }).then((association) => {
		Association.findById(req.params.id)
			.then((association) => {
				// Delete
				association.remove().then(() => res.json({ success: true }))
			})
			.catch((err) => res.status(404).json({ associationnotfound: 'No association found' }))
	})
})
module.exports = router
