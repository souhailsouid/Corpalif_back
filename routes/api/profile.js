const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation
const validateProfileInput = require('../../validation/profile')

// Load Profile Model
const Profile = require('../../models/Profile')
// Load User Model
const User = require('../../models/User')

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }))

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {}

	Profile.findOne({ user: req.user.id })
		.populate('user', [ 'name' ])
		.then((profile) => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user'
				return res.status(404).json(errors)
			}
			res.json(profile)
		})
		.catch((err) => res.status(404).json(err))
})

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
	const errors = {}

	Profile.find()
		.populate('user', [ 'name' ])
		.then((profiles) => {
			if (!profiles) {
				errors.noprofile = 'There are no profiles'
				return res.status(404).json(errors)
			}

			res.json(profiles)
		})
		.catch((err) => res.status(404).json({ profile: 'There are no profiles' }))
})

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:structure', (req, res) => {
	const errors = {}

	Profile.findOne({ structure: req.params.structure })
		.populate('user', [ 'name' ])
		.then((profile) => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user'
				res.status(404).json(errors)
			}

			res.json(profile)
		})
		.catch((err) => res.status(404).json(err))
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
	const errors = {}

	Profile.findOne({ user: req.params.user_id })
		.populate('user', [ 'name' ])
		.then((profile) => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user'
				res.status(404).json(errors)
			}

			res.json(profile)
		})
		.catch((err) => res.status(404).json({ profile: 'There is no profile for this user' }))
})

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateProfileInput(req.body)

	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors)
	}

	// Get fields
	const profileFields = {}
	profileFields.user = req.user.id

	if (req.body.structure) profileFields.structure = req.body.structure
	if (req.body.company) profileFields.company = req.body.company
	if (req.body.fonction) profileFields.fonction = req.body.fonction
	if (req.body.location) profileFields.location = req.body.location

	Profile.findOne({ user: req.user.id }).then((profile) => {
		if (profile) {
			// Update
			Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then((profile) =>
				res.json(profile)
			)
		} else {
			// Create

			// Check if handle exists
			Profile.findOne({ structure: profileFields.structure }).then((profile) => {
				if (profile) {
					errors.handle = 'That structure already exists'
					res.status(400).json(errors)
				}

				// Save Profile
				new Profile(profileFields).save().then((profile) => res.json(profile))
			})
		}
	})
})

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOneAndRemove({ user: req.user.id }).then(() => {
		User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }))
	})
})

module.exports = router
