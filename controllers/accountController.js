const accountModel = require("../models/account-model")
const utilities = require("../utilities")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult.rowCount > 0) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
      return res.status(201).render("account/login", { title: "Login", nav, errors: null })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      return res.status(501).render("account/register", { title: "Registration", nav, errors: null })
    }
  } catch (err) {
    console.error("Error registering account:", err)
    req.flash("notice", "An error occurred during registration.")
    return res.status(500).render("account/register", { title: "Registration", nav, errors: null })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
  }

  try {
    const isMatch = await bcrypt.compare(account_password, accountData.account_password)
    console.log("DEBUG - bcrypt compare result:", isMatch)

    if (isMatch) {
      delete accountData.account_password

      // ✅ Save to session
      req.session.accountData = accountData

      req.flash("notice", "Login successful!")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
    }
  } catch (error) {
    console.error(error)
    req.flash("notice", "Login failed due to server error.")
    return res.redirect("/account/login")
  }
}

/* ***************************
 * Deliver Account Management view
 * ************************** */
accountController.buildAccountManagement = async function (req, res) {
  let nav = await utilities.getNav()
  const accountData = req.session.accountData // ✅ pull from session

  res.render("account/management", {
    title: "Account Management",
    nav,
    messages: req.flash("notice"),
    errors: null,
    accountData,
  })
}

module.exports = accountController
