
const express = require('express');
// const mongooseConnection = require('../config/db');
const { User, Leads, Interactions, Customer } = require('../models/Schema'); // Adjust the path as needed
const authenticateToken = require('./middlewares/authenticateToken');

const router = express.Router();

/* GET home page. */
router.get('/', authenticateToken, async function(req, res) {

    leadStatusAggregate = await Leads.aggregate([
        {$group:{
            _id:{status:"$status"},
            count:{$sum:1}
        }}
    ]);
    let leadStatusCounts = [];
    leadStatusAggregate.forEach(element => {
        leadStatusCounts.push({"status":element._id.status,"count": element.count});
    });

    // get interactions count
    interactionsStatusAggregate = await Interactions.aggregate([
        {$group:{
            _id:{interaction_type:"$interaction_type"},
            count:{$sum:1}
        }}
    ]);
    let interactionCounts = [];
    interactionsStatusAggregate.forEach(element => {
        interactionCounts.push({"interaction_type":element._id.interaction_type,"count": element.count});
    });

    // get mails sent by day
    let emailCounts = [];
    interactionsStatusAggregate = await Interactions.aggregate([
        {
          "$group": {
            "_id": {
                $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
            },
            "count": {
                $sum: { "$cond": [{"$eq": ["$interaction_type", "email"]}, 1, 0] }
            },
          }
        }
    ]);
    interactionsStatusAggregate.forEach(element => {
        emailCounts.push({"date":element._id,"count": element.count});
    });

    // get conversions for each day
    let customerCreatedCounts = [];
    interactionsStatusAggregate = await Customer.aggregate([
        {
          "$group": {
            "_id": {
                $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
            },
            "count": {$sum: 1},
          }
        }
    ]);
    interactionsStatusAggregate.forEach(element => {
        customerCreatedCounts.push({"date":element._id,"count": element.count});
    });

    // get total conversions
    let totalLeads = await Leads.find().count();
    let totalCustomers = await Customer.find().count();
    let totalEmails = await Interactions.find({"interaction_type":"email"}).count();

    res.status(200).json({ 
        totalLeads:             totalLeads,
        totalCustomers:         totalCustomers,
        totalEmails:            totalEmails,

        leadStatusCounts:       leadStatusCounts,
        interactionCounts:      interactionCounts,
        emailCounts:            emailCounts,
        customerCreatedCounts:   customerCreatedCounts
    });
});

module.exports = router;
