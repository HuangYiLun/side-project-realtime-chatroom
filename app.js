//非production環境下，使用dotenv取得.env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const session = require('express-session')
const flash = require('connect-flash')

const routes = require('./routes')
//連接mongodb
require('./config/mongoose')

const app = express()
const port = process.env.PORT
const SESSION_SECRET = process.env.SESSION_SECRET


//setting template engine
app.engine('hbs', exphbs.engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

// setting body-parser
app.use(express.urlencoded({ extended: true }))

// setting passport
app.use(passport.initialize())
app.use(passport.session())

// setting middleware
app.use(flash())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.danger_msg = req.flash('danger_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.info_msg = req.flash('info_msg')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})



