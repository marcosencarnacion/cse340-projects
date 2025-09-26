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
  utilities.handleErrors(invController.buildManagement) // NEW: Management view route
)

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement)) // NEW

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification)) // NEW

// Route to handle add classification form submission
router.post("/add-classification", utilities.handleErrors(invController.addClassification)) // NEW

module.exports = router;