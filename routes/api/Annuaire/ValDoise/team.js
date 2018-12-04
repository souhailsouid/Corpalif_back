const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation

const validateAnnuaireInput = require('../../../../validation/annuaire')

// Load Annuaire Model

const Team = require('../../../../models/Annuaire/ValDoise/team')
// Load User Model

// @route   GET api/annuaire/test
// @desc    Tests annuaire route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Annuaire Works' }))

// @route   GET api/annuaire/valdoise/team
// @desc    Get current Annuaire
// @access  Public
router.get('/valdoise/team', (req, res) => {
	Team.find()
		.then((team) => {
			res.json(team)
		})
		.catch((err) => res.status(404).json(err))
})
// @route   GET api/annuaire/valdoise/team
// @desc    Get current Annuaire
// @access  Public

router.post('/valdoise/team', passport.authenticate('jwt', { session: false }), (req, res) => {
	const newPost = new Team({
		name: req.body.name,
		rue: req.body.rue,
		postcode: req.body.postcode,
		compl: req.body.compl,
		phone: req.body.phone,
		web: req.body.web,
		email: req.body.email
	})

	newPost.save().then((post) => res.json(post))
})
// @route   GET api/annuaire/valdoise/team/:id
// @desc    Get valdoise/team by id
// @access  Public
router.get('/valdoise/team/:id', (req, res) => {
	Team.findById(req.params.id)
		.then((team) => res.json(team))
		.catch((err) => res.status(404).json({ noteamfound: 'No team found with that ID' }))
})

// @route   UPDATE api/annuaire/valdoise/team/:id
// @desc    update post
// @access  Private
router.put('/valdoise/team/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)
	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors)
	}

	Team.findByIdAndUpdate({ _id: req.params.id }, req.body).then((team) => {
		Team.findOne({ _id: req.params.id }).then((team) => res.send(team))
	})
})

// @route   DELETE api/annuaire/valdoise/team/:id
// @desc    Delete post
// @access  Private
router.delete('/valdoise/team/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Team.findOne({ user: req.user.id }).then((team) => {
		Team.findById(req.params.id)
			.then((team) => {
				// Delete
				team.remove().then(() => res.json({ success: true }))
			})
			.catch((err) => res.status(404).json({ teamnotfound: 'No team found' }))
	})
})
module.exports = router
