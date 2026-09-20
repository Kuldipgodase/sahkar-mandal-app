import { useState, useEffect } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth, authState } from './firebase'
import type { ComponentType, ReactNode } from 'react'
import { useAppStore } from '@/store'
import type { AppStore, Member, Transaction, Festival, Expense, PendingCollection, AppNotification } from '@/store'
import * as React from 'react'
// Logo assets — logo-transparent.png has background removed, works on any bg
import logoTransparent from '@/assets/logo-transparent.png'
import ganapatiMurti from '@/assets/ganapati-murti.jpg'
import ganeshIcon from '@/assets/ganesh-icon.png'
import festivalGanesha from '@/assets/festival-ganesha.png'
import festivalNavratri from '@/assets/festival-navratri.png'
import festivalDahiHandi from '@/assets/festival-dahihandi.png'
import festivalShiva from '@/assets/festival-shiva.png'
import splashBg from '@/assets/splash-bg3.png'
import {
  Home as HomeIcon, ArrowLeftRight, Sparkles, Users, MoreHorizontal,
  Bell, ChevronRight, ChevronLeft, Search, Plus, Check, X,
  Phone, MessageCircle, Download, Printer, Share2, QrCode,
  FileText, Folder, BarChart2, Shield, Settings, LogOut,
  TrendingUp, TrendingDown, Wallet, Building2, Calendar,
  CreditCard, Banknote, AlertCircle, CheckCircle2, Clock,
  Edit3, Trash2, Eye, Send, Filter, RefreshCw, Upload,
  Star, Award, UserCheck, UserX, User2, Lock, Wifi, WifiOff,
  Copy, ExternalLink, Info, ChevronDown, LayoutGrid,
  PieChart, Activity, BookOpen, Archive, MapPin, Mail,
  IndianRupee, Receipt, Mic, Camera, Image, XCircle, MoreVertical, Database,
  Volume2, Utensils, Lightbulb, Flower2 as Flower, Headphones
} from 'lucide-react'

const WhatsAppIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Lang = 'mr' | 'en'
type Tab = 'home' | 'transactions' | 'festivals' | 'members' | 'more'
type Screen =
  | 'splash' | 'language' | 'welcome' | 'login' | 'register' | 'otp' | 'profile-setup' | 'role-selection'
  | 'dashboard'
  | 'collections' | 'new-collection' | 'collection-detail'
  | 'donations' | 'donor-profile' | 'new-donation'
  | 'transactions' | 'transaction-detail' | 'new-income'
  | 'festivals' | 'festival-detail' | 'add-festival'
  | 'members' | 'member-profile' | 'add-member' | 'pending-members' | 'join-mandal'
  | 'expenses' | 'new-expense' | 'expense-detail' | 'expense-approval'
  | 'qr-payment' | 'payment-success' | 'receipt'
  | 'pending-collections' | 'correction-request' | 'correction-form' | 'audit-history'
  | 'whatsapp-reminder' | 'offline'
  | 'notifications'
  | 'reports' | 'analytics'
  | 'documents' | 'folder-detail'
  | 'more' | 'admin' | 'mandal-profile' | 'roles-permissions' | 'security' | 'backup'
  | 'notification-settings' | 'language-settings' | 'payment-settings' | 'about'
  | 'public-portal' | 'public-donation' | 'public-qr' | 'public-success' | 'public-receipt'

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────

const TR: Record<Lang, Record<string, string>> = {
  en: {
    appName: 'Mandal Digital',
    tagline: 'One Mandal • One App • Complete Management',
    taglineSub: 'Manage • Collect • Record • Celebrate',
    mandalName: 'Shrimant Sahakar Mitra Mandal',
    mandalLocation: 'Pune, Maharashtra',
    selectLanguage: 'Select Your Language',
    continue: 'Continue',
    welcomeTitle: 'Preserve Tradition. Modernize Management.',
    welcomeSub: 'The complete digital platform for your Mandal — transparent, trusted, and built for every celebration.',
    getStarted: 'Get Started',
    login: 'Login',
    mobileNumber: 'Mobile Number',
    enterMobile: 'Enter mobile number',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    otpSentTo: 'OTP sent to',
    resendIn: 'Resend in',
    resend: 'Resend OTP',
    verify: 'Verify & Continue',
    selectMandal: 'Select Mandal',
    home: 'Home',
    transactions: 'Transactions',
    festivals: 'Festivals',
    members: 'Members',
    more: 'More',
    dashboard: 'Dashboard',
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    namaste: 'Namaste',
    cashInHand: 'Cash in Hand',
    bankBalance: 'Bank Balance',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    currentBalance: 'Current Balance',
    newCollection: 'New Collection',
    donation: 'Donation',
    expense: 'Expense',
    receipt: 'Receipt',
    qrPayment: 'QR Payment',
    membersShort: 'Members',
    recentActivity: 'Recent Activity',
    viewAll: 'View All',
    collections: 'Collections',
    pendingCollection: 'Pending Collection',
    paid: 'Paid',
    pending: 'Pending',
    partial: 'Partial',
    completed: 'Completed',
    income: 'Income',
    outgoing: 'Expense',
    all: 'All',
    search: 'Search...',
    filter: 'Filter',
    addNew: 'Add New',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    approve: 'Approve',
    reject: 'Reject',
    submit: 'Submit',
    share: 'Share',
    download: 'Download',
    print: 'Print',
    whatsapp: 'WhatsApp',
    viewReceipt: 'View Receipt',
    generateReceipt: 'Generate Receipt',
    paymentReceived: 'Payment Received!',
    paymentSuccess: 'Transaction recorded successfully.',
    amount: 'Amount',
    donor: 'Donor',
    festival: 'Festival',
    receiptNo: 'Receipt No.',
    date: 'Date',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    upi: 'UPI',
    neft: 'NEFT / RTGS',
    cheque: 'Cheque',
    bank: 'Bank Transfer',
    recordedBy: 'Recorded By',
    note: 'Note',
    status: 'Status',
    role: 'Role',
    superAdmin: 'Super Admin',
    admin: 'Admin',
    treasurer: 'Treasurer',
    secretary: 'Secretary',
    volunteer: 'Volunteer',
    viewOnly: 'View Only',
    active: 'Active',
    inactive: 'Inactive',
    upcoming: 'Upcoming',
    planned: 'Planned',
    name: 'Name',
    mobile: 'Mobile',
    email: 'Email',
    address: 'Address',
    joinedOn: 'Joined On',
    totalContribution: 'Total Contribution',
    lastDonation: 'Last Donation',
    donationCount: 'Donations',
    reportsTitle: 'Reports',
    financial: 'Financial Report',
    collectionReport: 'Collection Report',
    donationReport: 'Donation Report',
    expenseReport: 'Expense Report',
    festivalReport: 'Festival Report',
    auditReport: 'Audit Report',
    analytics: 'Analytics',
    notifications: 'Notifications',
    documents: 'Documents',
    adminCenter: 'Admin Center',
    mandalProfile: 'Mandal Profile',
    rolesPermissions: 'Roles & Permissions',
    security: 'Security',
    backup: 'Backup & Export',
    logOut: 'Log Out',
    offlineMode: 'Offline Mode',
    syncing: 'Syncing...',
    synced: 'Synced',
    noInternet: 'No Internet Connection',
    noData: 'No data found',
    noTransactions: 'No transactions yet',
    noMembers: 'No members found',
    noDonations: 'No donations recorded',
    noExpenses: 'No expenses recorded',
    noDocuments: 'No documents uploaded',
    noNotifications: 'You\'re all caught up!',
    done: 'Done',
    confirm: 'Confirm',
    correctionRequest: 'Correction Request',
    auditHistory: 'Audit History',
    vendor: 'Vendor',
    category: 'Category',
    description: 'Description',
    reference: 'Reference',
    decoration: 'Decoration',
    sound: 'Sound & DJ',
    lighting: 'Lighting',
    mandap: 'Mandap',
    prasad: 'Prasad',
    aarti: 'Aarti',
    transportation: 'Transportation',
    printing: 'Printing',
    food: 'Food',
    other: 'Other',
    sendReminder: 'Send Reminder',
    sendAll: 'Remind All',
    upiId: 'UPI ID',
    qrCode: 'QR Code',
    waitingPayment: 'Waiting for Payment...',
    scanToPay: 'Scan to Pay',
    uploadBill: 'Upload Bill',
    approvalWorkflow: 'Approval Status',
    draft: 'Draft',
    submitted: 'Submitted',
    underReview: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    audited: 'Audited',
    memberApprovals: 'member approvals pending',
    newPayment: 'New payment received',
    expenseApproval: 'Expense awaiting approval',
    reportReady: 'Report is ready',
    thankYou: 'Thank You!',
    ganapatiBappa: '🙏 Ganpati Bappa Morya!',
    incomeVsExpense: 'Income vs Expense',
    monthlyFlow: 'Monthly Cash Flow',
    festivalWise: 'Festival-wise Collection',
    categoryBreakdown: 'Category Breakdown',
    joinCode: 'Secure Joining Code',
    joinMandal: 'Join Mandal',
    requestAccess: 'Request Access',
    accessGranted: 'Access Granted',
    storageUsed: 'Storage Used',
    permissions: 'Permissions',
    everyone: 'Everyone',
    committee: 'Committee',
    readOnly: 'Read Only',
    allowed: 'Allowed',
    restricted: 'Restricted',
    biometric: 'Biometric Lock',
    sessions: 'Active Sessions',
    loginActivity: 'Login Activity',
    trustedDevices: 'Trusted Devices',
    dataPrivacy: 'Data Privacy',
    backupNow: 'Backup Now',
    lastBackup: 'Last Backup',
    exportData: 'Export Data',
  },
  mr: {
    appName: 'मंडळ डिजिटल',
    tagline: 'एक मंडळ • एक अॅप • संपूर्ण व्यवस्थापन',
    taglineSub: 'व्यवस्थापन • संकलन • नोंद • उत्सव',
    mandalName: 'श्रीमंत सहकार मित्र मंडळ',
    mandalLocation: 'पुणे, महाराष्ट्र',
    selectLanguage: 'आपली भाषा निवडा',
    continue: 'पुढे चला',
    welcomeTitle: 'परंपरा जपत, व्यवस्थापन डिजिटल करूया.',
    welcomeSub: 'मंडळाचे संपूर्ण डिजिटल व्यवस्थापन — पारदर्शक, विश्वासार्ह आणि प्रत्येक उत्सवासाठी तयार.',
    getStarted: 'सुरुवात करा',
    login: 'लॉगिन',
    mobileNumber: 'मोबाइल नंबर',
    enterMobile: 'मोबाइल नंबर टाका',
    sendOTP: 'OTP पाठवा',
    verifyOTP: 'OTP सत्यापित करा',
    otpSentTo: 'OTP पाठवला',
    resendIn: 'पुन्हा पाठवा',
    resend: 'OTP पुन्हा पाठवा',
    verify: 'सत्यापित करा व पुढे चला',
    selectMandal: 'मंडळ निवडा',
    home: 'मुख्यपृष्ठ',
    transactions: 'व्यवहार',
    festivals: 'उत्सव',
    members: 'सदस्य',
    more: 'अधिक',
    dashboard: 'डॅशबोर्ड',
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'शुभ दुपार',
    goodEvening: 'शुभ संध्याकाळ',
    namaste: 'नमस्कार',
    cashInHand: 'हातातील रोख',
    bankBalance: 'बँक शिल्लक',
    totalIncome: 'एकूण जमा',
    totalExpense: 'एकूण खर्च',
    currentBalance: 'सध्याची शिल्लक',
    newCollection: 'नवीन जमा',
    donation: 'देणगी',
    expense: 'खर्च',
    receipt: 'पावती',
    qrPayment: 'QR पेमेंट',
    membersShort: 'सदस्य',
    recentActivity: 'अलीकडील व्यवहार',
    viewAll: 'सर्व पहा',
    collections: 'वर्गणी',
    pendingCollection: 'बाकी वर्गणी',
    paid: 'भरलेले',
    pending: 'प्रलंबित',
    partial: 'अंशतः',
    completed: 'पूर्ण',
    income: 'जमा',
    outgoing: 'खर्च',
    all: 'सर्व',
    search: 'शोधा...',
    filter: 'फिल्टर',
    addNew: 'नवीन जोडा',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    approve: 'मंजूर करा',
    reject: 'नाकारा',
    submit: 'सादर करा',
    share: 'शेअर करा',
    download: 'डाउनलोड',
    print: 'प्रिंट करा',
    whatsapp: 'व्हॉट्सअॅप',
    viewReceipt: 'पावती पहा',
    generateReceipt: 'पावती तयार करा',
    paymentReceived: 'पेमेंट मिळाले!',
    paymentSuccess: 'व्यवहार यशस्वीरित्या नोंदवला.',
    amount: 'रक्कम',
    donor: 'देणगीदार',
    festival: 'उत्सव',
    receiptNo: 'पावती क्र.',
    date: 'तारीख',
    paymentMethod: 'पेमेंट पद्धत',
    cash: 'रोख',
    upi: 'UPI',
    neft: 'NEFT / RTGS',
    cheque: 'चेक',
    bank: 'बँक हस्तांतरण',
    recordedBy: 'नोंदवले',
    note: 'नोंद',
    status: 'स्थिती',
    role: 'भूमिका',
    superAdmin: 'सुपर ऍडमिन',
    admin: 'ऍडमिन',
    treasurer: 'खजिनदार',
    secretary: 'सचिव',
    volunteer: 'स्वयंसेवक',
    viewOnly: 'फक्त पहा',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    upcoming: 'आगामी',
    planned: 'नियोजित',
    name: 'नाव',
    mobile: 'मोबाइल',
    email: 'ईमेल',
    address: 'पत्ता',
    joinedOn: 'सामील झाले',
    totalContribution: 'एकूण योगदान',
    lastDonation: 'शेवटची देणगी',
    donationCount: 'देणग्या',
    reportsTitle: 'अहवाल',
    financial: 'आर्थिक अहवाल',
    collectionReport: 'वर्गणी अहवाल',
    donationReport: 'देणगी अहवाल',
    expenseReport: 'खर्च अहवाल',
    festivalReport: 'उत्सव अहवाल',
    auditReport: 'ऑडिट अहवाल',
    analytics: 'विश्लेषण',
    notifications: 'सूचना',
    documents: 'कागदपत्रे',
    adminCenter: 'प्रशासन केंद्र',
    mandalProfile: 'मंडळ प्रोफाइल',
    rolesPermissions: 'भूमिका व परवानग्या',
    security: 'सुरक्षा',
    backup: 'बॅकअप व निर्यात',
    logOut: 'लॉग आउट',
    offlineMode: 'ऑफलाइन मोड',
    syncing: 'समक्रमण...',
    synced: 'समक्रमित',
    noInternet: 'इंटरनेट कनेक्शन नाही',
    noData: 'माहिती सापडली नाही',
    noTransactions: 'अजून व्यवहार नाहीत',
    noMembers: 'सदस्य सापडले नाहीत',
    noDonations: 'देणग्या नोंदवल्या नाहीत',
    noExpenses: 'खर्च नोंदवला नाही',
    noDocuments: 'कागदपत्रे अपलोड केली नाहीत',
    noNotifications: 'सर्व सूचना वाचल्या आहेत!',
    done: 'पूर्ण',
    confirm: 'पुष्टी करा',
    correctionRequest: 'सुधारणा विनंती',
    auditHistory: 'ऑडिट इतिहास',
    vendor: 'विक्रेता',
    category: 'श्रेणी',
    description: 'वर्णन',
    reference: 'संदर्भ',
    decoration: 'सजावट',
    sound: 'साऊंड व DJ',
    lighting: 'प्रकाशयोजना',
    mandap: 'मंडप',
    prasad: 'प्रसाद',
    aarti: 'आरती',
    transportation: 'वाहतूक',
    printing: 'छपाई',
    food: 'भोजन',
    other: 'इतर',
    sendReminder: 'आठवण पाठवा',
    sendAll: 'सर्वांना आठवण करा',
    upiId: 'UPI आयडी',
    qrCode: 'QR कोड',
    waitingPayment: 'पेमेंटची प्रतीक्षा...',
    scanToPay: 'पेमेंटसाठी स्कॅन करा',
    uploadBill: 'बिल अपलोड करा',
    approvalWorkflow: 'मंजुरी स्थिती',
    draft: 'मसुदा',
    submitted: 'सादर केले',
    underReview: 'पुनरावलोकन',
    approved: 'मंजूर',
    rejected: 'नाकारले',
    audited: 'ऑडिट झाले',
    memberApprovals: 'सदस्य मंजुरी प्रलंबित',
    newPayment: 'नवीन पेमेंट मिळाले',
    expenseApproval: 'खर्च मंजुरी प्रलंबित',
    reportReady: 'अहवाल तयार आहे',
    thankYou: 'धन्यवाद!',
    ganapatiBappa: '🙏 गणपती बाप्पा मोरया!',
    incomeVsExpense: 'जमा विरुद्ध खर्च',
    monthlyFlow: 'मासिक रोख प्रवाह',
    festivalWise: 'उत्सवनिहाय संकलन',
    categoryBreakdown: 'श्रेणी विभाजन',
    joinCode: 'सुरक्षित प्रवेश कोड',
    joinMandal: 'मंडळात सामील व्हा',
    requestAccess: 'प्रवेश विनंती',
    accessGranted: 'प्रवेश मिळाला',
    storageUsed: 'स्टोरेज वापरले',
    permissions: 'परवानग्या',
    everyone: 'सर्वांसाठी',
    committee: 'समिती',
    readOnly: 'फक्त वाचा',
    allowed: 'परवानगी',
    restricted: 'प्रतिबंधित',
    biometric: 'बायोमेट्रिक लॉक',
    sessions: 'सक्रिय सत्रे',
    loginActivity: 'लॉगिन क्रियाकलाप',
    trustedDevices: 'विश्वासू उपकरणे',
    dataPrivacy: 'डेटा गोपनीयता',
    backupNow: 'आत्ता बॅकअप',
    lastBackup: 'शेवटचा बॅकअप',
    exportData: 'डेटा निर्यात',
  }
}

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────

