const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")  
const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build view by inventory id
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getVehicleByInventoryId(inv_id)
  const grid = await utilities.buildVehicleDetailGrid(data)
  let nav = await utilities.getNav()
  const vehicleTitle = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    grid,
  })
}

/* ***************************
 * Build inventory management view
 * ************************** */
invController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message: req.flash("notice"), // <-- show flash messages
  })
}

/* ***************************
 * Build inventory management view
 * ************************** */
invController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message: req.flash("notice"), // <-- show flash messages
  })
}

/* ****************************************
*  Deliver Add Classification View
* *************************************** */
invController.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Add Classification
* *************************************** */
invController.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()

  try {
    const data = await invModel.addClassification(classification_name)
    if (data) {
      req.flash("notice", `The ${classification_name} classification was successfully added.`)
      res.redirect("/inv/") // back to management view
    } else {
      req.flash("notice", "Sorry, the insert failed.")
      res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    console.error("addClassification controller error:", error)
    req.flash("notice", "There was an error processing the request.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

module.exports = invController