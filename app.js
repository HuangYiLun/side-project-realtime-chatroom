//非production環境下，使用dotenv取得.env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const routes = require('./routes')
//連接mongodb
require('./config/mongoose')

const app = express()
const port = process.env.PORT


//setting template engine
app.engine('hbs', exphbs.engine({extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(routes)

app.listen(port, () => {
  console.log( `app is running on http://localhost:${port}`)
})



