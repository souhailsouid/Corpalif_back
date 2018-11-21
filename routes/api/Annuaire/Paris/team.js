const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation

const validateAnnuaireInput = require('../../../../validation/annuaire')

// Load Annuaire Model

const Structure = require('../../../../models/Annuaire/Paris/structure')
// Load User Model

// @route   GET api/annuaire/test
// @desc    Tests annuaire route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Annuaire Works' }))

// @route   GET api/annuaire/paris/team
// @desc    Get current Annuaire
// @access  Public
router.get('/paris/structure', passport.authenticate('jwt', { session: false }), (req, res) => {
	Structure.find()
		.then((structure) => {
			res.json(structure)
		})
		.catch((err) => res.status(404).json(err))
})
// @route   GET api/annuaire/paris/structure
// @desc    Get current Annuaire
// @access  Public

router.post('/paris/structure', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)

	// Check Validation
	if (!isValid) {
		// If any errors, send 400 with errors object
		return res.status(400).json(errors)
	}

	const newPost = new Structure({
		name: req.body.name,
		adresse: req.body.adresse,
		phone: req.body.phone,
		responsable: req.body.responsable,
		email: req.body.email
	})

	newPost.save().then((post) => res.json(post))
})
// @route   GET api/annuaire/paris/structure/:id
// @desc    Get Paris/structure by id
// @access  Public
router.get('/paris/structure/:id', (req, res) => {
	Structure.findById(req.params.id)
		.then((structure) => res.json(structure))
		.catch((err) => res.status(404).json({ nostructurefound: 'No structure found with that ID' }))
})

// @route   UPDATE api/annuaire/paris/structure/:id
// @desc    update post
// @access  Private
router.put('/paris/structure/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)
	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors)
	}

	Structure.findByIdAndUpdate({ _id: req.params.id }, req.body).then((structure) => {
		Structure.findOne({ _id: req.params.id }).then((structure) => res.send(structure))
	})
})

// @route   DELETE api/annuaire/paris/structure/:id
// @desc    Delete post
// @access  Private
router.delete('/paris/structure/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Structure.findOne({ user: req.user.id }).then((structure) => {
		Structure.findById(req.params.id)
			.then((structure) => {
				// Delete
				structure.remove().then(() => res.json({ success: true }))
			})
			.catch((err) => res.status(404).json({ structurenotfound: 'No structure found' }))
	})
})
module.exports = router