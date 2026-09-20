const mongoose = require('mongoose');
const { Mandal, Member, Festival, Transaction, Expense, PendingCollection, Notification } = require('./models');

// Configure MongoDB URI here or via environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sahakar_mandal';

const SEED_MANDAL = {
  name: 'Sahakar Mitra Mandal', nameMr: 'सहकार मित्र मंडळ',
  location: 'Kasba Peth, Pune', locationMr: 'कसबा पेठ, पुणे',
  established: '1985', mobile: '98765 43210',
  email: 'info@sahakarmandal.org', upiId: 'sahakarmandal@upi',
};

const SEED_MEMBERS = [
  { name: 'Suresh Kadam', nameMr: 'सुरेश कदम', role: 'Super Admin', roleMr: 'मुख्य ॲडमिन', mobile: '9876543210', email: 'suresh@mandal.org', status: 'active', contributions: 45000, avatar: 'SK', avatarColor: '#8B0000' },
  { name: 'Siddharth Kadam', nameMr: 'सिद्धार्थ कदम', role: 'Treasurer', roleMr: 'खजिनदार', mobile: '8765432109', email: 'sid@mandal.org', status: 'active', contributions: 32000, avatar: 'SK', avatarColor: '#7C3AED' },
  { name: 'Minal Shinde', nameMr: 'मिनल शिंदे', role: 'Secretary', roleMr: 'सचिव', mobile: '7654321098', email: 'minal@mandal.org', status: 'active', contributions: 18500, avatar: 'MS', avatarColor: '#DB2777' },
  { name: 'Rahul Patil', nameMr: 'राहुल पाटील', role: 'Admin', roleMr: 'ॲडमिन', mobile: '6543210987', email: 'rahul@mandal.org', status: 'active', contributions: 22000, avatar: 'RP', avatarColor: '#0369A1' },
  { name: 'Priya Kulkarni', nameMr: 'प्रिया कुलकर्णी', role: 'Member', roleMr: 'सदस्य', mobile: '9988776655', email: 'priya@example.com', status: 'active', contributions: 5500, avatar: 'PK', avatarColor: '#065F46' },
  { name: 'Amit Deshpande', nameMr: 'अमित देशपांडे', role: 'Member', roleMr: 'सदस्य', mobile: '9911223344', email: 'amit@example.com', status: 'active', contributions: 7000, avatar: 'AD', avatarColor: '#B45309' },
  { name: 'Savita More', nameMr: 'सविता मोरे', role: 'Member', roleMr: 'सदस्य', mobile: '9800001122', email: 'savita@example.com', status: 'pending', contributions: 0, avatar: 'SM', avatarColor: '#1D4ED8' },
  { name: 'Ganesh Jadhav', nameMr: 'गणेश जाधव', role: 'Volunteer', roleMr: 'स्वयंसेवक', mobile: '8899001122', email: 'ganesh@example.com', status: 'active', contributions: 3000, avatar: 'GJ', avatarColor: '#6D28D9' },
];

