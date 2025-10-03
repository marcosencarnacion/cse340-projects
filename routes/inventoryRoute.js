// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")
const authMiddleware = require("../utilities/auth-middleware")

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

// Route to build inventory management view - PROTECTED
router.get(
  "/", 
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
)

// Route to build add classification view - PROTECTED
router.get(
  "/add-classification",
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to handle add classification form submission (with validation) - PROTECTED
router.post(
  "/add-classification",
  authMiddleware.isEmployeeOrAdmin,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view - PROTECTED
router.get(
  "/add-inventory",
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

// Route to handle add inventory form submission (with validation) - PROTECTED
router.post(
  "/add-inventory",
  authMiddleware.isEmployeeOrAdmin,
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to get inventory as JSON for AJAX request - PROTECTED
router.get(
  "/getInventory/:classification_id",
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build edit inventory view - PROTECTED
router.get(
  "/edit/:inv_id",
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventoryView)
)

// Route to handle inventory update - PROTECTED
router.post(
  "/update",
  authMiddleware.isEmployeeOrAdmin,
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build delete confirmation view - PROTECTED
router.get(
  "/delete/:inv_id",
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteConfirm)
)

// Route to handle the actual deletion - PROTECTED
router.post(
  "/delete/",
  authMiddleware.isEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router