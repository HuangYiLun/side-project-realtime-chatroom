const helpers = require('../helpers/auth-helper')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    console.log('驗證成功')
    return next()
  }
  console.log('驗證未成功')
  return res.redirect('/signin')
}


module.exports = {
  authenticated
}