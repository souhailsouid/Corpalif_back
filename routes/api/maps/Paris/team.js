const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation

// Load Annuaire Model

const Team = require('../../../../models/maps/paris/team')
// Load User Model

// @route   GET api/annuaire/test
// @desc    Tests annuaire route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Annuaire Works' }))

// @route   GET api/annuaire/essonne/team
// @desc    Get current Annuaire
// @access  Public
router.get('/team', (req, res) => {
	Team.find()
		.then((team) => {
			res.json(team)
		})
		.catch((err) => res.status(404).json(err))
})
// @route   GET api/annuaire/essonne/team
// @desc    Get current Annuaire
// @access  Public

router.post('/team', passport.authenticate('jwt', { session: false }), (req, res) => {
	const newPost = new Team({
		name: req.body.name,
		message: req.body.message,
		long: req.body.long,
		lat: req.body.lat
	})

	newPost.save().then((post) => res.json(post))
})
// @route   GET api/annuaire/essonne/team/:id
// @desc    Get essonne/team by id
// @access  Public
router.get('/team/:id', (req, res) => {
	Team.findById(req.params.id)
		.then((team) => res.json(team))
		.catch((err) => res.status(404).json({ noteamfound: 'No team found with that ID' }))
})

// @route   UPDATE api/annuaire/essonne/team/:id
// @desc    update post
// @access  Private
router.put('/team/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Team.findByIdAndUpdate({ _id: req.params.id }, req.body).then((team) => {
		Team.findOne({ _id: req.params.id }).then((team) => res.send(team))
	})
})

// @route   DELETE api/annuaire/essonne/team/:id
// @desc    Delete post
// @access  Private
router.delete('/team/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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
