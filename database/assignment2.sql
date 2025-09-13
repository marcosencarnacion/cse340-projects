-- First Query: Insert Data into 'account' table 
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Second Query: Update data from the 'account' table 
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- Third Query: Delete 'Tony Stark' record from Database using Primary Key 
DELETE FROM account
WHERE account_id = 2;
-- Fourth Query: Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query. 
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Fifth Query: -- Select make, model, and classification name for "Sport" inventory items using INNER JOIN (expected result: 2 rows)
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- Sixth Query: -- Update inv_image and inv_thumbnail to include "/vehicles" in their file paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');