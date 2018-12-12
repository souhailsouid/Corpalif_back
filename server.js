const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
require('dotenv').config()
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const Profile_adherent = require('./routes/api/adherents')
const posts = require('./routes/api/posts')
const app = express()
var cors = require('cors')
var flash = require('express-flash')
var stripe = require('stripe')('sk_test_yShrXQPIikLVP1AMM3BBl8sH')

// Annuaire Routes
// Paris
const paris_usp = require('./routes/api/Annuaire/Paris/usp')
const paris_reseaux = require('./routes/api/Annuaire/Paris/reseaux')
const paris_association = require('./routes/api/Annuaire/Paris/association')
const paris_team = require('./routes/api/Annuaire/Paris/team')
const paris_had = require('./routes/api/Annuaire/Paris/had')
const paris_lits = require('./routes/api/Annuaire/Paris/lits')

// Yvelines
const yvelines_usp = require('./routes/api/Annuaire/Yvelines/usp')
const yvelines_reseaux = require('./routes/api/Annuaire/Yvelines/reseaux')
const yvelines_association = require('./routes/api/Annuaire/Yvelines/association')
const yvelines_team = require('./routes/api/Annuaire/Yvelines/team')
const yvelines_had = require('./routes/api/Annuaire/Yvelines/had')
const yvelines_lits = require('./routes/api/Annuaire/Yvelines/lits')
// Val d'Oise
const valdoise_usp = require('./routes/api/Annuaire/ValDoise/usp')
const valdoise_reseaux = require('./routes/api/Annuaire/ValDoise/reseaux')
const valdoise_association = require('./routes/api/Annuaire/ValDoise/association')
const valdoise_team = require('./routes/api/Annuaire/ValDoise/team')
const valdoise_had = require('./routes/api/Annuaire/ValDoise/had')
const valdoise_lits = require('./routes/api/Annuaire/ValDoise/lits')
// Seine Saint Denis
const seinesaintdenis_usp = require('./routes/api/Annuaire/SeineSaintDenis/usp')
const seinesaintdenis_reseaux = require('./routes/api/Annuaire/SeineSaintDenis/reseaux')
const seinesaintdenis_association = require('./routes/api/Annuaire/SeineSaintDenis/association')
const seinesaintdenis_team = require('./routes/api/Annuaire/SeineSaintDenis/team')
const seinesaintdenis_had = require('./routes/api/Annuaire/SeineSaintDenis/had')
const seinesaintdenis_lits = require('./routes/api/Annuaire/SeineSaintDenis/lits')
// Val de Marne
const valdemarne_usp = require('./routes/api/Annuaire/ValDeMarne/usp')
const valdemarne_reseaux = require('./routes/api/Annuaire/ValDeMarne/reseaux')
const valdemarne_association = require('./routes/api/Annuaire/ValDeMarne/association')
const valdemarne_team = require('./routes/api/Annuaire/ValDeMarne/team')
const valdemarne_had = require('./routes/api/Annuaire/ValDeMarne/had')
const valdemarne_lits = require('./routes/api/Annuaire/ValDeMarne/lits')
// Seine et Marne
const seineetmarne_usp = require('./routes/api/Annuaire/SeineEtMarne/usp')
const seineetmarne_reseaux = require('./routes/api/Annuaire/SeineEtMarne/reseaux')
const seineetmarne_association = require('./routes/api/Annuaire/SeineEtMarne/association')
const seineetmarne_team = require('./routes/api/Annuaire/SeineEtMarne/team')
const seineetmarne_had = require('./routes/api/Annuaire/SeineEtMarne/had')
const seineetmarne_lits = require('./routes/api/Annuaire/SeineEtMarne/lits')