const TRANSACTIONS = [
  { id: 1, type: 'income', person: 'Mahadev Khadye', personMr: 'महादेव खडये', desc: 'Collection - Ganeshotsav 2026', descMr: 'वर्गणी - गणेशोत्सव २०२६', amount: 5001, method: 'UPI', methodMr: 'UPI', time: '2 hrs ago', timeMr: '२ तासांपूर्वी', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', receipt: 'RCP-2026-0841' },
  { id: 2, type: 'expense', person: 'Shri Decor Works', personMr: 'श्री डेकोर वर्क्स', desc: 'Decoration - Stage Setup', descMr: 'सजावट - स्टेज उभारणी', amount: 18500, method: 'NEFT', methodMr: 'NEFT', time: '5 hrs ago', timeMr: '५ तासांपूर्वी', status: 'approved', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', receipt: 'EXP-2026-0122' },
  { id: 3, type: 'income', person: 'Rahul Patil', personMr: 'राहुल पाटील', desc: 'Donation - General', descMr: 'देणगी - सर्वसाधारण', amount: 1001, method: 'Cash', methodMr: 'रोख', time: 'Yesterday', timeMr: 'काल', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', receipt: 'RCP-2026-0840' },
  { id: 4, type: 'income', person: 'Minal Shinde', personMr: 'मिनल शिंदे', desc: 'Collection - Annual', descMr: 'वर्गणी - वार्षिक', amount: 501, method: 'UPI', methodMr: 'UPI', time: 'Yesterday', timeMr: 'काल', status: 'paid', festival: 'General', festivalMr: 'सर्वसाधारण', receipt: 'RCP-2026-0839' },
  { id: 5, type: 'expense', person: 'Om Sound Systems', personMr: 'ओम साउंड सिस्टिम्स', desc: 'Sound System - 5 Days', descMr: 'ध्वनी व्यवस्था - ५ दिवस', amount: 25000, method: 'Cheque', methodMr: 'धनादेश', time: '2 days ago', timeMr: '२ दिवसांपूर्वी', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', receipt: 'EXP-2026-0121' },
  { id: 6, type: 'income', person: 'Suresh Kadam', personMr: 'सुरेश कदम', desc: 'Sponsorship - Banner', descMr: 'प्रायोजकत्व - फलक', amount: 10000, method: 'Bank', methodMr: 'बँक', time: '3 days ago', timeMr: '३ दिवसांपूर्वी', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', receipt: 'RCP-2026-0838' },
  { id: 7, type: 'income', person: 'Prasad Kulkarni', personMr: 'प्रसाद कुलकर्णी', desc: 'Collection - Ganeshotsav', descMr: 'वर्गणी - गणेशोत्सव', amount: 2001, method: 'UPI', methodMr: 'UPI', time: '4 days ago', timeMr: '४ दिवसांपूर्वी', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', receipt: 'RCP-2026-0837' },
  { id: 8, type: 'expense', person: 'Sai Mandap House', personMr: 'साई मंडप हाउस', desc: 'Mandap Rental', descMr: 'मंडप भाडे', amount: 15000, method: 'Cash', methodMr: 'रोख', time: '5 days ago', timeMr: '५ दिवसांपूर्वी', status: 'under-review', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', receipt: 'EXP-2026-0120' },
]

const MEMBERS = [
  { id: 1, name: 'Suresh Kadam',    nameMr: 'सुरेश कदम',    roleMr: 'मुख्य ॲडमिन', role: 'Super Admin', mobile: '98765 43210', email: 'suresh@mandal.org', status: 'active',   joinedDisplay: '12 Aug 2026', joinedDisplayMr: '१२ ऑगस्ट २०२६', contributions: 45000, avatar: 'SK', avatarColor: '#8B0000', hasPhoto: false },
  { id: 2, name: 'Siddharth Kadam', nameMr: 'सिद्धार्थ कदम', roleMr: 'खजिनदार',     role: 'Treasurer',   mobile: '87654 32109', email: 'sid@mandal.org',    status: 'active',   joinedDisplay: '10 Aug 2026', joinedDisplayMr: '१० ऑगस्ट २०२६', contributions: 32000, avatar: 'SK', avatarColor: '#7C3AED', hasPhoto: false },
  { id: 3, name: 'Minal Shinde',    nameMr: 'मिनल शिंदे',    roleMr: 'सचिव',         role: 'Secretary',   mobile: '76543 21098', email: 'minal@mandal.org',  status: 'active',   joinedDisplay: '8 Aug 2026',  joinedDisplayMr: '८ ऑगस्ट २०२६',  contributions: 18500, avatar: 'MS', avatarColor: '#DB2777', hasPhoto: false },
  { id: 4, name: 'Rahul Patil',     nameMr: 'राहुल पाटील',     roleMr: 'ॲडमिन',        role: 'Admin',       mobile: '65432 10987', email: 'rahul@mandal.org',  status: 'active',   joinedDisplay: '5 Aug 2026',  joinedDisplayMr: '५ ऑगस्ट २०२६',  contributions: 22000, avatar: 'RP', avatarColor: '#0369A1', hasPhoto: false },
  { id: 5, name: 'Rajesh Deshmukh', nameMr: 'राजेश देशमुख', roleMr: 'स्वयंसेवक',   role: 'Volunteer',   mobile: '54321 09876', email: 'rajesh@mandal.org', status: 'active',   joinedDisplay: '1 Aug 2026',  joinedDisplayMr: '१ ऑगस्ट २०२६',  contributions: 5500,  avatar: 'RD', avatarColor: '#8B0000', hasPhoto: false },
  { id: 6, name: 'Amit Pawar',      nameMr: 'अमित पवार',      roleMr: 'सदस्य',        role: 'Member',      mobile: '93210 56784', email: 'amit@mandal.org',   status: 'inactive', joinedDisplay: '28 Jul 2026', joinedDisplayMr: '२८ जुलै २०२६', contributions: 2000,  avatar: 'AP', avatarColor: '#78716C', hasPhoto: false },
  { id: 7, name: 'Payal Patil',     nameMr: 'पायल पाटील',     roleMr: 'सदस्य',        role: 'Member',      mobile: '98675 43210', email: 'payal@mandal.org',  status: 'pending',  joinedDisplay: '22 Sep 2026', joinedDisplayMr: '२२ सप्टेंबर २०२६', contributions: 0,     avatar: 'PP', avatarColor: '#BE185D', hasPhoto: false },
]

const FESTIVALS = [
  { id: 1, name: 'Ganeshotsav 2026', nameMr: 'गणेशोत्सव २०२६', quoteMr: '"एक मंडळ, एक ध्येय, सर्वांसाठी गणेशोत्सव"', quote: '"One Mandal, One Vision, Ganeshotsav for All"', dates: '27 Aug – 5 Sep 2026', datesMr: '२७ ऑगस्ट – ५ सप्टें २०२६', location: 'Main Mandap, Ganesh Nagar', locationMr: 'मुख्य मंडप, गणेश नगर', income: 178400, expense: 73000, balance: 105400, pending: 18502, pendingCount: 5, entries: 142, status: 'active' },
  { id: 2, name: 'Navratri 2026', nameMr: 'नवरात्री २०२६', quoteMr: '"शक्ती, श्रद्धा आणि एकत्रित आनंद"', quote: '"Strength, Devotion, and Collective Joy"', dates: '2 – 11 Oct 2026', datesMr: '२ – ११ ऑक्टो २०२६', location: 'Main Mandap, Ganesh Nagar', locationMr: 'मुख्य मंडप, गणेश नगर', income: 42000, expense: 18500, balance: 23500, pending: 4200, pendingCount: 3, entries: 38, status: 'upcoming' },
  { id: 3, name: 'Dahi Handi 2026', nameMr: 'दही हंडी २०२६', quoteMr: '"उत्साह, एकता आणि परंपरेचा झगा"', quote: '"Enthusiasm, Unity, and Cultural Pride"', dates: '15 Aug 2026', datesMr: '१५ ऑगस्ट २०२६', location: 'Sports Ground, Ganesh Nagar', locationMr: 'क्रीडा मैदान, गणेश नगर', income: 31000, expense: 22500, balance: 8500, pending: 0, pendingCount: 0, entries: 29, status: 'completed' },
  { id: 4, name: 'Shiv Jayanti 2027', nameMr: 'शिव जयंती २०२७', quoteMr: '"शौर्य, विचार आणि आदर्श"', quote: '"Bravery, Wisdom, and Ideals"', dates: '19 Feb 2027', datesMr: '१९ फेब्रु २०२७', location: 'Main Mandap, Ganesh Nagar', locationMr: 'मुख्य मंडप, गणेश नगर', income: 0, expense: 0, balance: 0, pending: 0, pendingCount: 0, entries: 0, status: 'planned' },
]

const PENDING = [
  { id: 1, name: 'Sunil Joshi', nameMr: 'सुनील जोशी', amount: 2000, paid: 500, outstanding: 1500, last: '12 Jun 2026', lastMr: '१२ जून २०२६', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', mobile: '91234 56789' },
  { id: 2, name: 'Ganesh Bodke', nameMr: 'गणेश बोडके', amount: 1000, paid: 0, outstanding: 1000, last: 'Never', lastMr: 'कधीही नाही', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', mobile: '90123 45678' },
  { id: 3, name: 'Priya Joshi', nameMr: 'प्रिया जोशी', amount: 501, paid: 0, outstanding: 501, last: 'Never', lastMr: 'कधीही नाही', festival: 'General', festivalMr: 'सर्वसाधारण', mobile: '89012 34567' },
  { id: 4, name: 'Vijay Kulkarni', nameMr: 'विजय कुलकर्णी', amount: 3000, paid: 1000, outstanding: 2000, last: '3 May 2026', lastMr: '३ मे २०२६', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', mobile: '78901 23456' },
  { id: 5, name: 'Meena Patil', nameMr: 'मीना पाटील', amount: 501, paid: 0, outstanding: 501, last: 'Never', lastMr: 'कधीही नाही', festival: 'Navratri 2026', festivalMr: 'नवरात्री २०२६', mobile: '67890 12345' },
]

const NOTIFICATIONS_DATA = [
  {
    id: 1, type: 'approval',
    title: '2 Member Approvals Pending',
    titleMr: '२ सदस्य मंजुरी प्रलंबित',
    sub: 'Ganesh Bodke and Priya Joshi are waiting for approval.',
    subMr: 'गणेश बोडके आणि प्रिया जोशी मंजुरीच्या प्रतीक्षेत आहेत.',
    time: '10 min ago',
    timeMr: '१० मिनिटांपूर्वी',
    unread: true, action: 'approve'
  },
  {
    id: 2, type: 'payment',
    title: 'New Payment Received',
    titleMr: 'नवीन देणगी प्राप्त',
    sub: 'Mahadev Khadye paid ₹5,001 via UPI for Ganeshotsav 2026.',
    subMr: 'महादेव खड्ये यांनी गणेशोत्सव २०२६ साठी ₹५,००१ UPI द्वारे भरले.',
    time: '2 hrs ago',
    timeMr: '२ तासांपूर्वी',
    unread: true, action: 'view'
  },
  {
    id: 3, type: 'expense',
    title: 'Expense Awaiting Approval',
    titleMr: 'खर्च मंजुरीच्या प्रतीक्षेत',
    sub: 'Sai Mandap House bill of ₹15,000 submitted by Siddharth Kadam.',
    subMr: 'सिद्धार्थ कदम यांनी सादर केलेले साई मंडप हाऊसचे ₹१५,००० चे बिल.',
    time: '5 hrs ago',
    timeMr: '५ तासांपूर्वी',
    unread: true, action: 'review'
  },
  {
    id: 4, type: 'reminder',
    title: '3 Outstanding Donations',
    titleMr: '३ थकित वर्गणी',
    sub: 'Total outstanding: ₹4,001 — Ganeshotsav 2026',
    subMr: 'एकूण बाकी: ₹४,००१ — गणेशोत्सव २०२६',
    time: 'Yesterday',
    timeMr: 'काल',
    unread: false, action: 'remind'
  },
  {
    id: 5, type: 'system',
    title: 'Report Ready',
    titleMr: 'अहवाल तयार आहे',
    sub: 'Ganeshotsav 2026 financial report has been generated.',
    subMr: 'गणेशोत्सव २०२६ चा आर्थिक अहवाल तयार करण्यात आला आहे.',
    time: '2 days ago',
    timeMr: '२ दिवसांपूर्वी',
    unread: false, action: 'view'
  },
]

const EXPENSES_DATA = [
  { id: 1, vendor: 'Om Sound Systems', vendorMr: 'ओम साउंड सिस्टिम्स', category: 'Sound & DJ', categoryMr: 'ध्वनी व डीजे', amount: 25000, method: 'Cheque', date: '22 Aug 2026', dateMr: '२२ ऑगस्ट २०२६', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: 'CHQ-004521' },
  { id: 2, vendor: 'Shri Decor Works', vendorMr: 'श्री डेकोर वर्क्स', category: 'Decoration', categoryMr: 'सजावट', amount: 18500, method: 'NEFT', date: '24 Aug 2026', dateMr: '२४ ऑगस्ट २०२६', status: 'approved', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: 'NEFT-20260824' },
  { id: 3, vendor: 'Sai Mandap House', vendorMr: 'साई मंडप हाउस', category: 'Mandap', categoryMr: 'मंडप', amount: 15000, method: 'Cash', date: '20 Aug 2026', dateMr: '२० ऑगस्ट २०२६', status: 'under-review', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: '' },
  { id: 4, vendor: 'Prasanna Catering', vendorMr: 'प्रसन्न कॅटरर्स', category: 'Food', categoryMr: 'प्रसाद व भोजन', amount: 8200, method: 'UPI', date: '21 Aug 2026', dateMr: '२१ ऑगस्ट २०२६', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: 'UPI-826341' },
  { id: 5, vendor: 'Datta Electricals', vendorMr: 'दत्त इलेक्ट्रिकल्स', category: 'Lighting', categoryMr: 'रोषणाई', amount: 6300, method: 'Cash', date: '19 Aug 2026', dateMr: '१९ ऑगस्ट २०२६', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: '' },
]

const DOCS_FOLDERS = [
  { id: 1, name: 'Permissions', nameMr: 'परवानग्या', icon: '📋', count: 4, permission: 'Admin', permissionMr: 'प्रशासक', size: '2.4 MB' },
  { id: 2, name: 'Bills & Receipts', nameMr: 'बिले आणि पावत्या', icon: '🧾', count: 28, permission: 'Committee', permissionMr: 'समिती', size: '18.2 MB' },
  { id: 3, name: 'Bank Documents', nameMr: 'बँक कागदपत्रे', icon: '🏦', count: 6, permission: 'Super Admin', permissionMr: 'मुख्य प्रशासक', size: '5.1 MB' },
  { id: 4, name: 'Festival Photos', nameMr: 'उत्सव फोटो', icon: '📸', count: 142, permission: 'Everyone', permissionMr: 'सर्व', size: '892 MB' },
  { id: 5, name: 'QR Codes', nameMr: 'QR कोड', icon: '⬛', count: 3, permission: 'Committee', permissionMr: 'समिती', size: '0.3 MB' },
  { id: 6, name: 'Official Documents', nameMr: 'अधिकृत कागदपत्रे', icon: '📄', count: 9, permission: 'Super Admin', permissionMr: 'मुख्य प्रशासक', size: '12.8 MB' },
]

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

// ─── SVG LOGO ────────────────────────────────────────────────────────────────

function MandalLogo({ size = 48 }: { size?: number; white?: boolean }) {
  return (
    <img
      src={logoTransparent}
      alt="Mandal Logo"
      style={{ height: size, width: 'auto', maxWidth: size * 3.5 }}
      className="object-contain"
    />
  )
}

// ─── CORE UI COMPONENTS ───────────────────────────────────────────────────────

function StatusBadge({ status, lang }: { status: string; lang: Lang }) {
  const map: Record<string, { bg: string; text: string; label_en: string; label_mr: string }> = {
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', label_en: 'Paid', label_mr: 'भरले' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', label_en: 'Pending', label_mr: 'प्रलंबित' },
    partial: { bg: 'bg-blue-50', text: 'text-blue-700', label_en: 'Partial', label_mr: 'अंशतः' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label_en: 'Completed', label_mr: 'पूर्ण' },
    active: { bg: 'bg-emerald-50', text: 'text-emerald-700', label_en: 'Active', label_mr: 'सक्रिय' },
    upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', label_en: 'Upcoming', label_mr: 'आगामी' },
    planned: { bg: 'bg-stone-100', text: 'text-stone-600', label_en: 'Planned', label_mr: 'नियोजित' },
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', label_en: 'Approved', label_mr: 'मंजूर' },
    'under-review': { bg: 'bg-amber-50', text: 'text-amber-700', label_en: 'Under Review', label_mr: 'पुनरावलोकन' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', label_en: 'Rejected', label_mr: 'नाकारले' },
    inactive: { bg: 'bg-stone-100', text: 'text-stone-500', label_en: 'Inactive', label_mr: 'निष्क्रिय' },
  }
  const s = map[status] || map['pending']
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      {lang === 'mr' ? s.label_mr : s.label_en}
    </span>
  )
}

function RoleBadge({ role, lang }: { role: string; lang: Lang }) {
  const map: Record<string, { bg: string; text: string; label_en: string; label_mr: string }> = {
    'Super Admin': { bg: 'bg-[#8B0000]/10', text: 'text-[#8B0000]', label_en: 'Super Admin', label_mr: 'सुपर ऍडमिन' },
    'Admin': { bg: 'bg-[#8B0000]/8', text: 'text-[#8B0000]', label_en: 'Admin', label_mr: 'ऍडमिन' },
    'Treasurer': { bg: 'bg-amber-50', text: 'text-amber-700', label_en: 'Treasurer', label_mr: 'खजिनदार' },
    'Secretary': { bg: 'bg-blue-50', text: 'text-blue-700', label_en: 'Secretary', label_mr: 'सचिव' },
    'Volunteer': { bg: 'bg-emerald-50', text: 'text-emerald-700', label_en: 'Volunteer', label_mr: 'स्वयंसेवक' },
    'View Only': { bg: 'bg-stone-100', text: 'text-stone-500', label_en: 'View Only', label_mr: 'फक्त पहा' },
  }
  const r = map[role] || map['Volunteer']
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.bg} ${r.text}`}>
      {lang === 'mr' ? r.label_mr : r.label_en}
    </span>
  )
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm'
  return (
    <div className={`${sz} rounded-full bg-[#8B0000]/10 text-[#8B0000] font-bold flex items-center justify-center flex-shrink-0`}>
      {initials}
    </div>
  )
}

function Btn({ children, onClick, variant = 'primary', className = '', icon }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'saffron'; className?: string; icon?: React.ReactNode
}) {
  const base = 'flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl font-semibold text-[15px] transition-all active:scale-[0.97] select-none'
  const variants = {
    primary: 'bg-[#8B0000] text-white shadow-brand',
    secondary: 'bg-white text-[#8B0000] border border-[#8B0000]/20',
    danger: 'bg-red-600 text-white',
    ghost: 'bg-transparent text-[#8B0000]',
    saffron: 'bg-[#D97706] text-white',
  }
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl shadow-card ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''} ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-[15px] text-[#1C1917]">{title}</h3>
      {action && <button onClick={onAction} className="text-[13px] text-[#8B0000] font-medium">{action}</button>}
    </div>
  )
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />
}

function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-[#8B0000]/6 flex items-center justify-center mb-4 text-[#8B0000]/50">
        {icon}
      </div>
      <p className="font-semibold text-[#1C1917] text-[16px] mb-1">{title}</p>
      {sub && <p className="text-[#78716C] text-[13px]">{sub}</p>}
    </div>
  )
}

function AppHeader({ title, onBack, onNotif, onProfile, showBell = false, lang, children }: {
  title: string; onBack?: () => void; onNotif?: () => void; onProfile?: () => void; showBell?: boolean; lang: Lang; children?: React.ReactNode
}) {
  return (
    <div
      className="bg-[#8B0000] px-4 pb-3.5 flex items-center gap-3 flex-shrink-0 shadow-sm"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 20px)' }}
    >
      {onBack && (
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform" aria-label="Back">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-white font-bold text-[17px] truncate">{title}</h1>
        {children && <div className="mt-0.5">{children}</div>}
      </div>
      {showBell && (
        <button onClick={onNotif} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D97706] rounded-full border-2 border-[#8B0000]" />
        </button>
      )}
      {onProfile && (
        <button onClick={onProfile} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[13px]">
          SK
        </button>
      )}
    </div>
  )
}

function SearchBar({ placeholder, className = '' }: { placeholder: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 bg-white rounded-xl border border-stone-200 px-4 h-11 ${className}`}>
      <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
      <input className="flex-1 text-[14px] outline-none text-[#1C1917] placeholder:text-stone-400 bg-transparent" placeholder={placeholder} />
    </div>
  )
}

function FinStat({ label, value, sub, trend, color = 'maroon' }: {
  label: string; value: string; sub?: string; trend?: 'up' | 'down'; color?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-white/70 uppercase tracking-wide font-medium">{label}</span>
      <span className="text-[22px] font-bold text-white leading-tight">{value}</span>
      {sub && <span className="text-[11px] text-white/60">{sub}</span>}
    </div>
  )
}

// ─── SHARED AUTH COMPONENTS ───────────────────────────────────────────────────

/** Temple cityscape footer — used on all pre-login screens */
function TempleFooter({ lang = 'mr' }: { lang?: Lang } = {}) {
  return (
    <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 172 }}>
      <svg viewBox="0 0 390 172" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFBF5"/>
            <stop offset="30%" stopColor="#FEF9EE"/>
            <stop offset="65%" stopColor="#FDDFA4" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#8B0000" stopOpacity="0.95"/>
          </linearGradient>
          <radialGradient id="tf-sun" cx="50%" cy="60%" r="48%">
            <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.85"/>
            <stop offset="55%" stopColor="#FDE68A" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#FFFBF5" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="390" height="172" fill="url(#tf-sky)"/>
        <rect x="12" y="118" width="10" height="54" fill="#7F1D1D" opacity="0.65"/>
        <polygon points="17,104 10,120 24,120" fill="#7F1D1D" opacity="0.65"/>
        <polygon points="17,90 11,106 23,106" fill="#7F1D1D" opacity="0.7"/>
        <line x1="17" y1="90" x2="17" y2="74" stroke="#D97706" strokeWidth="1.2" opacity="0.65"/>
        <polygon points="17,74 26,77.5 17,81" fill="#D97706" opacity="0.65"/>
        {/* Main left tall spire */}
        <rect x="46" y="108" width="14" height="64" fill="#8B0000" opacity="0.8"/>
        <polygon points="53,93 44,110 62,110" fill="#8B0000" opacity="0.8"/>
        <polygon points="53,77 45,95 61,95" fill="#8B0000" opacity="0.85"/>
        <polygon points="53,63 46,79 60,79" fill="#7A0000" opacity="0.9"/>
        <polygon points="53,50 48,65 58,65" fill="#7A0000" opacity="0.95"/>
        <line x1="53" y1="50" x2="53" y2="32" stroke="#D97706" strokeWidth="1.5" opacity="0.8"/>
        <polygon points="53,32 65,36 53,40" fill="#D97706" opacity="0.8"/>
        {/* Left medium spire */}
        <rect x="82" y="120" width="11" height="52" fill="#991B1B" opacity="0.65"/>
        <polygon points="87.5,106 80,122 95,122" fill="#991B1B" opacity="0.65"/>
        <polygon points="87.5,92 81,108 94,108" fill="#991B1B" opacity="0.7"/>
        <polygon points="87.5,79 82,94 93,94" fill="#991B1B" opacity="0.75"/>
        <line x1="87.5" y1="79" x2="87.5" y2="64" stroke="#D97706" strokeWidth="1.2" opacity="0.6"/>
        <polygon points="87.5,64 97,67.5 87.5,71" fill="#D97706" opacity="0.6"/>
        {/* Left small extra */}
        <rect x="113" y="130" width="8" height="42" fill="#B91C1C" opacity="0.5"/>
        <polygon points="117,118 111,132 123,132" fill="#B91C1C" opacity="0.5"/>
        <polygon points="117,107 112,120 122,120" fill="#B91C1C" opacity="0.55"/>
        <line x1="117" y1="107" x2="117" y2="94" stroke="#D97706" strokeWidth="1" opacity="0.5"/>
        <polygon points="117,94 124,97 117,100" fill="#D97706" opacity="0.5"/>
        {/* ── RIGHT CLUSTER ── */}
        {/* Right small extra */}
        <rect x="269" y="130" width="8" height="42" fill="#B91C1C" opacity="0.5"/>
        <polygon points="273,118 267,132 279,132" fill="#B91C1C" opacity="0.5"/>
        <polygon points="273,107 268,120 278,120" fill="#B91C1C" opacity="0.55"/>
        <line x1="273" y1="107" x2="273" y2="94" stroke="#D97706" strokeWidth="1" opacity="0.5"/>
        <polygon points="273,94 280,97 273,100" fill="#D97706" opacity="0.5"/>
        {/* Right medium spire */}
        <rect x="297" y="120" width="11" height="52" fill="#991B1B" opacity="0.65"/>
        <polygon points="302.5,106 295,122 310,122" fill="#991B1B" opacity="0.65"/>
        <polygon points="302.5,92 296,108 309,108" fill="#991B1B" opacity="0.7"/>
        <polygon points="302.5,79 297,94 308,94" fill="#991B1B" opacity="0.75"/>
        <line x1="302.5" y1="79" x2="302.5" y2="64" stroke="#D97706" strokeWidth="1.2" opacity="0.6"/>
        <polygon points="302.5,64 312,67.5 302.5,71" fill="#D97706" opacity="0.6"/>
        {/* Main right tall spire */}
        <rect x="330" y="108" width="14" height="64" fill="#8B0000" opacity="0.8"/>
        <polygon points="337,93 328,110 346,110" fill="#8B0000" opacity="0.8"/>
        <polygon points="337,77 329,95 345,95" fill="#8B0000" opacity="0.85"/>
        <polygon points="337,63 330,79 344,79" fill="#7A0000" opacity="0.9"/>
        <polygon points="337,50 332,65 342,65" fill="#7A0000" opacity="0.95"/>
        <line x1="337" y1="50" x2="337" y2="32" stroke="#D97706" strokeWidth="1.5" opacity="0.8"/>
        <polygon points="337,32 349,36 337,40" fill="#D97706" opacity="0.8"/>
        {/* Far-right small spire */}
        <rect x="368" y="118" width="10" height="54" fill="#7F1D1D" opacity="0.65"/>
        <polygon points="373,104 366,120 380,120" fill="#7F1D1D" opacity="0.65"/>
        <polygon points="373,90 367,106 379,106" fill="#7F1D1D" opacity="0.7"/>
        <line x1="373" y1="90" x2="373" y2="74" stroke="#D97706" strokeWidth="1.2" opacity="0.65"/>
        <polygon points="373,74 382,77.5 373,81" fill="#D97706" opacity="0.65"/>
        {/* Ground */}
        <rect x="0" y="160" width="390" height="12" fill="#8B0000" opacity="0.6"/>
        {/* Birds */}
        <path d="M148,58 Q152,53 156,58" stroke="#8B0000" strokeWidth="1.3" fill="none" opacity="0.25"/>
        <path d="M162,48 Q166,43 170,48" stroke="#8B0000" strokeWidth="1.3" fill="none" opacity="0.2"/>
        <path d="M220,55 Q224,50 228,55" stroke="#8B0000" strokeWidth="1.3" fill="none" opacity="0.25"/>
        <path d="M235,44 Q239,39 243,44" stroke="#8B0000" strokeWidth="1.3" fill="none" opacity="0.2"/>
      </svg>
      {/* Text overlay */}
      <div className="absolute bottom-3 inset-x-0 flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-3 mb-0.5">
          <div className="h-px w-14 bg-[#D97706]/40"/>
          <span className="text-[#D97706] text-[11px]">✿</span>
          <div className="h-px w-14 bg-[#D97706]/40"/>
        </div>
        <p className="text-[#7F1D1D] text-[11px] font-bold devanagari">
          {lang === 'mr' ? '|| गणपती बाप्पा मोरया ||' : '|| Shree Ganesh ||'}
        </p>
        <p className="text-[#78716C] text-[9px]">
          {lang === 'mr' ? 'उज्वल भविष्यासाठी एकत्र' : 'Together for a Better Tomorrow'}
        </p>
      </div>
    </div>
  )
}

/** Step indicator for registration flow */
function RegStepper({ step, lang }: { step: number; lang: Lang }) {
  const steps = lang === 'mr'
    ? ['मूलभूत माहिती', 'मोबाईल पडताळणी', 'प्रोफाईल तपशील', 'पूर्ण करा']
    : ['Basic Info', 'Verify Mobile', 'Profile Details', 'Complete']
  return (
    <div className="flex items-start justify-between px-1 mb-6">
      {steps.map((label, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div className="flex items-center w-full">
            {i > 0 && <div className={`h-px flex-1 ${i <= step ? 'border-t-2 border-dashed border-[#8B0000]' : 'border-t-2 border-dashed border-stone-200'}`} />}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold border-2 ${i < step ? 'bg-[#8B0000] border-[#8B0000] text-white' : i === step ? 'bg-[#8B0000] border-[#8B0000] text-white' : 'bg-white border-stone-300 text-stone-400'}`}>
              {i < step ? <Check className="w-4 h-4"/> : i + 1}
            </div>
            {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? 'border-t-2 border-dashed border-[#8B0000]' : 'border-t-2 border-dashed border-stone-200'}`} />}
          </div>
          <p className={`text-[9px] mt-1 text-center leading-tight ${i === step ? 'text-[#8B0000] font-bold' : i < step ? 'text-[#8B0000]' : 'text-stone-400'}`}>{label}</p>
        </div>
      ))}
    </div>
  )
}

/** Consistent auth screen input field */
function AuthInput({ icon: Icon, label, placeholder, type = 'text', value, onChange, right }: {
  icon: ComponentType<{ className?: string }>, label: string, placeholder: string
  type?: string, value?: string, onChange?: (v: string) => void, right?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#E8DFD4] rounded-2xl px-4 h-[54px] focus-within:border-[#8B0000] transition-colors">
      <Icon className="w-4.5 h-4.5 text-[#8B0000] flex-shrink-0"/>
      <div className="flex-1 min-w-0">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          aria-label={label}
          className="w-full text-[14px] text-[#2C2C2C] placeholder:text-stone-400 outline-none bg-transparent"
        />
      </div>
      {right}
    </div>
  )
}

// ─── SCREEN: SPLASH ──────────────────────────────────────────────────────────

const SPLASH_FEATURES = [
  { icon: Users,        label: 'Manage',    labelMr: 'व्यवस्थापन' },
  { icon: IndianRupee,  label: 'Collect',   labelMr: 'संकलन' },
  { icon: FileText,     label: 'Record',    labelMr: 'नोंद' },
  { icon: Sparkles,     label: 'Celebrate', labelMr: 'उत्सव' },
] as const

function SplashScreen({ onDone, lang = 'mr' }: { onDone: () => void; lang?: Lang }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setProgress(p => Math.min(p + 1.8, 100)), 50)
    const done = setTimeout(onDone, 3800)
    return () => { clearInterval(interval); clearTimeout(done) }
  }, [onDone])

  return (
    <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center" style={{ background: '#540206' }}>
      {/* Full-bleed splash container adapting edge-to-edge on any Android screen aspect ratio */}
      <div className="relative w-full h-full max-w-[480px] flex items-center justify-center overflow-hidden">
        <img
          src={splashBg}
          alt={lang === 'mr' ? 'सहकार मित्र मंडळ' : 'Sahakar Mitra Mandal'}
          className="w-full h-full object-cover object-top select-none pointer-events-none"
        />

        {/* Loading component — placed in the designated gap between Sahakar logo and feature badges */}
        <div style={{
          position: 'absolute',
          left: '10%', right: '10%',
          bottom: '15%',
        }}>
          {/* Bar + percentage row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              flex: 1, height: 7, borderRadius: 99,
              background: 'rgba(255,255,255,0.25)',
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.4) inset',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: 99,
                background: 'linear-gradient(90deg, #D97706, #F59E0B, #FCD34D)',
                boxShadow: '0 0 10px rgba(245,158,11,0.7)',
                transition: 'width 80ms linear',
              }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FCD34D', minWidth: 38, textAlign: 'right' }}>
              {Math.round(progress)}%
            </span>
          </div>
          {/* Loading label */}
          <p style={{
            textAlign: 'center', marginTop: 6,
            fontSize: 11, color: 'rgba(255,255,255,0.85)',
            letterSpacing: 1,
            fontWeight: 500,
          }}>{lang === 'mr' ? 'लोड होत आहे...' : 'Loading...'}</p>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: LANGUAGE SELECTION ───────────────────────────────────────────────

function LanguageScreen({ onSelect }: { onSelect: (l: Lang) => void }) {
  const [sel, setSel] = useState<Lang>('mr')

  /* Miniature temple cityscape SVG inside the language card */
  const CityscapeMini = ({ invert }: { invert?: boolean }) => {
    const c = invert ? 'rgba(255,255,255,0.15)' : 'rgba(139,0,0,0.10)'
    return (
      <svg viewBox="0 0 200 50" className="absolute bottom-0 inset-x-0 w-full opacity-80" preserveAspectRatio="xMidYMax slice">
        <rect x="5" y="20" width="6" height="30" fill={c}/>
        <polygon points="8,10 3,22 13,22" fill={c}/>
        <rect x="22" y="12" width="9" height="38" fill={c}/>
        <polygon points="26.5,2 19,14 34,14" fill={c}/>
        <rect x="45" y="22" width="6" height="28" fill={c}/>
        <polygon points="48,14 43,24 53,24" fill={c}/>
        <rect x="150" y="22" width="6" height="28" fill={c}/>
        <polygon points="153,14 148,24 158,24" fill={c}/>
        <rect x="165" y="12" width="9" height="38" fill={c}/>
        <polygon points="169.5,2 162,14 177,14" fill={c}/>
        <rect x="185" y="20" width="6" height="30" fill={c}/>
        <polygon points="188,10 183,22 193,22" fill={c}/>
      </svg>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5] overflow-y-auto no-scrollbar justify-between min-h-full">
      {/* Skip button — pinned top right */}
      <div className="flex justify-end px-5 flex-shrink-0" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 18px)' }}>
        <button onClick={() => onSelect(sel)} className="flex items-center gap-1 border border-[#8B0000]/30 rounded-full px-4 py-1.5 text-[13px] text-[#8B0000] font-medium hover:bg-[#8B0000]/5 transition-colors">
          {sel === 'mr' ? 'पुढे जा' : 'Skip'} <ChevronRight className="w-3.5 h-3.5"/>
        </button>
      </div>

      {/* Main interactive content — centered vertically so logo, cards and button sit comfortably down */}
      <div className="flex-1 flex flex-col justify-center px-5 py-3 my-auto">
        {/* Logo block */}
        <div className="flex flex-col items-center pb-2 relative">
          <img src={logoTransparent} alt={sel === 'mr' ? 'सहकार मित्र मंडळ' : 'Sahakar Mitra Mandal'} className="h-20 w-auto object-contain drop-shadow-sm"/>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-px w-12 bg-[#D97706]/40"/>
            <span className="text-[#D97706] text-[12px]">✦</span>
            <div className="h-px w-12 bg-[#D97706]/40"/>
          </div>
        </div>

        {/* Title */}
        <div className="mt-2 mb-5 text-center">
          <h1 className="text-[26px] font-bold text-[#8B0000] devanagari leading-tight">
            {sel === 'mr' ? 'आपली भाषा निवडा' : 'Choose Your Language'}
          </h1>
          <p className="text-stone-500 text-[13px] mt-1">
            {sel === 'mr' ? 'आपल्या सोयीची भाषा निवडा आणि पुढे चला' : 'Select your preferred language to continue'}
          </p>
        </div>

        {/* Language cards */}
        <div className="flex gap-3.5 mb-6">
          {([
            { code: 'mr' as Lang, char: 'अ', primary: sel === 'mr' ? 'मराठी' : 'Marathi', sub: sel === 'mr' ? 'माझी भाषा, माझा अभिमान' : 'My Language, My Pride' },
            { code: 'en' as Lang, char: 'A', primary: sel === 'mr' ? 'इंग्रजी' : 'English', sub: sel === 'mr' ? 'एकत्र येऊन अधिक सक्षम' : 'Stronger Together' },
          ]).map(({ code, char, primary, sub }) => {
            const active = sel === code
            return (
              <button key={code} onClick={() => setSel(code)}
                className={`flex-1 relative flex flex-col items-center pt-6 pb-14 rounded-3xl overflow-hidden border-2 transition-all shadow-card ${active ? 'bg-[#8B0000] border-[#8B0000] ring-4 ring-[#8B0000]/15' : 'bg-white border-stone-200 hover:border-stone-300'}`}
                style={{ minHeight: 185 }}>
                {active && (
                  <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#8B0000]"/>
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-[28px] font-bold mb-3 shadow-inner transition-transform ${active ? 'bg-white/20 text-white scale-105' : 'bg-stone-100 text-stone-700'}`}>
                  {char}
                </div>
                <p className={`text-[19px] font-bold ${active ? 'text-white' : 'text-[#2C2C2C]'}`}>{primary}</p>
                <p className={`text-[11px] mt-1.5 px-3 text-center leading-tight ${active ? 'text-white/80' : 'text-stone-400'}`}>{sub}</p>
                <CityscapeMini invert={active} />
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mb-4">
          <button onClick={() => onSelect(sel)}
            className="w-full h-[54px] bg-[#8B0000] rounded-full text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-brand active:scale-[0.98] transition-transform">
            <span className="devanagari">{sel === 'mr' ? 'पुढे चला →' : 'Continue →'}</span>
          </button>
        </div>

        {/* Info note */}
        <div className="flex items-center justify-center gap-2 px-2">
          <Info className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0"/>
          <p className="text-[11px] text-stone-500 devanagari text-center">
            {sel === 'mr' ? 'आपण ही भाषा नंतर सेटिंग्जमधून कधीही बदलू शकता' : 'You can change the language anytime from settings'}
          </p>
        </div>
      </div>

      {/* Footer — anchored cleanly at the bottom without emoji */}
      <div className="flex flex-col items-center gap-1.5 py-4 border-t border-stone-200/60 mx-5 flex-shrink-0" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 14px, 20px)' }}>
        <div className="flex items-center gap-2">
          <div className="h-px w-10 bg-[#D97706]/35"/>
          <span className="text-[#D97706] text-[12px]">✦</span>
          <div className="h-px w-10 bg-[#D97706]/35"/>
        </div>
        <p className="text-[#8B0000] text-[12px] font-bold devanagari tracking-wider">
          {sel === 'mr' ? '|| गणपती बाप्पा मोरया ||' : '|| Shree Ganesh ||'}
        </p>
      </div>
    </div>
  )
}

// ─── SCREEN: WELCOME ──────────────────────────────────────────────────────────

function WelcomeScreen({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  const [slide, setSlide] = useState(0)
  const features = [
    { icon: Users, titleMr: 'सदस्य व्यवस्थापन', title: 'Member Management', subMr: 'आपले मंडळ, अधिक मजबूत', sub: 'Manage Members Effortlessly' },
    { icon: IndianRupee, titleMr: 'देणगी व वर्गणी', title: 'Donations & Collections', subMr: 'पारदर्शक आणि सुरक्षित', sub: 'Collect Donations with Confidence' },
    { icon: FileText, titleMr: 'आर्थिक व्यवहार', title: 'Financial Records', subMr: 'प्रत्येक नोंद, कायमची सुरक्षित', sub: 'Track Income & Expenses in Real-Time' },
    { icon: Calendar, titleMr: 'उत्सव नियोजन', title: 'Festival Planning', subMr: 'प्रत्येक उत्सव, अधिक नियोजित', sub: 'Organize Festivals Seamlessly' },
  ]
  const totalSlides = 5

  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5] overflow-y-auto no-scrollbar">
      {/* Top nav */}
      <div className="flex items-center justify-between px-5" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 18px)' }}>
        <div className="w-8"/>
        <div/>
        <button onClick={onNext} className="flex items-center gap-1 border border-[#8B0000]/30 rounded-full px-4 py-1.5 text-[13px] text-[#8B0000] font-medium">
          {lang === 'mr' ? 'पुढे जा' : 'Skip'} <ChevronRight className="w-3.5 h-3.5"/>
        </button>
      </div>

      {/* Logo — centered */}
      <div className="flex items-center justify-center px-5 pt-2 pb-3">
        <img src={logoTransparent} alt={lang === 'mr' ? 'सहकार मित्र मंडळ' : 'Sahakar Mitra Mandal'} className="h-16 w-auto object-contain drop-shadow-sm"/>
      </div>

      {/* Gold separator */}
      <div className="mx-5 h-px bg-[#D97706]/30 mb-4"/>

      {/* Hero text */}
      <div className="px-5 mb-5">
        <h1 className="text-[22px] font-bold text-[#8B0000] devanagari leading-tight">
          {lang === 'mr' ? 'परंपरा जपत,' : 'Preserving Values,'}
        </h1>
        <h1 className="text-[22px] font-bold text-[#8B0000] devanagari leading-tight mb-2">
          {lang === 'mr' ? 'व्यवस्थापन अधिक स्मार्ट करूया!' : 'Smart Mandal Management!'}
        </h1>
        <p className="text-stone-500 text-[12px] leading-relaxed">
          {lang === 'mr'
            ? 'परंपरा आणि संस्कृती जपत, डिजिटल तंत्रज्ञानासह अधिक सक्षम समाज निर्माण करूया.'
            : 'Preserving our values, with technology for a stronger community!'}
        </p>
      </div>

      {/* 2×2 feature grid */}
      <div className="grid grid-cols-2 gap-3 px-5 mb-5">
        {features.map(({ icon: Icon, titleMr, title, subMr, sub }) => (
          <div key={title} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-card">
            <div className="w-11 h-11 rounded-full bg-[#8B0000]/10 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-[#8B0000]"/>
            </div>
            <p className="text-[13px] font-bold text-[#2C2C2C] devanagari leading-snug">
              {lang === 'mr' ? titleMr : title}
            </p>
            <p className="text-[9px] text-stone-400 devanagari mt-0.5">
              {lang === 'mr' ? subMr : sub}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <div className="h-px w-8 bg-[#D97706]/30"/>
        {Array.from({ length: totalSlides }, (_, i) => (
          <button key={i} onClick={() => setSlide(i)}
            className={`rounded-full transition-all ${i === slide ? 'w-5 h-2 bg-[#8B0000]' : 'w-2 h-2 bg-stone-300'}`}/>
        ))}
        <div className="h-px w-8 bg-[#D97706]/30"/>
      </div>

      {/* CTA */}
      <div className="px-5 mb-4">
        <button onClick={onNext}
          className="w-full h-[54px] bg-[#8B0000] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-brand active:scale-[0.98] transition-transform">
          <span className="devanagari">{lang === 'mr' ? 'सुरुवात करा →' : 'Get Started →'}</span>
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-stone-100 mt-1">
        <div className="flex items-center gap-2">
          <span className="text-[#D97706] text-[14px]">✦</span>
          <div>
            <p className="text-[#8B0000] text-[10px] font-bold devanagari">
              {lang === 'mr' ? '|| गणपती बाप्पा मोरया ||' : '|| Shree Ganesh ||'}
            </p>
            <p className="text-stone-400 text-[9px]">
              {lang === 'mr' ? 'उज्वल भविष्यासाठी एकत्र' : 'Together for a Better Tomorrow'}
            </p>
          </div>
        </div>
        <p className="text-stone-400 text-[9px] text-right">
          {lang === 'mr' ? 'समाज | संस्कृती | तंत्रज्ञान' : 'Community | Culture | Technology'}
        </p>
      </div>
    </div>
  )
}

// ─── SCREEN: LOGIN ────────────────────────────────────────────────────────────

function LoginScreen({ lang, onNext, onRegister, pop }: { lang: Lang; onNext: () => void; onRegister: () => void; pop?: () => void }) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Clear any existing recaptcha from other screens to prevent DOM conflicts
    if (recaptchaVerifier) {
      try { recaptchaVerifier.clear(); } catch(e){}
      recaptchaVerifier = null;
    }
  }, [])

  const handleNext = async () => {
    if (!phone || phone.length < 10) {
      setError(lang === 'mr' ? 'कृपया योग्य मोबाईल क्रमांक प्रविष्ट करा' : 'Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-login', {
          size: 'invisible'
        });
      }
      const appVerifier = recaptchaVerifier;
      const phoneNumber = `+91${phone}`;
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      authState.confirmationResult = confirmationResult;
      authState.phoneNumber = phoneNumber;
      onNext();
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      console.error(err);
      if (recaptchaVerifier) {
        try { recaptchaVerifier.clear(); } catch(e){}
        recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5]">
      {/* Top nav */}
      <div className="flex items-center justify-between px-5 mb-2 flex-shrink-0" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 18px)' }}>
        <button onClick={pop} className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center">
          <ChevronLeft className="w-4.5 h-4.5 text-[#2C2C2C]"/>
        </button>
        <button onClick={onRegister} className="flex items-center gap-1 border border-[#8B0000]/30 rounded-full px-4 py-1.5 text-[13px] text-[#8B0000] font-medium">
          {lang === 'mr' ? 'पुढे जा' : 'Skip'} <ChevronRight className="w-3.5 h-3.5"/>
        </button>
      </div>

      {/* Content — vertically centered in remaining space */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Logo */}
        <div className="flex flex-col items-center px-6 pb-4">
          <img src={logoTransparent} alt={lang === 'mr' ? 'सहकार मित्र मंडळ' : 'Sahakar Mitra Mandal'} className="h-20 w-auto object-contain drop-shadow-sm"/>
        </div>

        {/* Title */}
        <div className="px-6 mb-5">
          <h1 className="text-[26px] font-bold text-[#8B0000] devanagari">
            {lang === 'mr' ? 'लॉगिन करा' : 'Login'}
          </h1>
          <p className="text-[#2C2C2C] text-[15px] font-semibold mt-1">
            {lang === 'mr' ? 'आपल्या मंडळात पुन्हा स्वागत आहे.' : 'Sign in to access your Mandal account.'}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3 px-6">
          <div className="flex items-center gap-2 bg-white border border-[#E8DFD4] rounded-2xl px-4 h-[54px] focus-within:border-[#8B0000] transition-colors">
            <Phone className="w-4.5 h-4.5 text-[#8B0000] flex-shrink-0"/>
            <span className="text-[14px] text-[#2C2C2C] border-r border-stone-200 pr-3 mr-1">+91</span>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder={lang === 'mr' ? 'मोबाईल क्रमांक' : 'Mobile Number'}
              className="flex-1 text-[14px] text-[#2C2C2C] placeholder:text-stone-400 outline-none bg-transparent" type="tel" maxLength={10}/>
          </div>
        </div>

        {error && <p className="px-6 mt-3 text-red-500 text-sm text-center">{error}</p>}

        {/* CTA */}
        <div className="px-6 mt-5">
          <button onClick={handleNext} disabled={loading}
            className={`w-full h-[54px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-brand transition-transform ${loading ? 'bg-[#8B0000]/70' : 'bg-[#8B0000] active:scale-[0.98]'}`}>
            <span className="devanagari">
              {loading ? (lang === 'mr' ? 'कृपया प्रतीक्षा करा...' : 'Please wait...') : (lang === 'mr' ? 'OTP पाठवा →' : 'Send OTP →')}
            </span>
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-[13px] text-stone-500 mt-4 px-6">
          {lang === 'mr' ? 'नवीन सदस्य आहात? ' : 'New to Mandal? '}
          <button onClick={onRegister} className="text-[#8B0000] font-bold">
            {lang === 'mr' ? 'खाते तयार करा' : 'Create Account'}
          </button>
        </p>
      </div>

      <div id="recaptcha-container-login"></div>
      <TempleFooter lang={lang} />
    </div>
  )
}

// ─── SCREEN: REGISTER ────────────────────────────────────────────────────────

let recaptchaVerifier: RecaptchaVerifier | null = null;

function RegisterScreen({ lang, onNext, pop }: { lang: Lang; onNext: () => void; pop?: () => void }) {
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [agreed, setAgreed] = useState(true)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNext = async () => {
    if (!phone || phone.length < 10) {
      setError(lang === 'mr' ? 'कृपया योग्य मोबाईल क्रमांक प्रविष्ट करा' : 'Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }
      const appVerifier = recaptchaVerifier;
      const phoneNumber = `+91${phone}`;
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      authState.confirmationResult = confirmationResult;
      authState.phoneNumber = phoneNumber;
      onNext();
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      console.error(err);
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5] overflow-y-auto no-scrollbar">
      {/* Top nav — back (left) and skip (right) only */}
      <div className="flex items-center justify-between px-5" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 14px, 20px)' }}>
        <button onClick={pop} className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center">
          <ChevronLeft className="w-4.5 h-4.5 text-[#2C2C2C]"/>
        </button>
        <button onClick={onNext} className="flex items-center gap-1 border border-[#8B0000]/30 rounded-full px-4 py-1.5 text-[13px] text-[#8B0000] font-medium">
          {lang === 'mr' ? 'पुढे जा' : 'Skip'} <ChevronRight className="w-3.5 h-3.5"/>
        </button>
      </div>

      {/* Logo — centered on its own row */}
      <div className="flex justify-center mt-4 mb-2">
        <img src={logoTransparent} alt="" className="h-14 w-auto object-contain drop-shadow-sm"/>
      </div>

      {/* Title */}
      <div className="px-6 mt-3 mb-4">
        <h1 className="text-[22px] font-bold text-[#8B0000] devanagari">
          {lang === 'mr' ? 'आपले खाते तयार करा' : 'Create Your Account'}
        </h1>
        <p className="text-stone-400 text-[11px] mt-1">
          {lang === 'mr' ? 'मंडळाशी जोडा, सेवेत सहभागी व्हा, बदलाचा भाग बना.' : 'Join the mandal, be part of seva, create an impact.'}
        </p>
      </div>

      {/* Step indicator */}
      <div className="px-6 mb-5">
        <RegStepper step={0} lang={lang}/>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-3 px-6">
        <AuthInput icon={User2} label={lang === 'mr' ? 'पूर्ण नाव' : 'Full Name'} placeholder={lang === 'mr' ? 'आपले पूर्ण नाव प्रविष्ट करा' : 'Enter your full name'}/>
        <AuthInput icon={Mail} label={lang === 'mr' ? 'ईमेल (पर्यायी)' : 'Email (Optional)'} placeholder="example@gmail.com" type="email"/>
        <div className="flex items-center gap-2 bg-white border border-[#E8DFD4] rounded-2xl px-4 h-[54px] focus-within:border-[#8B0000] transition-colors">
          <Phone className="w-4.5 h-4.5 text-[#8B0000] flex-shrink-0"/>
          <span className="text-[14px] text-[#2C2C2C] border-r border-stone-200 pr-3 mr-1">+91</span>
          <input placeholder={lang === 'mr' ? 'मोबाईल क्रमांक *' : '+91 98765 43210'}
            value={phone} onChange={e => setPhone(e.target.value)}
            className="flex-1 text-[14px] text-[#2C2C2C] placeholder:text-stone-400 outline-none bg-transparent" type="tel" maxLength={10}/>
        </div>
        <AuthInput icon={Lock} label={lang === 'mr' ? 'पासवर्ड *' : 'Password *'}
          placeholder={lang === 'mr' ? 'किमान 6 अक्षरे असणे आवश्यक आहे' : 'Minimum 6 characters'}
          type={showPw ? 'text' : 'password'}
          right={<button onClick={() => setShowPw(p => !p)}><Eye className="w-4 h-4 text-stone-400"/></button>}/>
        <AuthInput icon={Lock} label={lang === 'mr' ? 'पासवर्ड पुन्हा प्रविष्ट करा *' : 'Confirm Password *'}
          placeholder={lang === 'mr' ? 'आपला पासवर्ड पुन्हा प्रविष्ट करा' : 'Re-enter your password'}
          type={showPw2 ? 'text' : 'password'}
          right={<button onClick={() => setShowPw2(p => !p)}><Eye className="w-4 h-4 text-stone-400"/></button>}/>
        {/* Terms */}
        <button onClick={() => setAgreed(a => !a)} className="flex items-start gap-3 text-left mt-1">
          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors ${agreed ? 'bg-[#8B0000] border-[#8B0000]' : 'border-stone-300'}`}>
            {agreed && <Check className="w-3 h-3 text-white"/>}
          </div>
          <p className="text-[12px] text-stone-500 leading-relaxed">
            {lang === 'mr'
              ? 'मी नियम आणि अटी तसेच गोपनीयता धोरणाशी सहमत आहे.'
              : 'I agree to the Terms & Conditions and Privacy Policy.'}
          </p>
        </button>
      </div>

      {error && <p className="px-6 mt-3 text-red-500 text-sm text-center">{error}</p>}

      {/* CTA */}
      <div className="px-6 mt-5 pb-4">
        <button onClick={handleNext} disabled={loading}
          className={`w-full h-[54px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-brand transition-transform ${loading ? 'bg-[#8B0000]/70' : 'bg-[#8B0000] active:scale-[0.98]'}`}>
          <span className="devanagari">
            {loading ? (lang === 'mr' ? 'कृपया प्रतीक्षा करा...' : 'Please wait...') : (lang === 'mr' ? 'पुढे चला →' : 'Continue →')}
          </span>
        </button>
      </div>

      <div id="recaptcha-container"></div>
      <TempleFooter lang={lang} />
    </div>
  )
}

// ─── SCREEN: OTP ─────────────────────────────────────────────────────────────

function OTPScreen({ lang, onNext, pop }: { lang: Lang; onNext: () => void; pop?: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(28)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (timer > 0) { const id = setTimeout(() => setTimer(t => t - 1), 1000); return () => clearTimeout(id) }
  }, [timer])

  const handleKey = (k: number | string) => {
    if (k === '⌫') {
      const idx = [...otp].reverse().findIndex((v: string) => v !== '')
      const realIdx = idx >= 0 ? otp.length - 1 - idx : -1
      if (realIdx >= 0) setOtp(prev => { const n = [...prev]; n[realIdx] = ''; return n })
    } else if (k !== '') {
      const idx = otp.findIndex(v => v === '')
      if (idx >= 0) setOtp(prev => { const n = [...prev]; n[idx] = String(k); return n })
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError(lang === 'mr' ? 'कृपया पूर्ण OTP प्रविष्ट करा' : 'Please enter the complete OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (!authState.confirmationResult) {
        throw new Error('OTP session expired. Please try again.');
      }
      await authState.confirmationResult.confirm(otpString);
      onNext();
    } catch (err: any) {
      console.error(err);
      setError(lang === 'mr' ? 'चुकीचा OTP. कृपया पुन्हा प्रयत्न करा.' : 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5] overflow-y-auto no-scrollbar">
      {/* Top nav — back (left) and मदत (right) only */}
      <div className="flex items-center justify-between px-5" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 14px, 20px)' }}>
        <button onClick={pop} className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center">
          <ChevronLeft className="w-4.5 h-4.5 text-[#2C2C2C]"/>
        </button>
        <button className="flex items-center gap-1 border border-[#8B0000]/30 rounded-full px-4 py-1.5 text-[13px] text-[#8B0000] font-medium">
          {lang === 'mr' ? 'मदत' : 'Help'} <span className="w-4 h-4 rounded-full bg-[#8B0000]/10 text-[#8B0000] text-[10px] font-bold flex items-center justify-center">?</span>
        </button>
      </div>

      {/* Logo — centered on its own row */}
      <div className="flex justify-center mt-5 mb-2">
        <img src={logoTransparent} alt="" className="h-16 w-auto object-contain drop-shadow-sm"/>
      </div>

      {/* Title */}
      <div className="px-6 mt-4 mb-4 text-center">
        <h1 className="text-[24px] font-bold text-[#8B0000] devanagari">
          {lang === 'mr' ? 'मोबाईल पडताळणी' : 'Mobile Verification'}
        </h1>
        <p className="text-stone-400 text-[11px] mt-2 leading-relaxed">
          {lang === 'mr' ? 'आपल्या नोंदणीकृत मोबाईल क्रमांकावर आम्ही एक OTP पाठवला आहे.' : 'We have sent a 6-digit OTP to your mobile number'}
        </p>
      </div>

      {/* Phone display */}
      <div className="mx-6 flex items-center justify-between bg-[#8B0000]/5 border border-[#8B0000]/20 rounded-2xl px-4 h-[50px] mb-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#8B0000]"/>
          <span className="text-[15px] font-bold text-[#2C2C2C]">{authState.phoneNumber || '+91 -'}</span>
        </div>
        <button onClick={pop} className="text-[#D97706] text-[12px] font-semibold flex items-center gap-1">
          {lang === 'mr' ? 'बदला' : 'Edit'} <Edit3 className="w-3 h-3"/>
        </button>
      </div>

      {/* OTP boxes */}
      <div className="flex gap-2.5 justify-center px-6 mb-3">
        {otp.map((v, i) => (
          <div key={i}
            className={`flex-1 h-14 bg-white rounded-2xl flex items-center justify-center text-[22px] font-bold border-2 transition-colors ${v ? 'border-[#8B0000] text-[#2C2C2C]' : 'border-stone-200 text-transparent'}`}>
            {v || <span className={`w-0.5 h-5 bg-[#8B0000] ${i === otp.findIndex(x => !x) ? 'animate-pulse' : 'opacity-0'}`}/>}
          </div>
        ))}
      </div>

      {error && <p className="text-center text-red-500 text-sm mb-3">{error}</p>}

      {/* Resend */}
      <p className="text-center text-[12px] text-stone-400 mb-4">
        {lang === 'mr' ? 'OTP मिळाला नाही? ' : "Didn't receive the OTP? "}
        {timer > 0
          ? <span className="text-[#8B0000] font-semibold">
              {lang === 'mr' ? `पुन्हा पाठवा (००:${String(timer).padStart(2, '0')})` : `Resend OTP in 00:${String(timer).padStart(2, '0')}`}
            </span>
          : <button onClick={pop} className="text-[#8B0000] font-semibold">{lang === 'mr' ? 'OTP पुन्हा पाठवा' : 'Resend OTP'}</button>
        }
      </p>

      {/* CTA */}
      <div className="px-6 mb-4">
        <button onClick={handleVerify} disabled={loading}
          className={`w-full h-[54px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-brand transition-transform ${loading ? 'bg-[#8B0000]/70' : 'bg-[#8B0000] active:scale-[0.98]'}`}>
          <span className="devanagari">
            {loading ? (lang === 'mr' ? 'पडताळणी करत आहे...' : 'Verifying...') : (lang === 'mr' ? 'पडताळणी करा →' : 'Verify & Continue →')}
          </span>
        </button>
      </div>

      {/* Divider + security note */}
      <div className="flex items-center gap-3 px-6 mb-3">
        <div className="flex-1 h-px bg-stone-200"/>
        <span className="text-[#D97706] text-[12px]">✦</span>
        <div className="flex-1 h-px bg-stone-200"/>
      </div>
      <div className="mx-6 flex items-center gap-3 bg-white border border-stone-100 rounded-2xl px-4 py-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-[#8B0000]/8 flex items-center justify-center flex-shrink-0">
          <Lock className="w-4 h-4 text-[#8B0000]"/>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-[#2C2C2C] devanagari">
            {lang === 'mr' ? 'तुमची माहिती सुरक्षित आहे' : 'Your data is 100% secure'}
          </p>
          <p className="text-[10px] text-stone-400">
            {lang === 'mr' ? '१००% सुरक्षित व कूटबद्ध' : 'End-to-end encrypted & protected'}
          </p>
        </div>
      </div>

      {/* Numeric keypad */}
      <div className="grid grid-cols-3 gap-2 px-6 mb-4">
        {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
          <button key={i} onClick={() => handleKey(k)}
            className={`h-12 rounded-2xl text-[20px] font-semibold transition-colors ${k === '' ? '' : 'bg-white border border-stone-100 shadow-sm text-[#2C2C2C] active:bg-stone-100'}`}>
            {k}
          </button>
        ))}
      </div>

      <TempleFooter lang={lang} />
    </div>
  )
}

