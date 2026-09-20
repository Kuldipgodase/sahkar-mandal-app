// ─── SAHAKAR MANDAL — CENTRAL STATE STORE (REAL-TIME API ENABLED) ───
import { useState, useEffect, useCallback } from 'react'

export type Lang = 'mr' | 'en'

export interface User {
  id: string; name: string; nameMr: string; mobile: string; email: string
  role: string; roleMr: string; avatar: string; avatarColor: string; mandalId: string
  address?: string; photo?: string;
}

export interface MandalConfig {
  name: string; nameMr: string; location: string; locationMr: string
  established: string; mobile: string; email: string; upiId: string
}

export interface Member {
  _id: string; id: string; name: string; nameMr: string; role: string; roleMr: string
  mobile: string; email: string; status: 'active' | 'pending' | 'inactive'
  contributions: number; avatar: string; avatarColor: string; hasPhoto: boolean
  dob?: string; address?: string; createdAt?: string; photo?: string; joinedDisplay?: string; joinedDisplayMr?: string
}

export interface Transaction {
  _id: string; id: string; type: 'income' | 'expense'; person: string; personMr: string
  desc: string; descMr: string; amount: number; method: string; methodMr: string
  time?: string; timeMr?: string; status: 'paid' | 'pending' | 'approved' | 'under-review' | 'rejected'
  festival: string; festivalMr: string; receipt: string; festivalId?: number
  memberId?: string; createdAt: string
}

export interface Festival {
  _id: string; id: string; name: string; nameMr: string; quote: string; quoteMr: string
  dates?: string; datesMr?: string; location: string; locationMr: string
  income: number; expense: number; balance: number; pending: number
  pendingCount: number; entries: number; status: 'active' | 'upcoming' | 'completed' | 'planned'
  startDate?: string; endDate?: string; budget?: number
}

export interface Expense {
  _id: string; id: string; vendor: string; vendorMr: string; category: string; categoryMr: string
  amount: number; method: string; methodMr?: string; date?: string; dateMr?: string
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'paid'
  festival: string; festivalMr: string; festivalId?: string; ref: string
  notes?: string; submittedBy?: string; approvedBy?: string; createdAt: string
  billDocument?: string; billUrl?: string; billName?: string; billType?: string; billSize?: string
}

export const INITIAL_EXPENSES: Expense[] = [
  { id: '1', _id: '1', vendor: 'Om Sound Systems', vendorMr: 'ओम साउंड सिस्टिम्स', category: 'Sound & DJ', categoryMr: 'ध्वनी व डीजे', amount: 25000, method: 'Cheque', methodMr: 'धनादेश', date: '22 Aug 2026', dateMr: '२२ ऑगस्ट २०२६', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: 'CHQ-004521', createdAt: '2026-08-22T10:00:00.000Z', submittedBy: 'सिद्धार्थ कदम', notes: 'ध्वनी व डीजे यंत्रणा - मुख्य उत्सव व विसर्जन' },
  { id: '2', _id: '2', vendor: 'Shri Decor Works', vendorMr: 'श्री डेकोर वर्क्स', category: 'Decoration', categoryMr: 'सजावट', amount: 18500, method: 'NEFT', methodMr: 'NEFT', date: '24 Aug 2026', dateMr: '२४ ऑगस्ट २०२६', status: 'approved', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: 'NEFT-20260824', createdAt: '2026-08-24T10:00:00.000Z', submittedBy: 'सिद्धार्थ कदम', notes: 'मंडप व स्टेज सजावट साहित्य' },
  { id: '3', _id: '3', vendor: 'Sai Mandap House', vendorMr: 'साई मंडप हाउस', category: 'Mandap', categoryMr: 'मंडप', amount: 15000, method: 'Cash', methodMr: 'रोख', date: '20 Aug 2026', dateMr: '२० ऑगस्ट २०२६', status: 'under-review', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: '', createdAt: '2026-08-20T10:00:00.000Z', submittedBy: 'सुरेश कदम', notes: 'मंडप उभारणी व छत व्यवस्था' },
  { id: '4', _id: '4', vendor: 'Prasanna Catering', vendorMr: 'प्रसन्न कॅटरर्स', category: 'Food', categoryMr: 'प्रसाद व भोजन', amount: 8200, method: 'UPI', methodMr: 'UPI', date: '21 Aug 2026', dateMr: '२१ ऑगस्ट २०२६', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: 'UPI-826341', createdAt: '2026-08-21T10:00:00.000Z', submittedBy: 'मिनल शिंदे', notes: 'महाप्रसाद व वाटप सामग्री' },
  { id: '5', _id: '5', vendor: 'Datta Electricals', vendorMr: 'दत्त इलेक्ट्रिकल्स', category: 'Lighting', categoryMr: 'रोषणाई', amount: 6300, method: 'Cash', methodMr: 'रोख', date: '19 Aug 2026', dateMr: '१९ ऑगस्ट २०२६', status: 'paid', festival: 'Ganeshotsav 2026', festivalMr: 'गणेशोत्सव २०२६', ref: '', createdAt: '2026-08-19T10:00:00.000Z', submittedBy: 'राहुल पाटील', notes: 'आकर्षक विद्युत रोषणाई' },
]

