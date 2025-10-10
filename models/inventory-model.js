const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getvehiclebyinventoryid error " + error)
  }
}

/* ***************************
 *  Find existing vehicle by key attributes
 *  Matching criteria: inv_make, inv_model, inv_year, classification_id
 *  (case-insensitive for make/model)
 * ************************** */
async function findVehicleByAttributes(inv_make, inv_model, inv_year, classification_id) {
  try {
    const sql = `
      SELECT * FROM public.inventory
      WHERE LOWER(inv_make) = LOWER($1)
        AND LOWER(inv_model) = LOWER($2)
        AND inv_year = $3
        AND classification_id = $4
      LIMIT 1;
    `
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, classification_id])
    return data.rows[0]
  } catch (error) {
    console.error("findVehicleByAttributes error: " + error)
  }
}

/* ***************************
 *  Increment inventory amount (add stock)
 * ************************** */
async function incrementInventory(inv_id, amount) {
  try {
    // amount should be positive; caller should validate
    const sql = `
      UPDATE public.inventory
      SET inv_amount = inv_amount + $1
      WHERE inv_id = $2
      RETURNING *;
    `
    const data = await pool.query(sql, [amount, inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("incrementInventory error: " + error)
    throw error
  }
}

/* ***************************
 *  Insert new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    console.error("addClassification error: " + error)
  }
}

/* ***************************
 *  Insert new vehicle
 * ************************** */
async function addInventory(vehicleData) {
  try {
    const sql = `
      INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_amount)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`
    const data = await pool.query(sql, [
      vehicleData.inv_make,
      vehicleData.inv_model,
      vehicleData.inv_year,
      vehicleData.inv_description,
      vehicleData.inv_image,
      vehicleData.inv_thumbnail,
      vehicleData.inv_price,
      vehicleData.inv_miles,
      vehicleData.inv_color,
      vehicleData.classification_id,
      vehicleData.inv_amount || 0
    ])
    return data.rows[0]
  } catch (error) {
    console.error("addInventory error: " + error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  inv_amount,
  classification_id
) {
  try {
    const sql =
      `UPDATE public.inventory 
       SET inv_make = $1,
           inv_model = $2,
           inv_description = $3,
           inv_image = $4,
           inv_thumbnail = $5,
           inv_price = $6,
           inv_year = $7,
           inv_miles = $8,
           inv_color = $9,
           inv_amount = $10,
           classification_id = $11
       WHERE inv_id = $12
       RETURNING *`
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_amount,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
    try {
        console.log("Model: Attempting to delete inventory ID:", inv_id);
        const sql = 'DELETE FROM inventory WHERE inv_id = $1';
        const result = await pool.query(sql, [inv_id]);
        console.log("Model: Delete query executed, rowCount:", result.rowCount);
        return result.rowCount; // Returns 1 if successful, 0 if failed
    } catch (error) {
        console.error("Delete Inventory Error", error);
        throw new Error("Delete Inventory Error");
    }
}

/* ***************************
 *  Decrease Inventory Amount
 * ************************** */
async function decreaseInventory(inv_id) {
  try {
    const sql = `
    UPDATE inventory
    SET inv_amount = inv_amount - 1
    WHERE inv_id = $1 
    and inv_amount > 0
    RETURNING *;
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error decreasing inventory:", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleByInventoryId,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventoryItem,
  decreaseInventory,
  findVehicleByAttributes,
  incrementInventory
}