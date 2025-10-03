const utilities = require("./")
const { body, validationResult } = require("express-validator")

const regValidate = {}

/* **********************************
 * Registration Data Validation Rules
 ********************************* */
regValidate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* **********************************
 * Login Data Validation Rules
 ********************************* */
regValidate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    
    body("account_password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("A valid password is required."),
  ]
}

/* **********************************
 * Account Update Validation Rules
 ********************************* */
regValidate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ]
}

/* **********************************
 * Password Update Validation Rules
 ********************************* */
regValidate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage("Password must be at least 8 characters with at least one number, one uppercase and one lowercase letter."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 ***************************** */
regValidate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors: errors.array(),
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check login data
 ***************************** */
regValidate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check account update data
 ***************************** */
regValidate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = { account_id, account_firstname, account_lastname, account_email }
    res.render("account/update", {
      errors: errors.array(),
      title: "Update Account",
      nav,
      accountData,
    })
    return
  }
  next()
}

/* ******************************
 * Check password update data
 ***************************** */
regValidate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // Fix this line - use accountModel instead of utilities
    const accountModel = require("../models/account-model")
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      errors: errors.array(),
      title: "Update Account",
      nav,
      accountData,
    })
    return
  }
  next()
}

module.exports = regValidate