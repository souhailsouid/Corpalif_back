const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation
const validateProfileInput = require('../../validation/profile')
const Profile = require('../../models/Profile')
// Load Profile Model
const Adherent = require('../../models/member')
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

	Adherent.findOne({ user: req.user.id })
		.populate('user', [ 'name' ])
		.then((adherent) => {
			if (!adherent) {
				// errors.noadherent = 'There is no adhesion for this user'
				return res.status(404).json(errors)
			}
			res.json(adherent)
		})
		.catch((err) => res.status(404).json(err))
})

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
	const errors = {}

	Adherent.find()
		.populate('user', [ 'name' ])
		.then((adherents) => {
			if (!adherents) {
				errors.noadherent = 'There are no adherents'
				return res.status(404).json(errors)
			}

			res.json(adherents)
			const htmlEmail = `
      <p>
        Bonjour ${user.last_name}
        <br />
      nous vous confirmons votre adhésion pour votre compte ${user.email}, pour l'année civile à la corpalif 
        <br />
        <br />
        A très bientôt
      </p>`

			var smtpTransport = nodemailer.createTransport({
				service: process.env.NODEMAILER_SERVICE,
				port: process.env.NODEMAILER_PORT,
				secure: false, // true for 465, false for other ports
				auth: {
					user: process.env.NODEMAILER_USER, // generated ethereal user
					pass: process.env.NODEMAILER_PASS // generated ethereal password
				}
			})

			var mailOptions = {
				to: user.email,
				from: process.env.NODEMAILER_USER,
				subject: 'Confirmation de votre adhésion à la corpalif',
				html: htmlEmail
			}
			smtpTransport.sendMail(mailOptions, function(err) {
				console.log('mail sent')
				console.log('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.')
				done(err, 'done')
			}),
				function(err) {
					return res.status(422).json({ message: err })
				}
		})
		.catch((err) => res.status(404).json({ adherent: 'There are no adherents' }))
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
	const adherentFields = {}
	adherentFields.user = req.user.id

	if (req.body.member) adherentFields.member = req.body.member
	Adherent.findOne({ user: req.user.id }).then((adherent) => {
		if (adherent) {
			// Update
			Adherent.findOneAndUpdate({ user: req.user.id }, { $set: adherentFields }, { new: true }).then((adherent) =>
				res.json(adherent)
			)
		} else {
			// Create

			// Check if handle exists
			Adherent.findOne({ structure: adherentFields.structure }).then((adherent) => {
				if (adherent) {
					errors.handle = 'That structure already exists'
					res.status(400).json(errors)
				}

				// Save Profile
				new Adherent(adherentFields).save().then((adherent) => res.json(adherent))
			})
		}
	})
})

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	Adherent.findOneAndRemove({ user: req.user.id }).then(() => {
		User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }))
	})
})

module.exports = router
