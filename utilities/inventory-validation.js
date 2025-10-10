const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const utilities = require(".")

const validate = {}

/* ***************************
 * Classification Validation Rules
 * ************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Classification name must be at least 2 characters long")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Classification name may only contain letters and spaces"),
  ]
}

/* ***************************
 * Inventory Validation Rules
 * ************************** */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required"),

    body("inv_make")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Make must be at least 2 characters long"),

    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Model must be at least 2 characters long"),

    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Enter a valid year between 1900 and 2099"),

    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required"),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required"),

    body("inv_price")
      .isFloat({ min: 0.01 })
      .withMessage("Price must be a valid number greater than 0"),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a valid number greater than or equal to 0"),

    // ✅ New validation for stock
    body("inv_amount")
      .optional({ checkFalsy: true }) // optional if not provided
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer (0 or higher)"),

    // ✅ Allow letters, spaces, and numbers in color
    body("inv_color")
      .trim()
      .matches(/^[A-Za-z\s0-9]+$/)
      .withMessage("Color may only contain letters, numbers, and spaces"),
  ]
}

/* ***************************
 * Check Data and Return Errors
 * ************************** */
validate.checkClassificationData = async (req, res, next) => {
  let nav = await utilities.getNav()
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name,
    })
  }
  next()
}

/* ***************************
 * Check Add Inventory Data and Return Errors
 * ************************** */
validate.checkInventoryData = async (req, res, next) => {
  let nav = await utilities.getNav()
  const classifications = await invModel.getClassifications()
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classifications: classifications.rows,
      errors: errors.array(),
      vehicleData: req.body,
    })
  }
  next()
}

/* ******************************
 * Check Update Inventory Data and Return Errors
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  let nav = await utilities.getNav()
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_amount
    } = req.body

    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_amount
    })
  }
  next()
}

module.exports = validate
