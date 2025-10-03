/* ***************************
 *  Authorization Middleware
 * **************************/
const utilities = require("./")

const authMiddleware = {}

//Middleware to check if the user is logged in
authMiddleware.isLoggedIn = (req, res, next) => {
    if (req.session.accountData) {
        next()
    } else {
        req.flash("notice", "Please log in to access this page.")
        return res.redirect('/account/login')
    }
}

// Middleware to check if user is Employee or Admin
authMiddleware.isEmployeeOrAdmin = (req, res, next) => {
  if (req.session.accountData && 
      (req.session.accountData.account_type === 'Employee' || 
       req.session.accountData.account_type === 'Admin')) {
    next()
  } else {
    req.flash("notice", "Access denied. Employee or Admin privileges required.")
    return res.redirect('/account/login')
  }
}

module.exports = authMiddleware

