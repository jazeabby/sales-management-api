const express = require('express');
const router = express.Router();
// const mongooseConnection = require('../config/db');
const { Interactions } = require('../models/Schema'); // Adjust the path as needed
const authenticateToken = require('./middlewares/authenticateToken');

// Create a new interaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const interaction = await Interactions.create(req.body);
    res.status(201).json(interaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all interactions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const interactions = await Interactions.find();
    res.status(200).json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific interaction by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const interaction = await Interactions.findById(req.params.id);
    if (interaction) {
      res.status(200).json(interaction);
    } else {
      res.status(404).json({ message: 'Interaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an interaction by ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const interaction = await Interactions.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (interaction) {
      res.status(200).json(interaction);
    } else {
      res.status(404).json({ message: 'Interaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an interaction by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const interaction = await Interactions.findByIdAndRemove(req.params.id);
    if (interaction) {
      res.status(200).json({ message: 'Interaction deleted successfully' });
    } else {
      res.status(404).json({ message: 'Interaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
