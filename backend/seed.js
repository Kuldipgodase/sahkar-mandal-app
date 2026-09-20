const mongoose = require('mongoose');
const { Mandal, Member, Festival, Transaction, Expense, PendingCollection, Notification } = require('./models');

// Configure MongoDB URI here or via environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sahakar_mandal';

const SEED_MANDAL = {
  name: 'Shrimant Sahakar Mitra Mandal', nameMr: 'श्रीमंत सहकार मित्र मंडळ',
  location: 'Kasba Peth, Pune', locationMr: 'कसबा पेठ, पुणे',
  established: '1985', mobile: '98765 43210',
  email: 'info@sahakarmandal.org', upiId: 'sahakarmandal@upi',
};

const SEED_MEMBERS = [
  { name: 'Suresh Kadam', nameMr: 'सुरेश कदम', role: 'Super Admin', roleMr: 'मुख्य ॲडमिन', mobile: '9876543210', email: 'suresh@mandal.org', status: 'active', contributions: 45000, avatar: 'SK', avatarColor: '#8B0000' },
  { name: 'Siddharth Kadam', nameMr: 'सिद्धार्थ कदम', role: 'Treasurer', roleMr: 'खजिनदार', mobile: '8765432109', email: 'sid@mandal.org', status: 'active', contributions: 32000, avatar: 'SK', avatarColor: '#7C3AED' },
  { name: 'Minal Shinde', nameMr: 'मिनल शिंदे', role: 'Secretary', roleMr: 'सचिव', mobile: '7654321098', email: 'minal@mandal.org', status: 'active', contributions: 18500, avatar: 'MS', avatarColor: '#DB2777' },
  { name: 'Rahul Patil', nameMr: 'राहुल पाटील', role: 'Admin', roleMr: 'ॲडमिन', mobile: '6543210987', email: 'rahul@mandal.org', status: 'active', contributions: 22000, avatar: 'RP', avatarColor: '#0369A1' },
];

const SEED_FESTIVALS = [
  { name: 'Ganeshotsav 2026', nameMr: 'गणेशोत्सव २०२६', quote: '"One Mandal, One Vision"', quoteMr: '"एक मंडळ, एक ध्येय"', startDate: new Date('2026-08-27'), endDate: new Date('2026-09-05'), location: 'Main Mandap, Ganesh Nagar', locationMr: 'मुख्य मंडप, गणेश नगर', budget: 200000, income: 178400, expense: 73000, balance: 105400, pending: 18502, pendingCount: 5, entries: 142, status: 'active' },
  { name: 'Navratri 2026', nameMr: 'नवरात्री २०२६', quote: '"Strength, Devotion"', quoteMr: '"शक्ती, श्रद्धा"', startDate: new Date('2026-10-02'), endDate: new Date('2026-10-11'), location: 'Main Mandap, Ganesh Nagar', locationMr: 'मुख्य मंडप, गणेश नगर', budget: 80000, income: 42000, expense: 18500, balance: 23500, pending: 4200, pendingCount: 3, entries: 38, status: 'upcoming' },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Clear existing collections
    console.log('Clearing existing data...');
    await Mandal.deleteMany({});
    await Member.deleteMany({});
    await Festival.deleteMany({});
    await Transaction.deleteMany({});
    await Expense.deleteMany({});
    await PendingCollection.deleteMany({});
    await Notification.deleteMany({});

    console.log('Seeding data...');

    // Seed Mandal
    const mandal = await Mandal.create(SEED_MANDAL);
    console.log('Mandal created.');

    // Seed Members
    const membersWithMandal = SEED_MEMBERS.map(m => ({ ...m, mandalId: mandal._id }));
    const members = await Member.insertMany(membersWithMandal);
    console.log(`Inserted ${members.length} members.`);

    // Seed Festivals
    const festivalsWithMandal = SEED_FESTIVALS.map(f => ({ ...f, mandalId: mandal._id }));
    const festivals = await Festival.insertMany(festivalsWithMandal);
    console.log(`Inserted ${festivals.length} festivals.`);

    // Seed Some Transactions linked to the first festival
    const SEED_TRANSACTIONS = [
      { type: 'income', person: 'Mahadev Khadye', personMr: 'महादेव खडये', desc: 'Collection', descMr: 'वर्गणी', amount: 5001, method: 'UPI', methodMr: 'UPI', status: 'paid', receipt: 'RCP-2026-0841', festivalId: festivals[0]._id, memberId: members[0]._id },
      { type: 'expense', person: 'Shri Decor Works', personMr: 'श्री डेकोर वर्क्स', desc: 'Decoration', descMr: 'सजावट', amount: 18500, method: 'NEFT', methodMr: 'NEFT', status: 'approved', receipt: 'EXP-2026-0122', festivalId: festivals[0]._id }
    ];
    await Transaction.insertMany(SEED_TRANSACTIONS);
    console.log('Inserted transactions.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