// ─── SCREEN: PROFILE SETUP ────────────────────────────────────────────────────

function ProfileSetupScreen({ lang, onNext, pop, store }: { lang: Lang; onNext: () => void; pop?: () => void; store?: AppStore }) {
  const [role, setRole] = useState(lang === 'mr' ? 'सदस्य' : 'Member')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  
  const roles = lang === 'mr'
    ? [{ key: 'सदस्य', icon: Users }, { key: 'देणगीदार', icon: IndianRupee }, { key: 'स्वयंसेवक', icon: Calendar }, { key: 'व्यवस्थापन', icon: Settings }]
    : [{ key: 'Member', icon: Users }, { key: 'Donor', icon: IndianRupee }, { key: 'Volunteer', icon: Calendar }, { key: 'Manager', icon: Settings }]

  const handleNext = async () => {
    setLoading(true);
    try {
      const mobile = authState.phoneNumber || '+91' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const roleStr = role === 'Member' || role === 'सदस्य' ? 'Member' : 'Admin';
      const roleMrStr = role === 'Member' || role === 'सदस्य' ? 'सदस्य' : 'प्रशासक';

      // Ensure the backend server is running on port 5000
      const response = await fetch('http://localhost:5000/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Kuldeep Godse',
          mobile,
          role: roleStr,
          roleMr: roleMrStr,
          dob,
          address: city,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }
      
      store?.updateCurrentUser({
        name: name || 'Kuldeep Godse',
        role: roleStr,
        roleMr: roleMrStr,
      });

      onNext();
    } catch (err) {
      console.error(err);
      alert('Error saving profile to database. Make sure backend is running!');
      // Still allow them to proceed for testing purposes
      onNext();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5] overflow-y-auto no-scrollbar">
      {/* Top nav — back (left) and skip (right) only */}
      <div className="flex items-center justify-between px-5" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 14px, 20px)' }}>
        <button onClick={pop} className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center">
          <ChevronLeft className="w-4.5 h-4.5 text-[#2C2C2C]"/>
        </button>
        <button onClick={onNext} className="flex items-center gap-1 border border-[#8B0000]/30 rounded-full px-4 py-1.5 text-[13px] text-[#8B0000] font-medium">
          {lang === 'mr' ? 'पुढे जा' : 'Skip'} <ChevronRight className="w-3.5 h-3.5"/>
        </button>
      </div>

      {/* Logo — centered on its own row */}
      <div className="flex justify-center mt-4 mb-2">
        <img src={logoTransparent} alt="" className="h-14 w-auto object-contain drop-shadow-sm"/>
      </div>

      {/* Step indicator — step 2 (index 2 = profile details) */}
      <div className="px-6 mt-3 mb-4">
        <RegStepper step={2} lang={lang}/>
      </div>

      {/* Title */}
      <div className="px-6 mb-4 text-center">
        <h1 className="text-[22px] font-bold text-[#8B0000] devanagari">
          {lang === 'mr' ? 'आपला प्रोफाइल तयार करा' : 'Complete Your Profile'}
        </h1>
        <p className="text-stone-400 text-[11px] mt-1">
          {lang === 'mr' ? 'आम्हाला तुम्हाला अधिक चांगला अनुभव देण्यासाठी काही माहिती आवश्यक आहे.' : 'Help us personalize your experience.'}
        </p>
      </div>

      {/* Profile photo */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-stone-200 flex items-center justify-center border-2 border-stone-100">
            <User2 className="w-10 h-10 text-stone-400"/>
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#8B0000] flex items-center justify-center border-2 border-white">
            <Camera className="w-3.5 h-3.5 text-white"/>
          </button>
        </div>
        <p className="text-[#8B0000] text-[12px] font-semibold mt-2 devanagari">
          {lang === 'mr' ? 'प्रोफाइल फोटो जोडा' : 'Add Profile Photo'}
        </p>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-3 px-6">
        <AuthInput icon={User2}
          label={lang === 'mr' ? 'संपूर्ण नाव *' : 'Full Name *'}
          placeholder={lang === 'mr' ? 'उदा. कुलदीप गोदसे' : 'e.g. Kuldeep Godse'}
          value={name} onChange={setName}/>
          
        <div className="flex items-center gap-2 bg-white border border-[#E8DFD4] rounded-2xl px-4 h-[54px] focus-within:border-[#8B0000] transition-colors relative">
          <Calendar className="w-4.5 h-4.5 text-[#8B0000] flex-shrink-0"/>
          <input 
            type="date"
            value={dob} onChange={e => setDob(e.target.value)}
            className={`flex-1 text-[14px] outline-none bg-transparent appearance-none ${dob ? 'text-[#2C2C2C]' : 'text-stone-400'}`}
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#E8DFD4] rounded-2xl px-4 h-[54px] focus-within:border-[#8B0000] transition-colors relative">
          <MapPin className="w-4.5 h-4.5 text-[#8B0000] flex-shrink-0"/>
          <select value={city} onChange={e => setCity(e.target.value)}
            className={`flex-1 text-[14px] outline-none bg-transparent appearance-none cursor-pointer ${city ? 'text-[#2C2C2C]' : 'text-stone-400'}`}>
            <option value="" disabled>{lang === 'mr' ? 'शहर / गाव निवडा *' : 'City / Village *'}</option>
            <option value="Pune">Pune (पुणे)</option>
            <option value="Mumbai">Mumbai (मुंबई)</option>
            <option value="Nashik">Nashik (नाशिक)</option>
            <option value="Satara">Satara (सातारा)</option>
            <option value="Kolhapur">Kolhapur (कोल्हापूर)</option>
            <option value="Solapur">Solapur (सोलापूर)</option>
            <option value="Pandharpur">Pandharpur (पंढरपूर)</option>
          </select>
          <ChevronDown className="w-4 h-4 text-stone-400 pointer-events-none absolute right-4"/>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#E8DFD4] rounded-2xl px-4 h-[54px] focus-within:border-[#8B0000] transition-colors relative">
          <Users className="w-4.5 h-4.5 text-[#8B0000] flex-shrink-0"/>
          <select value={role} onChange={e => setRole(e.target.value)}
            className={`flex-1 text-[14px] outline-none bg-transparent appearance-none cursor-pointer text-[#2C2C2C]`}>
            {roles.map(r => (
              <option key={r.key} value={r.key}>{r.key}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-stone-400 pointer-events-none absolute right-4"/>
        </div>

        {/* Role pills — all on one line */}
        <div className="flex gap-2 mt-1 overflow-x-auto no-scrollbar">
          {roles.map(({ key, icon: Icon }) => (
            <button key={key} onClick={() => setRole(key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${role === key ? 'bg-[#8B0000] border-[#8B0000] text-white' : 'bg-white border-stone-200 text-[#2C2C2C]'}`}>
              <Icon className="w-3 h-3"/>
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 mt-5 pb-4">
        <button onClick={handleNext}
          className="w-full h-[54px] bg-[#8B0000] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-brand active:scale-[0.98] transition-transform">
          <span className="devanagari">{lang === 'mr' ? 'पुढे चला →' : 'Continue →'}</span>
        </button>
      </div>

      <TempleFooter lang={lang} />
    </div>
  )
}

// ─── SCREEN: MANDAL SELECTION ─────────────────────────────────────────────────

// ─── SCREEN: DASHBOARD ────────────────────────────────────────────────────────

function DashboardScreen({ lang, push, store }: { lang: Lang; push: (s: Screen) => void; store?: AppStore }) {
  const t = TR[lang]
  const hour = new Date().getHours()
  const greetingMr = hour < 12 ? 'सुप्रभात' : hour < 17 ? 'शुभ दुपार' : 'शुभ संध्या'
  const greetingEn = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  const quickActions: Array<{ Icon: () => React.ReactElement; labelMr: string; label: string; screen: Screen }> = [
    {
      labelMr: 'नवीन जमा', label: 'New Collection', screen: 'collections',
      Icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <circle cx="12" cy="5.5" r="4"/>
          <line x1="10.2" y1="4" x2="13.8" y2="4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="10.2" y1="5.8" x2="13.2" y2="5.8" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="10.2" y1="4" x2="10.2" y2="8.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="10.4" y1="6.2" x2="13.8" y2="9" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <rect x="7" y="12" width="2" height="5.5" rx="1"/>
          <rect x="10" y="11" width="2" height="6.5" rx="1"/>
          <rect x="13" y="11.5" width="2" height="6" rx="1"/>
          <rect x="16" y="12" width="2" height="5.5" rx="1"/>
          <rect x="7" y="17" width="11" height="3" rx="1.5"/>
          <ellipse cx="5.5" cy="16" rx="1.5" ry="2.2" transform="rotate(-15 5.5 16)"/>
        </svg>
      ),
    },
    {
      labelMr: 'देणगी', label: 'Donation', screen: 'donations',
      Icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12 9C11 6.2 8 5.5 6.5 7.2C5 9 6 11.5 12 15.5C18 11.5 19 9 17.5 7.2C16 5.5 13 6.2 12 9z"/>
          <rect x="7" y="17" width="2" height="5" rx="1"/>
          <rect x="10" y="16" width="2" height="6" rx="1"/>
          <rect x="13" y="16.5" width="2" height="5.5" rx="1"/>
          <rect x="16" y="17" width="2" height="5" rx="1"/>
          <rect x="7" y="21.5" width="11" height="2.5" rx="1.5"/>
          <ellipse cx="5.5" cy="20.5" rx="1.5" ry="2" transform="rotate(-15 5.5 20.5)"/>
        </svg>
      ),
    },
    {
      labelMr: 'खर्च', label: 'Expense', screen: 'expenses',
      Icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M5 3.5A1.5 1.5 0 016.5 2h8L19 6.5V20a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 20V3.5z"/>
          <path d="M14.5 2v4.5H19" fill="white" opacity="0.25"/>
          <rect x="7.5" y="9" width="5" height="1.2" rx="0.5" fill="white" opacity="0.65"/>
          <rect x="7.5" y="11.5" width="8" height="1.2" rx="0.5" fill="white" opacity="0.65"/>
          <path d="M8 17.5h8M14.5 15l2.5 2.5L14.5 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ),
    },
    {
      labelMr: 'पावती', label: 'Receipt', screen: 'receipt',
      Icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <rect x="4" y="2" width="14" height="20" rx="2"/>
          <rect x="4" y="2" width="3.5" height="20" rx="1.5" opacity="0.5"/>
          <path d="M11 7.5h5M11 9.5h4M11 7.5v5.5M11.5 10L15 13" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          <path d="M15.5 2v5l-1.5-1.5L12.5 7V2z" fill="white" opacity="0.4"/>
        </svg>
      ),
    },
    {
      labelMr: 'QR पेमेंट', label: 'QR Payment', screen: 'qr-payment',
      Icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2"/>
          <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2"/>
          <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2"/>
          <rect x="5.5" y="5.5" width="2.5" height="2.5" rx="0.4" fill="white"/>
          <rect x="16" y="5.5" width="2.5" height="2.5" rx="0.4" fill="white"/>
          <rect x="5.5" y="16" width="2.5" height="2.5" rx="0.4" fill="white"/>
          <rect x="14" y="14" width="2.5" height="2.5" rx="0.4"/>
          <rect x="17.5" y="14" width="2.5" height="2.5" rx="0.4"/>
          <rect x="14" y="17.5" width="2.5" height="2.5" rx="0.4"/>
          <rect x="17.5" y="17.5" width="2.5" height="2.5" rx="0.4"/>
          <path d="M2 7V2h5M22 7V2h-5M2 17v5h5M22 17v5h-5" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      labelMr: 'सदस्य', label: 'Members', screen: 'members',
      Icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <circle cx="7" cy="8.5" r="2.5" opacity="0.55"/>
          <path d="M2 22c0-3.3 2.2-5.5 5-5.5s5 2.2 5 5.5" opacity="0.55"/>
          <circle cx="17" cy="8.5" r="2.5" opacity="0.55"/>
          <path d="M12 22c0-3.3 2.2-5.5 5-5.5s5 2.2 5 5.5" opacity="0.55"/>
          <circle cx="12" cy="7" r="3"/>
          <path d="M5.5 22c0-3.8 2.9-6 6.5-6s6.5 2.2 6.5 6"/>
        </svg>
      ),
    },
    {
      labelMr: 'सार्वजनिक', label: 'Public Portal', screen: 'public-portal',
      Icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      ),
    },
    {
      labelMr: 'ऑफलाइन', label: 'Offline', screen: 'offline',
      Icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5C7.5 10 10.2 9 12 9s4.5 1 7 3.5"/>
          <path d="M7.5 15.5A6.5 6.5 0 0112 14a6.5 6.5 0 014.5 1.5"/>
          <circle cx="12" cy="19" r="1" fill="currentColor"/>
          <line x1="3" y1="3" x2="21" y2="21"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F5F0EB]">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#8B0000] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6B0000 0%, #8B0000 60%, #A50000 100%)' }}>
        {/* Ganapati murti right-side ghost */}
        <img src={ganapatiMurti} alt="" aria-hidden="true"
          className="absolute right-0 top-0 h-full w-36 object-cover object-top"
          style={{ opacity: 0.18, maskImage: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
        />
        {/* Subtle radial glow top-right */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FCD34D, transparent)' }} />

        <div className="relative px-4 pb-6" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 20px)' }}>
          {/* Logo row */}
          <div className="flex items-center justify-between mb-3">
            <img src={logoTransparent} alt={lang === 'mr' ? 'सहकार मित्र मंडळ' : 'Sahakar Mitra Mandal'} className="h-10 w-auto object-contain" />
            <div className="flex items-center gap-2">
              <button onClick={() => push('notifications')}
                className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center relative">
                <Bell className="w-4 h-4 text-white" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FCD34D] rounded-full border border-[#8B0000]" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/20 border border-white/30 text-white font-bold text-[11px] flex items-center justify-center tracking-wide">
                SK
              </button>
            </div>
          </div>
          {/* Greeting */}
          <div>
            <p className="text-white/70 text-[12px] font-medium">
              {lang === 'mr' ? greetingMr : greetingEn},&nbsp;
              <span className="text-white font-bold text-[14px]">Siddharth</span>
              <span className="ml-1">🙏</span>
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-white/55 text-[11px]">
                {lang === 'mr' ? 'गणेशोत्सव २०२६ • सक्रिय उत्सव' : 'Ganeshotsav 2026 • Active Festival'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FINANCIAL OVERVIEW CARD ────────────────────────── */}
      <div className="px-4 mt-4 mb-1">
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #4A0000 0%, #6B0000 45%, #8B0000 100%)' }}>

          {/* Gold accent top bar */}
          <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #B45309, #FCD34D 50%, #B45309)' }} />

          {/* Card header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-4">
            <div>
              <p className="text-white/40 text-[9px] font-semibold uppercase tracking-[0.15em] mb-0.5">
                {lang === 'mr' ? 'आर्थिक आढावा' : 'Financial Overview'}
              </p>
              <p className="text-white/80 text-[12px] font-semibold">
                {lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[#FCD34D] text-[10px] font-bold uppercase tracking-wide border border-[#FCD34D]/40 px-2.5 py-1 rounded-md">
                {lang === 'mr' ? 'गणेशोत्सव २०२६' : 'GANESHOTSAV 2026'}
              </span>
            </div>
          </div>

          {/* Rule */}
          <div className="mx-4 h-px bg-white/10" />

          {/* Main income / expense — no inner containers, pure type */}
          <div className="grid grid-cols-2 px-4 py-4 gap-4">
            <div>
              <p className="text-white/45 text-[10px] font-medium uppercase tracking-wide mb-2">
                {lang === 'mr' ? 'एकूण जमा' : 'Total Income'}
              </p>
              <p className="text-white font-bold leading-none tracking-tight" style={{ fontSize: 26 }}>{fmt(382451)}</p>
              <div className="flex items-center gap-1 mt-2.5">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-[10px] font-semibold">
                  {lang === 'mr' ? 'या महिन्यात +१२%' : '+12% this month'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-white/45 text-[10px] font-medium uppercase tracking-wide mb-2">
                {lang === 'mr' ? 'एकूण खर्च' : 'Total Expense'}
              </p>
              <p className="text-white font-bold leading-none tracking-tight" style={{ fontSize: 26 }}>{fmt(231200)}</p>
              <div className="flex items-center gap-1 mt-2.5">
                <TrendingDown className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400 text-[10px] font-semibold">
                  {lang === 'mr' ? 'जमेच्या ७३%' : '73% of income'}
                </span>
              </div>
            </div>
          </div>

          {/* Full-width rule before sub-stats */}
          <div className="h-px bg-white/10" />

          {/* Sub-stats — plain columns, thin ruled dividers, no box */}
          <div className="grid grid-cols-3 px-0">
            {[
              { labelMr: 'हातातील रोख', label: 'Cash in Hand', val: '₹1.6L' },
              { labelMr: 'बँक शिल्लक',  label: 'Bank Balance',  val: '₹3.8L' },
              { labelMr: 'निव्वळ शिल्लक', label: 'Net Balance', val: fmt(151251) },
            ].map(({ labelMr, label, val }, i) => (
              <div key={label}
                className={`flex flex-col items-center py-3.5 ${i < 2 ? 'border-r border-white/10' : ''}`}>
                <p className="text-white font-bold text-[15px] leading-none mb-1.5">{val}</p>
                <p className="text-white/40 text-[9px] font-medium text-center leading-tight devanagari px-2">
                  {lang === 'mr' ? labelMr : label}
                </p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-px bg-white/10" />
          <div className="px-4 py-3">
            <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '60.6%', background: 'linear-gradient(90deg, #FCD34D, #F59E0B)' }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white/35 text-[9px] font-medium">{lang === 'mr' ? 'खर्च प्रमाण' : 'Expense'}: 60.6%</span>
              <span className="text-[#FCD34D]/60 text-[9px] font-medium">{lang === 'mr' ? 'शिल्लक' : 'Surplus'}: 39.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ──────────────────────────────────── */}
      <div className="px-4 mt-5">
        {/* Section header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-2.5">
            <div className="w-[3px] h-10 rounded-full mt-0.5 flex-shrink-0" style={{ background: 'linear-gradient(180deg, #D97706, #B45309)' }} />
            <div>
              <h2 className="text-[18px] font-extrabold text-[#6B0000] leading-tight devanagari">
                {lang === 'mr' ? 'जलद क्रिया' : 'Quick Actions'}
              </h2>
              <p className="text-[10px] text-[#78716C] mt-0.5 devanagari">
                {lang === 'mr' ? 'सेवा, सहभाग आणि सतकार्य एकाच ठिकाणी' : 'Service, participation & good deeds in one place'}
              </p>
            </div>
          </div>
          <button onClick={() => push('collections')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#8B0000] devanagari flex-shrink-0 mt-0.5"
            style={{ background: '#FDDCDC' }}>
            {lang === 'mr' ? 'सर्व पहा' : 'See All'} →
          </button>
        </div>

        {/* 4-column action grid */}
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map(({ Icon, label, labelMr, screen }) => (
            <button key={screen} onClick={() => push(screen)}
              className="relative flex flex-col items-center bg-white rounded-2xl overflow-hidden active:scale-95 transition-transform border border-stone-100/80 pb-2 pt-3"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

              {/* Mandala watermark */}
              <svg viewBox="0 0 80 80" className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 opacity-[0.07] pointer-events-none" aria-hidden="true">
                <circle cx="40" cy="40" r="38" fill="none" stroke="#D97706" strokeWidth="1"/>
                <circle cx="40" cy="40" r="30" fill="none" stroke="#D97706" strokeWidth="0.8"/>
                <circle cx="40" cy="40" r="22" fill="none" stroke="#D97706" strokeWidth="0.6"/>
                {[0,45,90,135,180,225,270,315].map(a => (
                  <ellipse key={a} cx={40 + 30*Math.cos(a*Math.PI/180)} cy={40 + 30*Math.sin(a*Math.PI/180)}
                    rx="6" ry="10" fill="#D97706" opacity="0.5"
                    transform={`rotate(${a} ${40 + 30*Math.cos(a*Math.PI/180)} ${40 + 30*Math.sin(a*Math.PI/180)})`} />
                ))}
              </svg>

              {/* Icon circle */}
              <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-2 text-[#8B0000]"
                style={{ background: '#FFF0E6' }}>
                <Icon />
              </div>

              {/* Label */}
              <span className="relative z-10 text-[10px] font-bold text-[#6B0000] text-center leading-tight px-1 devanagari">
                {lang === 'mr' ? labelMr : label}
              </span>

              {/* Temple spire silhouette at bottom */}
              <svg viewBox="0 0 80 20" className="w-full mt-1.5 opacity-20 pointer-events-none" aria-hidden="true" preserveAspectRatio="none" style={{ height: 12 }}>
                <polygon points="8,20 12,8 16,20" fill="#D97706"/>
                <polygon points="14,20 18,4 22,20" fill="#D97706"/>
                <polygon points="20,20 24,10 28,20" fill="#D97706"/>
                <polygon points="52,20 56,10 60,20" fill="#D97706"/>
                <polygon points="58,20 62,4 66,20" fill="#D97706"/>
                <polygon points="64,20 68,8 72,20" fill="#D97706"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* ── PENDING ALERT ──────────────────────────────────── */}
      <div className="px-4 mt-3.5">
        <button onClick={() => push('pending-collections')}
          className="w-full flex items-center gap-3 bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-3 text-left active:scale-[0.99] transition-transform"
          style={{ boxShadow: '0 1px 3px rgba(217,119,6,0.12)' }}>
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-amber-900">
              {lang === 'mr' ? '₹18,502 बाकी वर्गणी' : '₹18,502 Pending Collections'}
            </p>
            <p className="text-[11px] text-amber-600 mt-0.5">
              {lang === 'mr' ? '5 देणगीदार प्रलंबित' : '5 donors pending • Ganeshotsav 2026'}
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <ChevronRight className="w-4 h-4 text-amber-600" />
          </div>
        </button>
      </div>

      {/* ── RECENT TRANSACTIONS ───────────────────────────── */}
      <div className="px-4 mt-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold text-[#1C1917]">
            {lang === 'mr' ? 'अलीकडील व्यवहार' : 'Recent Transactions'}
          </h2>
          <button onClick={() => push('transactions')}
            className="text-[12px] font-semibold text-[#8B0000] flex items-center gap-0.5">
            {lang === 'mr' ? 'सर्व पहा' : 'View All'} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden border border-stone-100"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)' }}>
          {TRANSACTIONS.slice(0, 4).map((tx, i) => (
            <button key={tx.id} onClick={() => push('transaction-detail')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left active:bg-stone-50 transition-colors ${i < 3 ? 'border-b border-stone-50' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {tx.type === 'income'
                  ? <TrendingUp className="w-4 h-4 text-emerald-600" />
                  : <TrendingDown className="w-4 h-4 text-red-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1C1917] truncate">{lang === 'mr' ? (tx.personMr || tx.person) : tx.person}</p>
                <p className="text-[10.5px] text-[#78716C] truncate mt-0.5">{lang === 'mr' ? (tx.descMr || tx.desc) : tx.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-[13px] font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-[#8B0000]'}`}>
                  {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                </p>
                <p className="text-[10px] text-[#78716C] mt-0.5">{lang === 'mr' ? (tx.timeMr || tx.time) : tx.time}</p>
              </div>
            </button>
          ))}
          <button onClick={() => push('transactions')}
            className="w-full py-3 text-center text-[12px] font-semibold text-[#8B0000] border-t border-stone-50 active:bg-stone-50">
            {lang === 'mr' ? 'सर्व व्यवहार पहा →' : 'See all transactions →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: COLLECTIONS ─────────────────────────────────────────────────────

function CollectionsScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const t = TR[lang]
  const [tab, setTab] = useState<'all' | 'pending' | 'paid'>('all')
  const tabs = [{ k: 'all', l: t.all, lm: 'सर्व' }, { k: 'pending', l: t.pending, lm: 'प्रलंबित' }, { k: 'paid', l: t.paid, lm: 'भरले' }] as const
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={t.collections} onBack={pop} lang={lang} />
      <div className="px-4 py-3 bg-white border-b border-stone-100">
        <SearchBar placeholder={t.search} className="mb-3" />
        <div className="flex gap-2">
          {tabs.map(({ k, l, lm }) => (
            <button key={k} onClick={() => setTab(k as any)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${tab === k ? 'bg-[#8B0000] text-white' : 'bg-stone-100 text-[#78716C]'}`}>
              {lang === 'mr' ? lm : l}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <div className="bg-[#8B0000]/5 rounded-xl p-3 mb-4 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[#78716C]">{lang === 'mr' ? 'एकूण बाकी' : 'Total Outstanding'}</p>
            <p className="text-[20px] font-bold text-[#8B0000]">{fmt(18502)}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#78716C] text-right">{lang === 'mr' ? 'एकूण जमा' : 'Total Collected'}</p>
            <p className="text-[20px] font-bold text-emerald-600">{fmt(159949)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {TRANSACTIONS.filter(tx => tab === 'all' || (tab === 'paid' && tx.status === 'paid') || (tab === 'pending' && tx.status !== 'paid')).map(tx => (
            <Card key={tx.id} onClick={() => push('collection-detail')} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar initials={tx.person.split(' ').map(n => n[0]).join('').slice(0, 2)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-[14px] text-[#1C1917]">{lang === 'mr' ? (tx.personMr || tx.person) : tx.person}</p>
                    <StatusBadge status={tx.status} lang={lang} />
                  </div>
                  <p className="text-[12px] text-[#78716C]">{lang === 'mr' ? (tx.festivalMr || tx.festival) : tx.festival}</p>
                  <p className="text-[11px] text-[#78716C] mt-0.5">{lang === 'mr' ? (tx.methodMr || tx.method) : tx.method} • {lang === 'mr' ? (tx.timeMr || tx.time) : tx.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-bold text-emerald-600">{fmt(tx.amount)}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-stone-100">
                <button onClick={e => { e.stopPropagation(); push('new-collection') }}
                  className="flex-1 h-9 bg-[#8B0000] rounded-lg text-white text-[12px] font-semibold">
                  {lang === 'mr' ? 'जमा करा' : 'Collect'}
                </button>
                <button className="flex-1 h-9 bg-stone-100 rounded-lg text-[#78716C] text-[12px] font-semibold">
                  {lang === 'mr' ? 'इतिहास' : 'History'}
                </button>
                <button className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="px-4 py-3 bg-white border-t border-stone-100">
        <Btn onClick={() => push('new-collection')} className="w-full" icon={<Plus className="w-4 h-4" />}>
          {t.newCollection}
        </Btn>
      </div>
    </div>
  )
}

// ─── SCREEN: NEW COLLECTION ───────────────────────────────────────────────────

function NewCollectionScreen({ lang, push, pop, store }: { lang: Lang; push: (s: Screen) => void; pop: () => void; store?: AppStore }) {
  const t = TR[lang]
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('UPI')
  const methods = lang === 'mr'
    ? [{ k: 'Cash', l: 'रोख' }, { k: 'UPI', l: 'UPI' }, { k: 'NEFT', l: 'NEFT' }, { k: 'Cheque', l: 'धनादेश' }, { k: 'Bank', l: 'बँक' }]
    : [{ k: 'Cash', l: 'Cash' }, { k: 'UPI', l: 'UPI' }, { k: 'NEFT', l: 'NEFT' }, { k: 'Cheque', l: 'Cheque' }, { k: 'Bank', l: 'Bank' }]
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={t.newCollection} onBack={pop} lang={lang}>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-[#D97706]' : 'bg-white/30'}`} />
          ))}
        </div>
      </AppHeader>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-5">
        {step === 1 && (
          <div className="animate-slide-up flex flex-col gap-4">
            <p className="text-[12px] font-semibold text-[#78716C] uppercase tracking-wide mb-1">
              {lang === 'mr' ? 'टप्पा १ — देणगीदार माहिती' : 'Step 1 — Donor Information'}
            </p>
            {/* Existing donor detected banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-[12px] text-blue-700">
                {lang === 'mr' ? 'हा देणगीदार आधीपासून नोंदलेला आहे.' : 'This donor is already registered. Previous history loaded.'}
              </p>
            </div>
            {[
              { label: lang === 'mr' ? 'सदस्य / देणगीदाराचे नाव' : 'Member / Donor Name', placeholder: 'Rahul Patil', icon: Users },
              { label: lang === 'mr' ? 'मोबाइल नंबर' : 'Mobile Number', placeholder: '+91 98765 43210', icon: Phone },
            ].map(({ label, placeholder, icon: Icon }) => (
              <div key={label}>
                <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{label}</label>
                <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 h-12 focus-within:border-[#8B0000] transition-colors">
                  <Icon className="w-4 h-4 text-stone-400" />
                  <input placeholder={placeholder} className="flex-1 text-[14px] outline-none text-[#1C1917] placeholder:text-stone-400 bg-transparent" />
                </div>
              </div>
            ))}
            <div>
              <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{lang === 'mr' ? 'उत्सव' : 'Festival'}</label>
              <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 h-12">
                <Sparkles className="w-4 h-4 text-stone-400" />
                <span className="flex-1 text-[14px] text-[#1C1917]">{lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'}</span>
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="animate-slide-up flex flex-col gap-4">
            <p className="text-[12px] font-semibold text-[#78716C] uppercase tracking-wide mb-1">
              {lang === 'mr' ? 'टप्पा २ — रक्कम आणि पेमेंट' : 'Step 2 — Amount & Payment'}
            </p>
            <div>
              <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{t.amount}</label>
              <div className="flex items-center gap-3 bg-white border-2 border-[#8B0000] rounded-xl px-4 h-14 shadow-brand">
                <IndianRupee className="w-5 h-5 text-[#8B0000]" />
                <input defaultValue="1001" className="flex-1 text-[24px] font-bold text-[#1C1917] outline-none bg-transparent" type="number" />
              </div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#1C1917] mb-3 block">{t.paymentMethod}</label>
              <div className="grid grid-cols-3 gap-2">
                {methods.map(m => (
                  <button key={m.k} onClick={() => setMethod(m.k)}
                    className={`h-11 rounded-xl text-[13px] font-semibold transition-colors ${method === m.k ? 'bg-[#8B0000] text-white' : 'bg-white border border-stone-200 text-[#78716C]'}`}>
                    {m.l}
                  </button>
                ))}
              </div>
            </div>
            {method === 'UPI' && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-[12px] text-blue-700 font-medium">UPI Ref: {lang === 'mr' ? 'वैकल्पिक' : 'Optional'}</p>
                <input placeholder={lang === 'mr' ? 'UPI व्यवहार आयडी' : 'UPI transaction ID'} className="w-full mt-2 text-[14px] outline-none text-[#1C1917] bg-transparent border-b border-blue-200 pb-1" />
              </div>
            )}
            <div>
              <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{t.note} ({lang === 'mr' ? 'वैकल्पिक' : 'Optional'})</label>
              <textarea className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-[14px] outline-none text-[#1C1917] placeholder:text-stone-400 resize-none h-20" placeholder={lang === 'mr' ? 'नोंद टाका...' : 'Add note...'} />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="animate-slide-up flex flex-col gap-4">
            <p className="text-[12px] font-semibold text-[#78716C] uppercase tracking-wide mb-1">
              {lang === 'mr' ? 'टप्पा ३ — पुष्टी करा' : 'Step 3 — Confirm'}
            </p>
            <Card className="p-4">
              <h3 className="font-bold text-[16px] text-[#1C1917] mb-4">{lang === 'mr' ? 'सारांश' : 'Collection Summary'}</h3>
              {[
                [lang === 'mr' ? 'देणगीदार' : 'Donor', 'Rahul Patil'],
                [lang === 'mr' ? 'मोबाइल' : 'Mobile', '+91 65432 10987'],
                [lang === 'mr' ? 'उत्सव' : 'Festival', lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'],
                [lang === 'mr' ? 'रक्कम' : 'Amount', '₹1,001'],
                [lang === 'mr' ? 'पेमेंट' : 'Payment', lang === 'mr' && method === 'Cash' ? 'रोख' : method],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                  <span className="text-[13px] text-[#78716C]">{k}</span>
                  <span className="text-[14px] font-semibold text-[#1C1917]">{v}</span>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
      <div className="px-4 py-3 bg-white border-t border-stone-100 flex gap-3">
        {step > 1 && <Btn variant="secondary" onClick={() => setStep(s => s - 1)} className="flex-1">{lang === 'mr' ? 'मागे' : 'Back'}</Btn>}
        {step < 3
          ? <Btn onClick={() => setStep(s => s + 1)} className="flex-1">{lang === 'mr' ? 'पुढे' : 'Next'} →</Btn>
          : <Btn onClick={() => push('payment-success')} className="flex-1" icon={<Check className="w-4 h-4" />}>
            {t.generateReceipt}
          </Btn>
        }
      </div>
    </div>
  )
}

// ─── SCREEN: TRANSACTIONS ────────────────────────────────────────────────────

function TransactionsScreen({ lang, push, store }: { lang: Lang; push: (s: Screen) => void; store?: AppStore }) {
  const t = TR[lang]
  const [tab, setTab] = useState<'all' | 'income' | 'expense' | 'donation'>('all')
  const [search, setSearch] = useState('')
  const tabs: Array<{ k: 'all' | 'income' | 'expense' | 'donation'; lm: string; l: string }> = [
    { k: 'all', lm: 'सर्व', l: 'All' },
    { k: 'income', lm: 'जमा', l: 'Income' },
    { k: 'expense', lm: 'खर्च', l: 'Expense' },
    { k: 'donation', lm: 'देणगी', l: 'Donation' },
  ]
  const transactions = store?.state.transactions ?? []
  const filtered = transactions.filter(tx => {
    const matchTab = tab === 'all' || tx.type === tab || (tab === 'donation' && tx.type === 'income')
    const matchSearch = !search || tx.person.toLowerCase().includes(search.toLowerCase()) || tx.desc.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })
  const incomeTotal = store?.totalIncome ?? transactions.filter(tx => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0)
  const expenseTotal = store?.totalExpense ?? transactions.filter(tx => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0)
  const expensePct = Math.round((expenseTotal / (incomeTotal || 1)) * 100)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        <svg className="absolute bottom-0 right-0 w-48 h-24 opacity-10" viewBox="0 0 200 100" fill="white">
          <path d="M100 5L110 25H120V40H130V55H140V100H60V55H70V40H80V25H90L100 5Z"/>
          <path d="M50 40L60 55H70V100H30V55H40V40H50Z"/>
          <path d="M150 40L160 55H170V100H130V55H140V40H150Z"/>
          <rect x="80" y="70" width="40" height="30"/>
          <rect x="43" y="70" width="20" height="30"/>
          <rect x="137" y="70" width="20" height="30"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 relative">
          <div className="flex items-start justify-between">
            <div className="flex gap-2.5">
              <div style={{ width: 3, borderRadius: 2, background: '#F59E0B', minHeight: 52 }} />
              <div>
                <h1 className="text-white font-bold text-[24px] devanagari leading-tight">{lang === 'mr' ? 'व्यवहार' : 'Transactions'}</h1>
                <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'एकूण आर्थिक नोंदी' : 'Total Financial Records'}</p>
                <p className="text-white font-bold text-[20px] mt-1">{lang === 'mr' ? '₹६,१३,६५१' : '₹6,13,651'}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => push('notifications')} className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D97706] rounded-full border border-[#8B0000]" />
              </button>
              <p className="text-[#F59E0B] text-[11px] font-semibold devanagari">
                {lang === 'mr' ? '॥ गणपती बाप्पा मोरया ॥' : '|| Shree Ganesh ||'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex-shrink-0 bg-white border-b border-stone-100 px-4 py-3">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'mr' ? 'व्यवहार शोधा...' : 'Search transactions...'}
              className="flex-1 bg-transparent text-[13px] text-[#1C1917] placeholder-stone-400 outline-none devanagari"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-200 bg-white">
            <Filter className="w-4 h-4 text-[#78716C]" />
            <span className="text-[13px] font-semibold text-[#78716C] devanagari">{lang === 'mr' ? 'फिल्टर' : 'Filter'}</span>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map(({ k, lm, l }) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap border transition-all ${tab === k ? 'bg-[#8B0000] text-white border-[#8B0000]' : 'bg-white text-[#78716C] border-stone-200'}`}>
              <span className="devanagari">{lang === 'mr' ? lm : l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        {/* Summary cards */}
        <div className="flex gap-3 mb-4">
          {/* Income card */}
          <div className="flex-1 rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
            {/* mandala watermark */}
            <svg className="absolute -right-4 -bottom-4 w-20 h-20 opacity-10" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="1.5"/>
              <circle cx="40" cy="40" r="28" stroke="white" strokeWidth="1"/>
              <circle cx="40" cy="40" r="18" stroke="white" strokeWidth="1"/>
              <circle cx="40" cy="40" r="8" stroke="white" strokeWidth="1"/>
              {[0,45,90,135,180,225,270,315].map(a => (
                <line key={a} x1="40" y1="2" x2="40" y2="78" stroke="white" strokeWidth="0.5" transform={`rotate(${a} 40 40)`}/>
              ))}
            </svg>
            <div className="relative p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
                <p className="text-white/80 text-[11px] font-medium devanagari">{lang === 'mr' ? 'एकूण जमा' : 'Total Income'}</p>
              </div>
              <p className="text-white text-[20px] font-bold leading-tight">₹3,82,451</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-semibold text-emerald-200 bg-white/20 px-1.5 py-0.5 rounded-full">+12%</span>
                <span className="text-[10px] text-white/60">{lang === 'mr' ? 'मागील महिन्यापेक्षा' : 'vs last month'}</span>
              </div>
            </div>
          </div>
          {/* Expense card */}
          <div className="flex-1 rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)' }}>
            <svg className="absolute -right-4 -bottom-4 w-20 h-20 opacity-10" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="1.5"/>
              <circle cx="40" cy="40" r="28" stroke="white" strokeWidth="1"/>
              <circle cx="40" cy="40" r="18" stroke="white" strokeWidth="1"/>
              <circle cx="40" cy="40" r="8" stroke="white" strokeWidth="1"/>
              {[0,45,90,135,180,225,270,315].map(a => (
                <line key={a} x1="40" y1="2" x2="40" y2="78" stroke="white" strokeWidth="0.5" transform={`rotate(${a} 40 40)`}/>
              ))}
            </svg>
            <div className="relative p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingDown className="w-3 h-3 text-white" />
                </div>
                <p className="text-white/80 text-[11px] font-medium devanagari">{lang === 'mr' ? 'एकूण खर्च' : 'Total Expense'}</p>
              </div>
              <p className="text-white text-[20px] font-bold leading-tight">₹2,31,200</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-semibold text-red-200 bg-white/20 px-1.5 py-0.5 rounded-full">{expensePct}%</span>
                <span className="text-[10px] text-white/60">{lang === 'mr' ? 'जमा रकमेच्या' : 'of total income'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* List header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-bold text-[#1C1917] devanagari">{lang === 'mr' ? 'अलीकडील व्यवहार' : 'Recent Transactions'}</p>
          <button className="flex items-center gap-1 text-[12px] font-semibold text-[#8B0000]">
            <span className="devanagari">{lang === 'mr' ? 'नवीन ते जुने' : 'Newest to Oldest'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Transaction rows */}
        <div className="flex flex-col gap-2">
          {filtered.map(tx => (
            <div key={tx.id} onClick={() => push('transaction-detail')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 active:opacity-80 transition-opacity"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {/* Icon circle */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {tx.type === 'income'
                  ? <TrendingUp className="w-5 h-5 text-emerald-600" />
                  : <TrendingDown className="w-5 h-5 text-red-600" />}
              </div>
              {/* Middle info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13px] text-[#1C1917] truncate">{lang === 'mr' ? (tx.personMr || tx.person) : tx.person}</p>
                <p className="text-[11px] text-[#78716C] truncate devanagari">{lang === 'mr' ? (tx.descMr || tx.desc) : tx.desc}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-stone-400">{lang === 'mr' ? (tx.methodMr || tx.method) : tx.method}</span>
                  <span className="text-[10px] text-stone-300">•</span>
                  <span className="text-[10px] text-stone-400">{tx.receipt}</span>
                </div>
              </div>
              {/* Right: amount + status + date + menu */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className={`text-[15px] font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </p>
                <StatusBadge status={tx.status} lang={lang} />
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-stone-400">{lang === 'mr' ? '२५ ऑगस्ट' : '25 Aug'}</span>
                  <button className="text-stone-300 hover:text-stone-500" onClick={e => e.stopPropagation()}>
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#78716C]">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-[14px] font-semibold devanagari">{lang === 'mr' ? 'कोणतेही व्यवहार सापडले नाहीत' : 'No transactions found'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: TRANSACTION DETAIL ───────────────────────────────────────────────

function TransactionDetailScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const t = TR[lang]
  const tx = TRANSACTIONS[0]
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={lang === 'mr' ? 'व्यवहार तपशील' : 'Transaction Detail'} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-5">
        <Card className="p-5 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-[24px] font-bold text-emerald-600">+{fmt(tx.amount)}</p>
              <StatusBadge status={tx.status} lang={lang} />
            </div>
          </div>
          <div className="flex flex-col gap-0">
            {[
              [t.donor, lang === 'mr' ? (tx.personMr || tx.person) : tx.person],
              [t.festival, lang === 'mr' ? (tx.festivalMr || tx.festival) : tx.festival],
              [lang === 'mr' ? 'वर्णन' : 'Description', lang === 'mr' ? (tx.descMr || tx.desc) : tx.desc],
              [t.paymentMethod, lang === 'mr' ? (tx.methodMr || tx.method) : tx.method],
              [t.receiptNo, tx.receipt],
              [t.date, lang === 'mr' ? '२५ ऑगस्ट २०२६ • दुपारी २:३४' : '25 Aug 2026 • 2:34 PM'],
              [t.recordedBy, lang === 'mr' ? 'सिद्धार्थ कदम' : 'Siddharth Kadam'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between py-3 border-b border-stone-100 last:border-0">
                <span className="text-[13px] text-[#78716C] flex-1">{k}</span>
                <span className="text-[13px] font-semibold text-[#1C1917] text-right ml-4">{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex gap-3 mb-4">
          <button onClick={() => push('receipt')} className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
            <Receipt className="w-5 h-5 text-[#8B0000]" />
            <span className="text-[11px] font-semibold text-[#8B0000]">{t.receipt}</span>
          </button>
          {[{ icon: Edit3, label: lang === 'mr' ? 'संपादित' : 'Edit' }, { icon: AlertCircle, label: lang === 'mr' ? 'सुधारणा' : 'Correct' }, { icon: BookOpen, label: lang === 'mr' ? 'ऑडिट' : 'Audit' }].map(({ icon: Icon, label }) => (
            <button key={label} onClick={() => push('audit-history')} className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
              <Icon className="w-5 h-5 text-[#78716C]" />
              <span className="text-[11px] font-semibold text-[#78716C]">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: FESTIVALS ────────────────────────────────────────────────────────

function FestivalsScreen({ lang, push, store }: { lang: Lang; push: (s: Screen) => void; store?: AppStore }) {
  const [tab, setTab] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all')

  const filterTabs: Array<{ k: 'all' | 'upcoming' | 'active' | 'completed'; labelMr: string; label: string; Icon: () => React.ReactElement }> = [
    { k: 'all', labelMr: 'सर्व उत्सव', label: 'All', Icon: () => (<svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="9.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="1" y="9.5" width="5.5" height="5.5" rx="1" fill="currentColor"/><rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" fill="currentColor"/></svg>) },
    { k: 'upcoming', labelMr: 'आगामी', label: 'Upcoming', Icon: () => (<svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5 1.5V4M11 1.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.5"/></svg>) },
    { k: 'active', labelMr: 'सुरु असलेले', label: 'Active', Icon: () => (<svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 4.5V8L10.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { k: 'completed', labelMr: 'पूर्ण झालेले', label: 'Done', Icon: () => (<svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8.5L7 10.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
  ]

  const statusBorderColor: Record<string, string> = {
    active: '#10B981', upcoming: '#3B82F6', completed: '#6B7280', planned: '#94A3B8'
  }
  const statusBadgeStyle: Record<string, { bg: string; text: string; label: string }> = {
    active:    { bg: 'bg-emerald-50', text: 'text-emerald-700', label: lang === 'mr' ? 'सक्रिय' : 'Active' },
    upcoming:  { bg: 'bg-blue-50',    text: 'text-blue-700',    label: lang === 'mr' ? 'आगामी' : 'Upcoming' },
    completed: { bg: 'bg-stone-100',  text: 'text-stone-600',   label: lang === 'mr' ? 'पूर्ण' : 'Completed' },
    planned:   { bg: 'bg-slate-100',  text: 'text-slate-600',   label: lang === 'mr' ? 'नियोजित' : 'Planned' },
  }
  const festivalImages: Record<number, string> = {
    1: festivalGanesha,
    2: festivalNavratri,
    3: festivalDahiHandi,
    4: festivalShiva,
  }

  const festivals = store?.state.festivals ?? []
  const filtered = tab === 'all' ? festivals : festivals.filter(f =>
    tab === 'active' ? f.status === 'active' :
    tab === 'upcoming' ? (f.status === 'upcoming' || f.status === 'planned') :
    f.status === 'completed'
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        {/* Temple silhouette */}
        <svg className="absolute bottom-0 right-0 w-48 h-24 opacity-10" viewBox="0 0 200 100" fill="white">
          <path d="M100 5L110 25H120V40H130V55H140V100H60V55H70V40H80V25H90L100 5Z"/>
          <path d="M50 40L60 55H70V100H30V55H40V40H50Z"/>
          <path d="M150 40L160 55H170V100H130V55H140V40H150Z"/>
          <rect x="80" y="70" width="40" height="30"/>
          <rect x="43" y="70" width="20" height="30"/>
          <rect x="137" y="70" width="20" height="30"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 relative">
          <div className="flex items-start justify-between">
            <div className="flex gap-2.5">
              <div style={{ width: 3, borderRadius: 2, background: '#F59E0B', minHeight: 44 }} />
              <div>
                <h1 className="text-white font-bold text-[24px] devanagari leading-tight">{lang === 'mr' ? 'उत्सव' : 'Festivals'}</h1>
                <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'आपली परंपरा, आपला उत्साह' : 'Our Tradition, Our Celebration'}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => push('notifications')} className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D97706] rounded-full border border-[#8B0000]" />
              </button>
              <p className="text-[#F59E0B] text-[11px] font-semibold devanagari">
                {lang === 'mr' ? '॥ गणपती बाप्पा मोरया ॥' : '|| Shree Ganesh ||'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex-shrink-0 bg-white border-b border-stone-100 px-3 py-2.5 flex gap-2 overflow-x-auto no-scrollbar">
        {filterTabs.map(({ k, labelMr, label, Icon }) => {
          const active = tab === k
          return (
            <button key={k} onClick={() => setTab(k)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap border transition-all flex-shrink-0 ${active ? 'bg-[#8B0000] text-white border-[#8B0000]' : 'bg-white text-[#78716C] border-stone-200'}`}>
              <Icon />
              <span className="devanagari">{lang === 'mr' ? labelMr : label}</span>
            </button>
          )
        })}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <div className="flex flex-col gap-4">
          {filtered.map(f => {
            const badge = statusBadgeStyle[f.status]
            const borderColor = statusBorderColor[f.status]
            return (
              <div key={f.id} onClick={() => push('festival-detail')}
                className="bg-white rounded-2xl overflow-hidden active:opacity-80 transition-opacity"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${borderColor}` }}>
                <div className="flex">
                  {/* Left image panel */}
                  <div className="w-[110px] flex-shrink-0 relative">
                    <img src={festivalImages[f.id]} alt={lang === 'mr' ? f.nameMr : f.name}
                      className="w-full h-full object-cover"
                      style={{ minHeight: 120 }}
                      onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="110" height="120"><rect fill="%238B0000" width="110" height="120"/></svg>' }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 40%, transparent 70%)' }} />
                    {/* Status badge */}
                    <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full ${badge.bg}`}>
                      {f.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />}
                      {f.status === 'upcoming' && <Calendar className="w-2.5 h-2.5 text-blue-600" />}
                      {f.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5 text-stone-500" />}
                      {f.status === 'planned' && <Clock className="w-2.5 h-2.5 text-slate-500" />}
                      <span className={`text-[10px] font-bold ${badge.text} devanagari`}>{badge.label}</span>
                    </div>
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                      <p className="text-white text-[11px] font-bold devanagari leading-tight">
                        {lang === 'mr' ? f.nameMr : f.name}
                      </p>
                      <p className="text-white/70 text-[9px] devanagari leading-tight mt-0.5 line-clamp-2">
                        {lang === 'mr' ? f.quoteMr : f.quote}
                      </p>
                    </div>
                  </div>

                  {/* Right content */}
                  <div className="flex-1 min-w-0 p-3">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[14px] text-[#1C1917] leading-tight">
                          {lang === 'mr' ? f.nameMr : f.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-[#78716C] flex-shrink-0" />
                          <p className="text-[11px] text-[#78716C]">{f.dates}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#78716C] flex-shrink-0" />
                          <p className="text-[11px] text-[#78716C] devanagari truncate">{lang === 'mr' ? f.locationMr : f.location}</p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F5F0EB' }}>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8B0000]" />
                      </div>
                    </div>

                    {/* Stats row */}
                    {f.income > 0 ? (
                      <div className="mt-2.5 pt-2.5 border-t border-stone-100 grid grid-cols-3 gap-1">
                        <div>
                          <div className="flex items-center gap-1 mb-0.5">
                            <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center">
                              <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
                            </div>
                            <span className="text-[9px] text-[#78716C] devanagari">{lang === 'mr' ? 'जमा' : 'Income'}</span>
                          </div>
                          <p className="text-[12px] font-bold text-emerald-600">₹{(f.income/1000).toFixed(0)}k</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-0.5">
                            <div className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center">
                              <TrendingDown className="w-2.5 h-2.5 text-red-500" />
                            </div>
                            <span className="text-[9px] text-[#78716C] devanagari">{lang === 'mr' ? 'खर्च' : 'Expense'}</span>
                          </div>
                          <p className="text-[12px] font-bold text-red-600">₹{(f.expense/1000).toFixed(0)}k</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-0.5">
                            <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center">
                              <Wallet className="w-2.5 h-2.5 text-blue-600" />
                            </div>
                            <span className="text-[9px] text-[#78716C] devanagari">{lang === 'mr' ? 'शिल्लक' : 'Balance'}</span>
                          </div>
                          <p className="text-[12px] font-bold text-blue-600">₹{(f.balance/1000).toFixed(1)}k</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2.5 pt-2.5 border-t border-stone-100 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-stone-400" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-stone-500 devanagari">
                            {lang === 'mr' ? 'उत्सवाची तयारी सुरू आहे' : 'Festival preparations underway'}
                          </p>
                          <p className="text-[10px] text-stone-400 devanagari">
                            {lang === 'mr' ? 'लवकरच तपशील उपलब्ध' : 'Details coming soon'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Pending alert */}
                    {f.pending > 0 && (
                      <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          <span className="text-[10px] text-amber-700 devanagari font-medium">
                            {lang === 'mr' ? `₹${fmt(f.pending)} बाकी (${f.pendingCount} देणगीदार)` : `₹${fmt(f.pending)} pending (${f.pendingCount} Donors)`}
                          </span>
                        </div>
                        <button className="flex items-center gap-0.5 text-[10px] font-bold text-[#8B0000] whitespace-nowrap devanagari">
                          {lang === 'mr' ? 'तपशील पहा' : 'View Details'} <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add button */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-stone-100">
        <button onClick={() => push('add-festival')}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-[15px] devanagari"
          style={{ background: 'linear-gradient(135deg, #8B0000, #6B0000)', boxShadow: '0 4px 12px rgba(139,0,0,0.3)' }}>
          <Plus className="w-5 h-5" />
          {lang === 'mr' ? 'नवीन उत्सव जोडा' : 'Add New Festival'}
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN: FESTIVAL DETAIL ──────────────────────────────────────────────────

function FestivalDetailScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const t = TR[lang]
  const f = FESTIVALS[0]
  const [tab, setTab] = useState('overview')
  const detailTabs = [
    { k: 'overview', l: 'Overview', lm: 'आढावा' },
    { k: 'transactions', l: 'Transactions', lm: 'व्यवहार' },
    { k: 'expenses', l: 'Expenses', lm: 'खर्च' },
    { k: 'reports', l: 'Reports', lm: 'अहवाल' },
  ]
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-[#8B0000] px-4 pt-10 pb-5">
        <button onClick={pop} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-3">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white text-[20px] font-bold">{lang === 'mr' ? f.nameMr : f.name}</h1>
            <p className="text-white/70 text-[13px] mt-0.5">{lang === 'mr' ? f.datesMr : f.dates}</p>
          </div>
          <StatusBadge status={f.status} lang={lang} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 bg-white/10 rounded-2xl p-3">
          {[[lang === 'mr' ? 'जमा' : 'Income', fmt(f.income), 'text-emerald-300'], [lang === 'mr' ? 'खर्च' : 'Expense', fmt(f.expense), 'text-red-300'], [lang === 'mr' ? 'शिल्लक' : 'Balance', fmt(f.balance), 'text-white']].map(([k, v, tc]) => (
            <div key={k} className="text-center">
              <p className="text-white/60 text-[10px]">{k}</p>
              <p className={`text-[15px] font-bold ${tc}`}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white flex overflow-x-auto no-scrollbar border-b border-stone-100">
        {detailTabs.map(({ k, l, lm }) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === k ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-[#78716C]'}`}>
            {lang === 'mr' ? lm : l}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        {tab === 'overview' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <Card className="p-4">
              <h3 className="font-semibold text-[14px] text-[#1C1917] mb-3">{lang === 'mr' ? 'उत्पन्न विभाजन' : 'Income Breakdown'}</h3>
              {[[lang === 'mr' ? 'वर्गणी' : 'Collection', 98400, 'bg-[#8B0000]'], [lang === 'mr' ? 'देणगी' : 'Donation', 42000, 'bg-[#D97706]'], [lang === 'mr' ? 'प्रायोजकत्व' : 'Sponsorship', 28000, 'bg-emerald-500'], [lang === 'mr' ? 'इतर' : 'Other', 10000, 'bg-blue-500']].map(([l, v, bc]) => (
                <div key={l as string} className="mb-3">
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-[#78716C]">{l}</span>
                    <span className="font-semibold text-[#1C1917]">{fmt(v as number)}</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full ${bc} rounded-full`} style={{ width: `${((v as number) / f.income) * 100}%` }} />
                  </div>
                </div>
              ))}
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-[14px] text-[#1C1917] mb-3">{lang === 'mr' ? 'खर्च विभाजन' : 'Expense Breakdown'}</h3>
              {[[lang === 'mr' ? 'ध्वनी व डीजे' : 'Sound & DJ', 25000], [lang === 'mr' ? 'सजावट' : 'Decoration', 18500], [lang === 'mr' ? 'मंडप' : 'Mandap', 15000], [lang === 'mr' ? 'प्रसाद व भोजन' : 'Food & Catering', 8200], [lang === 'mr' ? 'रोषणाई' : 'Lighting', 6300]].map(([l, v]) => (
                <div key={l as string} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                  <span className="text-[13px] text-[#78716C]">{l}</span>
                  <span className="text-[13px] font-semibold text-[#8B0000]">{fmt(v as number)}</span>
                </div>
              ))}
            </Card>
          </div>
        )}
        {tab === 'transactions' && (
          <div className="flex flex-col gap-2 animate-fade-in">
            {TRANSACTIONS.slice(0, 5).map(tx => (
              <Card key={tx.id} onClick={() => push('transaction-detail')} className="p-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  {tx.type === 'income' ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1C1917] truncate">{lang === 'mr' ? (tx.personMr || tx.person) : tx.person}</p>
                  <p className="text-[11px] text-[#78716C]">{lang === 'mr' ? (tx.timeMr || tx.time) : tx.time}</p>
                </div>
                <span className={`text-[14px] font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-[#8B0000]'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </span>
              </Card>
            ))}
          </div>
        )}
        {tab === 'expenses' && (
          <div className="flex flex-col gap-2 animate-fade-in">
            {EXPENSES_DATA.map(e => (
              <Card key={e.id} onClick={() => push('expense-detail')} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#8B0000]/8 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-4 h-4 text-[#8B0000]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-[#1C1917]">{lang === 'mr' ? (e.vendorMr || e.vendor) : e.vendor}</p>
                      <p className="text-[14px] font-bold text-[#8B0000]">{fmt(e.amount)}</p>
                    </div>
                    <p className="text-[11px] text-[#78716C]">{lang === 'mr' ? e.categoryMr : e.category} • {lang === 'mr' ? e.dateMr : e.date}</p>
                    <StatusBadge status={e.status} lang={lang} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {tab === 'reports' && (
          <div className="flex flex-col gap-3 animate-fade-in">
            {[t.financial, t.collectionReport, t.expenseReport].map(r => (
              <Card key={r} className="p-4 flex items-center gap-3" onClick={() => push('reports')}>
                <div className="w-10 h-10 rounded-xl bg-[#8B0000]/8 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#8B0000]" />
                </div>
                <p className="flex-1 text-[14px] font-semibold text-[#1C1917]">{r}</p>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SCREEN: MEMBERS ─────────────────────────────────────────────────────────

function MembersScreen({ lang, push, store }: { lang: Lang; push: (s: Screen) => void; store?: AppStore }) {
  const [tab, setTab] = useState<'all' | 'active' | 'pending' | 'inactive'>('all')
  const [search, setSearch] = useState('')

  const members = store?.state.members ?? []

  const activeCount  = store?.activeMemberCount ?? members.filter(m => m.status === 'active').length
  const pendingCount = store?.pendingMemberCount ?? members.filter(m => m.status === 'pending').length
  const inactiveCount = members.filter(m => m.status === 'inactive').length
  const totalCount   = members.length

  const filterTabs = [
    { k: 'all' as const,      labelMr: `सर्व (${totalCount})`,          label: `All (${totalCount})` },
    { k: 'active' as const,   labelMr: `सक्रिय (${activeCount})`,       label: `Active (${activeCount})` },
    { k: 'pending' as const,  labelMr: `प्रलंबित (${pendingCount})`,    label: `Pending (${pendingCount})` },
    { k: 'inactive' as const, labelMr: `निष्क्रिय (${inactiveCount})`, label: `Inactive (${inactiveCount})` },
  ]

  const filtered = members.filter(m => {
    const matchTab = tab === 'all' || m.status === tab
    const q = search.toLowerCase()
    const matchSearch = !search || m.name.toLowerCase().includes(q) || m.mobile.includes(q) || m.role.toLowerCase().includes(q)
    return matchTab && matchSearch
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        <svg className="absolute bottom-0 right-0 w-48 h-24 opacity-10" viewBox="0 0 200 100" fill="white">
          <path d="M100 5L110 25H120V40H130V55H140V100H60V55H70V40H80V25H90L100 5Z"/>
          <path d="M50 40L60 55H70V100H30V55H40V40H50Z"/>
          <path d="M150 40L160 55H170V100H130V55H140V40H150Z"/>
          <rect x="80" y="70" width="40" height="30"/>
          <rect x="43" y="70" width="20" height="30"/>
          <rect x="137" y="70" width="20" height="30"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 relative">
          <div className="flex items-start justify-between">
            <div className="flex gap-2.5">
              <div style={{ width: 3, borderRadius: 2, background: '#F59E0B', minHeight: 52 }} />
              <div>
                <h1 className="text-white font-bold text-[24px] devanagari leading-tight">{lang === 'mr' ? 'सदस्य' : 'Members'}</h1>
                <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'आपला परिवार, आपली ताकद' : 'Our Family, Our Strength'}</p>
                <p className="text-white/50 text-[11px] devanagari mt-0.5">
                  {lang === 'mr' ? `${totalCount} सदस्य • ${pendingCount} प्रतीक्षित` : `${totalCount} Members • ${pendingCount} Pending`}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => push('notifications')} className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D97706] rounded-full border border-[#8B0000]" />
              </button>
              <p className="text-[#F59E0B] text-[11px] font-semibold devanagari">
                {lang === 'mr' ? '॥ गणपती बाप्पा मोरया ॥' : '|| Shree Ganesh ||'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter button */}
      <div className="flex-shrink-0 bg-white border-b border-stone-100 px-4 pt-3 pb-2.5">
        <div className="flex gap-2 mb-2.5">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 border border-stone-200 bg-white">
            <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'mr' ? 'सदस्य शोधा (नाव, पद, फोन नंबर)...' : 'Search members (name, role, phone)...'}
              className="flex-1 bg-transparent text-[12px] text-[#1C1917] placeholder-stone-400 outline-none devanagari" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#8B0000] bg-white">
            <Filter className="w-4 h-4 text-[#8B0000]" />
            <span className="text-[13px] font-semibold text-[#8B0000] devanagari">{lang === 'mr' ? 'फिल्टर' : 'Filter'}</span>
          </button>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filterTabs.map(({ k, labelMr, label }) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap border transition-all flex-shrink-0 ${tab === k ? 'bg-[#8B0000] text-white border-[#8B0000]' : 'bg-white text-[#78716C] border-stone-200'}`}>
              <span className="devanagari">{lang === 'mr' ? labelMr : label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex-shrink-0 bg-[#FFFBF5] px-4 pt-3 pb-0">
        <div className="bg-white rounded-2xl flex divide-x divide-stone-100 overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="flex-1 flex items-center gap-2.5 px-3 py-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-4.5 h-4.5 text-emerald-600" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-[10px] text-[#78716C] devanagari">{lang === 'mr' ? 'एकूण सदस्य' : 'Total Members'}</p>
              <p className="text-[20px] font-bold text-[#1C1917] leading-tight">{totalCount}</p>
              <p className="text-[9px] text-emerald-600 devanagari">{lang === 'mr' ? 'आपला परिवार' : 'Our Family'}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2.5 px-3 py-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-[10px] text-[#78716C] devanagari">{lang === 'mr' ? 'सक्रिय सदस्य' : 'Active Members'}</p>
              <p className="text-[20px] font-bold text-emerald-600 leading-tight">{activeCount}</p>
              <p className="text-[9px] text-emerald-600 devanagari">
                {lang === 'mr' ? `${Math.round(activeCount/totalCount*100)}% सक्रिय` : `${Math.round(activeCount/totalCount*100)}% Active`}
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2.5 px-3 py-3">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4.5 h-4.5 text-amber-500" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-[10px] text-[#78716C] devanagari">{lang === 'mr' ? 'प्रलंबित' : 'Pending'}</p>
              <p className="text-[20px] font-bold text-amber-500 leading-tight">{pendingCount}</p>
              <p className="text-[9px] text-amber-500 devanagari">
                {lang === 'mr' ? `${Math.round(pendingCount/totalCount*100)}% पडताळणी` : `${Math.round(pendingCount/totalCount*100)}% Pending`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-3">
        <div className="flex flex-col gap-2">
          {filtered.map(m => {
            const roleColors: Record<string, { bg: string; text: string }> = {
              'Super Admin': { bg: '#FEE2E2', text: '#991B1B' }, 'मुख्य ॲडमिन': { bg: '#FEE2E2', text: '#991B1B' },
              'Admin': { bg: '#E0F2FE', text: '#075985' }, 'ॲडमिन': { bg: '#E0F2FE', text: '#075985' },
              'Treasurer': { bg: '#FEF3C7', text: '#92400E' }, 'खजिनदार': { bg: '#FEF3C7', text: '#92400E' },
              'Secretary': { bg: '#F3E8FF', text: '#6B21A8' }, 'सचिव': { bg: '#F3E8FF', text: '#6B21A8' },
              'Volunteer': { bg: '#DCFCE7', text: '#166534' }, 'स्वयंसेवक': { bg: '#DCFCE7', text: '#166534' },
              'Member': { bg: '#F1F5F9', text: '#475569' }, 'सदस्य': { bg: '#F1F5F9', text: '#475569' }
            }
            const statusDot: Record<string, { c: string; t: string; tm: string }> = {
              'active': { c: '#10B981', t: 'Active', tm: 'सक्रिय' },
              'pending': { c: '#F59E0B', t: 'Pending', tm: 'प्रलंबित' },
              'inactive': { c: '#94A3B8', t: 'Inactive', tm: 'निष्क्रिय' }
            }
            const roleCfg = roleColors[m.role] ?? { bg: '#F1F5F9', text: '#475569' }
            const stCfg   = statusDot[m.status] ?? statusDot.active
            return (
              <div key={m.id} onClick={() => push('member-profile')}
                className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 active:opacity-80 transition-opacity"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[14px]"
                  style={{ background: m.avatarColor }}>
                  {m.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-[14px] text-[#1C1917]">{lang === 'mr' ? (m.nameMr || m.name) : m.name}</p>
                  </div>
                  {/* Role badge */}
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold devanagari" style={{ background: roleCfg.bg, color: roleCfg.text }}>
                    {lang === 'mr' ? m.roleMr : m.role}
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span className="text-[11px] text-[#78716C]">{m.mobile}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span className="text-[11px] text-[#78716C]">{lang === 'mr' ? (m.joinedDisplayMr || m.joinedDisplay) : m.joinedDisplay}</span>
                    </div>
                  </div>
                </div>

                {/* Right: status + actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: stCfg.c }} />
                    <span className="text-[11px] font-semibold devanagari" style={{ color: stCfg.c }}>{lang === 'mr' ? stCfg.tm : stCfg.t}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={e => e.stopPropagation()}
                      className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50">
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                    </button>
                    <button onClick={e => e.stopPropagation()}
                      className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50">
                      <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                    <button onClick={e => e.stopPropagation()}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-stone-50">
                      <MoreVertical className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#78716C]">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-[14px] font-semibold devanagari">{lang === 'mr' ? 'कोणताही सदस्य सापडला नाही' : 'No members found'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add member button */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-stone-100">
        <button onClick={() => push('join-mandal')}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-[15px] devanagari"
          style={{ background: 'linear-gradient(135deg, #8B0000, #6B0000)', boxShadow: '0 4px 12px rgba(139,0,0,0.3)' }}>
          <Plus className="w-5 h-5" />
          {lang === 'mr' ? 'सदस्य जोडा' : 'Add Member'}
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN: MEMBER PROFILE ───────────────────────────────────────────────────

function MemberProfileScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const m = MEMBERS[0]
  const t = TR[lang]
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-[#8B0000] px-4 pt-10 pb-6">
        <button onClick={pop} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-4">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 text-white text-[24px] font-bold flex items-center justify-center">{m.avatar}</div>
          <div>
            <h1 className="text-white text-[20px] font-bold">{lang === 'mr' ? (m.nameMr || m.name) : m.name}</h1>
            <RoleBadge role={m.role} lang={lang} />
            <p className="text-white/70 text-[13px] mt-1">{lang === 'mr' ? 'सामील झाले' : 'Joined'}: {lang === 'mr' ? 'जानेवारी २०२४' : 'Jan 2024'}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 bg-white/10 rounded-2xl p-3">
          {[[lang === 'mr' ? 'एकूण योगदान' : 'Contribution', fmt(m.contributions)], [lang === 'mr' ? 'उत्सव' : 'Festivals', lang === 'mr' ? '४' : '4'], [lang === 'mr' ? 'स्थिती' : 'Status', lang === 'mr' ? 'सक्रिय' : 'Active']].map(([k, v]) => (
            <div key={k} className="text-center">
              <p className="text-white/60 text-[10px]">{k}</p>
              <p className="text-white font-bold text-[14px]">{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <Card className="p-4 mb-4">
          {[[t.mobile, m.mobile, Phone], [t.email, m.email, Mail], [t.role, lang === 'mr' ? 'खजिनदार' : m.role, Award]].map(([k, v, Icon]: any) => (
            <div key={k} className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-[#8B0000]/8 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#8B0000]" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-[#78716C]">{k}</p>
                <p className="text-[14px] font-semibold text-[#1C1917]">{v}</p>
              </div>
            </div>
          ))}
        </Card>
        <div className="flex gap-3 mb-4">
          <button className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
            <Phone className="w-5 h-5 text-[#8B0000]" />
            <span className="text-[11px] font-semibold text-[#8B0000]">{lang === 'mr' ? 'कॉल' : 'Call'}</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="text-[11px] font-semibold text-green-600">{lang === 'mr' ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
            <Edit3 className="w-5 h-5 text-[#78716C]" />
            <span className="text-[11px] font-semibold text-[#78716C]">{lang === 'mr' ? 'संपादित' : 'Edit'}</span>
          </button>
        </div>
        <SectionHeader title={lang === 'mr' ? 'योगदान इतिहास' : 'Contribution History'} />
        {TRANSACTIONS.filter(tx => tx.type === 'income').slice(0, 3).map(tx => (
          <Card key={tx.id} className="p-3 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#1C1917]">{lang === 'mr' ? (tx.festivalMr || tx.festival) : tx.festival}</p>
              <p className="text-[11px] text-[#78716C]">{lang === 'mr' ? (tx.timeMr || tx.time) : tx.time}</p>
            </div>
            <span className="text-[14px] font-bold text-emerald-600">+{fmt(tx.amount)}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── SCREEN: EXPENSES ─────────────────────────────────────────────────────────

const EXPENSE_ICON_MAP: Record<string, { icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>, bg: string, color: string }> = {
  'Sound & DJ':  { icon: Volume2,   bg: '#FEE2E2', color: '#DC2626' },
  'Decoration':  { icon: Flower,    bg: '#FEF3C7', color: '#92400E' },
  'Mandap':      { icon: HomeIcon,  bg: '#D1FAE5', color: '#065F46' },
  'Food':        { icon: Utensils,  bg: '#EDE9FE', color: '#5B21B6' },
  'Lighting':    { icon: Lightbulb, bg: '#FFE4E6', color: '#BE123C' },
}

function ExpensesScreen({ lang, push, pop, store }: { lang: Lang; push: (s: Screen) => void; pop: () => void; store?: AppStore }) {
  const [search, setSearch] = useState('')

  const expenses = store?.state.expenses ?? []
  const filtered = expenses.filter(e =>
    e.vendor.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  )

  const statusLabel = (s: string) => {
    if (s === 'paid') return { label: lang === 'mr' ? 'भरले' : 'Paid', bg: '#D1FAE5', color: '#065F46' }
    if (s === 'approved') return { label: lang === 'mr' ? 'मंजूर' : 'Approved', bg: '#D1FAE5', color: '#065F46' }
    return { label: lang === 'mr' ? 'पुस्तिाबित' : 'Pending', bg: '#FEF3C7', color: '#92400E' }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        {/* Mandala + temple watermark */}
        <svg className="absolute right-3 top-2 opacity-15" width="110" height="72" viewBox="0 0 110 72" fill="none">
          <circle cx="75" cy="30" r="28" stroke="white" strokeWidth="0.8" fill="none"/>
          <circle cx="75" cy="30" r="20" stroke="white" strokeWidth="0.6" fill="none"/>
          <circle cx="75" cy="30" r="12" stroke="white" strokeWidth="0.5" fill="none"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
            <line key={a} x1="75" y1="30" x2={75+28*Math.cos(a*Math.PI/180)} y2={30+28*Math.sin(a*Math.PI/180)} stroke="white" strokeWidth="0.4"/>
          ))}
          <path d="M40 5L46 18H52V28H58V38H64V72H16V38H22V28H28V18H34L40 5Z" fill="white"/>
          <path d="M10 28L16 38H22V72H-2V38H4V28H10Z" fill="white" opacity="0.7"/>
          <path d="M70 28L76 38H82V72H56V38H62V28H70Z" fill="white" opacity="0.7"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 flex items-center gap-3 relative">
          <button onClick={pop} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-[22px] devanagari leading-tight">{lang === 'mr' ? 'खर्च' : 'Expenses'}</h1>
            <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'प्रत्येक खर्च, पारदर्शक समाजासाठी' : 'Every expense, for a transparent community'}</p>
          </div>
          <div className="text-right">
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">
              {lang === 'mr' ? '"सुसंवादी' : '"Harmonious'}
            </p>
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">
              {lang === 'mr' ? 'व्यवस्थापन,' : 'Governance,'}
            </p>
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">
              {lang === 'mr' ? 'समृद्ध उत्सव"' : 'Grand Festivals"'}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-shrink-0 bg-white px-4 py-3 flex items-center gap-2 border-b border-stone-100">
        <div className="flex-1 flex items-center gap-2 bg-stone-50 rounded-2xl px-4 py-2.5 border border-stone-200">
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            className="flex-1 bg-transparent text-[14px] text-[#1C1917] outline-none placeholder-stone-400 devanagari"
            placeholder={lang === 'mr' ? 'खर्च शोधा...' : 'Search expenses...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
          <Filter style={{ width: 18, height: 18, color: '#8B0000' }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5]">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 px-4 pt-4 pb-3">
          {/* Total expense */}
          <div className="bg-white rounded-2xl p-3.5 flex items-start gap-3" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
              <TrendingDown style={{ width: 20, height: 20, color: '#8B0000' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#78716C] devanagari">{lang === 'mr' ? 'एकूण खर्च' : 'Total Expense'}</p>
                <button className="w-5 h-5 rounded-full border border-stone-200 flex items-center justify-center">
                  <ChevronRight style={{ width: 11, height: 11, color: '#78716C' }} />
                </button>
              </div>
              <p className="text-[20px] font-bold text-[#8B0000] leading-tight mt-0.5">₹73,000</p>
              <p className="text-[10px] text-[#78716C] devanagari leading-tight mt-0.5">{lang === 'mr' ? 'या वर्षातील एकूण खर्च' : 'Total spent this year'}</p>
            </div>
          </div>
          {/* Budget remaining */}
          <div className="bg-white rounded-2xl p-3.5 flex items-start gap-3" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#D1FAE5' }}>
              <Wallet style={{ width: 20, height: 20, color: '#059669' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#78716C] devanagari">{lang === 'mr' ? 'बजेट' : 'Budget'}</p>
                <button className="w-5 h-5 rounded-full border border-stone-200 flex items-center justify-center">
                  <ChevronRight style={{ width: 11, height: 11, color: '#78716C' }} />
                </button>
              </div>
              <p className="text-[20px] font-bold text-emerald-600 leading-tight mt-0.5">₹54,300</p>
              <p className="text-[10px] text-[#78716C] devanagari leading-tight mt-0.5">{lang === 'mr' ? 'उर्वरित रक्कम' : 'Remaining balance'}</p>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between px-4 mb-2">
          <h2 className="text-[16px] font-bold text-[#1C1917] devanagari">{lang === 'mr' ? 'खर्च यादी' : 'Expense List'}</h2>
          <button className="flex items-center gap-1 text-[12px] text-[#78716C] devanagari">
            {lang === 'mr' ? 'नवीनतम' : 'Newest'} <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Expense list */}
        <div className="px-4 flex flex-col gap-2 pb-24">
          {filtered.map(e => {
            const iconDef = EXPENSE_ICON_MAP[e.category] ?? { icon: TrendingDown, bg: '#FEE2E2', color: '#8B0000' }
            const IconComp = iconDef.icon
            const st = statusLabel(e.status)
            return (
              <div key={e.id} className="bg-white rounded-2xl px-4 py-3.5 flex items-start gap-3"
                style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                {/* Category icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: iconDef.bg }}>
                  <IconComp style={{ width: 22, height: 22, color: iconDef.color }} />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => push('expense-detail')}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold text-[15px] text-[#1C1917] leading-tight">{lang === 'mr' ? (e.vendorMr || e.vendor) : e.vendor}</p>
                      <p className="text-[12px] text-[#78716C] mt-0.5">{lang === 'mr' ? (e.categoryMr || e.category) : e.category}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <p className="text-[16px] font-bold text-[#8B0000]">₹{(e.amount).toLocaleString('en-IN')}</p>
                      <ChevronRight style={{ width: 14, height: 14, color: '#D1C4C4' }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {/* Status badge */}
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold devanagari"
                      style={{ background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                    <span className="text-[11px] text-[#78716C]">{lang === 'mr' ? (e.method === 'Cheque' ? 'धनादेश' : e.method === 'Cash' ? 'रोख' : e.method) : e.method}</span>
                    <div className="flex items-center gap-1">
                      <Calendar style={{ width: 11, height: 11, color: '#78716C' }} />
                      <span className="text-[11px] text-[#78716C]">{lang === 'mr' ? (e.dateMr || e.date) : e.date}</span>
                    </div>
                    <div className="flex-1" />
                    <button className="p-1">
                      <MoreVertical style={{ width: 14, height: 14, color: '#C7B9B9' }} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAB */}
      <div className="absolute bottom-20 right-4">
        <button onClick={() => push('new-expense')}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full text-white font-semibold text-[14px] devanagari"
          style={{ background: '#8B0000', boxShadow: '0 4px 16px rgba(139,0,0,0.45)' }}>
          <Plus className="w-4 h-4" />
          {lang === 'mr' ? 'नवा खर्च जोडा' : 'Add New Expense'}
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN: NEW EXPENSE ──────────────────────────────────────────────────────

function NewExpenseScreen({ lang, push, pop, store }: { lang: Lang; push: (s: Screen) => void; pop: () => void; store?: AppStore }) {
  const t = TR[lang]
  const categories = [t.decoration, t.sound, t.lighting, t.mandap, t.prasad, t.aarti, t.transportation, t.printing, t.food, t.other]
  const [cat, setCat] = useState(t.decoration)
  const workflowSteps = [t.draft, t.submitted, t.underReview, t.approved]
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={lang === 'mr' ? 'नवीन खर्च' : 'New Expense'} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-5">
        {/* Approval workflow tracker */}
        <Card className="p-4 mb-4">
          <p className="text-[12px] font-semibold text-[#78716C] mb-3 uppercase tracking-wide">{t.approvalWorkflow}</p>
          <div className="flex items-center">
            {workflowSteps.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${i === 0 ? 'bg-[#8B0000] text-white' : 'bg-stone-100 text-[#78716C]'}`}>
                  {i === 0 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < workflowSteps.length - 1 && <div className="flex-1 h-0.5 bg-stone-100 mx-1" />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {workflowSteps.map((step, i) => (
              <span key={step} className={`text-[9px] font-medium ${i === 0 ? 'text-[#8B0000]' : 'text-[#78716C]'}`}>{step}</span>
            ))}
          </div>
        </Card>
        <div className="flex flex-col gap-4">
          {[
            { label: t.vendor, placeholder: lang === 'mr' ? 'ओम साउंड सिस्टीम्स' : 'Om Sound Systems', icon: Building2 },
            { label: t.amount, placeholder: '25000', icon: IndianRupee },
            { label: t.reference, placeholder: lang === 'mr' ? 'CHQ-004521 (वैकल्पिक)' : 'CHQ-004521 (optional)', icon: FileText },
          ].map(({ label, placeholder, icon: Icon }) => (
            <div key={label}>
              <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{label}</label>
              <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 h-12 focus-within:border-[#8B0000]">
                <Icon className="w-4 h-4 text-stone-400" />
                <input placeholder={placeholder} className="flex-1 text-[14px] outline-none text-[#1C1917] placeholder:text-stone-400 bg-transparent" />
              </div>
            </div>
          ))}
          <div>
            <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{t.category}</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${cat === c ? 'bg-[#8B0000] text-white' : 'bg-white border border-stone-200 text-[#78716C]'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* Bill upload */}
          <div>
            <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{t.uploadBill}</label>
            <div className="border-2 border-dashed border-stone-200 rounded-xl p-5 flex flex-col items-center gap-2 bg-white">
              <Upload className="w-8 h-8 text-stone-400" />
              <p className="text-[13px] text-[#78716C] text-center">{lang === 'mr' ? 'बिल / पावती अपलोड करा' : 'Upload bill or receipt'}</p>
              <p className="text-[11px] text-stone-400">PDF, JPG, PNG</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-white border-t border-stone-100">
        <Btn onClick={() => push('expense-approval')} className="w-full">{lang === 'mr' ? 'खर्च सादर करा' : 'Submit Expense'}</Btn>
      </div>
    </div>
  )
}

// ─── SCREEN: EXPENSE DETAIL ───────────────────────────────────────────────────

function ExpenseDetailScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const e = EXPENSES_DATA[1]
  const t = TR[lang]
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={lang === 'mr' ? 'खर्च तपशील' : 'Expense Detail'} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#8B0000]/8 flex items-center justify-center">
            <TrendingDown className="w-7 h-7 text-[#8B0000]" />
          </div>
          <div>
            <p className="text-[28px] font-bold text-[#8B0000]">{fmt(e.amount)}</p>
            <StatusBadge status={e.status} lang={lang} />
          </div>
        </div>
        <Card className="p-4 mb-4">
          {[
            [t.vendor, lang === 'mr' ? (e.vendorMr || e.vendor) : e.vendor],
            [t.category, lang === 'mr' ? (e.categoryMr || e.category) : e.category],
            [t.festival, lang === 'mr' ? (e.festivalMr || e.festival) : e.festival],
            [t.paymentMethod, lang === 'mr' ? (e.method === 'Cheque' ? 'धनादेश' : e.method === 'Cash' ? 'रोख' : e.method) : e.method],
            [t.reference, e.ref || '—'],
            [t.date, lang === 'mr' ? (e.dateMr || e.date) : e.date],
            [t.recordedBy, lang === 'mr' ? 'सिद्धार्थ कदम' : 'Siddharth Kadam'],
            [t.status, lang === 'mr' ? (e.status === 'approved' ? 'मंजूर' : e.status === 'pending' ? 'प्रलंबित' : 'नाकारले') : e.status]
          ].map(([k, v]) => (
            <div key={k} className="flex items-start justify-between py-2.5 border-b border-stone-100 last:border-0">
              <span className="text-[13px] text-[#78716C]">{k}</span>
              <span className="text-[13px] font-semibold text-[#1C1917] text-right ml-4 capitalize">{v}</span>
            </div>
          ))}
        </Card>
        <div className="flex gap-3">
          {[
            { icon: Edit3, label: t.edit, screen: 'audit-history' as Screen },
            { icon: AlertCircle, label: t.correctionRequest, screen: 'correction-request' as Screen },
            { icon: BookOpen, label: t.auditHistory, screen: 'audit-history' as Screen }
          ].map(({ icon: Icon, label, screen }) => (
            <button key={label} onClick={() => push(screen)} className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
              <Icon className="w-5 h-5 text-[#78716C]" />
              <span className="text-[10px] font-semibold text-[#78716C] text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: QR PAYMENT ───────────────────────────────────────────────────────

function QRPaymentScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const t = TR[lang]
  const [step, setStep] = useState<'setup' | 'qr' | 'waiting'>('setup')
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={t.qrPayment} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-5">
        {step === 'setup' && (
          <div className="animate-fade-in flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{t.amount}</label>
              <div className="flex items-center gap-3 bg-white border-2 border-[#8B0000] rounded-xl px-4 h-16 shadow-brand">
                <IndianRupee className="w-6 h-6 text-[#8B0000]" />
                <input defaultValue="1250" className="flex-1 text-[28px] font-bold text-[#1C1917] outline-none bg-transparent" type="number" />
              </div>
              <div className="flex gap-2 mt-3">
                {[501, 1001, 2001, 5001].map(a => (
                  <button key={a} className="flex-1 h-9 bg-[#8B0000]/8 text-[#8B0000] rounded-lg text-[13px] font-semibold">₹{a.toLocaleString()}</button>
                ))}
              </div>
            </div>
            {[
              { label: lang === 'mr' ? 'देणगीदार' : 'Donor (optional)', placeholder: 'Rahul Patil', icon: Users },
            ].map(({ label, placeholder, icon: Icon }) => (
              <div key={label}>
                <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{label}</label>
                <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 h-12">
                  <Icon className="w-4 h-4 text-stone-400" />
                  <input placeholder={placeholder} className="flex-1 text-[14px] outline-none text-[#1C1917] bg-transparent" />
                </div>
              </div>
            ))}
            <Btn onClick={() => setStep('qr')} className="w-full" icon={<QrCode className="w-4 h-4" />}>
              {lang === 'mr' ? 'QR तयार करा' : 'Generate QR Code'}
            </Btn>
          </div>
        )}
        {(step === 'qr' || step === 'waiting') && (
          <div className="animate-scale-in flex flex-col items-center gap-5">
            <div className="bg-white rounded-2xl p-5 shadow-card w-full flex flex-col items-center">
              <MandalLogo size={40} />
              <h2 className="font-bold text-[16px] text-[#1C1917] mt-2">{lang === 'mr' ? 'श्रीमंत सहकार मित्र मंडळ' : 'Shrimant Sahakar Mitra Mandal'}</h2>
              <p className="text-[#78716C] text-[12px] mb-4">{lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'}</p>
              {/* QR Code placeholder */}
              <div className="w-48 h-48 bg-[#1C1917] rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-8 grid-rows-8 gap-0.5 p-3">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <MandalLogo size={32} />
                  </div>
                </div>
              </div>
              <p className="text-[20px] font-bold text-[#1C1917] mt-4">₹1,250</p>
              <p className="text-[#78716C] text-[13px]">{lang === 'mr' ? 'राहुल पाटील • गणेशोत्सव २०२६' : 'Rahul Patil • Ganeshotsav 2026'}</p>
              <p className="text-[12px] text-[#78716C] mt-1">{t.upiId}: sahakar@sbi</p>
            </div>
            {step === 'waiting' ? (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 w-full animate-pulse-glow">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800">{t.waitingPayment}</p>
                  <p className="text-[12px] text-amber-600">{lang === 'mr' ? 'QR स्कॅन होण्याची प्रतीक्षा...' : 'Waiting for QR scan...'}</p>
                </div>
              </div>
            ) : (
              <button onClick={() => setStep('waiting')} className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 w-full">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <p className="text-[14px] font-semibold text-blue-700">{lang === 'mr' ? 'पेमेंटची प्रतीक्षा करा' : 'Wait for Payment'}</p>
              </button>
            )}
            <div className="flex gap-3 w-full">
              <button className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
                <Share2 className="w-5 h-5 text-[#8B0000]" />
                <span className="text-[11px] font-semibold text-[#8B0000]">{t.share}</span>
              </button>
              <button className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
                <Download className="w-5 h-5 text-[#78716C]" />
                <span className="text-[11px] font-semibold text-[#78716C]">{t.download}</span>
              </button>
              <button onClick={() => push('payment-success')} className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-[11px] font-semibold text-emerald-600">{lang === 'mr' ? 'मिळाले' : 'Received'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SCREEN: PAYMENT SUCCESS ──────────────────────────────────────────────────

function PaymentSuccessScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const t = TR[lang]
  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5]">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="animate-scale-in flex flex-col items-center gap-5 w-full">
          {/* Success icon */}
          <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="text-center">
            <h1 className="text-[26px] font-bold text-[#1C1917] mb-1">{t.paymentReceived}</h1>
            <p className="text-[#78716C] text-[15px]">{t.paymentSuccess}</p>
          </div>
          <Card className="p-5 w-full">
            <div className="text-center mb-4">
              <p className="text-[32px] font-bold text-emerald-600">₹5,001</p>
              <p className="text-[13px] text-[#78716C]">{lang === 'mr' ? 'UPI द्वारे' : 'via UPI'}</p>
            </div>
            {[
              [t.donor, lang === 'mr' ? 'महादेव खडये' : 'Mahadev Khadye'],
              [t.festival, lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'],
              [t.receiptNo, 'RCP-2026-0841'],
              [t.date, lang === 'mr' ? '२५ ऑगस्ट २०२६ • दुपारी ४:१५' : '25 Aug 2026 • 4:15 PM'],
              [t.recordedBy, lang === 'mr' ? 'सिद्धार्थ कदम' : 'Siddharth Kadam']
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                <span className="text-[13px] text-[#78716C]">{k}</span>
                <span className="text-[13px] font-semibold text-[#1C1917]">{v}</span>
              </div>
            ))}
          </Card>
          <p className="text-[#D97706] font-semibold text-[15px] devanagari">{t.ganapatiBappa}</p>
        </div>
      </div>
      <div className="px-4 pb-6">
        <div className="flex gap-3 mb-3">
          <button className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="text-[11px] font-semibold text-green-600">{t.whatsapp}</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
            <Download className="w-5 h-5 text-[#78716C]" />
            <span className="text-[11px] font-semibold text-[#78716C]">{t.download}</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-card">
            <Printer className="w-5 h-5 text-[#78716C]" />
            <span className="text-[11px] font-semibold text-[#78716C]">{t.print}</span>
          </button>
        </div>
        <div className="flex gap-3">
          <Btn variant="secondary" onClick={() => push('receipt')} className="flex-1">{t.viewReceipt}</Btn>
          <Btn onClick={pop} className="flex-1">{t.done}</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: RECEIPT ─────────────────────────────────────────────────────────

function ReceiptScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const t = TR[lang]
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={lang === 'mr' ? 'देणगी पावती' : 'Donation Receipt'} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        {/* Receipt card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="bg-[#8B0000] px-5 py-6 flex flex-col items-center">
            <MandalLogo size={56} white />
            <p className="text-[#D97706] text-[12px] mt-2 font-semibold tracking-widest">{lang === 'mr' ? '॥ श्री गणेश ॥' : '|| Shree Ganesh ||'}</p>
            <h2 className="text-white text-[16px] font-bold mt-1 text-center">{lang === 'mr' ? 'श्रीमंत सहकार मित्र मंडळ' : 'Shrimant Sahakar Mitra Mandal'}</h2>
            <p className="text-white/70 text-[12px]">{lang === 'mr' ? 'कसबा पेठ, पुणे' : 'Kasba Peth, Pune'}</p>
            <div className="w-full h-px bg-white/20 mt-3 mb-2" />
            <p className="text-[#D97706] text-[13px] font-bold uppercase tracking-wider">
              {lang === 'mr' ? 'देणगी पावती' : 'Donation Receipt'}
            </p>
          </div>
          {/* Gold border */}
          <div className="h-1 bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#D97706]" />
          {/* Body */}
          <div className="px-5 py-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#8B0000]/10">
              <div>
                <p className="text-[11px] text-[#78716C]">{t.receiptNo}</p>
                <p className="text-[16px] font-bold text-[#8B0000]">RCP-2026-0841</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#78716C]">{t.date}</p>
                <p className="text-[13px] font-semibold text-[#1C1917]">{lang === 'mr' ? '२५ ऑगस्ट २०२६' : '25 Aug 2026'}</p>
              </div>
            </div>
            {/* Amount */}
            <div className="bg-[#8B0000]/5 rounded-xl p-4 text-center mb-4">
              <p className="text-[11px] text-[#78716C] mb-1">{lang === 'mr' ? 'प्राप्त रक्कम' : 'Amount Received'}</p>
              <p className="text-[32px] font-bold text-[#8B0000]">₹5,001</p>
              <p className="text-[12px] text-[#78716C]">{lang === 'mr' ? 'पाच हजार एक रुपये' : 'Five Thousand One Rupees'}</p>
            </div>
            {[
              [t.donor, lang === 'mr' ? 'महादेव खडये' : 'Mahadev Khadye'],
              [t.festival, lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'],
              [t.paymentMethod, 'UPI'],
              [lang === 'mr' ? 'UPI संदर्भ' : 'UPI Reference', 'UPI2026082500341'],
              [t.recordedBy, lang === 'mr' ? 'सिद्धार्थ कदम' : 'Siddharth Kadam']
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2.5 border-b border-[#8B0000]/8 last:border-0">
                <span className="text-[12px] text-[#78716C]">{k}</span>
                <span className="text-[13px] font-semibold text-[#1C1917]">{v}</span>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="h-1 bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#D97706]" />
          <div className="bg-[#8B0000] px-5 py-4 text-center">
            <p className="text-[#D97706] font-bold text-[15px] devanagari">{lang === 'mr' ? 'धन्यवाद!' : 'Thank You!'}</p>
            <p className="text-white/80 text-[13px] mt-0.5 devanagari">{lang === 'mr' ? 'गणपती बाप्पा मोरया! 🙏' : 'Best Wishes & Blessings! 🙏'}</p>
            <p className="text-white/50 text-[10px] mt-2">{lang === 'mr' ? 'हे अधिकृत मंडळ पावती आहे.' : 'This is an official Mandal receipt.'}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {[[MessageCircle, t.whatsapp, 'text-green-600', 'bg-green-50'], [Download, t.download, 'text-[#8B0000]', 'bg-[#8B0000]/5'], [Printer, t.print, 'text-[#78716C]', 'bg-stone-100'], [Share2, t.share, 'text-blue-600', 'bg-blue-50']].map(([Icon, label, tc, bg]) => (
            <button key={label as string} className={`flex-1 flex flex-col items-center gap-1.5 p-3 ${bg} rounded-xl`}>
              <Icon className={`w-5 h-5 ${tc}`} />
              <span className={`text-[10px] font-semibold ${tc}`}>{label as string}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: PENDING COLLECTIONS ─────────────────────────────────────────────

function PendingCollectionsScreen({ lang, push, pop, store }: { lang: Lang; push: (s: Screen) => void; pop: () => void; store?: AppStore }) {
  const t = TR[lang]
  const pendingCollections = store?.state.pendingCollections ?? []
  const totalOutstanding = store?.totalOutstanding ?? pendingCollections.reduce((sum, p) => sum + p.outstanding, 0)
  
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={lang === 'mr' ? 'बाकी वर्गणी' : 'Pending Collections'} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <Card className="p-4 mb-4 bg-gradient-to-r from-[#8B0000] to-[#B91C1C]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-[12px]">{lang === 'mr' ? 'एकूण बाकी' : 'Total Outstanding'}</p>
              <p className="text-white text-[26px] font-bold">{fmt(totalOutstanding)}</p>
              <p className="text-white/60 text-[12px]">{pendingCollections.length} {lang === 'mr' ? 'देणगीदार बाकी' : 'donors pending'}</p>
            </div>
            <Btn variant="secondary" className="text-white border-white/30 bg-white/15 text-[13px] min-h-[40px] px-4" onClick={() => {}}>
              {t.sendAll}
            </Btn>
          </div>
        </Card>
        <div className="flex flex-col gap-2">
          {pendingCollections.map(p => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar initials={p.name.split(' ').map(n => n[0]).join('')} />
                <div className="flex-1">
                  <p className="font-semibold text-[14px] text-[#1C1917]">{lang === 'mr' ? (p.nameMr || p.name) : p.name}</p>
                  <p className="text-[12px] text-[#78716C]">{lang === 'mr' ? (p.festivalMr || p.festival) : p.festival}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[11px] text-[#78716C]">{lang === 'mr' ? 'एकूण' : 'Total'}: {fmt(p.amount)}</span>
                    <span className="text-[11px] text-emerald-600">{lang === 'mr' ? 'भरले' : 'Paid'}: {fmt(p.paid)}</span>
                  </div>
                </div>
                <p className="text-[18px] font-bold text-[#8B0000]">{fmt(p.outstanding)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => push('new-collection')} className="flex-1 h-9 bg-[#8B0000] rounded-lg text-white text-[12px] font-semibold">
                  {lang === 'mr' ? 'जमा करा' : 'Collect'}
                </button>
                <button onClick={() => push('whatsapp-reminder')} className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                  <WhatsAppIcon className="w-4 h-4 text-green-600" />
                </button>
                <button className="w-9 h-9 bg-stone-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#78716C]" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: DONATIONS ────────────────────────────────────────────────────────

function DonationsScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const [search, setSearch] = useState('')

  const donors = [
    { initials: 'SK', color: '#8B0000',  bg: '#FEE2E2', name: 'Suresh Kadam',    nameMr: 'सुरेश कदम',    phone: '98765 43210', amount: 45000, donations: 4, date: '12 Sep 2026' },
    { initials: 'SK', color: '#92400E',  bg: '#FEF3C7', name: 'Siddharth Kadam', nameMr: 'सिद्धार्थ कदम', phone: '87654 32109', amount: 32000, donations: 4, date: '10 Sep 2026' },
    { initials: 'MS', color: '#065F46',  bg: '#D1FAE5', name: 'Minal Shinde',    nameMr: 'मिनल शिंदे',    phone: '76543 21098', amount: 18500, donations: 4, date: '08 Sep 2026' },
    { initials: 'RP', color: '#5B21B6',  bg: '#EDE9FE', name: 'Rahul Patil',     nameMr: 'राहुल पाटील',     phone: '65432 10987', amount: 22000, donations: 4, date: '05 Sep 2026' },
    { initials: 'RD', color: '#BE123C',  bg: '#FFE4E6', name: 'Rajesh Deshmukh', nameMr: 'राजेश देशमुख', phone: '54321 09876', amount: 5500,  donations: 4, date: '02 Sep 2026' },
    { initials: 'AP', color: '#1D4ED8',  bg: '#DBEAFE', name: 'Amit Pawar',      nameMr: 'अमित पवार',      phone: '93210 56784', amount: 2000,  donations: 4, date: '01 Sep 2026' },
  ]

  const filtered = donors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search)
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        <svg className="absolute right-0 top-0 w-32 h-20 opacity-10" viewBox="0 0 120 80" fill="white">
          <path d="M60 5L68 20H76V32H84V44H92V80H28V44H36V32H44V20H52L60 5Z"/>
          <path d="M20 32L28 44H36V80H4V44H12V32H20Z"/>
          <path d="M100 32L108 44H116V80H84V44H92V32H100Z"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 flex items-center gap-3 relative">
          <button onClick={pop} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-[22px] devanagari leading-tight">{lang === 'mr' ? 'देणगी' : 'Donations'}</h1>
            <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'आपल्या योगदानाची नोंद' : 'Record of contributions'}</p>
          </div>
          <div className="text-right">
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">{lang === 'mr' ? '"दानातून' : '"Through Giving'}</p>
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">{lang === 'mr' ? 'समाज उन्तीकडे"' : 'Community Thrives"'}</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex-shrink-0 bg-white px-4 py-3 flex items-center gap-2 border-b border-stone-100">
        <div className="flex-1 flex items-center gap-2 bg-stone-50 rounded-2xl px-4 py-2.5 border border-stone-200">
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            className="flex-1 bg-transparent text-[14px] text-[#1C1917] outline-none placeholder-stone-400 devanagari"
            placeholder={lang === 'mr' ? 'देणगीदार शोधा...' : 'Search donors...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
          <Filter className="w-4.5 h-4.5 text-[#8B0000]" style={{ width: 18, height: 18 }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5]">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 px-4 pt-4 pb-3">
          {/* Total donations */}
          <div className="bg-white rounded-2xl p-3.5 flex items-start gap-3" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
              <Database className="w-5 h-5 text-[#8B0000]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#78716C] devanagari leading-tight">{lang === 'mr' ? 'एकूण देणगी' : 'Total Donations'}</p>
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: '#D1FAE5' }}>
                  <TrendingUp style={{ width: 9, height: 9, color: '#059669' }} />
                  <span className="text-[9px] font-bold text-emerald-700">+12%</span>
                </div>
              </div>
              <p className="text-[20px] font-bold text-[#8B0000] leading-tight mt-0.5">₹1,42,000</p>
              <p className="text-[10px] text-[#78716C] devanagari leading-tight mt-0.5">{lang === 'mr' ? 'मागील महिन्याच्या तुलनेत' : 'vs last month'}</p>
            </div>
          </div>
          {/* Donors count */}
          <div className="bg-white rounded-2xl p-3.5 flex items-start gap-3" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
              <Users className="w-5 h-5 text-[#8B0000]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#78716C] devanagari leading-tight">{lang === 'mr' ? 'देणगीदार' : 'Donors'}</p>
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: '#FEE2E2' }}>
                  <TrendingUp style={{ width: 9, height: 9, color: '#DC2626' }} />
                  <span className="text-[9px] font-bold text-red-700">+5</span>
                </div>
              </div>
              <p className="text-[20px] font-bold text-[#8B0000] leading-tight mt-0.5">38</p>
              <p className="text-[10px] text-[#78716C] devanagari leading-tight mt-0.5">{lang === 'mr' ? 'या महिन्यात नवीन' : 'new this month'}</p>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between px-4 mb-2">
          <h2 className="text-[16px] font-bold text-[#1C1917] devanagari">{lang === 'mr' ? 'देणगीदार यादी' : 'Donor List'}</h2>
          <button className="flex items-center gap-1 text-[12px] text-[#78716C] devanagari">
            {lang === 'mr' ? 'नवीनतम' : 'Latest'} <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Donor list */}
        <div className="px-4 flex flex-col gap-2 pb-24">
          {filtered.map((d, i) => (
            <button key={i} onClick={() => push('donor-profile')}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left w-full"
              style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-[15px] flex-shrink-0"
                style={{ background: d.bg, color: d.color }}>
                {d.initials}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] text-[#1C1917] leading-tight">{lang === 'mr' ? (d.nameMr || d.name) : d.name}</p>
                <p className="text-[12px] text-[#78716C] mt-0.5">{d.phone}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[13px] font-bold text-emerald-600">{fmt(d.amount)}</span>
                  <span className="text-stone-300 text-[10px]">•</span>
                  <span className="text-[12px] text-[#78716C]">{d.donations} {lang === 'mr' ? 'देणग्या' : 'donations'}</span>
                </div>
              </div>
              {/* Date + chevron */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <ChevronRight className="w-4 h-4 text-stone-300" />
                <span className="text-[11px] text-[#78716C]">{lang === 'mr' ? d.date.replace('Sep', 'सप्टें') : d.date}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAB */}
      <div className="absolute bottom-20 right-4">
        <button onClick={() => push('new-donation')}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full shadow-lg text-white font-semibold text-[14px] devanagari"
          style={{ background: '#8B0000', boxShadow: '0 4px 16px rgba(139,0,0,0.45)' }}>
          <Plus className="w-4 h-4" />
          {lang === 'mr' ? 'नवीन देणगीदार' : 'New Donor'}
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN: DONOR PROFILE ────────────────────────────────────────────────────

function DonorProfileScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const t = TR[lang]
  const m = MEMBERS[0]
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-[#8B0000] px-4 pt-10 pb-5">
        <button onClick={pop} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-3">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 text-white text-[24px] font-bold flex items-center justify-center">{m.avatar}</div>
          <div>
            <h2 className="text-white text-[20px] font-bold">{m.name}</h2>
            <p className="text-white/70 text-[13px]">{m.mobile}</p>
            <p className="text-white/60 text-[12px]">{lang === 'mr' ? 'पहिली देणगी: जाने २०२०' : 'First donation: Jan 2020'}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 bg-white/10 rounded-2xl p-3">
          {[[lang === 'mr' ? 'एकूण' : 'Total', fmt(m.contributions)], [lang === 'mr' ? 'देणग्या' : 'Donations', '12'], [lang === 'mr' ? 'मोठी' : 'Largest', '₹10,000'], [lang === 'mr' ? 'शेवटची' : 'Last', lang === 'mr' ? '३ दिवसांपूर्वी' : '3d ago']].map(([k, v]) => (
            <div key={k} className="text-center">
              <p className="text-white/60 text-[9px]">{k}</p>
              <p className="text-white font-bold text-[12px]">{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <SectionHeader title={lang === 'mr' ? 'देणगी इतिहास' : 'Donation History'} />
        {TRANSACTIONS.filter(tx => tx.type === 'income').map(tx => (
          <Card key={tx.id} className="p-3 mb-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#1C1917]">{lang === 'mr' ? (tx.festival === 'Ganeshotsav 2026' ? 'गणेशोत्सव २०२६' : tx.festival) : tx.festival}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#78716C]">{lang === 'mr' && tx.method === 'Cash' ? 'रोख' : tx.method}</span>
                <span className="text-[10px] text-stone-300">•</span>
                <span className="text-[11px] text-[#78716C]">{tx.time}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-bold text-emerald-600">{fmt(tx.amount)}</p>
              <button onClick={() => push('receipt')} className="text-[11px] text-[#8B0000] font-medium">{t.receipt}</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── SCREEN: NOTIFICATIONS ────────────────────────────────────────────────────

function NotificationsScreen({ lang, pop, store }: { lang: Lang; pop: () => void; store?: AppStore }) {
  const t = TR[lang]
  const iconMap: Record<string, React.ReactNode> = {
    approval: <UserCheck className="w-5 h-5 text-[#8B0000]" />,
    payment: <IndianRupee className="w-5 h-5 text-emerald-600" />,
    expense: <TrendingDown className="w-5 h-5 text-amber-600" />,
    reminder: <Bell className="w-5 h-5 text-blue-600" />,
    system: <Info className="w-5 h-5 text-[#78716C]" />,
  }
  const bgMap: Record<string, string> = {
    approval: 'bg-[#8B0000]/8', payment: 'bg-emerald-50', expense: 'bg-amber-50', reminder: 'bg-blue-50', system: 'bg-stone-100'
  }
  const notifications = store?.state.notifications ?? []
  const unreadCount = store?.unreadCount ?? notifications.filter(n => n.unread).length

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={t.notifications} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-[#78716C]">
            {unreadCount > 0 
              ? (lang === 'mr' ? `${unreadCount} नवीन सूचना` : `${unreadCount} unread`)
              : (lang === 'mr' ? 'सर्व वाचले' : 'All caught up')}
          </p>
          {unreadCount > 0 && (
            <button onClick={() => store?.markAllRead()} className="text-[13px] text-[#8B0000] font-semibold">
              {lang === 'mr' ? 'सर्व वाचले खूण करा' : 'Mark all read'}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {notifications.map(n => (
            <Card key={n.id} className={`p-4 ${n.unread ? 'border-l-4 border-l-[#8B0000]' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${bgMap[n.type]} flex items-center justify-center flex-shrink-0`}>
                  {iconMap[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-[13px] font-semibold ${n.unread ? 'text-[#1C1917]' : 'text-[#78716C]'}`}>{lang === 'mr' ? n.titleMr : n.title}</p>
                    <span className="text-[10px] text-[#78716C] whitespace-nowrap">{lang === 'mr' ? n.timeMr : n.time}</span>
                  </div>
                  <p className="text-[12px] text-[#78716C] mt-0.5 leading-relaxed">{lang === 'mr' ? n.subMr : n.sub}</p>
                  {n.action === 'approve' && (
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-[#8B0000] rounded-lg text-white text-[11px] font-semibold">{t.approve}</button>
                      <button className="px-3 py-1 bg-stone-100 rounded-lg text-[#78716C] text-[11px] font-semibold">{t.reject}</button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: REPORTS ─────────────────────────────────────────────────────────

const REPORT_CARDS = [
  { icon: BarChart2,    labelMr: 'आर्थिक अहवाल',  label: 'Financial Report',   descMr: 'मंडळाचा आर्थिक आढावा आणि तपशील',          desc: 'Mandal financial overview & details',   iconBg: '#FEE2E2', iconColor: '#DC2626' },
  { icon: IndianRupee,  labelMr: 'वर्गणी अहवाल',   label: 'Collection Report',  descMr: 'वर्गणी संकलनाचा तपशील आणि सदस्य योगदान',  desc: 'Collection details & member contributions', iconBg: '#FEF3C7', iconColor: '#D97706' },
  { icon: Award,        labelMr: 'देणगी अहवाल',    label: 'Donation Report',    descMr: 'प्राप्त देणग्या आणि देणगीदारांची यादी',    desc: 'Received donations & donor list',       iconBg: '#D1FAE5', iconColor: '#059669' },
  { icon: TrendingDown, labelMr: 'खर्च अहवाल',     label: 'Expense Report',     descMr: 'उत्सवातील सर्व खर्चाचा तपशील',             desc: 'All festival expenses detail',          iconBg: '#FEE2E2', iconColor: '#DC2626' },
  { icon: Sparkles,     labelMr: 'उत्सव अहवाल',    label: 'Festival Report',    descMr: 'उत्सव उपक्रमांचा संपूर्ण आढावा',            desc: 'Complete festival activities overview', iconBg: '#EDE9FE', iconColor: '#7C3AED' },
  { icon: Shield,       labelMr: 'ऑडिट अहवाल',     label: 'Audit Report',       descMr: 'लेखा परीक्षण व ऑडिट तपशील',               desc: 'Audit & accounting review details',     iconBg: '#DBEAFE', iconColor: '#2563EB' },
  { icon: Users,        labelMr: 'सदस्य अहवाल',    label: 'Member Report',      descMr: 'सदस्य संख्या आणि सदस्य संरचना',           desc: 'Member count & structure',              iconBg: '#FEF3C7', iconColor: '#B45309' },
  { icon: FileText,     labelMr: 'संपूर्ण अहवाल',  label: 'Complete Report',    descMr: 'सर्व अहवाल एकत्रित (वार्षिक आढावा)',      desc: 'All reports combined (annual overview)',iconBg: '#F1F5F9', iconColor: '#64748B' },
] as const

function ReportsScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        {/* Mandala watermark */}
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 w-28 h-28" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="1"/>
          <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="1"/>
          <circle cx="50" cy="50" r="22" stroke="white" strokeWidth="1"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
            <line key={a} x1="50" y1="2" x2="50" y2="98" stroke="white" strokeWidth="0.5" transform={`rotate(${a} 50 50)`}/>
          ))}
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 flex items-center gap-3 relative">
          <button onClick={pop} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-[22px] devanagari leading-tight">{lang === 'mr' ? 'अहवाल' : 'Reports'}</h1>
            <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'मंडळाचा संपूर्ण आढावा' : 'Complete Mandal Overview'}</p>
          </div>
          <div className="text-right">
            {lang === 'mr' ? (
              <>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">"परंपरा जपत</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">समाजासाठी एकत्र"</p>
              </>
            ) : (
              <>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">"Preserving Tradition</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">United for Society"</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-3 py-3">

        {/* Analytics banner — full-width crimson card */}
        <button onClick={() => push('analytics')}
          className="w-full rounded-2xl mb-4 flex items-center gap-3 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #8B0000 0%, #B91C1C 100%)', padding: '14px 16px' }}>
          {/* Bar chart decorative illustration */}
          <svg className="absolute right-12 top-1/2 -translate-y-1/2 opacity-25 w-16 h-12" viewBox="0 0 64 48" fill="white">
            <rect x="4"  y="28" width="8" height="20" rx="2"/>
            <rect x="16" y="18" width="8" height="30" rx="2"/>
            <rect x="28" y="8"  width="8" height="40" rx="2"/>
            <rect x="40" y="14" width="8" height="34" rx="2"/>
            <rect x="52" y="22" width="8" height="26" rx="2"/>
          </svg>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-bold text-[18px] devanagari">{lang === 'mr' ? 'विश्लेषण' : 'Analytics'}</p>
            <p className="text-white/70 text-[12px] devanagari">{lang === 'mr' ? 'चार्ट आणि आलेख पाहा' : 'View charts and graphs'}</p>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* 2-column report grid */}
        <div className="grid grid-cols-2 gap-3">
          {REPORT_CARDS.map(({ icon: Icon, labelMr, label, descMr, desc, iconBg, iconColor }) => (
            <div key={labelMr} className="bg-white rounded-2xl p-3.5 flex flex-col relative overflow-hidden"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              {/* Leaf watermark */}
              <svg className="absolute -right-3 -bottom-3 w-16 h-16 opacity-5" viewBox="0 0 60 60" fill={iconColor}>
                <path d="M30 5C30 5 5 20 5 40C5 52 17 55 30 55C43 55 55 52 55 40C55 20 30 5 30 5Z"/>
              </svg>

              {/* Icon + chevron row */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
                  <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: iconBg }}>
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: iconColor }} />
                </div>
              </div>

              {/* Title + desc */}
              <p className="font-bold text-[14px] text-[#1C1917] devanagari leading-tight mb-1">
                {lang === 'mr' ? labelMr : label}
              </p>
              <p className="text-[10px] text-[#78716C] devanagari leading-snug mb-3 flex-1">
                {lang === 'mr' ? descMr : desc}
              </p>

              {/* PDF + Excel buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg"
                  style={{ background: '#FEE2E2' }}>
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 flex-shrink-0" fill="none">
                    <rect x="2" y="1" width="12" height="14" rx="1.5" fill="#DC2626"/>
                    <path d="M5 8h3M5 10.5h6M5 5.5h6" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                    <text x="3.5" y="8.5" fontSize="3.5" fill="white" fontWeight="bold">PDF</text>
                  </svg>
                  <span className="text-[11px] font-bold" style={{ color: '#DC2626' }}>PDF</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg"
                  style={{ background: '#D1FAE5' }}>
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 flex-shrink-0" fill="none">
                    <rect x="2" y="1" width="12" height="14" rx="1.5" fill="#059669"/>
                    <path d="M5 6L8 9L11 6M8 9V3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[11px] font-bold" style={{ color: '#059669' }}>Excel</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── SCREEN: ANALYTICS ───────────────────────────────────────────────────────

function AnalyticsScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const [year, setYear] = useState('2026')
  const [tooltip, setTooltip] = useState<number | null>(8) // Sep index

  const monthly = [
    { m: lang === 'mr' ? 'जाने' : 'Jan', income: 22000,  expense: 9000  },
    { m: lang === 'mr' ? 'फेब्रु' : 'Feb', income: 18000,  expense: 11000 },
    { m: lang === 'mr' ? 'मार्च' : 'Mar', income: 31000,  expense: 13000 },
    { m: lang === 'mr' ? 'एप्रिल' : 'Apr', income: 25000,  expense: 10000 },
    { m: lang === 'mr' ? 'मे' : 'May', income: 29000,  expense: 14000 },
    { m: lang === 'mr' ? 'जून' : 'Jun', income: 35000,  expense: 16000 },
    { m: lang === 'mr' ? 'जुलै' : 'Jul', income: 28000,  expense: 18000 },
    { m: lang === 'mr' ? 'ऑगस्ट' : 'Aug', income: 178400, expense: 73000 },
    { m: lang === 'mr' ? 'सप्टें' : 'Sep', income: 124000, expense: 68000 },
    { m: lang === 'mr' ? 'ऑक्टो' : 'Oct', income: 42000,  expense: 18000 },
    { m: lang === 'mr' ? 'नोव्हें' : 'Nov', income: 15000,  expense: 8000  },
    { m: lang === 'mr' ? 'डिसें' : 'Dec', income: 12000,  expense: 6000  },
  ]
  const maxVal = Math.max(...monthly.flatMap(d => [d.income, d.expense]))
  const yLabels = ['1.5L', '1.0L', '50K', '0']
  const yVals   = [150000, 100000, 50000, 0]

  const festivalBars = [
    { nameMr: 'गणेशोत्सव २०२६', name: 'Ganeshotsav 2026', pct: 78, amount: 178400 },
    { nameMr: 'नवरात्री २०२६',    name: 'Navratri 2026',    pct: 46, amount: 42000  },
    { nameMr: 'दहीहंडी २०२६',   name: 'Dahi Handi 2026',  pct: 32, amount: 31000  },
  ]

  const donutSlices = [
    { labelMr: 'ध्वनी व डीजे', label: 'Sound & DJ',  pct: 27, color: '#3B82F6', amount: 25000 },
    { labelMr: 'सजावट',       label: 'Decoration',  pct: 20, color: '#F59E0B', amount: 18500 },
    { labelMr: 'मंडप',         label: 'Mandap',      pct: 16, color: '#10B981', amount: 15000 },
    { labelMr: 'प्रसाद व जेवण', label: 'Food & Prasad',pct: 12, color: '#8B5CF6', amount: 8200  },
    { labelMr: 'विद्युत रोषणाई',label: 'Lighting',    pct: 10, color: '#EF4444', amount: 6300  },
    { labelMr: 'इतर',         label: 'Other',       pct: 15, color: '#9CA3AF', amount: 13000 },
  ]

  // Build SVG donut paths
  const donutPaths = (() => {
    const cx = 70, cy = 70, r = 52, ir = 34
    let angle = -90
    return donutSlices.map(s => {
      const start = angle
      const sweep = (s.pct / 100) * 360
      angle += sweep
      const toRad = (a: number) => (a * Math.PI) / 180
      const x1 = cx + r * Math.cos(toRad(start))
      const y1 = cy + r * Math.sin(toRad(start))
      const x2 = cx + r * Math.cos(toRad(start + sweep))
      const y2 = cy + r * Math.sin(toRad(start + sweep))
      const ix1 = cx + ir * Math.cos(toRad(start))
      const iy1 = cy + ir * Math.sin(toRad(start))
      const ix2 = cx + ir * Math.cos(toRad(start + sweep))
      const iy2 = cy + ir * Math.sin(toRad(start + sweep))
      const large = sweep > 180 ? 1 : 0
      return {
        ...s,
        d: `M${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} L${ix2},${iy2} A${ir},${ir},0,${large},0,${ix1},${iy1} Z`
      }
    })
  })()

  const summaryStats = [
    { icon: TrendingUp,   value: '₹2,85,400', labelMr: 'एकूण जमा',      labelEn: 'Total Income',  badgeMr: '+१२%', badgeEn: '+12%', up: true,  iconBg: '#D1FAE5', iconColor: '#059669' },
    { icon: TrendingDown, value: '₹92,000',   labelMr: 'एकूण खर्च',     labelEn: 'Total Expense', badgeMr: '-८%',  badgeEn: '-8%',  up: false, iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { icon: Wallet,       value: '₹1,93,400', labelMr: 'शिल्लक रक्कम',  labelEn: 'Balance Amount',badgeMr: '+१८%', badgeEn: '+18%', up: true,  iconBg: '#DBEAFE', iconColor: '#2563EB' },
    { icon: Sparkles,     value: lang === 'mr' ? '३' : '3', labelMr: 'उत्सव', labelEn: 'Festivals', badgeMr: 'यंदाचे वर्ष', badgeEn: 'This Year', up: null, iconBg: '#FEF3C7', iconColor: '#B45309' },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        <svg className="absolute right-0 top-0 w-32 h-20 opacity-10" viewBox="0 0 120 80" fill="white">
          <path d="M60 5L68 20H76V32H84V44H92V80H28V44H36V32H44V20H52L60 5Z"/>
          <path d="M20 32L28 44H36V80H4V44H12V32H20Z"/>
          <path d="M100 32L108 44H116V80H84V44H92V32H100Z"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 flex items-center gap-3 relative">
          <button onClick={pop} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-[22px] devanagari leading-tight">{lang === 'mr' ? 'विश्लेषण' : 'Analytics'}</h1>
            <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'आकडेवारीतून प्रगतीकडे' : 'From Data to Progress'}</p>
          </div>
          <div className="text-right">
            {lang === 'mr' ? (
              <>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">"परंपरा जपत</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">समाजासाठी एकत्र"</p>
              </>
            ) : (
              <>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">"Preserving Tradition</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">United for Society"</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5]">
        {/* Year filter row */}
        <div className="bg-white border-b border-stone-100 px-4 py-2.5 flex items-center gap-2">
          {['2024','2025','2026','2027'].map(y => (
            <button key={y} onClick={() => setYear(y)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-all ${year === y ? 'text-white border-[#8B0000]' : 'text-[#78716C] border-stone-200 bg-white'}`}
              style={year === y ? { background: '#8B0000' } : {}}>
              {y}
            </button>
          ))}
          <div className="flex-1" />
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-stone-200 text-[12px] text-[#78716C] bg-white">
            <span className="devanagari">{lang === 'mr' ? 'सर्व मंडळ' : 'All Mandal'}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center bg-white">
            <Calendar className="w-4 h-4 text-[#78716C]" />
          </button>
        </div>

        <div className="px-4 py-3 flex flex-col gap-3">
          {/* ── BAR CHART CARD ── */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                  <BarChart2 className="w-4.5 h-4.5 text-[#DC2626]" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#1C1917] devanagari">{lang === 'mr' ? 'जमा विरुद्ध खर्च' : 'Income vs Expense'}</p>
                  <p className="text-[10px] text-[#78716C] devanagari">{lang === 'mr' ? `महिनाभिहाय तुलना (${year})` : `Monthly Comparison (${year})`}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-400"/><span className="text-[10px] text-[#78716C] devanagari">{lang === 'mr' ? 'जमा' : 'Income'}</span></div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]"/><span className="text-[10px] text-[#78716C] devanagari">{lang === 'mr' ? 'खर्च' : 'Expense'}</span></div>
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-stone-200 text-[11px] text-[#78716C]">
                  <span className="devanagari">{lang === 'mr' ? 'महिना' : 'Month'}</span><ChevronDown className="w-3 h-3"/>
                </button>
              </div>
            </div>

            {/* Chart area */}
            <div className="flex gap-1.5 relative" style={{ height: 140 }}>
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between text-right pr-1 flex-shrink-0" style={{ width: 32 }}>
                {yLabels.map(l => <span key={l} className="text-[9px] text-[#78716C]">{l}</span>)}
              </div>
              {/* Bars */}
              <div className="flex-1 relative">
                {/* Grid lines */}
                {yVals.map((v) => (
                  <div key={v} className="absolute left-0 right-0" style={{ bottom: `${(v / maxVal) * 100}%`, borderTop: '1px dashed #E7E5E4' }} />
                ))}
                <div className="flex items-end gap-0.5 absolute inset-0 pb-5">
                  {monthly.map(({ m, income, expense }, idx) => (
                    <div key={m} className="flex-1 flex flex-col items-center gap-0.5 relative h-full"
                      onClick={() => setTooltip(tooltip === idx ? null : idx)}>
                      {/* Tooltip */}
                      {tooltip === idx && (
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 bg-white rounded-xl px-2.5 py-1.5 shadow-lg border border-stone-100 whitespace-nowrap" style={{ bottom: 'auto', top: -60 }}>
                          <p className="text-[10px] font-bold text-[#1C1917] mb-0.5">{m} {year}</p>
                          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"/><span className="text-[9px] text-[#1C1917]">₹{(income/1000).toFixed(0)}K</span></div>
                          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#DC2626]"/><span className="text-[9px] text-[#1C1917]">₹{(expense/1000).toFixed(0)}K</span></div>
                        </div>
                      )}
                      <div className="flex items-end gap-0.5 flex-1 w-full">
                        <div className="flex-1 bg-emerald-400 rounded-t-sm" style={{ height: `${(income/maxVal)*100}%`, minHeight: 3 }} />
                        <div className="flex-1 rounded-t-sm" style={{ height: `${(expense/maxVal)*100}%`, minHeight: 3, background: '#DC2626' }} />
                      </div>
                      <span className="text-[8px] text-[#78716C] absolute bottom-0">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── FESTIVAL BARS CARD ── */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
                  <IndianRupee className="w-4.5 h-4.5 text-[#D97706]" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#1C1917] devanagari">{lang === 'mr' ? 'उत्सवाभिहाय संकलन' : 'Festival Collections'}</p>
                  <p className="text-[10px] text-[#78716C] devanagari">{lang === 'mr' ? `वर्ष ${year}` : `Year ${year}`}</p>
                </div>
              </div>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-stone-200 text-[11px] text-[#78716C]">
                <span className="devanagari">{lang === 'mr' ? 'सर्व उत्सव' : 'All Festivals'}</span><ChevronDown className="w-3 h-3"/>
              </button>
            </div>
            <div className="flex flex-col gap-3.5">
              {festivalBars.map(({ nameMr, name, pct, amount }) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] text-[#1C1917] font-medium">{lang === 'mr' ? nameMr : name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-[#78716C]">{pct}%</span>
                      <span className="text-[13px] font-bold text-[#1C1917]">₹{fmt(amount)}</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #8B0000, #B91C1C)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── DONUT CHART CARD ── */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                  <PieChart className="w-4.5 h-4.5 text-[#DC2626]" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#1C1917] devanagari">{lang === 'mr' ? 'श्रेणी विभाजन' : 'Category Breakdown'}</p>
                  <p className="text-[10px] text-[#78716C] devanagari">{lang === 'mr' ? `एकूण खर्चाचे वर्गीकरण (${year})` : `Total Expense Categorization (${year})`}</p>
                </div>
              </div>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-stone-200 text-[11px] text-[#78716C]">
                <span className="devanagari">{lang === 'mr' ? 'खर्च' : 'Expense'}</span><ChevronDown className="w-3 h-3"/>
              </button>
            </div>
            <div className="flex items-center gap-4">
              {/* Donut SVG */}
              <div className="flex-shrink-0 relative" style={{ width: 140, height: 140 }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {donutPaths.map((s, i) => (
                    <path key={i} d={s.d} fill={s.color} stroke="white" strokeWidth="1.5" />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[15px] font-bold text-[#1C1917]">₹92,000</p>
                  <p className="text-[10px] text-[#78716C] devanagari">{lang === 'mr' ? 'एकूण खर्च' : 'Total Expense'}</p>
                </div>
              </div>
              {/* Legend */}
              <div className="flex-1 flex flex-col gap-2">
                {donutSlices.map(({ labelMr, label, color, amount }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="text-[11px] text-[#78716C] devanagari">{lang === 'mr' ? labelMr : label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#1C1917]">₹{fmt(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SUMMARY STAT ROW ── */}
          <div className="grid grid-cols-4 gap-2">
            {summaryStats.map(({ icon: Icon, value, labelMr, labelEn, badgeMr, badgeEn, up, iconBg, iconColor }) => (
              <div key={labelMr} className="bg-white rounded-2xl p-3 flex flex-col gap-1.5" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
                  <Icon style={{ width: 16, height: 16, color: iconColor }} />
                </div>
                <p className="font-bold text-[13px] text-[#1C1917] leading-tight">{value}</p>
                <p className="text-[9px] text-[#78716C] devanagari leading-tight">{lang === 'mr' ? labelMr : labelEn}</p>
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full self-start"
                  style={{ background: up === true ? '#D1FAE5' : up === false ? '#FEE2E2' : '#FEF3C7' }}>
                  <span className="text-[9px] font-bold devanagari" style={{ color: up === true ? '#059669' : up === false ? '#DC2626' : '#B45309' }}>{lang === 'mr' ? badgeMr : badgeEn}</span>
                  {up === true  && <TrendingUp  style={{ width: 9, height: 9, color: '#059669' }} />}
                  {up === false && <TrendingDown style={{ width: 9, height: 9, color: '#DC2626' }} />}
                </div>
              </div>
            ))}
          </div>

          <div className="h-2" />
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: DOCUMENTS ────────────────────────────────────────────────────────

function DocumentsScreen({ lang, pop, store }: { lang: Lang; pop: () => void; store?: AppStore }) {
  const staticFolders = [
    {
      nameMr: 'परवानग्या', name: 'Permissions',
      icon: FileText, iconBg: '#FEE2E2', iconColor: '#DC2626',
      arrowBg: '#FEE2E2', arrowColor: '#DC2626',
      badgeMr: 'प्रशासक', badge: 'Admin', badgeBg: '#FEE2E2', badgeColor: '#8B0000',
      mandalaColor: '#8B0000',
    },
    {
      nameMr: 'बिले आणि पावत्या', name: 'Bills & Receipts',
      icon: Receipt, iconBg: '#EDE9FE', iconColor: '#5B21B6',
      arrowBg: '#EDE9FE', arrowColor: '#5B21B6',
      badgeMr: 'सदस्य', badge: 'Member', badgeBg: '#EDE9FE', badgeColor: '#5B21B6',
      mandalaColor: '#5B21B6',
    },
    {
      nameMr: 'बँक कागदपत्रे', name: 'Bank Documents',
      icon: Building2, iconBg: '#D1FAE5', iconColor: '#065F46',
      arrowBg: '#D1FAE5', arrowColor: '#065F46',
      badgeMr: 'मुख्य प्रशासक', badge: 'Super Admin', badgeBg: '#FEE2E2', badgeColor: '#8B0000',
      mandalaColor: '#065F46',
    },
    {
      nameMr: 'उत्सव फोटो', name: 'Festival Photos',
      icon: Image, iconBg: '#FEF3C7', iconColor: '#D97706',
      arrowBg: '#FEF3C7', arrowColor: '#D97706',
      badgeMr: 'सर्वांसाठी', badge: 'Public', badgeBg: '#D1FAE5', badgeColor: '#065F46',
      mandalaColor: '#D97706',
    },
    {
      nameMr: 'QR कोड', name: 'QR Codes',
      icon: QrCode, iconBg: '#EDE9FE', iconColor: '#5B21B6',
      arrowBg: '#EDE9FE', arrowColor: '#5B21B6',
      badgeMr: 'सदस्य', badge: 'Member', badgeBg: '#EDE9FE', badgeColor: '#5B21B6',
      mandalaColor: '#5B21B6',
    },
    {
      nameMr: 'अधिकृत कागदपत्रे', name: 'Official Documents',
      icon: Archive, iconBg: '#F1F5F9', iconColor: '#475569',
      arrowBg: '#F1F5F9', arrowColor: '#475569',
      badgeMr: 'मुख्य प्रशासक', badge: 'Super Admin', badgeBg: '#FEE2E2', badgeColor: '#8B0000',
      mandalaColor: '#475569',
    },
  ]

  const storeDocs = store?.state.documents ?? []
  const folders = staticFolders.map((f, i) => {
    const sDoc = storeDocs[i]
    return { ...f, count: sDoc?.count ?? 0, size: sDoc?.size ?? '0 MB' }
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        <svg className="absolute right-3 top-2 opacity-15" width="110" height="72" viewBox="0 0 110 72" fill="none">
          <circle cx="75" cy="30" r="28" stroke="white" strokeWidth="0.8" fill="none"/>
          <circle cx="75" cy="30" r="20" stroke="white" strokeWidth="0.6" fill="none"/>
          <circle cx="75" cy="30" r="12" stroke="white" strokeWidth="0.5" fill="none"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
            <line key={a} x1="75" y1="30" x2={75+28*Math.cos(a*Math.PI/180)} y2={30+28*Math.sin(a*Math.PI/180)} stroke="white" strokeWidth="0.4"/>
          ))}
          <path d="M40 5L46 18H52V28H58V38H64V72H16V38H22V28H28V18H34L40 5Z" fill="white"/>
          <path d="M10 28L16 38H22V72H-2V38H4V28H10Z" fill="white" opacity="0.7"/>
          <path d="M70 28L76 38H82V72H56V38H62V28H70Z" fill="white" opacity="0.7"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 flex items-center gap-3 relative">
          <button onClick={pop} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-[22px] devanagari leading-tight">{lang === 'mr' ? 'कागदपत्रे' : 'Documents'}</h1>
            <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'सर्व महत्वाची कागदपत्रे एकाच ठिकाणी' : 'All important documents in one place'}</p>
          </div>
          <div className="text-right">
            {lang === 'mr' ? (
              <>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">"दस्तऐवज</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">सुरक्षित,</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">समाज अधिक सक्षम"</p>
              </>
            ) : (
              <>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">"Documents</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">Secure,</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">Society Empowered"</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5]">
        {/* Storage card */}
        <div className="mx-4 mt-4 mb-3 bg-white rounded-2xl px-4 py-3.5" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
              <Database style={{ width: 22, height: 22, color: '#8B0000' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-bold text-[15px] text-[#1C1917] devanagari">{lang === 'mr' ? 'स्टोरेज वापरले' : 'Storage Used'}</p>
                <p className="text-[13px] text-[#78716C] font-medium">929 MB / 2 GB</p>
              </div>
              <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '46%', background: 'linear-gradient(90deg, #8B0000, #B91C1C)' }} />
              </div>
              <p className="text-[11px] text-[#78716C] devanagari mt-1">{lang === 'mr' ? '४६% वापरलेले' : '46% Used'}</p>
            </div>
          </div>
        </div>

        {/* Folder grid */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-3">
          {folders.map((f, i) => {
            const IconComp = f.icon
            return (
              <div key={i} className="bg-white rounded-2xl p-4 relative overflow-hidden"
                style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                {/* Mandala watermark */}
                <svg className="absolute bottom-2 right-2 opacity-[0.07]" width="56" height="56" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="28" stroke={f.mandalaColor} strokeWidth="1" fill="none"/>
                  <circle cx="30" cy="30" r="20" stroke={f.mandalaColor} strokeWidth="1" fill="none"/>
                  <circle cx="30" cy="30" r="12" stroke={f.mandalaColor} strokeWidth="1" fill="none"/>
                  {[0,45,90,135,180,225,270,315].map(a => (
                    <line key={a} x1="30" y1="30" x2={30+28*Math.cos(a*Math.PI/180)} y2={30+28*Math.sin(a*Math.PI/180)} stroke={f.mandalaColor} strokeWidth="0.8"/>
                  ))}
                </svg>

                {/* Top row: icon + arrow */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: f.iconBg }}>
                    <IconComp style={{ width: 24, height: 24, color: f.iconColor }} />
                  </div>
                  <div className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: f.arrowColor, background: 'transparent' }}>
                    <ChevronRight style={{ width: 13, height: 13, color: f.arrowColor }} />
                  </div>
                </div>

                {/* Folder name */}
                <p className="font-bold text-[15px] text-[#1C1917] devanagari leading-tight mb-1">
                  {lang === 'mr' ? f.nameMr : f.name}
                </p>
                <p className="text-[11px] text-[#78716C] mb-2.5 devanagari">
                  {f.count} {lang === 'mr' ? 'फाइल्स' : 'files'} • {f.size}
                </p>

                {/* Access badge */}
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full devanagari"
                  style={{ background: f.badgeBg, color: f.badgeColor }}>
                  {lang === 'mr' ? f.badgeMr : f.badge}
                </span>
              </div>
            )
          })}
        </div>

        {/* Upload button */}
        <div className="px-4 mb-3">
          <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-bold text-[16px] devanagari"
            style={{ background: '#8B0000', boxShadow: '0 4px 16px rgba(139,0,0,0.3)' }}>
            <Upload style={{ width: 20, height: 20 }} />
            {lang === 'mr' ? 'कागदपत्र अपलोड करा' : 'Upload Document'}
          </button>
        </div>

        {/* Security banner */}
        <div className="mx-4 mb-6 bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#D1FAE5' }}>
            <Shield style={{ width: 22, height: 22, color: '#059669' }} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[14px] text-[#1C1917] devanagari leading-tight">{lang === 'mr' ? 'तुमची सर्व कागदपत्रे सुरक्षित आहेत' : 'All your documents are secure'}</p>
            <p className="text-[11px] text-[#78716C] devanagari mt-0.5">{lang === 'mr' ? 'एन्क्रिप्टेड स्टोरेज • सुरक्षित प्रवेश • सदैव उपलब्ध' : 'Encrypted storage • Secure access • Always available'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: AUDIT HISTORY ────────────────────────────────────────────────────

function AuditHistoryScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { key: 'all',          labelMr: 'सर्व',     label: 'All',          icon: BarChart2 },
    { key: 'transactions', labelMr: 'व्यवहार',  label: 'Transactions', icon: null },
    { key: 'approvals',    labelMr: 'मंजुरी',   label: 'Approvals',    icon: null },
    { key: 'members',      labelMr: 'सदस्य',    label: 'Members',      icon: null },
    { key: 'changes',      labelMr: 'बदल',      label: 'Changes',      icon: null },
  ]

  const events = [
    {
      user: 'Siddharth Kadam', userMr: 'सिद्धार्थ कदम',
      actionMr: 'खर्च रक्कम बदलली', actionEn: 'Changed expense amount',
      changeType: 'amount', from: '₹3,000', to: '₹3,200',
      reasonMr: 'वाहतूक खर्च जोडला', reasonEn: 'Transportation expense added',
      date: '25 Aug 2026', time: '3:12 PM',
      type: 'edit', dot: '#F59E0B',
      iconBg: '#FEF3C7', iconColor: '#92400E',
    },
    {
      user: 'Suresh Kadam', userMr: 'सुरेश कदम',
      actionMr: 'खर्च मंजूर केला', actionEn: 'Approved expense',
      changeType: 'status',
      fromMr: 'तपासणी सुरू', fromEn: 'Under Review',
      toMr: 'मंजूर', toEn: 'Approved',
      reasonMr: 'बिल पडताळले', reasonEn: 'Bill verified',
      date: '25 Aug 2026', time: '2:45 PM',
      type: 'approve', dot: '#10B981',
      iconBg: '#D1FAE5', iconColor: '#065F46',
    },
    {
      user: 'Minal Shinde', userMr: 'मिनल शिंदे',
      actionMr: 'नवीन जमा नोंदवली', actionEn: 'Added new collection',
      changeType: 'add', from: '', to: '₹5,001',
      reasonMr: 'गणेशोत्सव वर्गणी', reasonEn: 'Ganeshotsav contribution',
      date: '25 Aug 2026', time: '2:30 PM',
      type: 'create', dot: '#3B82F6',
      iconBg: '#DBEAFE', iconColor: '#1D4ED8',
    },
    {
      user: 'Rahul Patil', userMr: 'राहुल पाटील',
      actionMr: 'सदस्य भूमिका बदलली', actionEn: 'Member role changed',
      changeType: 'role',
      fromMr: 'स्वयंसेवक', fromEn: 'Volunteer',
      toMr: 'प्रशासक', toEn: 'Admin',
      reasonMr: 'समितीचा निर्णय', reasonEn: 'Committee decision',
      date: '24 Aug 2026', time: '11:20 AM',
      type: 'role', dot: '#EF4444',
      iconBg: '#FFE4E6', iconColor: '#BE123C',
    },
  ]

  const icons: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
    edit: Edit3, approve: Check, create: Plus, role: User2,
  }

  const filtered = events.filter(e => {
    const act = lang === 'mr' ? e.actionMr : e.actionEn
    const rsn = lang === 'mr' ? e.reasonMr : e.reasonEn
    return (
      e.user.toLowerCase().includes(search.toLowerCase()) ||
      act.toLowerCase().includes(search.toLowerCase()) ||
      rsn.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        <svg className="absolute right-3 top-2 opacity-15" width="110" height="72" viewBox="0 0 110 72" fill="none">
          <circle cx="75" cy="30" r="28" stroke="white" strokeWidth="0.8" fill="none"/>
          <circle cx="75" cy="30" r="20" stroke="white" strokeWidth="0.6" fill="none"/>
          <circle cx="75" cy="30" r="12" stroke="white" strokeWidth="0.5" fill="none"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
            <line key={a} x1="75" y1="30" x2={75+28*Math.cos(a*Math.PI/180)} y2={30+28*Math.sin(a*Math.PI/180)} stroke="white" strokeWidth="0.4"/>
          ))}
          <path d="M40 5L46 18H52V28H58V38H64V72H16V38H22V28H28V18H34L40 5Z" fill="white"/>
          <path d="M10 28L16 38H22V72H-2V38H4V28H10Z" fill="white" opacity="0.7"/>
          <path d="M70 28L76 38H82V72H56V38H62V28H70Z" fill="white" opacity="0.7"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 flex items-center gap-3 relative">
          <button onClick={pop} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-[22px] devanagari leading-tight">{lang === 'mr' ? 'ऑडिट इतिहास' : 'Audit History'}</h1>
            <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'नोंदी आणि बदलांचा मागोवा' : 'Track records and changes'}</p>
          </div>
          <div className="text-right">
            {lang === 'mr' ? (
              <>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">"पारदर्शक</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">व्यवस्थापन,</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">समृद्ध समाज"</p>
              </>
            ) : (
              <>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">"Transparent</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">Governance,</p>
                <p className="text-[#F59E0B] text-[11px] font-semibold leading-tight">Prosperous Society"</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-shrink-0 bg-white px-4 py-3 flex items-center gap-2 border-b border-stone-100">
        <div className="flex-1 flex items-center bg-stone-50 rounded-2xl px-4 py-3 border border-stone-200 gap-2">
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            className="flex-1 bg-transparent text-[13px] text-[#1C1917] outline-none placeholder-stone-400 devanagari"
            placeholder={lang === 'mr' ? 'सदस्य, कृती किंवा कारण शोधा...' : 'Search by member, action or reason...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-1.5 px-3.5 h-12 rounded-2xl flex-shrink-0" style={{ background: '#FEE2E2' }}>
          <Filter style={{ width: 16, height: 16, color: '#8B0000' }} />
          <span className="text-[13px] font-semibold text-[#8B0000] devanagari">{lang === 'mr' ? 'फिल्टर' : 'Filter'}</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex-shrink-0 bg-white border-b border-stone-100 px-3 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap flex-shrink-0 transition-all"
              style={activeTab === tab.key
                ? { background: '#8B0000', color: 'white' }
                : { background: 'white', color: '#78716C', border: '1px solid #E7E5E4' }
              }>
              {tab.key === 'all' && activeTab === 'all' && (
                <BarChart2 style={{ width: 14, height: 14, color: 'white' }} />
              )}
              <span className="devanagari">{lang === 'mr' ? tab.labelMr : tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5]">
        {/* Stats card */}
        <div className="mx-4 mt-4 mb-3 bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div className="flex">
            <div className="flex-1 flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                <BarChart2 style={{ width: 20, height: 20, color: '#8B0000' }} />
              </div>
              <div>
                <p className="text-[11px] text-[#78716C] devanagari leading-tight">{lang === 'mr' ? 'एकूण ऑडिट नोंदी' : 'Total Audit Records'}</p>
                <p className="text-[24px] font-bold text-[#8B0000] leading-tight mt-0.5">128</p>
              </div>
            </div>
            <div className="w-px bg-stone-100 my-3" />
            <div className="flex-1 flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                <Clock style={{ width: 20, height: 20, color: '#8B0000' }} />
              </div>
              <div>
                <p className="text-[11px] text-[#78716C] devanagari leading-tight">{lang === 'mr' ? 'अलीकडील नोंद' : 'Latest Activity'}</p>
                <p className="text-[13px] font-semibold text-[#1C1917] leading-tight mt-0.5">25 Aug 2026</p>
                <p className="text-[11px] text-[#78716C]">3:12 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between px-4 mb-3">
          <div>
            <h2 className="text-[16px] font-bold text-[#1C1917] devanagari">{lang === 'mr' ? 'अलीकडील घडामोडी' : 'Recent Activities'}</h2>
          </div>
          <button className="flex items-center gap-1 text-[12px] text-[#78716C]">
            <ArrowLeftRight style={{ width: 13, height: 13 }} />
            <span className="devanagari">{lang === 'mr' ? 'नवीनतम पहिले' : 'Newest First'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline */}
        <div className="px-4 pb-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-stone-200" />

            <div className="flex flex-col gap-3">
              {filtered.map((e, i) => {
                const IconComp = icons[e.type]
                return (
                  <div key={i} className="flex gap-3">
                    {/* Dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-6 h-6 rounded-full border-2 border-white flex-shrink-0 z-10 mt-3.5"
                        style={{ background: e.dot, boxShadow: `0 0 0 2px ${e.dot}33` }} />
                    </div>
                    {/* Card */}
                    <div className="flex-1 bg-white rounded-2xl px-4 py-3.5 mb-0.5" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: e.iconBg }}>
                          <IconComp style={{ width: 20, height: 20, color: e.iconColor }} />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-[14px] text-[#1C1917]">{lang === 'mr' ? (e.userMr || e.user) : e.user}</p>
                              <p className="text-[12px] text-[#78716C]">{lang === 'mr' ? e.actionMr : e.actionEn}</p>
                            </div>
                            <div className="flex items-start gap-1 flex-shrink-0">
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-[10px] text-[#78716C]">
                                  <Calendar style={{ width: 10, height: 10 }} />
                                  <span>{e.date}</span>
                                </div>
                                <p className="text-[10px] text-[#78716C]">{e.time}</p>
                              </div>
                              <button className="ml-1">
                                <MoreVertical style={{ width: 14, height: 14, color: '#C7B9B9' }} />
                              </button>
                            </div>
                          </div>

                          {/* Change visualization */}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {e.changeType === 'amount' && (
                              <>
                                <span className="px-2.5 py-1 rounded-lg text-[12px] font-semibold" style={{ background: '#FEE2E2', color: '#8B0000' }}>{e.from}</span>
                                <ChevronRight style={{ width: 14, height: 14, color: '#78716C' }} />
                                <span className="px-2.5 py-1 rounded-lg text-[12px] font-semibold" style={{ background: '#FEE2E2', color: '#8B0000' }}>{e.to}</span>
                              </>
                            )}
                            {e.changeType === 'status' && (
                              <>
                                <span className="px-2.5 py-1 rounded-lg text-[12px] font-semibold border border-stone-200 text-[#78716C]">{lang === 'mr' ? e.fromMr : e.fromEn}</span>
                                <ChevronRight style={{ width: 14, height: 14, color: '#78716C' }} />
                                <span className="px-2.5 py-1 rounded-lg text-[12px] font-semibold" style={{ background: '#D1FAE5', color: '#065F46' }}>{lang === 'mr' ? e.toMr : e.toEn}</span>
                              </>
                            )}
                            {e.changeType === 'add' && (
                              <span className="px-2.5 py-1 rounded-lg text-[12px] font-semibold" style={{ background: '#D1FAE5', color: '#065F46' }}>{e.to}</span>
                            )}
                            {e.changeType === 'role' && (
                              <>
                                <span className="px-2.5 py-1 rounded-lg text-[12px] font-semibold border border-stone-200 text-[#78716C]">{lang === 'mr' ? e.fromMr : e.fromEn}</span>
                                <ChevronRight style={{ width: 14, height: 14, color: '#78716C' }} />
                                <span className="px-2.5 py-1 rounded-lg text-[12px] font-semibold" style={{ background: '#D1FAE5', color: '#065F46' }}>{lang === 'mr' ? e.toMr : e.toEn}</span>
                              </>
                            )}
                          </div>

                          {/* Reason */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <FileText style={{ width: 12, height: 12, color: '#78716C' }} />
                            <p className="text-[11px] text-[#78716C] devanagari">{lang === 'mr' ? `कारण: ${e.reasonMr}` : `Reason: ${e.reasonEn}`}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom trust banner */}
        <div className="mx-4 mb-6 rounded-2xl overflow-hidden" style={{ background: '#FEF3C7', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-4 px-4 py-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FDE68A' }}>
              <Shield style={{ width: 22, height: 22, color: '#B45309' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[14px] text-[#8B0000] devanagari leading-tight">{lang === 'mr' ? 'प्रत्येक बदलाची नोंद कायम सुरक्षित' : 'Every change is securely recorded'}</p>
              <p className="text-[11px] text-[#78716C] mt-0.5">{lang === 'mr' ? 'संपूर्ण सुरक्षित आणि पडताळणीयोग्य' : 'Fully secure and verifiable'}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,0,0,0.12)' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#8B0000">
                  <path d="M12 2C10.5 2 9 3 9 4.5V6H6C5.4 6 5 6.4 5 7V19C5 19.6 5.4 20 6 20H18C18.6 20 19 19.6 19 19V7C19 6.4 18.6 6 18 6H15V4.5C15 3 13.5 2 12 2ZM12 3.5C12.8 3.5 13.5 4.2 13.5 5V6H10.5V5C10.5 4.2 11.2 3.5 12 3.5Z" />
                </svg>
              </div>
              <p className="text-[10px] text-[#8B0000] font-semibold devanagari text-right leading-tight">
                {lang === 'mr' ? <>पारदर्शकता<br/>विश्वास निर्माण करते</> : <>Transparency<br/>Builds Trust</>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: MORE ─────────────────────────────────────────────────────────────

const MORE_SECTIONS = [
  {
    titleMr: 'आर्थिक', title: 'Financial', sectionIcon: BarChart2,
    items: [
      { icon: BarChart2,    labelMr: 'अहवाल',       label: 'Reports',   subMr: 'आर्थिक अहवाल आणि तपशील',      sub: 'Financial reports & details',    screen: 'reports' as Screen },
      { icon: PieChart,     labelMr: 'विश्लेषण',    label: 'Analytics', subMr: 'उत्पन्न, खर्च आणि ट्रेंड',    sub: 'Income, expense & trends',       screen: 'analytics' as Screen },
      { icon: AlertCircle,  labelMr: 'बाकी वर्गणी', label: 'Pending',   subMr: 'थकित देयके आणि स्मरणपत्र',    sub: 'Due payments & reminders',       screen: 'pending-collections' as Screen },
    ]
  },
  {
    titleMr: 'व्यवस्थापन', title: 'Management', sectionIcon: IndianRupee,
    items: [
      { icon: IndianRupee,  labelMr: 'देणगी',       label: 'Donations',  subMr: 'देणगी नोंदणी आणि तपशील',      sub: 'Donation records & details',      screen: 'donations' as Screen },
      { icon: TrendingDown, labelMr: 'खर्च',         label: 'Expenses',   subMr: 'खर्च नोंदणी आणि व्यवस्थापन', sub: 'Expense records & management',    screen: 'expenses' as Screen },
      { icon: Folder,       labelMr: 'कागदपत्रे',   label: 'Documents',  subMr: 'महत्वाची कागदपत्रे आणि फायली', sub: 'Important documents & files',    screen: 'documents' as Screen },
      { icon: BookOpen,     labelMr: 'ऑडिट',        label: 'Audit',      subMr: 'लेखा परीक्षण व नोंदी',          sub: 'Accounting review & records',    screen: 'audit-history' as Screen },
    ]
  },
  {
    titleMr: 'प्रशासन', title: 'Administration', sectionIcon: Settings,
    items: [
      { icon: Shield,       labelMr: 'प्रशासन केंद्र', label: 'Admin Center', subMr: 'भूमिका, परवानग्या आणि सेटिंग्ज', sub: 'Roles, permissions & settings', screen: 'admin' as Screen },
      { icon: Info,         labelMr: 'ॲप माहिती',      label: 'App Info',     subMr: 'आवृत्ती, गोपनीयता धोरण आणि मदत',  sub: 'Version, privacy & help',      screen: 'about' as Screen },
      { icon: LogOut,       labelMr: 'लॉगआउट',         label: 'Logout',       subMr: 'सुरक्षितपणे बाहेर पडा',           sub: 'Sign out securely',            screen: 'login' as Screen },
    ]
  },
] as const

function MoreScreen({ lang, push, onLangToggle, store }: { lang: Lang; push: (s: Screen) => void; onLangToggle: () => void; store?: AppStore }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        <svg className="absolute bottom-0 right-0 w-48 h-24 opacity-10" viewBox="0 0 200 100" fill="white">
          <path d="M100 5L110 25H120V40H130V55H140V100H60V55H70V40H80V25H90L100 5Z"/>
          <path d="M50 40L60 55H70V100H30V55H40V40H50Z"/>
          <path d="M150 40L160 55H170V100H130V55H140V40H150Z"/>
          <rect x="80" y="70" width="40" height="30"/>
          <rect x="43" y="70" width="20" height="30"/>
          <rect x="137" y="70" width="20" height="30"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 relative">
          <div className="flex items-start justify-between">
            <div className="flex gap-2.5">
              <div style={{ width: 3, borderRadius: 2, background: '#F59E0B', minHeight: 44 }} />
              <div>
                <h1 className="text-white font-bold text-[24px] devanagari leading-tight">{lang === 'mr' ? 'अधिक' : 'More'}</h1>
                <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'व्यवस्थापन केंद्र' : 'Management Center'}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => push('notifications')} className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D97706] rounded-full border border-[#8B0000]" />
              </button>
              <p className="text-[#F59E0B] text-[11px] font-semibold devanagari">{lang === 'mr' ? '॥ गणपती बाप्पा मोरया ॥' : 'Serving Together'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-4 mb-3 flex items-center gap-3" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[18px] text-white" style={{ background: '#7C3AED' }}>
            {store?.state.currentUser?.name.split(' ').map((n: string) => n[0]).join('') ?? 'SK'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[16px] text-[#1C1917]">{store?.state.currentUser?.name ?? 'Siddharth Kadam'}</p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold devanagari mt-0.5" style={{ background: '#FEF3C7', color: '#92400E' }}>
              {lang === 'mr' ? (store?.state.currentUser?.roleMr ?? 'खजिनदार') : (store?.state.currentUser?.role ?? 'Treasurer')}
            </span>
            <p className="text-[11px] text-[#78716C] mt-0.5 truncate devanagari">{lang === 'mr' ? 'श्रीमंत सहकार मित्र मंडळ' : 'Shrimant Sahakar Mitra Mandal'}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-stone-400" />
                <span className="text-[11px] text-[#78716C]">{store?.state.currentUser?.mobile ?? '87654 32109'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-stone-400" />
                <span className="text-[11px] text-[#78716C]">{store?.state.currentUser?.name.toLowerCase().split(' ')[0]}@sahakarmandal.org</span>
              </div>
            </div>
          </div>
          <button onClick={() => push('member-profile')} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#8B0000] flex-shrink-0">
            <ChevronRight className="w-3.5 h-3.5 text-[#8B0000]" />
            <span className="text-[11px] font-semibold text-[#8B0000] devanagari">{lang === 'mr' ? 'प्रोफाइल पहा' : 'View Profile'}</span>
          </button>
        </div>

        {/* Language toggle */}
        <div className="bg-white rounded-2xl p-4 mb-4 flex items-center justify-between" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEF3C7' }}>
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-[#D97706]">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 2C10 2 7 6 7 10C7 14 10 18 10 18" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 2C10 2 13 6 13 10C13 14 10 18 10 18" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 10H18" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 6.5H17M3 13.5H17" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[14px] text-[#1C1917] devanagari">{lang === 'mr' ? 'भाषा' : 'Language'}</p>
              <p className="text-[11px] text-[#78716C] devanagari">{lang === 'mr' ? 'आपली पसंतीची भाषा निवडा' : 'Select your preferred language'}</p>
            </div>
          </div>
          <div className="flex items-center rounded-full overflow-hidden border border-stone-200">
            <button onClick={() => lang !== 'mr' && onLangToggle()}
              className={`px-4 py-1.5 text-[13px] font-bold devanagari transition-all ${lang === 'mr' ? 'text-white' : 'text-[#78716C] bg-white'}`}
              style={lang === 'mr' ? { background: '#8B0000' } : {}}>{lang === 'mr' ? 'मराठी' : 'Marathi'}</button>
            <button onClick={() => lang !== 'en' && onLangToggle()}
              className={`px-4 py-1.5 text-[13px] font-bold transition-all ${lang === 'en' ? 'text-white' : 'text-[#78716C] bg-white'}`}
              style={lang === 'en' ? { background: '#8B0000' } : {}}>{lang === 'mr' ? 'इंग्रजी' : 'English'}</button>
          </div>
        </div>

        {/* Sections */}
        {MORE_SECTIONS.map(({ titleMr, title, sectionIcon: SectionIcon, items }) => (
          <div key={titleMr} className="mb-4">
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="flex items-center gap-2">
                <SectionIcon className="w-5 h-5 text-[#8B0000]" />
                <p className="text-[15px] font-bold text-[#1C1917] devanagari">{lang === 'mr' ? titleMr : title}</p>
              </div>
              <button className="flex items-center gap-0.5 text-[12px] font-semibold text-[#8B0000] devanagari">
                {lang === 'mr' ? 'सर्व पहा' : 'View All'} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
              {items.map(({ icon: ItemIcon, labelMr, label, subMr, sub, screen }, i) => (
                <button key={screen} onClick={() => push(screen)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-stone-50 transition-colors ${i < items.length - 1 ? 'border-b border-stone-100' : ''}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,0,0,0.08)' }}>
                    <ItemIcon className="w-5 h-5 text-[#8B0000]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#1C1917] devanagari">{lang === 'mr' ? labelMr : label}</p>
                    <p className="text-[11px] text-[#78716C] devanagari mt-0.5">{lang === 'mr' ? subMr : sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── SCREEN: ADMIN ────────────────────────────────────────────────────────────

function AdminScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const menuItems = [
    {
      icon: Building2, iconBg: '#FEE2E2', iconColor: '#8B0000',
      labelMr: 'मंडळ प्रोफाइल', label: 'Mandal Profile',
      subMr: 'मंडळाची माहिती, संपर्क तपशील आणि मूलभूत सेटिंग्ज',
      sub: 'Mandal info, contact details & basic settings',
      screen: 'mandal-profile' as Screen,
    },
    {
      icon: Shield, iconBg: '#DBEAFE', iconColor: '#1D4ED8',
      labelMr: 'भुमिका व परवानग्या', label: 'Roles & Permissions',
      subMr: 'सदस्यांच्या भूमिका, परवानग्या आणि प्रवेश नियंत्रण',
      sub: 'Member roles, permissions & access control',
      screen: 'roles-permissions' as Screen,
    },
    {
      icon: Lock, iconBg: '#D1FAE5', iconColor: '#065F46',
      labelMr: 'सुरक्षा', label: 'Security',
      subMr: 'पासवर्ड, दोन-स्तरीय प्रमाणीकरण आणि सुरक्षा सेटिंग्ज',
      sub: 'Password, 2FA & security settings',
      screen: 'security' as Screen,
    },
    {
      icon: Archive, iconBg: '#FEF3C7', iconColor: '#B45309',
      labelMr: 'बॅकअप व निर्यात', label: 'Backup & Export',
      subMr: 'डेटा बॅकअप, पुनर्स्थापना आणि निर्यात पर्याय',
      sub: 'Data backup, restore & export options',
      screen: 'backup' as Screen,
    },
    {
      icon: Bell, iconBg: '#EDE9FE', iconColor: '#5B21B6',
      labelMr: 'सूचना सेटिंग्ज', label: 'Notification Settings',
      subMr: 'सूचना प्राधान्ये, ईमेल आणि पुश नोटिफिकेशन्स',
      sub: 'Notification preferences, email & push',
      screen: 'notification-settings' as Screen,
    },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        <svg className="absolute right-3 top-2 opacity-15" width="110" height="72" viewBox="0 0 110 72" fill="none">
          <circle cx="75" cy="30" r="28" stroke="white" strokeWidth="0.8" fill="none"/>
          <circle cx="75" cy="30" r="20" stroke="white" strokeWidth="0.6" fill="none"/>
          <circle cx="75" cy="30" r="12" stroke="white" strokeWidth="0.5" fill="none"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
            <line key={a} x1="75" y1="30" x2={75+28*Math.cos(a*Math.PI/180)} y2={30+28*Math.sin(a*Math.PI/180)} stroke="white" strokeWidth="0.4"/>
          ))}
          <path d="M40 5L46 18H52V28H58V38H64V72H16V38H22V28H28V18H34L40 5Z" fill="white"/>
          <path d="M10 28L16 38H22V72H-2V38H4V28H10Z" fill="white" opacity="0.7"/>
          <path d="M70 28L76 38H82V72H56V38H62V28H70Z" fill="white" opacity="0.7"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 flex items-center gap-3 relative">
          <button onClick={pop} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-[22px] devanagari leading-tight">{lang === 'mr' ? 'प्रशासन केंद्र' : 'Admin Center'}</h1>
            <p className="text-white/60 text-[12px] devanagari mt-0.5">{lang === 'mr' ? 'व्यवस्था, सुरक्षितता आणि नियंत्रण' : 'Management, Security & Control'}</p>
          </div>
          <div className="text-right">
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">{lang === 'mr' ? '"सेवा' : '"Service'}</p>
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">{lang === 'mr' ? 'सहकार्य' : 'Cooperation'}</p>
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">{lang === 'mr' ? 'समृद्ध समाज"' : 'Prosperity"'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5]">
        <div className="px-4 pt-4 flex flex-col gap-2.5">
          {/* Top info card (no chevron) */}
          <div className="bg-white rounded-2xl px-4 py-4 flex items-center gap-3" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
              <Shield style={{ width: 24, height: 24, color: '#8B0000' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[16px] text-[#1C1917] devanagari leading-tight">{lang === 'mr' ? 'प्रशासन केंद्र' : 'Admin Center'}</p>
              <p className="text-[12px] text-[#78716C] devanagari mt-0.5">{lang === 'mr' ? 'व्यवस्थापन अधिक सक्षम, समाज अधिक मजबूत' : 'Empowering management, strengthening community'}</p>
            </div>
          </div>

          {/* Menu items */}
          {menuItems.map(({ icon: Icon, iconBg, iconColor, labelMr, label, subMr, sub, screen }) => (
            <button key={screen} onClick={() => push(screen)}
              className="bg-white rounded-2xl px-4 py-4 flex items-center gap-3 text-left w-full"
              style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg }}>
                <Icon style={{ width: 24, height: 24, color: iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] text-[#1C1917] devanagari leading-tight">
                  {lang === 'mr' ? labelMr : label}
                </p>
                <p className="text-[12px] text-[#78716C] devanagari mt-0.5 leading-snug">
                  {lang === 'mr' ? subMr : sub}
                </p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: '#DC2626' }} className="flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Decorative Ganesh footer */}
        <div className="relative mx-4 mt-6 mb-6 rounded-2xl overflow-hidden" style={{ background: '#FFFBF5', minHeight: 180 }}>
          {/* Large Ganesh watermark */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 200 180" fill="#8B0000">
            <ellipse cx="100" cy="70" rx="30" ry="35"/>
            <circle cx="100" cy="50" r="22"/>
            <path d="M70 65 Q55 80 60 100 Q65 115 80 118 Q95 122 100 115 Q105 122 120 118 Q135 115 140 100 Q145 80 130 65"/>
            <path d="M78 50 Q70 35 55 38 Q45 42 48 55 Q52 65 65 62"/>
            <path d="M122 50 Q130 35 145 38 Q155 42 152 55 Q148 65 135 62"/>
            <circle cx="85" cy="52" r="4"/>
            <circle cx="115" cy="52" r="4"/>
            <path d="M90 62 Q100 68 110 62"/>
            <ellipse cx="100" cy="130" rx="40" ry="28"/>
            <path d="M60 120 Q50 140 55 155 Q60 165 75 168 H125 Q140 165 145 155 Q150 140 140 120"/>
          </svg>
          {/* Diamond spark */}
          <div className="relative flex flex-col items-center pt-10 pb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#D97706">
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"/>
            </svg>
            <div className="flex items-center gap-3 mt-3 mb-1">
              <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #D97706)' }} />
              <p className="text-[20px] font-bold text-[#8B0000] devanagari text-center leading-tight">
                {lang === 'mr' ? <>एकत्र<br/>सहकार्याने<br/>समाजासाठी</> : <>Together<br/>In Cooperation<br/>For Society</>}
              </p>
              <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #D97706)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: MANDAL PROFILE ───────────────────────────────────────────────────

function MandalProfileScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const t = TR[lang]
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={t.mandalProfile} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <div className="flex flex-col items-center py-5 mb-4">
          <MandalLogo size={72} />
          <h2 className="text-[18px] font-bold text-[#1C1917] mt-3 text-center">
            {lang === 'mr' ? 'श्रीमंत सहकार मित्र मंडळ' : 'Shrimant Sahakar Mitra Mandal'}
          </h2>
          <p className="text-[12px] text-[#78716C] mt-0.5">
            {lang === 'mr' ? 'कसबा पेठ, पुणे • स्थापना १९८५' : 'Kasba Peth, Pune • Est. 1985'}
          </p>
        </div>
        <Card className="p-4 mb-4">
          {[
            [lang === 'mr' ? 'नोंदणी क्रमांक' : 'Reg. Number', 'MAH-PNE-2023-04521'],
            [lang === 'mr' ? 'UPI आयडी' : 'UPI ID', 'sahakar@sbi'],
            [lang === 'mr' ? 'संपर्क' : 'Contact', lang === 'mr' ? '+९१ २० २३४५ ६७८९' : '+91 20 2345 6789'],
            [lang === 'mr' ? 'ईमेल' : 'Email', 'info@sahakarmandal.org'],
            [lang === 'mr' ? 'बँक' : 'Bank', lang === 'mr' ? 'स्टेट बँक ऑफ इंडिया, कसबा शाखा' : 'State Bank of India, Kasba Branch'],
            ['IFSC', 'SBIN0004521'],
            [lang === 'mr' ? 'स्थापना वर्ष' : 'Established', lang === 'mr' ? '१९८५' : '1985'],
            [lang === 'mr' ? 'सदस्य' : 'Members', lang === 'mr' ? '७ सक्रिय' : '7 Active'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
              <span className="text-[13px] text-[#78716C]">{k}</span>
              <span className="text-[13px] font-semibold text-[#1C1917] text-right ml-4">{v}</span>
            </div>
          ))}
        </Card>
        <Btn className="w-full" icon={<Edit3 className="w-4 h-4" />}>{lang === 'mr' ? 'प्रोफाइल संपादित करा' : 'Edit Profile'}</Btn>
      </div>
    </div>
  )
}

// ─── SCREEN: ROLES & PERMISSIONS ─────────────────────────────────────────────

function RolesPermissionsScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const t = TR[lang]
  const modules = ['Dashboard', 'Collections', 'Donations', 'Expenses', 'Transactions', 'Members', 'Reports', 'Audit', 'Settings']
  const moduleNamesMr: Record<string, string> = {
    'Dashboard': 'डॅशबोर्ड',
    'Collections': 'वर्गणी',
    'Donations': 'देणगी',
    'Expenses': 'खर्च',
    'Transactions': 'व्यवहार',
    'Members': 'सदस्य',
    'Reports': 'अहवाल',
    'Audit': 'ऑडिट',
    'Settings': 'सेटिंग्ज',
  }
  const roles = ['SA', 'A', 'T', 'S', 'V', 'VO']
  const roleLabels = lang === 'mr'
    ? ['सुपर ॲडमिन', 'ॲडमिन', 'खजिनदार', 'सचिव', 'स्वयंसेवक', 'केवळ वाचक']
    : ['Super Admin', 'Admin', 'Treasurer', 'Secretary', 'Volunteer', 'View Only']
  const matrix: Record<string, string[]> = {
    'Dashboard': ['✓', '✓', '✓', '✓', '✓', '✓'],
    'Collections': ['✓', '✓', '✓', '✓', '✓', '—'],
    'Donations': ['✓', '✓', '✓', '—', '—', '—'],
    'Expenses': ['✓', '✓', '✓', '—', '—', '—'],
    'Transactions': ['✓', '✓', '✓', '✓', '—', '—'],
    'Members': ['✓', '✓', '—', '✓', '—', '—'],
    'Reports': ['✓', '✓', '✓', '—', '—', '—'],
    'Audit': ['✓', '—', '—', '—', '—', '—'],
    'Settings': ['✓', '—', '—', '—', '—', '—'],
  }
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={t.rolesPermissions} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {roleLabels.map((r, i) => (
            <span key={r} className={`text-[10px] font-semibold px-2 py-1 rounded-full ${i === 0 ? 'bg-[#8B0000] text-white' : i === 2 ? 'bg-[#D97706]/20 text-[#D97706]' : 'bg-stone-100 text-[#78716C]'}`}>
              {roles[i]}: {r}
            </span>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Header row */}
          <div className="flex bg-[#8B0000]/5 px-3 py-2 border-b border-stone-100">
            <div className="w-24 text-[10px] font-bold text-[#78716C] uppercase">{lang === 'mr' ? 'विभाग' : 'Module'}</div>
            {roles.map(r => (
              <div key={r} className="flex-1 text-center text-[10px] font-bold text-[#8B0000]">{r}</div>
            ))}
          </div>
          {modules.map(mod => (
            <div key={mod} className="flex items-center px-3 py-2.5 border-b border-stone-100 last:border-0">
              <div className="w-24 text-[12px] font-medium text-[#1C1917]">
                {lang === 'mr' ? (moduleNamesMr[mod] || mod) : mod}
              </div>
              {(matrix[mod] || []).map((perm, i) => (
                <div key={i} className="flex-1 flex justify-center">
                  {perm === '✓'
                    ? <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-600" /></div>
                    : <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center"><span className="text-[10px] text-stone-400">—</span></div>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: SECURITY ────────────────────────────────────────────────────────

function SecurityScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const t = TR[lang]
  const [biometric, setBiometric] = useState(true)
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={t.security} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <Card className="overflow-hidden mb-4">
          {[
            { label: t.biometric, value: <button onClick={() => setBiometric(b => !b)} className={`w-10 h-6 rounded-full transition-colors ${biometric ? 'bg-[#8B0000]' : 'bg-stone-200'} relative`}><div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${biometric ? 'translate-x-4' : 'translate-x-0.5'}`} /></button>, icon: Lock },
            { label: t.sessions, value: <span className="text-[13px] font-semibold text-[#1C1917]">{lang === 'mr' ? '२' : '2'}</span>, icon: Activity },
            { label: t.loginActivity, value: <ChevronRight className="w-4 h-4 text-stone-300" />, icon: BookOpen },
            { label: t.trustedDevices, value: <ChevronRight className="w-4 h-4 text-stone-300" />, icon: Shield },
            { label: t.dataPrivacy, value: <ChevronRight className="w-4 h-4 text-stone-300" />, icon: Eye },
          ].map(({ label, value, icon: Icon }, i, arr) => (
            <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-stone-100' : ''}`}>
              <div className="w-9 h-9 rounded-xl bg-[#8B0000]/8 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#8B0000]" />
              </div>
              <span className="flex-1 text-[14px] font-medium text-[#1C1917]">{label}</span>
              {value}
            </div>
          ))}
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[14px] font-semibold text-[#1C1917]">{t.backup}</p>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#78716C]">{t.lastBackup}</span>
            <span className="font-semibold text-emerald-600">{lang === 'mr' ? 'आज सकाळी ६:००' : 'Today 6:00 AM'}</span>
          </div>
          <Btn className="w-full mt-3 min-h-[40px] text-[13px]">{t.backupNow}</Btn>
        </Card>
      </div>
    </div>
  )
}

// ─── SCREEN: JOIN MANDAL ─────────────────────────────────────────────────────

function JoinMandalScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const t = TR[lang]
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={t.joinMandal} onBack={pop} lang={lang} />
      <div className="flex-1 flex flex-col items-center px-6 py-8">
        <MandalLogo size={64} />
        <h2 className="text-[22px] font-bold text-[#1C1917] mt-4 text-center">{t.joinMandal}</h2>
        <p className="text-[#78716C] text-[14px] text-center mt-2 mb-8">{lang === 'mr' ? 'मंडळात सामील होण्यासाठी कोड शेअर करा' : 'Share this code to invite new members'}</p>
        <div className="w-full bg-[#8B0000]/5 border-2 border-dashed border-[#8B0000]/30 rounded-2xl p-6 flex flex-col items-center gap-3 mb-6">
          <p className="text-[12px] text-[#78716C] uppercase tracking-wide">{t.joinCode}</p>
          <p className="text-[42px] font-bold text-[#8B0000] tracking-[0.15em]">{lang === 'mr' ? '४८२ ७६१' : '482 761'}</p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-card text-[13px] font-semibold text-[#8B0000]">
              <Copy className="w-4 h-4" /> {lang === 'mr' ? 'कॉपी' : 'Copy'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl shadow-card text-[13px] font-semibold text-green-700">
              <Share2 className="w-4 h-4" /> {lang === 'mr' ? 'शेअर' : 'Share'}
            </button>
          </div>
        </div>
        <p className="text-[13px] text-[#78716C] text-center">{lang === 'mr' ? 'किंवा मोबाइल नंबरने थेट आमंत्रण द्या' : 'Or invite directly via mobile number'}</p>
        <div className="w-full flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 h-12 mt-3">
          <Phone className="w-4 h-4 text-stone-400" />
          <input placeholder={lang === 'mr' ? '+९१ मोबाइल नंबर' : '+91 Mobile Number'} className="flex-1 text-[14px] outline-none text-[#1C1917] bg-transparent" type="tel" />
          <button className="text-[13px] font-semibold text-[#8B0000]">{lang === 'mr' ? 'पाठवा' : 'Send'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: ROLE SELECTION ───────────────────────────────────────────────────

function RoleSelectionScreen({ lang, onNext, store }: { lang: Lang; onNext: () => void; store?: AppStore }) {
  const roles = [
    { key: 'Super Admin', nameMr: 'सुपर ॲडमिन', icon: Shield, color: '#8B0000', desc: 'Full access and control', descMr: 'संपूर्ण प्रवेश व नियंत्रण' },
    { key: 'Admin', nameMr: 'ॲडमिन', icon: Settings, color: '#8B0000', desc: 'Manage members, events, finances', descMr: 'सदस्य, उत्सव, आर्थिक व्यवस्थापन' },
    { key: 'Treasurer', nameMr: 'खजिनदार', icon: IndianRupee, color: '#D97706', desc: 'Collections, payments, reports', descMr: 'वर्गणी, पेमेंट, अहवाल' },
    { key: 'Secretary', nameMr: 'सचिव', icon: FileText, color: '#1D4ED8', desc: 'Members, events, documents', descMr: 'सदस्य, उत्सव, कागदपत्रे' },
    { key: 'Volunteer', nameMr: 'स्वयंसेवक', icon: Users, color: '#065F46', desc: 'Collections only', descMr: 'फक्त वर्गणी' },
    { key: 'View Only', nameMr: 'केवळ वाचक', icon: Eye, color: '#6B7280', desc: 'Read-only access', descMr: 'फक्त पाहणे' },
  ]
  const [selected, setSelected] = useState('Treasurer')
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-[#8B0000] px-5 pb-6" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 20px)' }}>
        <MandalLogo size={44} white />
        <h1 className="text-white text-[22px] font-bold mt-4">{lang === 'mr' ? 'आपली भूमिका' : 'Your Role'}</h1>
        <p className="text-white/70 text-[14px] mt-1">{lang === 'mr' ? 'मंडळाने आपल्याला खालील भूमिका दिली आहे' : 'Your assigned role in the Mandal'}</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-5">
        <div className="flex flex-col gap-3">
          {roles.map(({ key, nameMr, icon: Icon, color, desc, descMr }) => (
            <button key={key} onClick={() => setSelected(key)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${selected === key ? 'border-[#8B0000] bg-white shadow-brand' : 'border-stone-100 bg-white'}`}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '15' }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-bold text-[15px] ${selected === key ? 'text-[#8B0000]' : 'text-[#1C1917]'}`}>
                    {lang === 'mr' ? nameMr : key}
                  </p>
                  {key === 'Treasurer' && <span className="text-[10px] bg-[#D97706]/15 text-[#D97706] font-semibold px-2 py-0.5 rounded-full">{lang === 'mr' ? 'आपली भूमिका' : 'Your Role'}</span>}
                </div>
                <p className="text-[12px] text-[#78716C] mt-0.5">{lang === 'mr' ? descMr : desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === key ? 'border-[#8B0000]' : 'border-stone-300'}`}>
                {selected === key && <div className="w-2.5 h-2.5 rounded-full bg-[#8B0000]" />}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-5">
          <Btn onClick={() => {
            const roleObj = roles.find(r => r.key === selected)
            if (roleObj) store?.updateCurrentUser({ role: selected, roleMr: roleObj.nameMr })
            onNext()
          }} className="w-full">{lang === 'mr' ? 'डॅशबोर्डवर जा' : 'Enter Dashboard'}</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: CORRECTION REQUEST ───────────────────────────────────────────────

function CorrectionFormScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const t = TR[lang]
  const [reason, setReason] = useState('')
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={t.correctionRequest} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-5">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-amber-800">{lang === 'mr' ? 'महत्त्वाची सूचना' : 'Important Notice'}</p>
            <p className="text-[12px] text-amber-700 mt-1">{lang === 'mr' ? 'आर्थिक नोंदी बदलण्यासाठी खजिनदार मंजुरी आवश्यक आहे.' : 'Financial corrections require Treasurer approval and will be audit-logged.'}</p>
          </div>
        </div>
        <Card className="p-4 mb-5">
          <p className="text-[12px] font-semibold text-[#78716C] mb-3 uppercase tracking-wide">{lang === 'mr' ? 'मूळ नोंद' : 'Original Record'}</p>
          {[[lang === 'mr' ? 'व्यवहार' : 'Transaction', 'EXP-2026-0122'], [lang === 'mr' ? 'विक्रेता' : 'Vendor', lang === 'mr' ? 'श्री डेकोर वर्क्स' : 'Shri Decor Works'], [lang === 'mr' ? 'रक्कम' : 'Amount', '₹18,500'], [lang === 'mr' ? 'तारीख' : 'Date', lang === 'mr' ? '२४ ऑगस्ट २०२६' : '24 Aug 2026']].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-stone-100 last:border-0">
              <span className="text-[13px] text-[#78716C]">{k}</span>
              <span className="text-[13px] font-semibold text-[#1C1917]">{v}</span>
            </div>
          ))}
        </Card>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{lang === 'mr' ? 'दुरुस्त रक्कम' : 'Corrected Amount'}</label>
            <div className="flex items-center gap-3 bg-white border-2 border-[#8B0000] rounded-xl px-4 h-14">
              <IndianRupee className="w-5 h-5 text-[#8B0000]" />
              <input defaultValue="19200" className="flex-1 text-[22px] font-bold text-[#1C1917] outline-none bg-transparent" type="number" />
            </div>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">
              {lang === 'mr' ? 'सुधारणेचे कारण' : 'Reason for Correction'} <span className="text-red-500">*</span>
            </label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              className="w-full bg-white border border-stone-200 focus:border-[#8B0000] rounded-xl px-4 py-3 text-[14px] outline-none text-[#1C1917] placeholder:text-stone-400 resize-none h-24 transition-colors"
              placeholder={lang === 'mr' ? 'सुधारणेचे कारण लिहा...' : 'Describe the reason for correction...'} />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{lang === 'mr' ? 'पुरावा दस्तऐवज' : 'Supporting Document'} ({lang === 'mr' ? 'वैकल्पिक' : 'Optional'})</label>
            <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 flex flex-col items-center gap-2 bg-white">
              <Upload className="w-6 h-6 text-stone-400" />
              <p className="text-[13px] text-[#78716C]">{lang === 'mr' ? 'दस्तऐवज अपलोड करा' : 'Upload document'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-white border-t border-stone-100 flex gap-3">
        <Btn variant="secondary" onClick={pop} className="flex-1">{t.cancel}</Btn>
        <Btn onClick={() => push('audit-history')} className="flex-1" icon={<Send className="w-4 h-4" />}>
          {lang === 'mr' ? 'विनंती सादर करा' : 'Submit Request'}
        </Btn>
      </div>
    </div>
  )
}

// ─── SCREEN: WHATSAPP REMINDER ────────────────────────────────────────────────

function WhatsAppReminderScreen({ lang, pop, store }: { lang: Lang; pop: () => void; store?: AppStore }) {
  const person = store?.state.pendingCollections?.[0]
  const [msg, setMsg] = useState(
    lang === 'mr'
      ? `नमस्कार ${person?.name || 'सदस्य'} जी 🙏\n\nश्रीमंत सहकार मित्र मंडळ\n\nगणेशोत्सव २०२६ साठी आपली वर्गणी ₹${person?.outstanding?.toLocaleString('en-IN') || 0} बाकी आहे.\n\nकृपया लवकरात लवकर भरावी.\n\nधन्यवाद!\nगणपती बाप्पा मोरया 🙏`
      : `Dear ${person?.name || 'Member'} Ji,\n\nShrimant Sahakar Mitra Mandal\n\nYour Ganeshotsav 2026 contribution of ₹${person?.outstanding?.toLocaleString('en-IN') || 0} is pending.\n\nPlease make the payment at your earliest convenience.\n\nThank you!`
  )
  if (!person) return null;
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={lang === 'mr' ? 'व्हॉट्सॲप स्मरणपत्र' : 'WhatsApp Reminder'} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-5">
        <Card className="p-4 mb-4 flex items-center gap-3">
          <Avatar initials={person.name.split(' ').map(n => n[0]).join('')} />
          <div>
            <p className="font-bold text-[15px] text-[#1C1917]">{person.name}</p>
            <p className="text-[12px] text-[#78716C]">{person.mobile}</p>
            <p className="text-[13px] font-bold text-[#8B0000]">{lang === 'mr' ? 'बाकी' : 'Outstanding'}: ₹{person.outstanding.toLocaleString('en-IN')}</p>
          </div>
        </Card>
        <div>
          <label className="text-[13px] font-semibold text-[#1C1917] mb-2 block">{lang === 'mr' ? 'संदेश' : 'Message'}</label>
          <textarea value={msg} onChange={e => setMsg(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-[13px] outline-none text-[#1C1917] resize-none h-52 focus:border-[#8B0000] transition-colors" />
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setMsg(
            lang === 'mr'
              ? `नमस्कार ${person.name} जी 🙏\n\nश्रीमंत सहकार मित्र मंडळ\n\nगणेशोत्सव २०२६ साठी आपली वर्गणी ₹${person.outstanding.toLocaleString('en-IN')} बाकी आहे.\n\nकृपया लवकरात लवकर भरावी.\n\nधन्यवाद!\nगणपती बाप्पा मोरया 🙏`
              : `Dear ${person.name} Ji,\n\nShrimant Sahakar Mitra Mandal\n\nYour Ganeshotsav 2026 contribution of ₹${person.outstanding.toLocaleString('en-IN')} is pending.\n\nPlease make the payment at your earliest convenience.\n\nThank you!`
          )} className="flex-1 h-9 bg-stone-100 rounded-lg text-[12px] font-semibold text-[#78716C]">
            {lang === 'mr' ? 'मराठी' : 'Marathi'}
          </button>
          <button onClick={() => setMsg(
            `Dear ${person.name} Ji,\n\nShrimant Sahakar Mitra Mandal\n\nYour Ganeshotsav 2026 contribution of ₹${person.outstanding.toLocaleString('en-IN')} is pending.\n\nPlease make the payment at your earliest convenience.\n\nThank you!`
          )} className="flex-1 h-9 bg-stone-100 rounded-lg text-[12px] font-semibold text-[#78716C]">
            {lang === 'mr' ? 'इंग्रजी' : 'English'}
          </button>
          <button onClick={() => setMsg('')} className="flex-1 h-9 bg-stone-100 rounded-lg text-[12px] font-semibold text-[#78716C]">
            {lang === 'mr' ? 'रीसेट' : 'Reset'}
          </button>
        </div>
      </div>
      <div className="px-4 py-3 bg-white border-t border-stone-100 flex gap-3">
        <button className="flex-1 h-12 border border-stone-200 rounded-xl text-[14px] font-semibold text-[#78716C] flex items-center justify-center gap-2">
          <Copy className="w-4 h-4" /> {lang === 'mr' ? 'कॉपी' : 'Copy'}
        </button>
        <button className="flex-1 h-12 bg-[#25D366] rounded-xl text-[14px] font-semibold text-white flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4" /> {lang === 'mr' ? 'व्हॉट्सॲपवर पाठवा' : 'Send WhatsApp'}
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN: PAYMENT SETTINGS ─────────────────────────────────────────────────

function PaymentSettingsScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const [upiId, setUpiId] = useState('sahakar@sbi')
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={lang === 'mr' ? 'पेमेंट सेटिंग्ज' : 'Payment Settings'} onBack={pop} lang={lang} />
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-5">
        <div className="flex flex-col gap-5">
          <Card className="p-4">
            <h3 className="font-bold text-[15px] text-[#1C1917] mb-4">{lang === 'mr' ? 'UPI तपशील' : 'UPI Details'}</h3>
            <div>
              <label className="text-[13px] font-semibold text-[#78716C] mb-2 block">UPI ID</label>
              <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl px-4 h-12 focus-within:border-[#8B0000]">
                <QrCode className="w-4 h-4 text-stone-400" />
                <input value={upiId} onChange={e => setUpiId(e.target.value)}
                  className="flex-1 text-[14px] outline-none text-[#1C1917] bg-transparent" />
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center gap-3 bg-stone-50 rounded-xl p-4">
              <p className="text-[12px] text-[#78716C]">{lang === 'mr' ? 'QR कोड पूर्वावलोकन' : 'QR Code Preview'}</p>
              <div className="w-28 h-28 bg-[#1C1917] rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-6 grid-rows-6 gap-0.5 p-2">
                  {Array.from({ length: 36 }, (_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-[#8B0000]/8 rounded-lg text-[12px] font-semibold text-[#8B0000] flex items-center gap-1">
                  <Download className="w-3 h-3" /> {lang === 'mr' ? 'डाउनलोड' : 'Download'}
                </button>
                <button className="px-3 py-1.5 bg-stone-100 rounded-lg text-[12px] font-semibold text-[#78716C] flex items-center gap-1">
                  <Share2 className="w-3 h-3" /> {lang === 'mr' ? 'शेअर' : 'Share'}
                </button>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-[15px] text-[#1C1917] mb-4">{lang === 'mr' ? 'बँक तपशील' : 'Bank Details'}</h3>
            {[
              { label: lang === 'mr' ? 'बँक नाव' : 'Bank Name', value: lang === 'mr' ? 'स्टेट बँक ऑफ इंडिया' : 'State Bank of India' },
              { label: lang === 'mr' ? 'खाते क्र.' : 'Account No.', value: '•••• •••• 4521' },
              { label: 'IFSC', value: 'SBIN0004521' },
              { label: lang === 'mr' ? 'शाखा' : 'Branch', value: lang === 'mr' ? 'कसबा पेठ, पुणे' : 'Kasba Peth, Pune' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
                <span className="text-[13px] text-[#78716C]">{label}</span>
                <span className="text-[13px] font-semibold text-[#1C1917]">{value}</span>
              </div>
            ))}
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-[14px] text-[#1C1917] mb-3">{lang === 'mr' ? 'पेमेंट पद्धती' : 'Accepted Methods'}</h3>
            {(lang === 'mr'
              ? ['रोख', 'UPI', 'NEFT / RTGS', 'धनादेश', 'बँक हस्तांतरण']
              : ['Cash', 'UPI', 'NEFT / RTGS', 'Cheque', 'Bank Transfer']
            ).map(m => (
              <div key={m} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
                <span className="text-[13px] text-[#1C1917]">{m}</span>
                <div className="w-10 h-5 bg-[#8B0000] rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            ))}
          </Card>
        </div>
        <Btn className="w-full mt-4" icon={<Check className="w-4 h-4" />}>
          {lang === 'mr' ? 'सेटिंग्ज जतन करा' : 'Save Settings'}
        </Btn>
      </div>
    </div>
  )
}

// ─── SCREEN: ABOUT / HELP ─────────────────────────────────────────────────────

function AboutScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const contactItems = [
    { icon: Phone,         value: lang === 'mr' ? '+९१ २० २३४५ ६७८९' : '+91 20 2345 6789',         iconBg: '#FEE2E2', iconColor: '#8B0000' },
    { icon: Mail,          value: 'support@mandaldigital.in', iconBg: '#FEE2E2', iconColor: '#8B0000' },
    { icon: WhatsAppIcon, value: lang === 'mr' ? 'व्हॉट्सॲप: +९१ ९८७६५ ४३२१०' : 'WhatsApp: +91 98765 43210', iconBg: '#DCFCE7', iconColor: '#16A34A' },
  ]

  const faqItems = lang === 'mr' ? [
    { icon: User2,       iconBg: '#FEE2E2', iconColor: '#8B0000', q: 'नवीन नोंदणी कशी जोडावी?' },
    { icon: User2,       iconBg: '#FEF3C7', iconColor: '#B45309', q: 'माझी नोंदणी तयार कशी करावी?' },
    { icon: FileText,    iconBg: '#EDE9FE', iconColor: '#5B21B6', q: 'नोंदणी सदस्य कसा जोडावा?' },
    { icon: Headphones,  iconBg: '#D1FAE5', iconColor: '#065F46', q: 'UPI पेमेंट कसे घ्यावे?' },
  ] : [
    { icon: User2,       iconBg: '#FEE2E2', iconColor: '#8B0000', q: 'How to add a new collection?' },
    { icon: User2,       iconBg: '#FEF3C7', iconColor: '#B45309', q: 'How to generate a receipt?' },
    { icon: FileText,    iconBg: '#EDE9FE', iconColor: '#5B21B6', q: 'How to add a new member?' },
    { icon: Headphones,  iconBg: '#D1FAE5', iconColor: '#065F46', q: 'How to accept UPI payments?' },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)' }}>
        <svg className="absolute right-3 top-2 opacity-15" width="110" height="72" viewBox="0 0 110 72" fill="none">
          <circle cx="75" cy="30" r="28" stroke="white" strokeWidth="0.8" fill="none"/>
          <circle cx="75" cy="30" r="20" stroke="white" strokeWidth="0.6" fill="none"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
            <line key={a} x1="75" y1="30" x2={75+28*Math.cos(a*Math.PI/180)} y2={30+28*Math.sin(a*Math.PI/180)} stroke="white" strokeWidth="0.4"/>
          ))}
          <path d="M40 5L46 18H52V28H58V38H64V72H16V38H22V28H28V18H34L40 5Z" fill="white"/>
        </svg>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)' }} />
        <div className="px-4 pt-10 pb-4 flex items-center gap-3 relative">
          <button onClick={pop} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-[22px] devanagari flex-1">{lang === 'mr' ? 'मंडळ व माहिती' : 'Mandal & App Info'}</h1>
          <div className="text-right">
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">{lang === 'mr' ? '"सेवा' : '"Service'}</p>
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">{lang === 'mr' ? 'समर्पण' : 'Dedication'}</p>
            <p className="text-[#F59E0B] text-[11px] font-semibold devanagari leading-tight">{lang === 'mr' ? 'संस्कार"' : 'Culture"'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5]">
        {/* App identity block */}
        <div className="flex flex-col items-center pt-8 pb-6 px-4 bg-white mb-3">
          <MandalLogo size={96} />
          <h2 className="text-[22px] font-bold text-[#1C1917] mt-4">{lang === 'mr' ? 'मंडळ डिजिटल' : 'Mandal Digital'}</h2>
          <span className="mt-3 text-[12px] font-semibold px-4 py-1.5 rounded-full devanagari"
            style={{ background: '#FEE2E2', color: '#8B0000' }}>
            v2.0.0 – 2026
          </span>
        </div>

        <div className="px-4 flex flex-col gap-3 pb-8">
          {/* Contact section */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            {/* Section header */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                <Phone style={{ width: 18, height: 18, color: '#8B0000' }} />
              </div>
              <p className="font-bold text-[17px] text-[#1C1917] devanagari">{lang === 'mr' ? 'संपर्क करा' : 'Contact Us'}</p>
            </div>
            <div className="border-t border-stone-100">
              {contactItems.map(({ icon: Icon, value, iconBg, iconColor }) => (
                <button key={value}
                  className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-stone-100 last:border-0 text-left">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: iconBg }}>
                    <Icon style={{ width: 16, height: 16, color: iconColor }} />
                  </div>
                  <span className="flex-1 text-[14px] text-[#1C1917]">{value}</span>
                  <ChevronRight style={{ width: 15, height: 15, color: '#D1C4C4' }} />
                </button>
              ))}
            </div>
          </div>

          {/* FAQ section */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            {/* Section header */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                <Info style={{ width: 18, height: 18, color: '#8B0000' }} />
              </div>
              <p className="font-bold text-[17px] text-[#1C1917] devanagari">{lang === 'mr' ? 'वारंवार विचारले जाणारे प्रश्न' : 'Frequently Asked Questions'}</p>
            </div>
            <div className="border-t border-stone-100">
              {faqItems.map(({ icon: Icon, iconBg, iconColor, q }) => (
                <button key={q}
                  className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-stone-100 last:border-0 text-left">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: iconBg }}>
                    <Icon style={{ width: 16, height: 16, color: iconColor }} />
                  </div>
                  <span className="flex-1 text-[14px] text-[#1C1917] devanagari leading-snug">{q}</span>
                  <ChevronRight style={{ width: 15, height: 15, color: '#D1C4C4' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Ganpati footer */}
          <div className="relative flex flex-col items-center pt-6 pb-4">
            {/* Faint Ganesh watermark */}
            <svg className="absolute inset-0 w-full opacity-[0.05]" viewBox="0 0 200 120" fill="#8B0000">
              <ellipse cx="100" cy="55" rx="28" ry="32"/>
              <circle cx="100" cy="38" r="20"/>
              <path d="M75 52 Q62 66 67 84 Q72 98 86 101 Q100 105 100 98 Q100 105 114 101 Q128 98 133 84 Q138 66 125 52"/>
              <path d="M82 38 Q74 25 60 28 Q50 32 53 44 Q57 54 70 51"/>
              <path d="M118 38 Q126 25 140 28 Q150 32 147 44 Q143 54 130 51"/>
            </svg>
            {/* Praying hands icon */}
            <div className="text-[24px] mb-2">🙏</div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-px w-10" style={{ background: 'linear-gradient(to right, transparent, #D97706)' }} />
              <p className="text-[15px] font-bold text-[#8B0000] devanagari">{lang === 'mr' ? 'गणपती बाप्पा मोरया' : 'Serving Together with Devotion'}</p>
              <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, #D97706)' }} />
            </div>
            <p className="text-[12px] text-[#78716C] devanagari">{lang === 'mr' ? '© २०२६ मंडळ डिजिटल' : '© 2026 Mandal Digital'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: OFFLINE STATE ────────────────────────────────────────────────────

function OfflineScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  const [syncing, setSyncing] = useState(false)
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title={lang === 'mr' ? 'ऑफलाइन मोड' : 'Offline Mode'} onBack={pop} lang={lang} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#FFFBF5]">
        <div className="w-24 h-24 rounded-full bg-stone-100 border-4 border-stone-200 flex items-center justify-center mb-5">
          <WifiOff className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-[20px] font-bold text-[#1C1917] mb-2">{lang === 'mr' ? 'इंटरनेट नाही' : 'No Internet Connection'}</h2>
        <p className="text-[#78716C] text-[14px] text-center mb-6">
          {lang === 'mr' ? 'आपण ऑफलाइन आहात. काही क्रिया स्थानिक स्तरावर जतन केल्या जातील.' : 'You\'re offline. Some actions will be saved locally and synced when connected.'}
        </p>
        {/* Offline-available actions */}
        <Card className="p-4 w-full mb-6">
          <p className="text-[13px] font-semibold text-[#78716C] mb-3">{lang === 'mr' ? 'ऑफलाइन उपलब्ध' : 'Available Offline'}</p>
          {[
            [lang === 'mr' ? 'नवीन वर्गणी' : 'New Collection', 'bg-emerald-50 text-emerald-600'],
            [lang === 'mr' ? 'नवीन खर्च' : 'New Expense', 'bg-blue-50 text-blue-600'],
            [lang === 'mr' ? 'अलीकडील नोंदी पहा' : 'View Recent Records', 'bg-amber-50 text-amber-600'],
            [lang === 'mr' ? 'देणगीदार जोडा' : 'Add Donor', 'bg-purple-50 text-purple-600'],
          ].map(([l, cls]) => (
            <div key={l} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
              <Check className={`w-4 h-4 ${cls.split(' ')[1]}`} />
              <span className="text-[13px] text-[#1C1917]">{l}</span>
            </div>
          ))}
        </Card>
        {/* Pending sync */}
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-amber-800">{lang === 'mr' ? '३ ऑफलाइन व्यवहार प्रलंबित' : '3 offline transactions pending'}</p>
            <p className="text-[11px] text-amber-600">{lang === 'mr' ? 'कनेक्शन परत आल्यावर समक्रमित होतील' : 'Will sync when connection is restored'}</p>
          </div>
        </div>
        <button onClick={() => setSyncing(true)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${syncing ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-600'}`}>
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? (lang === 'mr' ? 'समक्रमण...' : 'Syncing...') : (lang === 'mr' ? 'पुन्हा प्रयत्न' : 'Retry')}
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN: PUBLIC DONOR PORTAL ─────────────────────────────────────────────

function PublicPortalLandingScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5]">
      {/* Decorative top */}
      <div className="bg-[#8B0000] px-5 pb-8 flex flex-col items-center relative overflow-hidden" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 20px)' }}>
        {lang === 'mr' && (
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <div className="text-white text-[180px] font-bold leading-none select-none">ॐ</div>
          </div>
        )}
        <button onClick={pop} className="self-start w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-4">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <MandalLogo size={80} white />
        <div className="mt-4 text-center z-10">
          <p className="text-[#D97706] text-[12px] font-semibold tracking-widest mb-1">{lang === 'mr' ? '॥ श्री गणेश ॥' : '|| Shree Ganesh ||'}</p>
          <h1 className="text-white text-[22px] font-bold leading-tight">{lang === 'mr' ? 'श्रीमंत सहकार' : 'Shrimant Sahakar'}</h1>
          <h1 className="text-white text-[22px] font-bold leading-tight">{lang === 'mr' ? 'मित्र मंडळ' : 'Mitra Mandal'}</h1>
          <p className="text-white/70 text-[13px] mt-2">{lang === 'mr' ? 'कसबा पेठ, पुणे • स्थापना १९८५' : 'Kasba Peth, Pune • Est. 1985'}</p>
        </div>
      </div>
      {/* Gold divider */}
      <div className="h-1 bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#D97706]" />
      <div className="flex-1 px-5 py-6">
        <div className="text-center mb-6">
          <h2 className="text-[20px] font-bold text-[#1C1917]">{lang === 'mr' ? 'देणगी द्या' : 'Make a Donation'}</h2>
          <p className="text-[#78716C] text-[14px] mt-1">{lang === 'mr' ? 'आपले मंडळाला पाठिंबा द्या' : 'Support your Mandal securely'}</p>
        </div>
        {/* Active festival highlight */}
        <Card className="p-4 mb-5 border-2 border-[#D97706]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <p className="font-bold text-[15px] text-[#1C1917]">{lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'}</p>
              <p className="text-[12px] text-[#78716C]">{lang === 'mr' ? '२७ ऑगस्ट – ५ सप्टें २०२६ • सुरू' : '27 Aug – 5 Sep 2026 • Active'}</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </Card>
        <Btn onClick={() => push('public-donation')} className="w-full mb-3" icon={<IndianRupee className="w-4 h-4" />}>
          {lang === 'mr' ? 'देणगी द्या' : 'Donate Now'}
        </Btn>
        <button onClick={() => push('public-donation')} className="w-full h-12 border border-[#8B0000]/20 rounded-xl text-[14px] font-semibold text-[#8B0000] flex items-center justify-center gap-2">
          <QrCode className="w-4 h-4" /> {lang === 'mr' ? 'UPI QR ने द्या' : 'Pay via UPI / QR'}
        </button>
        <p className="text-center text-[11px] text-stone-400 mt-5">
          🔒 {lang === 'mr' ? 'सुरक्षित व अधिकृत मंडळ पेमेंट' : 'Secure & Official Mandal Collection'}
        </p>
        {/* Testimonial / trust */}
        <div className="mt-5 bg-[#8B0000]/5 rounded-xl p-3 text-center">
          <p className="text-[#D97706] font-semibold text-[14px] devanagari">{lang === 'mr' ? 'गणपती बाप्पा मोरया! 🙏' : 'Blessings of Lord Ganesha! 🙏'}</p>
          <p className="text-[12px] text-[#78716C] mt-1">{lang === 'mr' ? 'आपल्या देणगीबद्दल धन्यवाद' : 'Thank you for your contribution'}</p>
        </div>
      </div>
    </div>
  )
}

function PublicDonationScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  const [amount, setAmount] = useState<number | null>(null)
  const presets = [501, 1001, 2001, 5001]
  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5]">
      <div className="bg-[#8B0000] px-5 pt-10 pb-6 flex items-center gap-3">
        <button onClick={pop} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-white text-[18px] font-bold">{lang === 'mr' ? 'देणगी रक्कम' : 'Donation Amount'}</h1>
          <p className="text-white/70 text-[12px]">{lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'}</p>
        </div>
      </div>
      <div className="flex-1 px-5 py-6">
        <p className="text-[13px] font-semibold text-[#78716C] mb-3">{lang === 'mr' ? 'रक्कम निवडा' : 'Select Amount'}</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {presets.map(p => (
            <button key={p} onClick={() => setAmount(p)}
              className={`h-16 rounded-2xl text-[20px] font-bold transition-all ${amount === p ? 'bg-[#8B0000] text-white shadow-brand' : 'bg-white border-2 border-stone-200 text-[#1C1917]'}`}>
              ₹{p.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div>
          <div className="relative flex justify-center"><span className="bg-[#FFFBF5] px-3 text-[13px] text-stone-400">{lang === 'mr' ? 'किंवा आपली रक्कम' : 'or custom amount'}</span></div>
        </div>
        <div className="flex items-center gap-3 bg-white border-2 border-stone-200 focus-within:border-[#8B0000] rounded-2xl px-4 h-16 mb-5 transition-colors">
          <IndianRupee className="w-6 h-6 text-stone-400" />
          <input onChange={e => setAmount(parseInt(e.target.value) || null)}
            className="flex-1 text-[24px] font-bold text-[#1C1917] outline-none bg-transparent placeholder:text-stone-300"
            placeholder="0" type="number" />
        </div>
        <div className="mb-5">
          <label className="text-[13px] font-semibold text-[#78716C] mb-2 block">{lang === 'mr' ? 'आपले नाव (वैकल्पिक)' : 'Your Name (Optional)'}</label>
          <input className="w-full h-12 bg-white border border-stone-200 rounded-xl px-4 text-[14px] outline-none text-[#1C1917] focus:border-[#8B0000] transition-colors"
            placeholder={lang === 'mr' ? 'नाव टाका' : 'Enter your name'} />
        </div>
        <Btn onClick={() => push('public-qr')} className="w-full" icon={<QrCode className="w-4 h-4" />}
          variant={amount ? 'primary' : 'secondary'}>
          {lang === 'mr' ? 'पुढे जा' : 'Proceed to Pay'}
          {amount ? ` • ₹${amount.toLocaleString('en-IN')}` : ''}
        </Btn>
      </div>
    </div>
  )
}

function PublicQRScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5]">
      <div className="bg-[#8B0000] px-5 pb-5 flex items-center gap-3" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 20px)' }}>
        <button onClick={pop} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-white text-[18px] font-bold">{lang === 'mr' ? 'UPI पेमेंट' : 'UPI Payment'}</h1>
          <p className="text-white/70 text-[12px]">sahakar@sbi</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center px-5 py-6">
        <Card className="p-5 w-full flex flex-col items-center mb-4">
          <MandalLogo size={40} />
          <p className="font-bold text-[15px] text-[#1C1917] mt-2 text-center">{lang === 'mr' ? 'श्रीमंत सहकार मित्र मंडळ' : 'Shrimant Sahakar Mitra Mandal'}</p>
          <p className="text-[12px] text-[#78716C] mb-4">{lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'}</p>
          <div className="w-52 h-52 bg-[#1C1917] rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="grid grid-cols-9 grid-rows-9 gap-0.5 p-3">
              {Array.from({ length: 81 }, (_, i) => (
                <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.45 ? 'bg-white' : 'bg-transparent'}`} />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <MandalLogo size={32} />
              </div>
            </div>
          </div>
          <p className="text-[28px] font-bold text-[#1C1917] mt-4">₹1,001</p>
          <p className="text-[12px] text-[#78716C]">{lang === 'mr' ? 'स्कॅन करा किंवा UPI ने द्या' : 'Scan to pay via any UPI app'}</p>
        </Card>
        <div className="flex gap-3 w-full mb-5">
          {[['Google Pay', '#00BFA5'], ['PhonePe', '#5F259F'], ['Paytm', '#00B9F1'], ['BHIM', '#FF6B00']].map(([n, c]) => (
            <div key={n} className="flex-1 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold text-white" style={{ background: c }}>
              {n}
            </div>
          ))}
        </div>
        <Btn onClick={() => push('public-success')} className="w-full" icon={<Check className="w-4 h-4" />}>
          {lang === 'mr' ? 'पेमेंट झाले' : 'I\'ve Paid'}
        </Btn>
        <p className="text-[11px] text-stone-400 mt-3 text-center">
          🔒 {lang === 'mr' ? 'सुरक्षित UPI पेमेंट' : 'Secure payment via UPI'}
        </p>
      </div>
    </div>
  )
}

function PublicSuccessScreen({ lang, push, pop }: { lang: Lang; push: (s: Screen) => void; pop: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF5]">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="animate-scale-in flex flex-col items-center gap-5 w-full">
          <div className="w-28 h-28 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500" />
          </div>
          <div className="text-center">
            <h1 className="text-[26px] font-bold text-[#1C1917] mb-1">{lang === 'mr' ? 'देणगी मिळाली!' : 'Donation Received!'}</h1>
            <p className="text-[#78716C]">{lang === 'mr' ? 'आपल्या योगदानाबद्दल धन्यवाद' : 'Thank you for your generous contribution'}</p>
          </div>
          <Card className="p-5 w-full text-center">
            <p className="text-[36px] font-bold text-emerald-600">₹1,001</p>
            <p className="text-[13px] text-[#78716C]">{lang === 'mr' ? 'गणेशोत्सव २०२६ • UPI द्वारे' : 'Ganeshotsav 2026 • via UPI'}</p>
            <div className="w-full h-px bg-stone-100 my-3" />
            <p className="text-[13px] text-[#78716C]">{lang === 'mr' ? 'पावती क्र.' : 'Receipt'}: <span className="font-bold text-[#1C1917]">RCP-2026-0842</span></p>
          </Card>
          <div className="text-center">
            <p className="text-[#D97706] font-bold text-[18px] devanagari">{lang === 'mr' ? 'गणपती बाप्पा मोरया! 🙏' : 'May Lord Ganesha Bless You! 🙏'}</p>
            <p className="text-[12px] text-[#78716C] mt-1">{lang === 'mr' ? 'आपले मंडळ आपल्या पाठिंब्याबद्दल कृतज्ञ आहे.' : 'Your Mandal is grateful for your support.'}</p>
          </div>
        </div>
      </div>
      <div className="px-5 pb-8">
        <div className="flex gap-3 mb-3">
          <button className="flex-1 flex flex-col items-center gap-1 p-3 bg-white rounded-xl shadow-card">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="text-[11px] font-semibold text-green-600">{lang === 'mr' ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
          </button>
          <button onClick={() => push('public-receipt')} className="flex-1 flex flex-col items-center gap-1 p-3 bg-white rounded-xl shadow-card">
            <Receipt className="w-5 h-5 text-[#8B0000]" />
            <span className="text-[11px] font-semibold text-[#8B0000]">{lang === 'mr' ? 'पावती' : 'Receipt'}</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-1 p-3 bg-white rounded-xl shadow-card">
            <Download className="w-5 h-5 text-[#78716C]" />
            <span className="text-[11px] font-semibold text-[#78716C]">{lang === 'mr' ? 'डाउनलोड' : 'Download'}</span>
          </button>
        </div>
        <Btn onClick={pop} variant="secondary" className="w-full">{lang === 'mr' ? 'मुख्यपृष्ठावर जा' : 'Back to Home'}</Btn>
      </div>
    </div>
  )
}

function PublicReceiptScreen({ lang, pop }: { lang: Lang; pop: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-[#8B0000] px-5 pb-4 flex items-center gap-3" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 12px, 20px)' }}>
        <button onClick={pop} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-[18px] font-bold">{lang === 'mr' ? 'डिजिटल पावती' : 'Digital Receipt'}</h1>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBF5] px-4 py-4">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="bg-[#8B0000] px-5 py-6 flex flex-col items-center">
            <MandalLogo size={52} white />
            <p className="text-[#D97706] text-[11px] mt-2 font-semibold tracking-widest">{lang === 'mr' ? '॥ श्री गणेश ॥' : '|| Shree Ganesh ||'}</p>
            <h2 className="text-white text-[16px] font-bold mt-1 text-center">{lang === 'mr' ? 'श्रीमंत सहकार मित्र मंडळ' : 'Shrimant Sahakar Mitra Mandal'}</h2>
            <p className="text-white/70 text-[12px]">{lang === 'mr' ? 'कसबा पेठ, पुणे' : 'Kasba Peth, Pune'}</p>
          </div>
          <div className="h-1 bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#D97706]" />
          <div className="px-5 py-5">
            <div className="flex justify-between mb-3 pb-3 border-b border-[#8B0000]/10">
              <div><p className="text-[10px] text-[#78716C]">{lang === 'mr' ? 'पावती क्र.' : 'Receipt No.'}</p><p className="text-[14px] font-bold text-[#8B0000]">RCP-2026-0842</p></div>
              <div className="text-right"><p className="text-[10px] text-[#78716C]">{lang === 'mr' ? 'तारीख' : 'Date'}</p><p className="text-[13px] font-semibold">{lang === 'mr' ? '२५ ऑगस्ट २०२६' : '25 Aug 2026'}</p></div>
            </div>
            <div className="bg-[#8B0000]/5 rounded-xl p-4 text-center mb-4">
              <p className="text-[10px] text-[#78716C] mb-1">{lang === 'mr' ? 'प्राप्त देणगी' : 'Donation Received'}</p>
              <p className="text-[32px] font-bold text-[#8B0000]">₹1,001</p>
              <p className="text-[11px] text-[#78716C]">{lang === 'mr' ? 'एक हजार एक रुपये' : 'One Thousand One Rupees'}</p>
            </div>
            {[
              [lang === 'mr' ? 'उत्सव' : 'Festival', lang === 'mr' ? 'गणेशोत्सव २०२६' : 'Ganeshotsav 2026'],
              [lang === 'mr' ? 'पेमेंट पद्धत' : 'Payment', 'UPI'],
              [lang === 'mr' ? 'संदर्भ क्र.' : 'Reference', 'UPI2026082500999'],
              [lang === 'mr' ? 'स्थिती' : 'Status', lang === 'mr' ? '✓ सत्यापित' : '✓ Verified'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-[#8B0000]/8 last:border-0">
                <span className="text-[12px] text-[#78716C]">{k}</span>
                <span className="text-[12px] font-semibold text-[#1C1917]">{v}</span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#D97706]" />
          <div className="bg-[#8B0000] px-5 py-4 text-center">
            <p className="text-[#D97706] font-bold text-[14px] devanagari">{lang === 'mr' ? 'धन्यवाद! गणपती बाप्पा मोरया! 🙏' : 'Thank You! Best Wishes & Blessings! 🙏'}</p>
            <p className="text-white/50 text-[10px] mt-1">{lang === 'mr' ? 'हे अधिकृत मंडळ पावती आहे' : 'Official Mandal receipt'}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {[[MessageCircle, lang === 'mr' ? 'व्हॉट्सॲप' : 'WhatsApp', 'bg-green-50', 'text-green-600'], [Download, lang === 'mr' ? 'डाउनलोड' : 'Download', 'bg-[#8B0000]/5', 'text-[#8B0000]'], [Printer, lang === 'mr' ? 'प्रिंट' : 'Print', 'bg-stone-100', 'text-[#78716C]']].map(([Icon, label, bg, tc]) => (
            <button key={label as string} className={`flex-1 flex flex-col items-center gap-1.5 p-3 ${bg} rounded-xl`}>
              <Icon className={`w-5 h-5 ${tc}`} />
              <span className={`text-[10px] font-semibold ${tc}`}>{label as string}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────

function BottomNav({ tab, setTab, lang, push }: { tab: Tab; setTab: (t: Tab) => void; lang: Lang; push: (s: Screen) => void }) {
  const t = TR[lang]

  type NavItem = { key: Tab; icon: React.ReactNode; labelMr: string; label: string; screen: Screen }
  const leftTabs: NavItem[] = [
    { key: 'home',         icon: <HomeIcon className="w-5 h-5" />,      labelMr: 'मुख्यपृष्ठ', label: t.home,         screen: 'dashboard' },
    { key: 'transactions', icon: <ArrowLeftRight className="w-5 h-5" />, labelMr: 'व्यवहार',    label: t.transactions, screen: 'transactions' },
  ]
  const rightTabs: NavItem[] = [
    { key: 'members', icon: <Users className="w-5 h-5" />,        labelMr: 'सदस्य', label: t.members, screen: 'members' },
    { key: 'more',    icon: <MoreHorizontal className="w-5 h-5" />, labelMr: 'अधिक',  label: t.more,    screen: 'more' },
  ]

  const renderTab = ({ key, icon, labelMr, label, screen }: NavItem) => (
    <button key={key} onClick={() => { setTab(key); push(screen) }}
      className="flex-1 flex flex-col items-center gap-1 py-2 relative">
      {tab === key && <div className="absolute top-0 inset-x-0 flex justify-center"><div className="w-5 h-0.5 bg-[#8B0000] rounded-full" /></div>}
      <div className={tab === key ? 'text-[#8B0000]' : 'text-stone-400'}>{icon}</div>
      <span className={`text-[10px] font-semibold ${tab === key ? 'text-[#8B0000]' : 'text-stone-400'}`}>
        {lang === 'mr' ? labelMr : label}
      </span>
    </button>
  )

  return (
    <div className="relative bg-white border-t border-stone-100 flex items-end px-2 pb-safe flex-shrink-0" style={{ zIndex: 30 }}>
      {leftTabs.map(renderTab)}

      {/* ── CENTER: Elevated Ganapati FAB ── */}
      <button onClick={() => { setTab('festivals'); push('festivals') }}
        className="flex-1 flex flex-col items-center pb-1 relative" style={{ paddingTop: 32 }}>

        {/* Circle popping above navbar */}
        <div className="absolute left-1/2" style={{ top: 0, transform: 'translate(-50%, -52%)' }}>
          <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-transform duration-200 ${tab === 'festivals' ? 'scale-105' : 'scale-100'}`}
            style={{
              background: '#8B0000',
              boxShadow: '0 0 0 3px white, 0 0 0 4px rgba(139,0,0,0.15), 0 4px 14px rgba(139,0,0,0.25)',
            }}>
            {/* Ganesha icon — user-supplied asset */}
            <img
              src={ganeshIcon}
              alt="Ganapati"
              className="w-10 h-10 object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
        </div>

        {/* Label below circle — matches other tabs */}
        <span className={`text-[10px] font-semibold ${tab === 'festivals' ? 'text-[#8B0000]' : 'text-stone-400'}`}>
          {lang === 'mr' ? 'उत्सव' : 'Festivals'}
        </span>
      </button>

      {rightTabs.map(renderTab)}
    </div>
  )
}

// ─── STATUS BAR ──────────────────────────────────────────────────────────────

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-5 pt-2 pb-1 flex-shrink-0 ${dark ? 'bg-[#8B0000]' : 'bg-transparent'}`}>
      <span className={`text-[12px] font-bold ${dark ? 'text-white' : 'text-[#1C1917]'}`}>9:41</span>
      <div className="flex items-center gap-1.5">
        <Wifi className={`w-3.5 h-3.5 ${dark ? 'text-white' : 'text-[#1C1917]'}`} />
        <div className={`flex gap-0.5 items-end h-3.5`}>
          {[3, 5, 7, 9].map((h, i) => (
            <div key={i} className={`w-1 rounded-sm ${dark ? 'bg-white' : 'bg-[#1C1917]'}`} style={{ height: `${h}px` }} />
          ))}
        </div>
        <div className={`text-[12px] font-bold ${dark ? 'text-white' : 'text-[#1C1917]'}`}>⚡</div>
      </div>
    </div>
  )
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="absolute bottom-24 left-4 right-4 bg-[#1C1917] text-white px-4 py-3 rounded-xl shadow-float text-[13px] font-medium animate-slide-up z-50 flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      {msg}
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const PUBLIC_SCREENS: Screen[] = ['public-portal', 'public-donation', 'public-qr', 'public-success', 'public-receipt']
const AUTH_SCREENS: Screen[] = ['splash', 'language', 'welcome', 'login', 'register', 'otp', 'profile-setup', 'role-selection', ...PUBLIC_SCREENS]
const MAIN_TABS: Record<Tab, Screen> = { home: 'dashboard', transactions: 'transactions', festivals: 'festivals', members: 'members', more: 'more' }

export default function App() {
  const store = useAppStore()
  const lang = store.state.lang
  const [tab, setTab] = useState<Tab>('home')
  const [screenStack, setScreenStack] = useState<Screen[]>(['splash'])
  const [toast, setToast] = useState<string | null>(null)

  const currentScreen = screenStack[screenStack.length - 1]
  const isAuth = AUTH_SCREENS.includes(currentScreen)

  const push = (screen: Screen) => setScreenStack(prev => [...prev, screen])
  const pop = () => setScreenStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
  const reset = (screen: Screen) => setScreenStack([screen])

  const handleTabChange = (t: Tab) => {
    setTab(t)
    setScreenStack([MAIN_TABS[t]])
  }

  const showToast = (msg: string) => setToast(msg)

  const screenProps = { lang, push, pop, store, onLangToggle: () => store.setLang(lang === 'mr' ? 'en' : 'mr') }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen lang={lang} onDone={() => push('language')} />
      case 'language': return <LanguageScreen onSelect={l => { store.setLang(l); push('welcome') }} />
      case 'welcome': return <WelcomeScreen {...screenProps} onNext={() => push('login')} />
      case 'login': return <LoginScreen {...screenProps} onNext={() => push('otp')} onRegister={() => push('register')} />
      case 'register': return <RegisterScreen {...screenProps} onNext={() => push('otp')} />
      case 'otp': return <OTPScreen {...screenProps} onNext={() => push('profile-setup')} />
      case 'profile-setup': return <ProfileSetupScreen lang={lang} store={store} onNext={() => reset('dashboard')} pop={pop} />
      case 'role-selection': return <RoleSelectionScreen lang={lang} store={store} onNext={() => reset('dashboard')} />
      case 'dashboard': return <DashboardScreen {...screenProps} />
      case 'collections': return <CollectionsScreen {...screenProps} />
      case 'new-collection': return <NewCollectionScreen {...screenProps} />
      case 'collection-detail': return <TransactionDetailScreen {...screenProps} />
      case 'donations': return <DonationsScreen {...screenProps} />
      case 'donor-profile': return <DonorProfileScreen {...screenProps} />
      case 'new-donation': return <NewCollectionScreen {...screenProps} />
      case 'transactions': return <TransactionsScreen {...screenProps} />
      case 'transaction-detail': return <TransactionDetailScreen {...screenProps} />
      case 'festivals': return <FestivalsScreen {...screenProps} />
      case 'festival-detail': return <FestivalDetailScreen {...screenProps} />
      case 'add-festival': return <div className="p-10 text-center font-bold">Add Festival Coming Soon</div>
      case 'members': return <MembersScreen {...screenProps} />
      case 'member-profile': return <MemberProfileScreen {...screenProps} />
      case 'add-member': return <div className="p-10 text-center font-bold">Add Member Coming Soon</div>
      case 'pending-members': return <MembersScreen {...screenProps} />
      case 'join-mandal': return <JoinMandalScreen {...screenProps} />
      case 'expenses': return <ExpensesScreen {...screenProps} />
      case 'new-expense': return <NewExpenseScreen {...screenProps} />
      case 'expense-detail': return <ExpenseDetailScreen {...screenProps} />
      case 'expense-approval': return <ExpenseDetailScreen {...screenProps} />
      case 'qr-payment': return <QRPaymentScreen {...screenProps} />
      case 'payment-success': return <PaymentSuccessScreen {...screenProps} />
      case 'receipt': return <ReceiptScreen {...screenProps} />
      case 'pending-collections': return <PendingCollectionsScreen {...screenProps} />
      case 'correction-request': return <CorrectionFormScreen {...screenProps} />
      case 'correction-form': return <CorrectionFormScreen {...screenProps} />
      case 'whatsapp-reminder': return <WhatsAppReminderScreen lang={lang} pop={pop} store={store} />
      case 'offline': return <OfflineScreen lang={lang} pop={pop} />
      case 'audit-history': return <AuditHistoryScreen {...screenProps} />
      case 'notifications': return <NotificationsScreen {...screenProps} />
      case 'reports': return <ReportsScreen {...screenProps} />
      case 'analytics': return <AnalyticsScreen {...screenProps} />
      case 'documents': return <DocumentsScreen {...screenProps} />
      case 'more': return <MoreScreen lang={lang} push={push} store={store} onLangToggle={() => store.setLang(lang === 'mr' ? 'en' : 'mr')} />
      case 'admin': return <AdminScreen {...screenProps} />
      case 'mandal-profile': return <MandalProfileScreen {...screenProps} />
      case 'roles-permissions': return <RolesPermissionsScreen {...screenProps} />
      case 'security': return <SecurityScreen {...screenProps} />
      case 'backup': return <SecurityScreen {...screenProps} />
      case 'notification-settings': return <NotificationsScreen {...screenProps} />
      case 'language-settings': return <LanguageScreen onSelect={l => { store.setLang(l); pop() }} />
      case 'payment-settings': return <PaymentSettingsScreen lang={lang} pop={pop} />
      case 'about': return <AboutScreen lang={lang} pop={pop} />
      case 'public-portal': return <PublicPortalLandingScreen {...screenProps} />
      case 'public-donation': return <PublicDonationScreen {...screenProps} />
      case 'public-qr': return <PublicQRScreen {...screenProps} />
      case 'public-success': return <PublicSuccessScreen {...screenProps} />
      case 'public-receipt': return <PublicReceiptScreen lang={lang} pop={pop} />
      default: return <DashboardScreen {...screenProps} />
    }
  }

  // Which screens show the dark status bar (inside a colored header)
  const darkStatusScreens: Screen[] = ['splash', 'login', 'otp', 'role-selection', 'dashboard', 'collections', 'festivals', 'members', 'more', 'transactions', 'public-portal']

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#FFFBF5', overflow: 'hidden', position: 'relative' }}>
      <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" key={currentScreen}>
        {renderScreen()}
      </div>
      {!isAuth && (
        <BottomNav tab={tab} setTab={handleTabChange} lang={lang} push={push} />
      )}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