// Essonne
const essonne_usp = require('./routes/api/Annuaire/Essonne/usp')
const essonne_reseaux = require('./routes/api/Annuaire/Essonne/reseaux')
const essonne_association = require('./routes/api/Annuaire/Essonne/association')
const essonne_team = require('./routes/api/Annuaire/Essonne/team')
const essonne_had = require('./routes/api/Annuaire/Essonne/had')
const essonne_lits = require('./routes/api/Annuaire/Essonne/lits')
// Hauts de Seine
const hautsdeseine_usp = require('./routes/api/Annuaire/HautsDeSeine/usp')
const hautsdeseine_reseaux = require('./routes/api/Annuaire/HautsDeSeine/reseaux')
const hautsdeseine_association = require('./routes/api/Annuaire/HautsDeSeine/association')
const hautsdeseine_team = require('./routes/api/Annuaire/HautsDeSeine/team')
const hautsdeseine_had = require('./routes/api/Annuaire/HautsDeSeine/had')
const hautsdeseine_lits = require('./routes/api/Annuaire/HautsDeSeine/lits')

// VEILLE MEDICALE

const veillemedicale_recommandation = require('./routes/api/veillemedicale/recommandations&outils')
const veillemedicale_rencontre = require('./routes/api/veillemedicale/rencontre')
const veillemedicale_evenement = require('./routes/api/veillemedicale/evenement')
const veillemedicale_actualite = require('./routes/api/veillemedicale/actualite')
const caroussel = require('./routes/api/HomePage/caroussel')
const adherent = require('./routes/api/HomePage/adherent')
const register_file = require('./routes/api/HomePage/Register_file')
// AGENDA
const agenda = require('./routes/api/HomePage//agenda')
// OFFRE DEMPLOI & FORMATIONS
const offresdemplois = require('./routes/api/offredemploi&formations/offredemploi')
const formations = require('./routes/api/offredemploi&formations/formations')
//NOTIFCATION
const agenda1 = require('./routes/api/HomePage/agenda1')
const agenda2 = require('./routes/api/HomePage/agenda2')
const offre = require('./routes/api/HomePage/offre')

// MAPS

const paris_maps_team = require('./routes/api/maps/Paris/team')
// Paris
// const paris_usp = require('./routes/api/Annuaire/Paris/usp')
// const paris_reseaux = require('./routes/api/Annuaire/Paris/reseaux')
// const paris_association = require('./routes/api/Annuaire/Paris/association')

// const paris_had = require('./routes/api/Annuaire/Paris/had')
// const paris_lits = require('./routes/api/Annuaire/Paris/lits')

// // Yvelines
// const yvelines_usp = require('./routes/api/Annuaire/Yvelines/usp')
// const yvelines_reseaux = require('./routes/api/Annuaire/Yvelines/reseaux')
// const yvelines_association = require('./routes/api/Annuaire/Yvelines/association')
// const yvelines_team = require('./routes/api/Annuaire/Yvelines/team')
// const yvelines_had = require('./routes/api/Annuaire/Yvelines/had')
// const yvelines_lits = require('./routes/api/Annuaire/Yvelines/lits')
// // Val d'Oise
// const valdoise_usp = require('./routes/api/Annuaire/ValDoise/usp')
// const valdoise_reseaux = require('./routes/api/Annuaire/ValDoise/reseaux')
// const valdoise_association = require('./routes/api/Annuaire/ValDoise/association')
// const valdoise_team = require('./routes/api/Annuaire/ValDoise/team')
// const valdoise_had = require('./routes/api/Annuaire/ValDoise/had')
// const valdoise_lits = require('./routes/api/Annuaire/ValDoise/lits')
// // Seine Saint Denis
// const seinesaintdenis_usp = require('./routes/api/Annuaire/SeineSaintDenis/usp')
// const seinesaintdenis_reseaux = require('./routes/api/Annuaire/SeineSaintDenis/reseaux')
// const seinesaintdenis_association = require('./routes/api/Annuaire/SeineSaintDenis/association')
// const seinesaintdenis_team = require('./routes/api/Annuaire/SeineSaintDenis/team')
// const seinesaintdenis_had = require('./routes/api/Annuaire/SeineSaintDenis/had')
// const seinesaintdenis_lits = require('./routes/api/Annuaire/SeineSaintDenis/lits')
// // Val de Marne
// const valdemarne_usp = require('./routes/api/Annuaire/ValDeMarne/usp')
// const valdemarne_reseaux = require('./routes/api/Annuaire/ValDeMarne/reseaux')
// const valdemarne_association = require('./routes/api/Annuaire/ValDeMarne/association')
// const valdemarne_team = require('./routes/api/Annuaire/ValDeMarne/team')
// const valdemarne_had = require('./routes/api/Annuaire/ValDeMarne/had')
// const valdemarne_lits = require('./routes/api/Annuaire/ValDeMarne/lits')
// // Seine et Marne
// const seineetmarne_usp = require('./routes/api/Annuaire/SeineEtMarne/usp')
// const seineetmarne_reseaux = require('./routes/api/Annuaire/SeineEtMarne/reseaux')
// const seineetmarne_association = require('./routes/api/Annuaire/SeineEtMarne/association')
// const seineetmarne_team = require('./routes/api/Annuaire/SeineEtMarne/team')
// const seineetmarne_had = require('./routes/api/Annuaire/SeineEtMarne/had')
// const seineetmarne_lits = require('./routes/api/Annuaire/SeineEtMarne/lits')

