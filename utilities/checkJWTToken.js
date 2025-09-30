const jwt = require("jsonwebtoken")
require("dotenv").config()

async function checkJWTToken(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = decoded // pass user data to views
    next()
  } catch (err) {
    console.error("JWT verification failed:", err)
    req.flash("notice", "Session expired. Please log in again.")
    res.clearCookie("jwt")
    return res.redirect("/account/login")
  }
}

module.exports = checkJWTToken