export interface PendingCollection {
  id: string; name: string; nameMr: string; amount: number; paid: number
  outstanding: number; last?: string; lastMr?: string; festival: string
  festivalMr: string; festivalId?: string; mobile: string; memberId?: string
}

export interface AppNotification {
  id: string; type: 'approval' | 'payment' | 'expense' | 'reminder' | 'system' | 'festival'
  title: string; titleMr: string; sub: string; subMr: string
  time?: string; timeMr?: string; unread: boolean; action: string; createdAt: string
}

export interface DocFolder {
  id: string; name: string; nameMr: string; icon: string; count: number
  permission: string; permissionMr: string; size: string
}

export interface AppState {
  lang: Lang; isAuthenticated: boolean; currentUser: User | null
  members: Member[]; transactions: Transaction[]; festivals: Festival[];
  expenses: Expense[]; pendingCollections: PendingCollection[];
  notifications: AppNotification[]; documents: DocFolder[]; mandal: MandalConfig;
  lastTransaction?: Partial<Transaction>;
  selectedExpense?: Expense | null;
}

const SEED_MANDAL: MandalConfig = {
  name: 'Sahakar Mitra Mandal', nameMr: 'सहकार मित्र मंडळ',
  location: 'Kasba Peth, Pune', locationMr: 'कसबा पेठ, पुणे',
  established: '1985', mobile: '98765 43210',
  email: 'info@sahakarmandal.org', upiId: 'sahakarmandal@upi',
}

const INITIAL_STATE: AppState = {
  lang: 'mr', isAuthenticated: false, currentUser: null,
  members: [], transactions: [], festivals: [], expenses: INITIAL_EXPENSES,
  pendingCollections: [], notifications: [], documents: [], mandal: SEED_MANDAL,
}

const STORAGE_KEY = 'sahakar_mandal_state_v4'
const API_BASE = 'http://localhost:5000/api'

