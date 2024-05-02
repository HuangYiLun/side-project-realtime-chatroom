const express = require("express")
const router = express.Router()
const passport = require("../../../config/passport")
const userController = require("../../../controllers/user-controller")

// 登入
router
  .route("/signin")
  .get(userController.getSignIn)
  .post(
    passport.authenticate("local", { failureRedirect: "/signin" }),
    userController.signIn
  )

// 登出
router.post("/signout", userController.signOut)

// 註冊
router
  .route("/signup")
  .get(userController.getSignUp)
  .post(userController.signUp)

module.exports = router
