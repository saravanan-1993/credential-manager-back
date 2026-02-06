const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Get all projects
router.get('/', projectController.getProjects);

// Create a new project
router.post('/', projectController.createProject);

// Get single project
router.get('/:id', projectController.getProjectById);

// Update project
router.put('/:id', projectController.updateProject);

// Delete project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