export function useAppStore() {
  const [state, _setState] = useState<AppState>(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) return { ...INITIAL_STATE, ...JSON.parse(s) } } catch {}
    return INITIAL_STATE
  })
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {} }, [state])
  const set = useCallback((fn: (p: AppState) => AppState) => _setState(fn), [])

  const setLang = (lang: Lang) => set(s => ({ ...s, lang }))
  const login = (user: User) => set(s => ({ ...s, isAuthenticated: true, currentUser: user }))
  const logout = () => set(s => ({ ...s, isAuthenticated: false, currentUser: null }))
  const updateCurrentUser = (data: Partial<User>) => set(s => ({ ...s, currentUser: s.currentUser ? { ...s.currentUser, ...data } : data as User }))

  const fetchInitialData = async () => {
    try {
      const [membersRes, txRes, expRes, festRes] = await Promise.all([
        fetch(`${API_BASE}/members`),
        fetch(`${API_BASE}/transactions`),
        fetch(`${API_BASE}/expenses`),
        fetch(`${API_BASE}/festivals`),
      ]);
      const members = membersRes.ok ? await membersRes.json() : [];
      const transactions = txRes.ok ? await txRes.json() : [];
      const expenses = expRes.ok ? await expRes.json() : [];
      const festivals = festRes.ok ? await festRes.json() : [];
      
      set(s => ({
        ...s,
        members: members.length > 0 ? members : s.members,
        transactions: transactions.length > 0 ? transactions : s.transactions,
        expenses: expenses.length > 0 ? expenses : (s.expenses && s.expenses.length > 0 ? s.expenses : INITIAL_EXPENSES),
        festivals: festivals.length > 0 ? festivals : s.festivals,
      }));
    } catch (err) {
      console.error('Error fetching data from backend', err);
    }
  }

  // Always fetch on mount (regardless of auth) so data always shows
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Also poll every 30s when authenticated for real-time updates
  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(fetchInitialData, 30000);
      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]);

  const addTransaction = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const newTx = await response.json();
        // Prepend new transaction and keep all existing ones, store as lastTransaction
        set(s => ({ ...s, transactions: [newTx, ...s.transactions], lastTransaction: newTx }));
      }
    } catch (err) {
      // Optimistic UI even if backend fails
      const optimistic = { ...data, _id: Date.now().toString(), id: Date.now().toString(), createdAt: new Date().toISOString() };
      set(s => ({ ...s, transactions: [optimistic, ...s.transactions], lastTransaction: optimistic }));
      console.error('Failed to add transaction to backend, added optimistically', err);
    }
  }
  const updateTransaction = (id: string, data: Partial<Transaction>) => set(s => ({ ...s, transactions: s.transactions.map(tx => tx.id === id || tx._id === id ? { ...tx, ...data } : tx) }))

  const addExpense = async (data: any) => {
    let savedExp: any = null;
    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        savedExp = await response.json();
      }
    } catch (err) {
      console.error('Failed to add expense to backend, will use local fallback', err);
    }
    const finalExp: Expense = {
      ...(savedExp || data),
      _id: (savedExp && savedExp._id) || data._id || 'exp_' + Date.now(),
      id: (savedExp && (savedExp.id || savedExp._id)) || data.id || 'exp_' + Date.now(),
      vendor: data.vendor,
      vendorMr: data.vendorMr || data.vendor,
      category: data.category,
      categoryMr: data.categoryMr || data.category,
      amount: Number(data.amount) || 0,
      method: data.method || 'Cash',
      methodMr: data.methodMr || (data.method === 'Cheque' ? 'धनादेश' : data.method === 'Cash' ? 'रोख' : data.method),
      date: data.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      dateMr: data.dateMr || new Date().toLocaleDateString('mr-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: data.status || 'submitted',
      festival: data.festival || 'Ganeshotsav 2026',
      festivalMr: data.festivalMr || 'गणेशोत्सव २०२६',
      ref: data.ref || '',
      notes: data.notes || '',
      billDocument: data.billDocument || '',
      billUrl: data.billUrl || '',
      billName: data.billName || '',
      billType: data.billType || '',
      billSize: data.billSize || '',
      submittedBy: data.submittedBy || 'सिद्धार्थ कदम',
      createdAt: data.createdAt || new Date().toISOString()
    };

    set(s => ({
      ...s,
      expenses: [finalExp, ...(s.expenses || []).filter(e => e.id !== finalExp.id && e._id !== finalExp._id)],
      selectedExpense: finalExp,
      // Add corresponding transaction so Dashboard and Transactions screen update real-time
      transactions: [
        {
          _id: 'tx_' + finalExp._id,
          id: 'tx_' + finalExp.id,
          type: 'expense' as const,
          person: finalExp.vendor,
          personMr: finalExp.vendorMr || finalExp.vendor,
          desc: finalExp.category,
          descMr: finalExp.categoryMr || finalExp.category,
          amount: finalExp.amount,
          method: finalExp.method,
          methodMr: finalExp.methodMr || finalExp.method,
          status: 'paid' as const,
          festival: finalExp.festival,
          festivalMr: finalExp.festivalMr,
          receipt: finalExp.ref || ('EXP-' + Date.now().toString().slice(-5)),
          createdAt: finalExp.createdAt
        },
        ...s.transactions
      ],
      // Add notification
      notifications: [
        {
          id: 'notif_' + Date.now(),
          type: 'expense' as const,
          title: s.lang === 'mr' ? 'नवीन खर्च नोंदवला' : 'New Expense Added',
          titleMr: 'नवीन खर्च नोंदवला',
          sub: `${finalExp.vendorMr || finalExp.vendor} — ₹${finalExp.amount.toLocaleString('en-IN')}`,
          subMr: `${finalExp.vendorMr || finalExp.vendor} — ₹${finalExp.amount.toLocaleString('en-IN')}`,
          time: 'Just now',
          timeMr: 'आत्ताच',
          unread: true,
          action: 'view',
          createdAt: new Date().toISOString()
        },
        ...s.notifications
      ]
    }));
    return finalExp;
  }
  
  const setSelectedExpense = (exp: Expense | null) => set(s => ({ ...s, selectedExpense: exp }))
  const updateExpense = (id: string, data: Partial<Expense>) => set(s => ({ ...s, expenses: s.expenses.map(e => e.id === id || e._id === id ? { ...e, ...data } : e) }))
  const deleteExpense = (id: string) => set(s => ({ ...s, expenses: s.expenses.filter(e => e.id !== id && e._id !== id) }))

  const addMember = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const newMember = await response.json();
        set(s => ({ ...s, members: [newMember, ...s.members] }));
      }
    } catch (err) {
      const optimistic = { ...data, _id: Date.now().toString(), id: Date.now().toString(), status: 'pending', contributions: 0, avatar: (data.name || 'U').slice(0,2).toUpperCase(), avatarColor: '#8B0000', hasPhoto: false, createdAt: new Date().toISOString() };
      set(s => ({ ...s, members: [optimistic, ...s.members] }));
      console.error('Failed to add member, added optimistically', err);
    }
  }
  const updateMember = (id: string, data: any) => set(s => ({ ...s, members: s.members.map(m => m.id === id || m._id === id ? { ...m, ...data } : m) }))
  const deleteMember = (id: string) => set(s => ({ ...s, members: s.members.filter(m => m.id !== id && m._id !== id) }))
  const approveMember = (id: string) => set(s => ({ ...s, members: s.members.map(m => m.id === id || m._id === id ? { ...m, status: 'active' as const } : m) }))
  const addFestival = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE}/festivals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const newFest = await response.json();
        set(s => ({ ...s, festivals: [newFest, ...s.festivals] }));
      }
    } catch (err) {
      const optimistic = { ...data, _id: Date.now().toString(), id: Date.now().toString(), income: 0, expense: 0, balance: 0, pending: 0, pendingCount: 0, entries: 0, createdAt: new Date().toISOString() };
      set(s => ({ ...s, festivals: [optimistic, ...s.festivals] }));
      console.error('Failed to add festival, added optimistically', err);
    }
  }
  const updateFestival = (id: string, data: any) => set(s => ({ ...s, festivals: s.festivals.map(f => f.id === id || f._id === id ? { ...f, ...data } : f) }))
  const addPendingCollection = (data: any) => set(s => ({ ...s, pendingCollections: [...s.pendingCollections, data] }))
  const recordPendingPayment = (id: string, paid: number) => set(s => ({ ...s, pendingCollections: s.pendingCollections.map(p => p.id === id ? { ...p, paid: p.paid + paid, outstanding: Math.max(0, p.outstanding - paid) } : p) }))
  
  const markNotificationRead = (id: string) => set(s => ({ ...s, notifications: s.notifications.map(n => n.id === id ? { ...n, unread: false } : n) }))
  const markAllRead = () => set(s => ({ ...s, notifications: s.notifications.map(n => ({ ...n, unread: false })) }))
  const dismissNotification = (id: string) => set(s => ({ ...s, notifications: s.notifications.filter(n => n.id !== id) }))

  const resetToDefaults = () => { localStorage.removeItem(STORAGE_KEY); _setState(INITIAL_STATE) }

  const totalIncome = state.transactions.filter(t => t.type === 'income' && t.status === 'paid').reduce((s, t) => s + t.amount, 0)
  const totalExpense = state.transactions.filter(t => t.type === 'expense' && (t.status === 'paid' || t.status === 'approved')).reduce((s, t) => s + t.amount, 0)
  const currentBalance = totalIncome - totalExpense
  const unreadCount = state.notifications.filter(n => n.unread).length
  const pendingMemberCount = state.members.filter(m => m.status === 'pending').length
  const activeMemberCount = state.members.filter(m => m.status === 'active').length
  const totalOutstanding = state.pendingCollections.reduce((s, p) => s + p.outstanding, 0)

  return {
    state, setLang, login, logout, updateCurrentUser,
    addMember, updateMember, deleteMember, approveMember,
    addTransaction, updateTransaction,
    addExpense, updateExpense, deleteExpense, setSelectedExpense,
    addFestival, updateFestival,
    addPendingCollection, recordPendingPayment,
    markNotificationRead, markAllRead, dismissNotification,
    resetToDefaults, fetchInitialData,
    totalIncome, totalExpense, currentBalance, unreadCount, pendingMemberCount, activeMemberCount, totalOutstanding
  }
}


export type AppStore = ReturnType<typeof useAppStore>;
