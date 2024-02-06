const express = require('express');
const router = express.Router();
// const mongooseConnection = require('../config/db');
const { Customer } = require('../models/Schema'); // Adjust the path as needed
const authenticateToken = require('./middlewares/authenticateToken');

// Create a new customer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all customers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific customer by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a customer by ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a customer by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (customer) {
      res.status(200).json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
