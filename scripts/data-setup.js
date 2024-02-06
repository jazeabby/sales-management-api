const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { User } = require('../models/Schema'); // Adjust the path as needed

dotenv.config();

async function createDefaultAdmin() {
  // Connect to MongoDB using environment variables
  await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

  // Check if the default admin user already exists
  const existingAdmin = await User.findOne({ email: 'admin@example.com' });

  if (existingAdmin) {
    console.log('Default admin user already exists.');
    mongoose.disconnect();
    return;
  }

  // If not, create the default admin user
  const adminData = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: await bcrypt.hash('password', 10), // Replace 'adminpassword' with your desired admin password
    role: 'admin',
  };

  try {
    const adminUser = await User.create(adminData);
    console.log('Default admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating default admin user:', error.message);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run the script
createDefaultAdmin();
