const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

// Get all assets (global view)
router.get('/', assetController.getAllAssets);

// Get assets for a specific client
router.get('/client/:clientId', assetController.getAssets);

// Create a new asset
router.post('/', assetController.createAsset);

// Reveal asset credentials
router.get('/reveal/:id', assetController.revealAsset);

// Update an asset
router.put('/:id', assetController.updateAsset);

// Renew an asset
router.put('/renew/:id', assetController.renewAsset);

module.exports = router;