// // Essonne
// const essonne_usp = require('./routes/api/Annuaire/Essonne/usp')
// const essonne_reseaux = require('./routes/api/Annuaire/Essonne/reseaux')
// const essonne_association = require('./routes/api/Annuaire/Essonne/association')
// const essonne_team = require('./routes/api/Annuaire/Essonne/team')
// const essonne_had = require('./routes/api/Annuaire/Essonne/had')
// const essonne_lits = require('./routes/api/Annuaire/Essonne/lits')
// // Hauts de Seine
// const hautsdeseine_usp = require('./routes/api/Annuaire/HautsDeSeine/usp')
// const hautsdeseine_reseaux = require('./routes/api/Annuaire/HautsDeSeine/reseaux')
// const hautsdeseine_association = require('./routes/api/Annuaire/HautsDeSeine/association')
// const hautsdeseine_team = require('./routes/api/Annuaire/HautsDeSeine/team')
// const hautsdeseine_had = require('./routes/api/Annuaire/HautsDeSeine/had')
// const hautsdeseine_lits = require('./routes/api/Annuaire/HautsDeSeine/lits')

// Body parser middleware

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require('body-parser').text())

app.use('/api', express.static('uploads'))
app.use(flash())
// DB Config
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err))

// Passport middleware
app.use(passport.initialize())

// Passport Config
require('./config/passport')(passport)
app.use(cors())
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With'
	)
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
	next()
})
// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*')
// 	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
// 	if (req.method === 'OPTIONS') {
// 		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
// 		return res.status(200).json({})
// 	}
// 	next()
// })

// Use Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/profileadherent', Profile_adherent)
app.use('/api/posts', posts)
app.use('/api/uploads', express.static('uploads'))

// Annuaire Routes

// Paris
app.use('/api/annuaire/paris', paris_usp)
app.use('/api/annuaire/paris', paris_reseaux)
app.use('/api/annuaire/paris', paris_association)
app.use('/api/annuaire/paris', paris_team)
app.use('/api/annuaire/paris', paris_had)
app.use('/api/annuaire/paris', paris_lits)

