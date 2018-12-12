const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const nodemailer = require('nodemailer')
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
		.populate('user', [ 'name', 'last_name', 'email', 'status' ])
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
		.populate('user', [ 'name', 'last_name', 'email', 'status' ])
		.then((profiles) => {
			if (!profiles) {
				errors.noprofile = 'There are no profiles'
				return res.status(404).json(errors)
			}

			res.json(profiles)
		})
		.catch((err) => res.status(404).json({ profile: 'There are no profiles' }))
})
// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/adherent', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id }).then((profile) => {
		const newAdherent = {
			member: req.body.member
		}

		// Add to comments array
		profile.adherent.unshift(newAdherent)

		// Save
		profile.save().then((profile) => res.json(profile))
		nodemailer.createTestAccount((err, account) => {
			var transporter = nodemailer.createTransport({
				service: process.env.NODEMAILER_SERVICE,
				port: process.env.NODEMAILER_PORT,
				secure: false, // true for 465, false for other ports
				auth: {
					user: process.env.NODEMAILER_USER, // generated ethereal user
					pass: process.env.NODEMAILER_PASS // generated ethereal password
				}
			})
			const htmlEmail = `
      <p>
        Bonjour ${req.user.last_name}
        <br />
      nous vous confirmons vore adhésion pour votre compte ${req.user.email}, pour l'année civile à la corpalif 
        <br />
        <br />
        A très bientôt
			</p>`
			let mailOptions = {
				from: process.env.NODEMAILER_USER, // sender address
				to: req.user.email,
				replyTo: req.body.email, // list of receivers
				subject: 'Confirmation de votre adhésion à la corpalif ✔', // Subject line
				html: htmlEmail
			}
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error)
				}
				console.log('Message sent: %s', info.messageId)
				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
				res.render('contact', { msg: 'Your message has been sent' })
			})
		})
	})
})
router.put('/adherent', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOneAndUpdate({ user: req.user.id }, req.body).then((profile) => {
		profile.adherent.unshift().findOne()
		Profile.findOne({ user: req.user.id }).then((profile) => res.send(profile))

		// router.put('/adherent', passport.authenticate('jwt', { session: false }), (req, res) => {
		// 	Profile.findOneAndUpdate({ user: req.user.id }).then((profile) => {
		// 		// Save
		// 		Post.findById(req.params.id)
		// 		profile.save().then((profile) => res.json(profile))
		// 		router.put('/adherent', passport.authenticate('jwt', { session: false }), (req, res) => {
		// 			Profile.findOneAndUpdate({ user: req.user.id }).then((profile) => {
		// 				// profile.adherent.unshift(newAdherent)
		// 				Profile.findOne({ user: req.user.id }).then((profile) => res.send(profile))

		// })
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
	})
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
	if (req.body.newsletter) profileFields.newsletter = req.body.newsletter
	if (req.body.member) profileFields.member = req.body.member
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

router.post('/updatemember', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Get fields
	const profileFields = {}
	profileFields.user = req.user.id

	if (req.body.member) profileFields.member = req.body.member
	Profile.findOne({ user: req.user.id }).then((profile) => {
		if (profile) {
			// Update
			Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then((profile) =>
				res.json(profile)
			)

			// Save Profile
			new Profile(profileFields).save().then((profile) => res.json(profile))
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
