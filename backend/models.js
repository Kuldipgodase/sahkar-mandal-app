const mongoose = require('mongoose');
const { Schema } = mongoose;

const MandalSchema = new Schema({
  name: { type: String, required: true },
  nameMr: { type: String, required: true },
  location: String,
  locationMr: String,
  established: String,
  mobile: String,
  email: String,
  upiId: String
}, { timestamps: true });

const MemberSchema = new Schema({
  name: { type: String, required: true },
  nameMr: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: String,
  role: { type: String, enum: ['Super Admin', 'Admin', 'Treasurer', 'Secretary', 'Volunteer', 'Member'], default: 'Member' },
  roleMr: String,
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
  contributions: { type: Number, default: 0 },
  avatar: String,
  avatarColor: String,
  hasPhoto: { type: Boolean, default: false },
  dob: Date,
  address: String,
  addressMr: String,
  joinedAt: { type: Date, default: Date.now },
  mandalId: { type: Schema.Types.ObjectId, ref: 'Mandal' }
}, { timestamps: true });

const FestivalSchema = new Schema({
  name: { type: String, required: true },
  nameMr: { type: String, required: true },
  quote: String,
  quoteMr: String,
  startDate: Date,
  endDate: Date,
  location: String,
  locationMr: String,
  budget: { type: Number, default: 0 },
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  pending: { type: Number, default: 0 },
  pendingCount: { type: Number, default: 0 },
  entries: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'upcoming', 'completed', 'planned'], default: 'planned' },
  mandalId: { type: Schema.Types.ObjectId, ref: 'Mandal' }
}, { timestamps: true });

const TransactionSchema = new Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  person: String,
  personMr: String,
  memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
  desc: String,
  descMr: String,
  amount: { type: Number, required: true },
  method: String,
  methodMr: String,
  status: { type: String, enum: ['paid', 'pending', 'approved', 'under-review', 'rejected'], default: 'paid' },
  receipt: { type: String, unique: true },
  festivalId: { type: Schema.Types.ObjectId, ref: 'Festival' }
}, { timestamps: true });

// Create indexes
TransactionSchema.index({ festivalId: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, createdAt: -1 });

const ExpenseSchema = new Schema({
  vendor: { type: String, required: true },
  vendorMr: String,
  category: String,
  categoryMr: String,
  amount: { type: Number, required: true },
  method: String,
  methodMr: String,
  date: Date,
  dateMr: String,
  status: { type: String, enum: ['draft', 'submitted', 'under-review', 'approved', 'rejected', 'paid'], default: 'submitted' },
  festival: String,
  festivalMr: String,
  festivalId: { type: Schema.Types.ObjectId, ref: 'Festival' },
  ref: String,
  notes: String,
  billDocument: String,
  billUrl: String,
  billName: String,
  billType: String,
  submittedBy: { type: Schema.Types.ObjectId, ref: 'Member' },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'Member' }
}, { timestamps: true });

ExpenseSchema.index({ status: 1 });

const PendingCollectionSchema = new Schema({
  memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
  name: String,
  nameMr: String,
  mobile: String,
  amount: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  outstanding: { type: Number, required: true },
  lastPaymentDate: Date,
  festivalId: { type: Schema.Types.ObjectId, ref: 'Festival' }
}, { timestamps: true });

PendingCollectionSchema.index({ outstanding: -1 });

const NotificationSchema = new Schema({
  type: { type: String, enum: ['approval', 'payment', 'expense', 'reminder', 'system', 'festival'], required: true },
  title: String,
  titleMr: String,
  sub: String,
  subMr: String,
  unread: { type: Boolean, default: true },
  action: String,
  targetUserId: { type: Schema.Types.ObjectId, ref: 'Member' }
}, { timestamps: true });

const Mandal = mongoose.model('Mandal', MandalSchema);
const Member = mongoose.model('Member', MemberSchema);
const Festival = mongoose.model('Festival', FestivalSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);
const PendingCollection = mongoose.model('PendingCollection', PendingCollectionSchema);
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = {
  Mandal,
  Member,
  Festival,
  Transaction,
  Expense,
  PendingCollection,
  Notification
};
