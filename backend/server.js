const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Member } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://sahakar-mandal_db:Sahakar%402026@ac-aqpy3bp-shard-00-00.se6sibu.mongodb.net:27017,ac-aqpy3bp-shard-00-01.se6sibu.mongodb.net:27017,ac-aqpy3bp-shard-00-02.se6sibu.mongodb.net:27017/sahakar_mandal?ssl=true&replicaSet=atlas-bl57y7-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Endpoint to register a new user/member
app.post('/api/members', async (req, res) => {
  try {
    const { name, nameMr, mobile, role, roleMr, dob, address, avatar, avatarColor } = req.body;

    // Check if user already exists
    let existingUser = await Member.findOne({ mobile });
    if (existingUser) {
      // Update existing user or just return them
      existingUser.name = name || existingUser.name;
      existingUser.nameMr = nameMr || existingUser.nameMr;
      existingUser.role = role || existingUser.role;
      existingUser.roleMr = roleMr || existingUser.roleMr;
      existingUser.dob = dob || existingUser.dob;
      existingUser.address = address || existingUser.address;
      await existingUser.save();
      return res.status(200).json({ message: 'User updated', member: existingUser });
    }

    // Create new member
    const newMember = new Member({
      name,
      nameMr: nameMr || name, // Fallback if no Marathi name provided
      mobile,
      role: role || 'Member',
      roleMr: roleMr || 'सदस्य',
      status: 'active', // Since they authenticated via OTP, make them active
      dob: dob ? new Date(dob) : null,
      address,
      avatar: avatar || (name ? name.substring(0, 2).toUpperCase() : 'U'),
      avatarColor: avatarColor || '#8B0000',
    });

    await newMember.save();
    res.status(201).json({ message: 'User created successfully', member: newMember });
  } catch (error) {
    console.error('Error saving member:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Start server
mongoose.connect(MONGODB_URI, { family: 4 }) // family 4 avoids IPv6 localhost issues
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
