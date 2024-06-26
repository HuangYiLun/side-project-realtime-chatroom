const helpers = require("../helpers/auth-helper")

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  return res.redirect("/signin")
}

const authSignIn = (req, res, next) => {
  if (!helpers.ensureAuthenticated(req)) {
    return next()
  }
  return res.redirect("/")
}

module.exports = {
  authenticated,
  authSignIn,
}