const SEED_FESTIVALS = [
  { name: 'Ganeshotsav 2026', nameMr: 'गणेशोत्सव २०२६', quote: '"One Mandal, One Vision"', quoteMr: '"एक मंडळ, एक ध्येय"', startDate: new Date('2026-08-27'), endDate: new Date('2026-09-05'), location: 'Main Mandap, Ganesh Nagar', locationMr: 'मुख्य मंडप, गणेश नगर', budget: 200000, income: 178400, expense: 73000, balance: 105400, pending: 18502, pendingCount: 5, entries: 142, status: 'active' },
  { name: 'Navratri 2026', nameMr: 'नवरात्री २०२६', quote: '"Strength, Devotion"', quoteMr: '"शक्ती, श्रद्धा"', startDate: new Date('2026-10-02'), endDate: new Date('2026-10-11'), location: 'Main Mandap, Ganesh Nagar', locationMr: 'मुख्य मंडप, गणेश नगर', budget: 80000, income: 42000, expense: 18500, balance: 23500, pending: 4200, pendingCount: 3, entries: 38, status: 'upcoming' },
  { name: 'Dahi Handi 2026', nameMr: 'दही हंडी २०२६', quote: '"Enthusiasm, Unity, and Cultural Pride"', quoteMr: '"उत्साह, एकता आणि परंपरेचा झगा"', startDate: new Date('2026-08-15'), endDate: new Date('2026-08-15'), location: 'Sports Ground, Ganesh Nagar', locationMr: 'क्रीडा मैदान, गणेश नगर', budget: 35000, income: 31000, expense: 22500, balance: 8500, pending: 0, pendingCount: 0, entries: 29, status: 'completed' },
  { name: 'Diwali 2026', nameMr: 'दीपावली २०२६', quote: '"Festival of Lights"', quoteMr: '"दिव्यांचा सण"', startDate: new Date('2026-11-01'), endDate: new Date('2026-11-05'), location: 'Community Hall', locationMr: 'सामुदायिक सभागृह', budget: 60000, income: 0, expense: 0, balance: 0, pending: 0, pendingCount: 0, entries: 0, status: 'planned' },
  { name: 'Shiv Jayanti 2027', nameMr: 'शिव जयंती २०२७', quote: '"Bravery, Wisdom, and Ideals"', quoteMr: '"शौर्य, विचार आणि आदर्श"', startDate: new Date('2027-02-19'), endDate: new Date('2027-02-19'), location: 'Main Mandap, Ganesh Nagar', locationMr: 'मुख्य मंडप, गणेश नगर', budget: 50000, income: 0, expense: 0, balance: 0, pending: 0, pendingCount: 0, entries: 0, status: 'planned' },
];

const SEED_TRANSACTIONS = [
  { type: 'income', person: 'Mahadev Khadye', personMr: 'महादेव खडये', desc: 'Collection', descMr: 'वर्गणी', amount: 5001, method: 'UPI', methodMr: 'UPI', status: 'paid', receipt: 'RCP-2026-0841', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', createdAt: new Date('2026-08-25') },
  { type: 'income', person: 'Anita Gawde', personMr: 'अनिता गावडे', desc: 'Donation', descMr: 'देणगी', amount: 11000, method: 'Cash', methodMr: 'रोख', status: 'paid', receipt: 'RCP-2026-0842', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', createdAt: new Date('2026-08-26') },
  { type: 'income', person: 'Vijay Salunkhe', personMr: 'विजय साळुंखे', desc: 'Collection', descMr: 'वर्गणी', amount: 2500, method: 'UPI', methodMr: 'UPI', status: 'paid', receipt: 'RCP-2026-0843', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', createdAt: new Date('2026-08-27') },
  { type: 'income', person: 'Nandini Joshi', personMr: 'नंदिनी जोशी', desc: 'Donation', descMr: 'देणगी', amount: 7500, method: 'NEFT', methodMr: 'NEFT', status: 'paid', receipt: 'RCP-2026-0844', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', createdAt: new Date('2026-08-28') },
  { type: 'expense', person: 'Shri Decor Works', personMr: 'श्री डेकोर वर्क्स', desc: 'Decoration', descMr: 'सजावट', amount: 18500, method: 'NEFT', methodMr: 'NEFT', status: 'approved', receipt: 'EXP-2026-0122', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', createdAt: new Date('2026-08-24') },
  { type: 'expense', person: 'Ganesh Sound System', personMr: 'गणेश साउंड सिस्टम', desc: 'Sound System', descMr: 'ध्वनी यंत्रणा', amount: 12000, method: 'Cash', methodMr: 'रोख', status: 'paid', receipt: 'EXP-2026-0123', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', createdAt: new Date('2026-08-25') },
  { type: 'income', person: 'Ramesh Bhosale', personMr: 'रमेश भोसले', desc: 'Collection', descMr: 'वर्गणी', amount: 3000, method: 'UPI', methodMr: 'UPI', status: 'pending', receipt: 'RCP-2026-0845', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', createdAt: new Date('2026-08-29') },
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

    // Seed Transactions linked to the first festival
    const txWithFestival = SEED_TRANSACTIONS.map(tx => ({ ...tx, festivalId: festivals[0]._id, mandalId: mandal._id }));
    await Transaction.insertMany(txWithFestival);
    console.log(`Inserted ${SEED_TRANSACTIONS.length} transactions.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
