const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const authMiddleware = require("../utilities/auth-middleware")

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Default account management view - requires login
router.get("/", authMiddleware.isLoggedIn, utilities.handleErrors(accountController.buildAccountManagement))

// Account update view - requires login
router.get("/update/:account_id", authMiddleware.isLoggedIn, utilities.handleErrors(accountController.buildUpdateAccount))

// Process account update - requires login
router.post(
  "/update",
  authMiddleware.isLoggedIn,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update - requires login
router.post(
  "/update-password",
  authMiddleware.isLoggedIn,
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Logout route
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Temporary test route - add this to your accountRoute.js
router.get("/test-db/:account_id", async (req, res) => {
  const account_id = parseInt(req.params.account_id)
  console.log("Testing DB for account_id:", account_id)
  
  try {
    const accountData = await accountModel.getAccountById(account_id)
    console.log("DB Result:", accountData)
    res.json({
      success: true,
      accountData: accountData,
      message: accountData ? "Account found" : "Account not found"
    })
  } catch (error) {
    console.error("DB Error:", error)
    res.json({
      success: false,
      error: error.message
    })
  }
})

module.exports = router