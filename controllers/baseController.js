const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

/* ***************************
 * Build Error view
 * ************************** */
baseController.buildError = async function (req, res, next) {
  throw new Error("Oh no! There was a crash. Maybe try a different route?")
}

module.exports = baseController