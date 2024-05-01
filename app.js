//非production環境下，使用dotenv取得.env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}
const express = require("express")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const passport = require("./config/passport")
const session = require("express-session")
const flash = require("connect-flash")
const handlebarsHelpers = require("./helpers/handlebars-helper")
const helpers = require("./helpers/auth-helper")
// const routes = require("./routes/pages")
const { pages, apis } = require("./routes")
const onlyForHandshake = require("./utilities/socketio-passport")

//連接mongodb
require("./config/mongoose")

const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server, {
  connectionStateRecovery: {},
})

const port = process.env.PORT
const SESSION_SECRET = process.env.SESSION_SECRET
//setting handlebars
const hbs = exphbs.create({
  extname: ".hbs",
  helpers: handlebarsHelpers,
})

//setting template engine
app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")

// setting body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
})
app.use(sessionMiddleware)

// setting passport
app.use(passport.initialize())
app.use(passport.session())

// setting middleware
app.use(flash())
app.use(methodOverride("_method"))
app.use((req, res, next) => {
  res.locals.danger_msg = req.flash("danger_msg")
  res.locals.success_msg = req.flash("success_msg")
  res.locals.warning_msg = req.flash("warning_msg")
  res.locals.info_msg = req.flash("info_msg")
  res.locals.loginUser = helpers.getUser(req)
  next()
})

// socketio 取得 passport session
io.engine.use(onlyForHandshake(sessionMiddleware))
io.engine.use(onlyForHandshake(passport.session()))
io.engine.use(
  onlyForHandshake((req, res, next) => {
    if (req.user) {
      next()
    } else {
      res.writeHead(401)
      res.end()
    }
  })
)
require("./socket/socket")(io)

// app.use(routes)
app.use("/api", apis)
app.use(pages)

server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`)
})
