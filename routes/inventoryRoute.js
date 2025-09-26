// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to handle a request for a single vehicle.
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

router.get(
  "/", // site-name/inv/
  utilities.handleErrors(invController.buildManagement)
)

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement)) 

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to handle add classification form submission
router.post("/add-classification", utilities.handleErrors(invController.addClassification)) 

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory)) 

// Route to handle add inventory form submission
router.post("/add-inventory", utilities.handleErrors(invController.addInventory))

module.exports = router;