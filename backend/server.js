const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Member, Transaction, Expense, Festival, PendingCollection } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://sahakar-mandal_db:Sahakar%402026@ac-aqpy3bp-shard-00-00.se6sibu.mongodb.net:27017,ac-aqpy3bp-shard-00-01.se6sibu.mongodb.net:27017,ac-aqpy3bp-shard-00-02.se6sibu.mongodb.net:27017/sahakar_mandal?ssl=true&replicaSet=atlas-bl57y7-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

// --- MEMBERS ---
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/members/:mobile', async (req, res) => {
  try {
    const mobile = req.params.mobile;
    const member = await Member.findOne({ mobile });
    if (!member) return res.status(404).json({ error: 'Not found' });
    res.json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/members', async (req, res) => {
  try {
    const { name, nameMr, mobile, role, roleMr, dob, address, avatar, avatarColor } = req.body;
    let existingUser = await Member.findOne({ mobile });
    if (existingUser) {
      existingUser.name = name || existingUser.name;
      existingUser.nameMr = nameMr || existingUser.nameMr;
      existingUser.role = role || existingUser.role;
      existingUser.roleMr = roleMr || existingUser.roleMr;
      existingUser.dob = dob || existingUser.dob;
      existingUser.address = address || existingUser.address;
      await existingUser.save();
      return res.status(200).json({ message: 'User updated', member: existingUser });
    }
    const newMember = new Member({
      name, nameMr: nameMr || name, mobile, role: role || 'Member', roleMr: roleMr || 'सदस्य',
      status: 'active', dob: dob ? new Date(dob) : null, address,
      avatar: avatar || (name ? name.substring(0, 2).toUpperCase() : 'U'), avatarColor: avatarColor || '#8B0000',
    });
    await newMember.save();
    res.status(201).json({ message: 'User created successfully', member: newMember });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- TRANSACTIONS (Donations / Income) ---
app.get('/api/transactions', async (req, res) => {
  try {
    const tx = await Transaction.find().sort({ createdAt: -1 });
    res.json(tx);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const tx = new Transaction(req.body);
    // If it's an income transaction linked to a member, update member's contributions
    if (tx.type === 'income' && tx.memberId) {
       await Member.findByIdAndUpdate(tx.memberId, { $inc: { contributions: tx.amount } });
    }
    await tx.save();
    res.status(201).json(tx);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- EXPENSES ---
app.get('/api/expenses', async (req, res) => {
  try {
    const ex = await Expense.find().sort({ createdAt: -1 });
    res.json(ex);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const ex = new Expense(req.body);
    await ex.save();
    res.status(201).json(ex);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- FESTIVALS ---
app.get('/api/festivals', async (req, res) => {
  try {
    const festivals = await Festival.find().sort({ startDate: -1 });
    res.json(festivals);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/festivals', async (req, res) => {
  try {
    const mandal = await Mandal.findOne();
    const fest = new Festival({ ...req.body, mandalId: mandal ? mandal._id : undefined });
    await fest.save();
    res.status(201).json(fest);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Start server
mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));