// Yvelines
app.use('/api/annuaire/yvelines', yvelines_usp)
app.use('/api/annuaire/yvelines', yvelines_reseaux)
app.use('/api/annuaire/yvelines', yvelines_association)
app.use('/api/annuaire/yvelines', yvelines_team)
app.use('/api/annuaire/yvelines', yvelines_had)
app.use('/api/annuaire/yvelines', yvelines_lits)
// Val d'Oise
app.use('/api/annuaire/valdoise', valdoise_usp)
app.use('/api/annuaire/valdoise', valdoise_reseaux)
app.use('/api/annuaire/valdoise', valdoise_association)
app.use('/api/annuaire/valdoise', valdoise_team)
app.use('/api/annuaire/valdoise', valdoise_had)
app.use('/api/annuaire/valdoise', valdoise_lits)
// Seine Saint Denis
app.use('/api/annuaire/seinesaintdenis', seinesaintdenis_usp)
app.use('/api/annuaire/seinesaintdenis', seinesaintdenis_reseaux)
app.use('/api/annuaire/seinesaintdenis', seinesaintdenis_association)
app.use('/api/annuaire/seinesaintdenis', seinesaintdenis_team)
app.use('/api/annuaire/seinesaintdenis', seinesaintdenis_had)
app.use('/api/annuaire/seinesaintdenis', seinesaintdenis_lits)
// Val de Marne
app.use('/api/annuaire/valdemarne', valdemarne_usp)
app.use('/api/annuaire/valdemarne', valdemarne_reseaux)
app.use('/api/annuaire/valdemarne', valdemarne_association)
app.use('/api/annuaire/valdemarne', valdemarne_team)
app.use('/api/annuaire/valdemarne', valdemarne_had)
app.use('/api/annuaire/valdemarne', valdemarne_lits)
// Seine et Marne
app.use('/api/annuaire/seineetmarne', seineetmarne_usp)
app.use('/api/annuaire/seineetmarne', seineetmarne_reseaux)
app.use('/api/annuaire/seineetmarne', seineetmarne_association)
app.use('/api/annuaire/seineetmarne', seineetmarne_team)
app.use('/api/annuaire/seineetmarne', seineetmarne_had)
app.use('/api/annuaire/seineetmarne', seineetmarne_lits)
// Essonne
app.use('/api/annuaire/essonne', essonne_usp)
app.use('/api/annuaire/essonne', essonne_reseaux)
app.use('/api/annuaire/essonne', essonne_association)
app.use('/api/annuaire/essonne', essonne_team)
app.use('/api/annuaire/essonne', essonne_had)
app.use('/api/annuaire/essonne', essonne_lits)
// Hauts de Seine
app.use('/api/annuaire/hautsdeseine', hautsdeseine_usp)
app.use('/api/annuaire/hautsdeseine', hautsdeseine_reseaux)
app.use('/api/annuaire/hautsdeseine', hautsdeseine_association)
app.use('/api/annuaire/hautsdeseine', hautsdeseine_team)
app.use('/api/annuaire/hautsdeseine', hautsdeseine_had)
app.use('/api/annuaire/hautsdeseine', hautsdeseine_lits)

// Reset password
// VEILLE MEDICALE
// RECOMMANDATIONS ET OUTILS

app.use('/api/recommandation', veillemedicale_recommandation)
// Rencontres
app.use('/api/rencontre', veillemedicale_rencontre)
// Evenements
app.use('/api/evenement', veillemedicale_evenement)
// Actualites
app.use('/api/actualite', veillemedicale_actualite)
// Home Page
// Caroussel
app.use('/api/caroussel', caroussel)
// ADHERENT
app.use('/api/adherent', adherent)
// Formulaire d'admission
app.use('/api/register_file', register_file)
// Agenda
app.use('/api/agenda', agenda)
// Notifications
//AGENDA 1 & 	2
app.use('/api/agenda1', agenda1)
app.use('/api/agenda2', agenda2)
// Offre d'emploi & formations

app.use('/api/offre', offre)
app.use('/api/offres', offresdemplois)
app.use('/api/formations', formations)

//Maps
// Paris
// app.use('/api/maps/paris', paris_maps_usp)
// app.use('/api/maps/paris', paris_maps_reseaux)
// app.use('/api/maps/paris', paris_maps_association)
app.use('/api/maps/paris', paris_maps_team)
// app.use('/api/maps/paris', paris_maps_had)
// app.use('/api/maps/paris', paris_maps_lits)

