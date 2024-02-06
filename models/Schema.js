const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Adjust roles as needed
    default: 'user'
  }
});

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  interests: [String],
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leads'
  },
  phone_number: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Leads Schema
const leadsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  interests: [String],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['in_progress', 'declined', 'completed', 'inactive', 'pending'],
    default: 'pending'
  }
});

// Interactions Schema
const interactionsSchema = new mongoose.Schema({
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leads',
    required: true
  },
  interaction_type: {
    type: String,
    required: true
  },
  comment: String,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Define models
const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Leads = mongoose.model('Leads', leadsSchema);
const Interactions = mongoose.model('Interactions', interactionsSchema);

module.exports = { User, Customer, Leads, Interactions };
