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
    message: req.flash("notice"),
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
    classification_name: "", // default empty for sticky forms
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
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the insert failed.")
      res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        classification_name, // sticky
      })
    }
  } catch (error) {
    console.error("addClassification controller error:", error)
    req.flash("notice", "There was an error processing the request.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name, // sticky
    })
  }
}

/* ****************************************
*  Deliver Add Inventory View
* *************************************** */
invController.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classifications = await invModel.getClassifications()
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classifications: classifications.rows,
    errors: null,
    vehicleData: {}, // default empty
  })
}

/* ****************************************
*  Process Add Inventory
* *************************************** */
invController.addInventory = async function (req, res, next) {
  const vehicleData = req.body
  let nav = await utilities.getNav()
  try {
    const data = await invModel.addInventory(vehicleData)
    if (data) {
      req.flash("notice", `The ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model} was successfully added.`)
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the insert failed.")
      res.status(500).render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classifications: (await invModel.getClassifications()).rows,
        errors: null,
        vehicleData, // sticky
      })
    }
  } catch (error) {
    console.error("addInventory controller error:", error)
    req.flash("notice", "There was an error processing the request.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classifications: (await invModel.getClassifications()).rows,
      errors: null,
      vehicleData, // sticky
    })
  }
}

/* ***************************
 * Build inventory management view with classification list
 * ************************** */
invController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null,
    message: req.flash("notice"),
  })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData.length > 0) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invController.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

module.exports = invController
