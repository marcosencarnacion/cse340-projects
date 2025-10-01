// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Route to handle a request for a single vehicle
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
)

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to handle add classification form submission (with validation)
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Route to handle add inventory form submission (with validation)
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to get inventory as JSON for AJAX request
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventoryView)
)

// Route to handle inventory update
router.post(
  "/update",
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router
