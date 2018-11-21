const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const env = require('dotenv').config()
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')
const app = express()

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
const hautsdeseine_team = require('./routes/api/Annuaire/HautsDeSeine/structure')
const hautsdeseine_had = require('./routes/api/Annuaire/HautsDeSeine/had')
const hautsdeseine_lits = require('./routes/api/Annuaire/HautsDeSeine/lits')
// Reset password
// VEILLE MEDICALE
// RECOMMANDATIONS ET OUTILS
const veillemedicale_recommandation = require('./routes/api/veillemedicale/recommandations&outils')
const caroussel = require('./routes/api/HomePage/caroussel')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', express.static('uploads'))

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

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
		return res.status(200).json({})
	}
	next()
})

// Use Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
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
// Home Page
// Caroussel

app.use('/api/caroussel', caroussel)
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
