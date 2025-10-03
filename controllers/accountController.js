const accountModel = require("../models/account-model")
const utilities = require("../utilities")
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
*  Deliver account update view
* *************************************** */
accountController.buildUpdateAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  console.log("DEBUG buildUpdateAccount:")
  console.log("  - account_id from params:", account_id)
  console.log("  - session accountData:", req.session.accountData)
  console.log("  - flash messages:", req.flash("notice"))
  
  // Verify the logged-in user is updating their own account
  if (req.session.accountData.account_id !== account_id) {
    req.flash("notice", "You can only update your own account.")
    return res.redirect("/account/")
  }

  const accountData = await accountModel.getAccountById(account_id)
  console.log("DEBUG - accountData from DB:", accountData)
  
  res.render("account/update", {
    title: "Update Account",
    nav,
    messages: req.flash("notice") || null, // ADDED: Pass messages to view
    errors: null,
    accountData,
  })
}

/* ****************************************
*  Process account update
* *************************************** */
accountController.updateAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  try {
    // Verify the logged-in user is updating their own account
    if (req.session.accountData.account_id !== parseInt(account_id)) {
      req.flash("notice", "You can only update your own account.")
      return res.redirect("/account/")
    }

    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      // Update session data
      req.session.accountData.account_firstname = account_firstname
      req.session.accountData.account_lastname = account_lastname
      req.session.accountData.account_email = account_email
      
      req.flash("notice", "Account updated successfully!")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the account update failed.")
      return res.status(501).render("account/update", {
        title: "Update Account",
        nav,
        messages: req.flash("notice") || null, // ADDED: Pass messages
        errors: null,
        accountData: req.body
      })
    }
  } catch (err) {
    console.error("Error updating account:", err)
    req.flash("notice", "An error occurred during account update.")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      messages: req.flash("notice") || null, // ADDED: Pass messages
      errors: null,
      accountData: req.body
    })
  }
}

/* ****************************************
*  Process password update
* *************************************** */
accountController.updatePassword = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    // Verify the logged-in user is updating their own account
    if (req.session.accountData.account_id !== parseInt(account_id)) {
      req.flash("notice", "You can only update your own account.")
      return res.redirect("/account/")
    }

    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash("notice", "Password updated successfully!")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the password update failed.")
      return res.status(501).render("account/update", {
        title: "Update Account",
        nav,
        messages: req.flash("notice") || null, // ADDED: Pass messages
        errors: null,
        accountData: await accountModel.getAccountById(account_id)
      })
    }
  } catch (err) {
    console.error("Error updating password:", err)
    req.flash("notice", "An error occurred during password update.")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      messages: req.flash("notice") || null, // ADDED: Pass messages
      errors: null,
      accountData: await accountModel.getAccountById(account_id)
    })
  }
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
      return res.status(201).render("account/login", { 
        title: "Login", 
        nav, 
        errors: null 
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      return res.status(501).render("account/register", { 
        title: "Registration", 
        nav, 
        errors: null 
      })
    }
  } catch (err) {
    console.error("Error registering account:", err)
    req.flash("notice", "An error occurred during registration.")
    return res.status(500).render("account/register", { 
      title: "Registration", 
      nav, 
      errors: null 
    })
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
    return res.status(400).render("account/login", { 
      title: "Login", 
      nav, 
      errors: null, 
      account_email 
    })
  }

  try {
    const isMatch = await bcrypt.compare(account_password, accountData.account_password)

    if (isMatch) {
      delete accountData.account_password

      // Save to session
      req.session.accountData = accountData

      req.flash("notice", "Login successful!")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", { 
        title: "Login", 
        nav, 
        errors: null, 
        account_email 
      })
    }
  } catch (error) {
    console.error(error)
    req.flash("notice", "Login failed due to server error.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
accountController.accountLogout = async function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err)
    }
    res.redirect("/")
  })
}

/* ***************************
 * Deliver Account Management view
 * ************************** */
accountController.buildAccountManagement = async function (req, res) {
  let nav = await utilities.getNav()
  const accountData = req.session.accountData

  res.render("account/management", {
    title: "Account Management",
    nav,
    messages: req.flash("notice"),
    errors: null,
    accountData,
  })
}

module.exports = accountController