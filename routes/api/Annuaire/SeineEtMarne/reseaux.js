const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation

const validateAnnuaireInput = require('../../../../validation/annuaire')

// Load Annuaire Model

const Reseaux = require('../../../../models/Annuaire/SeineEtMarne/reseaux')
// Load User Model

// @route   GET api/annuaire/test
// @desc    Tests annuaire route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Annuaire Works' }))

// @route   GET api/annuaire/seineetmarne/reseaux
// @desc    Get current Annuaire
// @access  Public
router.get('/seineetmarne/reseaux', (req, res) => {
	Reseaux.find()
		.then((reseaux) => {
			res.json(reseaux)
		})
		.catch((err) => res.status(404).json(err))
})
// @route   GET api/annuaire/seineetmarne/reseaux
// @desc    Get current Annuaire
// @access  Public

router.post('/seineetmarne/reseaux', passport.authenticate('jwt', { session: false }), (req, res) => {
	const newPost = new Reseaux({
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
// @route   GET api/annuaire/seineetmarne/reseaux/:id
// @desc    Get seineetmarne/reseaux by id
// @access  Public
router.get('/seineetmarne/reseaux/:id', (req, res) => {
	Reseaux.findById(req.params.id)
		.then((reseaux) => res.json(reseaux))
		.catch((err) => res.status(404).json({ noreseauxfound: 'No reseaux found with that ID' }))
})

// @route   UPDATE api/annuaire/seineetmarne/reseaux/:id
// @desc    update post
// @access  Private
router.put('/seineetmarne/reseaux/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateAnnuaireInput(req.body)
	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors)
	}

	Reseaux.findByIdAndUpdate({ _id: req.params.id }, req.body).then((reseaux) => {
		Reseaux.findOne({ _id: req.params.id }).then((reseaux) => res.send(reseaux))
	})
})

// @route   DELETE api/annuaire/seineetmarne/reseaux/:id
// @desc    Delete post
// @access  Private
router.delete('/seineetmarne/reseaux/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Reseaux.findOne({ user: req.user.id }).then((reseaux) => {
		Reseaux.findById(req.params.id)
			.then((reseaux) => {
				// Delete
				reseaux.remove().then(() => res.json({ success: true }))
			})
			.catch((err) => res.status(404).json({ reseauxnotfound: 'No reseaux found' }))
	})
})
module.exports = router
