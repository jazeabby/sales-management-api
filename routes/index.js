
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
// const mongooseConnection = require('../config/db');
const { User, Leads, Interactions } = require('../models/Schema'); // Adjust the path as needed
const authenticateToken = require('./middlewares/authenticateToken');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({ title: 'Healthy' });
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    console.log(process.env.JWT_KEY);
    const token = jwt.sign({ userId: user._id, userEmail: user.email }, process.env.JWT_KEY, { expiresIn: '24h' });

    res.status(200).json({ user:{"name":user.name, "email":user.email, "role":user.role}, token:token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create a new interaction
router.post('/send-emails', authenticateToken, async (req, res) => {
  try {

    // res.status(201).json({success:true});
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2adb1b7fba573a",
        pass: "1f481c5c3fe0f3"
      }
    });
    // const transporter = nodemailer.createTransport({
    //   host: 'sandbox.smtp.mailtrap.io',
    //   port: 2525,
    //   auth: {
    //       user: process.env.USER, // generated mailtrap user
    //       pass: process.env.PASSWORD, // generated mailtrap password
    //   }
    // });
    // generate email body using Mailgen
    const MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "Test Email",
            link: 'https://mailgen.js/'
        }
    });
    let leadStatus = req.query.status ?? "pending";
    let leadIds = req.body.leads ?? [];
    let leads = {};
    if(leadIds) {
      leads = await Leads.find({"_id":{"$in": leadIds}});
      console.log(leads);
      console.log("in leads");
    } else {
      leads = await Leads.find({"created_by":req.body.created_by, "status": leadStatus});
      console.log("not in leads");
    }


    let emailSubject = req.body.subject ?? req;
    await leads.forEach((lead) => {
      data = {...req.body, lead_id: lead._id};
      const email = {
        body : {
            name: lead.name,
            intro : req.body.content || 'Welcome to Test Mail! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
      }
      const emailBody = MailGenerator.generate(email);
      // send mail with defined transport object
      const mailOptions = {
          from: process.env.EMAIL,
          to: lead.email,
          cc: req.body.cc,
          bcc: req.body.bcc,
          subject: emailSubject,
          html: emailBody
      };
      data.interaction_type = 'email';
      data.lead_id = lead._id;
      transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            data.comment = "Failed to send email";
            await Interactions.create(data);
            console.log('Error occured' + error);
          } else {
            data.comment = "Email sent with subject: "+emailSubject;
            console.log(data);
            await Interactions.create(data);
          }
      });
    });
    res.status(201).json({success:true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