// // Yvelines
// app.use('/api/maps/yvelines', yvelines_maps_usp)
// app.use('/api/maps/yvelines', yvelines_maps_reseaux)
// app.use('/api/maps/yvelines', yvelines_maps_association)
// app.use('/api/maps/yvelines', yvelines_maps_team)
// app.use('/api/maps/yvelines', yvelines_maps_had)
// app.use('/api/maps/yvelines', yvelines_maps_lits)
// // Val d'Oise
// app.use('/api/maps/valdoise', valdoise_maps_usp)
// app.use('/api/maps/valdoise', valdoise_maps_reseaux)
// app.use('/api/maps/valdoise', valdoise_maps_association)
// app.use('/api/maps/valdoise', valdoise_maps_team)
// app.use('/api/maps/valdoise', valdoise_maps_had)
// app.use('/api/maps/valdoise', valdoise_maps_lits)
// // Seine Saint Denis
// app.use('/api/maps/seinesaintdenis', seinesaintdenis_maps_usp)
// app.use('/api/maps/seinesaintdenis', seinesaintdenis_maps_reseaux)
// app.use('/api/maps/seinesaintdenis', seinesaintdenis_maps_association)
// app.use('/api/maps/seinesaintdenis', seinesaintdenis_maps_team)
// app.use('/api/maps/seinesaintdenis', seinesaintdenis_maps_had)
// app.use('/api/maps/seinesaintdenis', seinesaintdenis_maps_lits)
// // Val de Marne
// app.use('/api/maps/valdemarne', valdemarne_maps_usp)
// app.use('/api/maps/valdemarne', valdemarne_maps_reseaux)
// app.use('/api/maps/valdemarne', valdemarne_maps_association)
// app.use('/api/maps/valdemarne', valdemarne_maps_team)
// app.use('/api/maps/valdemarne', valdemarne_maps_had)
// app.use('/api/maps/valdemarne', valdemarne_maps_lits)
// // Seine et Marne
// app.use('/api/maps/seineetmarne', seineetmarne_maps_usp)
// app.use('/api/maps/seineetmarne', seineetmarne_maps_reseaux)
// app.use('/api/maps/seineetmarne', seineetmarne_maps_association)
// app.use('/api/maps/seineetmarne', seineetmarne_maps_team)
// app.use('/api/maps/seineetmarne', seineetmarne_maps_had)
// app.use('/api/maps/seineetmarne', seineetmarne_maps_lits)
// // Essonne
// app.use('/api/maps/essonne', essonne_maps_usp)
// app.use('/api/maps/essonne', essonne_maps_reseaux)
// app.use('/api/maps/essonne', essonne_maps_association)
// app.use('/api/maps/essonne', essonne_maps_team)
// app.use('/api/maps/essonne', essonne_maps_had)
// app.use('/api/maps/essonne', essonne_maps_lits)
// // Hauts de Seine
// app.use('/api/maps/hautsdeseine', hautsdeseine_maps_usp)
// app.use('/api/maps/hautsdeseine', hautsdeseine_maps_reseaux)
// app.use('/api/maps/hautsdeseine', hautsdeseine_maps_association)
// app.use('/api/maps/hautsdeseine', hautsdeseine_maps_team)
// app.use('/api/maps/hautsdeseine', hautsdeseine_maps_had)
// app.use('/api/maps/hautsdeseine', hautsdeseine_maps_lits)

// Adherents Stripe

app.post('/api/charge', async (req, res) => {
	try {
		let { status } = await stripe.charges.create({
			amount: 1500,
			currency: 'eur',
			description: "Frais annuel d'adhesion",
			source: req.body
		})

		res.json({ status })
	} catch (err) {
		res.status(500).end()
	}
})
app.post('/api/charge50', async (req, res) => {
	try {
		let { status } = await stripe.charges.create({
			amount: 5000,
			currency: 'eur',
			description: "Frais annuel d'adhesion",
			source: req.body
		})

		res.json({ status })
	} catch (err) {
		res.status(500).end()
	}
})
app.listen(80, function() {
	console.log('CORS-enabled web server listening on port 80')
})
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
