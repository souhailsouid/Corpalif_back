const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const async = require('async')
var flash = require('express-flash')
var cors = require('cors')
require('dotenv').config()

// Load Input Validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const validateForgotpassInput = require('../../validation/forgotpass')
const validateResetpassinput = require('../../validation/resetpass')
const validateHelperText = require('../../validation/helperText')
// Load User model
const User = require('../../models/User')
// paypal
const paypal = require('paypal-rest-sdk')

paypal.configure({
	mode: 'sandbox', //sandbox or live
	client_id: 'AS0sA4cFUPz6LLyuobu7_mu3DIEhxfqrhckbfCmz0tK3NlgHStufwkhRFi0zGNhZbgLged0THpdgP276',
	client_secret: 'EO8sf9w95OkW_dr65BTWaI9_8iXrEL1229QpeaMkP6KeF6EBhs_DIR6M_KH1CzK-_4yGV5ZkM_lnPJSl'
})
// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }))

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body)

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors)
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			errors.email = 'Email already exists'
			return res.status(400).json(errors)
		} else {
			const newUser = new User({
				name: req.body.name,
				last_name: req.body.last_name,
				email: req.body.email,
				password: req.body.password,
				status: req.body.status,

				isAdmin: req.body.isAdmin
			})

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err
					newUser.password = hash
					newUser.save().then((user) => res.json(user)).catch((err) => console.log(err))
				})
			})
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
				${req.body.last_name}, 
				<p>
					bienvenue sur le site Internet de la Corpalif !
					<br/> 
					Votre inscription a bien été prise en compte, vous pouvez à tout moment modifier vos informations dans votre profil.
					<br/>
					Si vous souhaitez recevoir régulièrement nos mails (rencontres, offres d'emploi, actualités), merci de cocher la case "Je souhaite recevoir les mails de la Corpalif".
					<br/> 
					Vous pouvez également nous suivre sur nos pages Facebook et Linkedin.
          <br/>
					Pour participer activement à l'activité de l'association, n'hésitez pas à consulter notre page d'adhésion. 
          <br/>
          <br/>
					A très bientôt. 
          <br/>
					Corpalif
					</p>`
				let mailOptions = {
					from: process.env.NODEMAILER_USER, // sender address
					to: req.body.email,
					replyTo: req.body.email, // list of receivers
					subject: 'Inscription à la Corpalif ✔', // Subject line
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
		}
	})
})
// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body)

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors)
	}

	const email = req.body.email
	const password = req.body.password

	// Find user by email
	User.findOne({ email }).then((user) => {
		// Check for user
		if (!user) {
			errors.email = 'User not found'
			return res.status(404).json(errors)
		}

		// Check Password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				// User Matched
				const payload = {
					id: user.id,
					name: user.name,
					last_name: user.last_name,
					status: user.status,

					email: user.email,
					isAdmin: user.isAdmin
				} // Create JWT Payload

				// Sign Token
				jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
					res.json({
						success: true,
						token: 'Bearer ' + token
					})
				})
			} else {
				errors.password = 'Password incorrect'
				return res.status(400).json(errors)
			}
		})
	})
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name
	})
})

// @route Post api/users/api/form
// @desc Return contact details to corpalif
// @access Private
// Contact Form

router.post('/api/form', (req, res) => {
	nodemailer.createTestAccount((err, account) => {
		const htmlEmail = `

		<p>You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
		<li>First_name: ${req.body.first_name}</li>
		<li>Last_name: ${req.body.last_name}</li>
		<li>Email: ${req.body.email}</li>
		</ul>
		<h3>Message</h3>
		<p>${req.body.message}</p>

		`
		let transporter = nodemailer.createTransport({
			service: process.env.NODEMAILER_SERVICE,
			port: process.env.NODEMAILER_PORT,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.NODEMAILER_USER, // generated ethereal user
				pass: process.env.NODEMAILER_PASS // generated ethereal password
			}
		})
		let mailOptions = {
			from: process.env.NODEMAILER_USER, // sender address
			to: process.env.NODEMAILER_USER,
			replyTo: process.env.NODEMAILER_USER, // list of receivers
			subject: 'Contact request ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: htmlEmail // html body
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

// @route GET api/forgot_password
// @desc Return forgot password
// @access Private
// forgot password
router.get('/forgot_password', function(req, res) {
	res.render('forgot')
})
router.post('/forgot_password', function(req, res, next) {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex')
				done(err, token)
			})
		},
		function(token, done) {
			const { errors, isValid } = validateForgotpassInput(req.body)

			// Check Validation
			if (!isValid) {
				// Return any errors with 400 status
				console.log(errors)
				return res.status(400).json(errors)
			}
			User.findOne({ email: req.body.email }, function(err, user) {
				if (!user) {
					errors.forgot_password = 'No account with that email address exists.'
					return res.status(404).json(errors)
				}

				user.resetPasswordToken = token
				user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

				user.save(function(err) {
					done(err, token, user)
				})
			})
		},
		function(token, user, done) {
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
				subject: 'Node.js Password Reset',
				text:
					'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' +
					'localhost:3000' +
					'/reset/' +
					token +
					'\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			}
			smtpTransport.sendMail(mailOptions, function(err) {
				console.log('mail sent')

				console.log('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.')
				done(err, 'done')
			})
		},

		function(err) {
			return res.status(422).json({ message: err })
		}
	])
})

router.get('/reset/:token', function(req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(
		err,
		user
	) {
		if (!user) {
			console.log('error', 'Password reset token is invalid or has expired.')
			return res.redirect('/forgot')
		}
		res.status('reset', {
			user: req.user
		})
	})
})
router.post('/reset/:token', (req, res) => {
	async.waterfall([
		function(done) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: { $gt: Date.now() }
			}).exec(
				function(err, user) {
					const { errors, isValid, helperText } =
						validateResetpassinput(req.body) || validateHelperText(req.body)

					// Check Validation
					if (!isValid) {
						// Return any errors with 400 status
						console.log(errors)
						return res.status(400).json(errors)
					}
					res.status(200).json(helperText)

					if (user) {
						if (req.body.password === req.body.password2) {
							user.password = bcrypt.hashSync(req.body.password, 10)
							user.resetPasswordToken = undefined
							user.resetPasswordExpires = undefined

							// user.save().then(console.log(user))

							user.save(function(err) {
								done(err, user)

								console.log(user, err)
							})
						}

						const htmlEmail = `
							<p>
								Bonjour ${user.last_name}
								<br />
								vous avez demandé la modification de votre mot de passe pour ${user.email}.<br />
								La modification a bien été prise en compte, vous pouvez dès maintenant vous connecter à
								votre espace sur notre site www.corpalif.org.
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
							subject: 'Confirmation changement du mot de passe',
							html: htmlEmail
						}
						smtpTransport.sendMail(mailOptions, function(err) {
							console.log('mail sent')
							console.log(
								'success',
								'An e-mail has been sent to ' + user.email + ' with further instructions.'
							)
							done(err, 'done')
						})
					}
				},
				function(err) {
					return res.status(422).json({ message: err })
				}
			)
		}
	])
})

module.exports = router
