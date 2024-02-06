const express = require('express');
const router = express.Router();
// const mongooseConnection = require('../config/db');
const { Leads, Interactions, Customer } = require('../models/Schema'); // Adjust the path as needed
const authenticateToken = require('./middlewares/authenticateToken');

// Create a new lead
router.post('/', authenticateToken, async (req, res) => {
  try {
    const lead = await Leads.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all leads
router.get('/', authenticateToken, async (req, res) => {
  console.log(req.query);
  console.log(req.body);
  try {
    let leads = {};
    if(req.query.status) {
      leads = await Leads.find({"created_by":req.body.created_by, "status": req.query.status});
    } else {
      leads = await Leads.find({"created_by":req.body.created_by});
    }
    // console.log(leads);
    res.status(200).json(leads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific lead by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Leads.findById(req.params.id);
    if (lead) {
      res.status(200).json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific lead by ID
router.get('/:id/interactions', authenticateToken, async (req, res) => {
  try {
    const lead = await Leads.findById(req.params.id);
    if (lead) {
      const interactions = await Interactions.find({lead_id:lead._id});
      res.status(200).json(interactions);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new interaction
router.post('/:id/interactions', authenticateToken, async (req, res) => {
  try {
    const lead = await Leads.findById(req.params.id);
    if (lead) {
      data = {...req.body, lead_id: req.params.id};
      const interaction = await Interactions.create(data);      
    }
    const interactions = await Interactions.find({lead_id:lead._id});
    res.status(201).json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/:id/customer', authenticateToken, async (req, res) => {
  try {
    const lead = await Leads.findById(req.params.id);
    if (lead) {
      data = {
        ...req.body, 
        lead_id: req.params.id, 
        name:lead.name,
        email:lead.email,
        interests:lead.interests,
      };
      await Leads.findByIdAndUpdate(req.params.id, {status:"completed"});
      const customer = await Customer.create(data);      
    }
    // const customers = await Customer.find({lead_id:lead._id});
    res.status(201).json({success:true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a lead by ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Leads.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (lead) {
      res.status(200).json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a lead by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Leads.findByIdAndDelete(req.params.id);
    if (lead) {
      res.status(200).json({ message: 'Lead deleted successfully' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
