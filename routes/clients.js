const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Get all clients
router.get('/', clientController.getClients);

// Create a new client
router.post('/', clientController.createClient);

// Get single client
router.get('/:id', clientController.getClientById);

// Update client
router.put('/:id', clientController.updateClient);

// Delete client
router.delete('/:id', clientController.deleteClient);

module.exports = router;
