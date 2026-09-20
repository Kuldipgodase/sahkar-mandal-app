// ─── SAHAKAR MANDAL — CENTRAL STATE STORE ────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'

export type Lang = 'mr' | 'en'

export interface User {
  id: string; name: string; nameMr: string; mobile: string; email: string
  role: string; roleMr: string; avatar: string; avatarColor: string; mandalId: string
}

export interface MandalConfig {
  name: string; nameMr: string; location: string; locationMr: string
  established: string; mobile: string; email: string; upiId: string
}

export interface Member {
  id: number; name: string; nameMr: string; role: string; roleMr: string
  mobile: string; email: string; status: 'active' | 'pending' | 'inactive'
  joinedDisplay: string; joinedDisplayMr: string; contributions: number
  avatar: string; avatarColor: string; hasPhoto: boolean; dob?: string
  address?: string; addressMr?: string
}

export interface Transaction {
  id: number; type: 'income' | 'expense'; person: string; personMr: string
  desc: string; descMr: string; amount: number; method: string; methodMr: string
  time: string; timeMr: string; status: 'paid' | 'pending' | 'approved' | 'under-review' | 'rejected'
  festival: string; festivalMr: string; receipt: string; festivalId?: number
  memberId?: number; createdAt: string
}

export interface Festival {
  id: number; name: string; nameMr: string; quote: string; quoteMr: string
  dates: string; datesMr: string; location: string; locationMr: string
  income: number; expense: number; balance: number; pending: number
  pendingCount: number; entries: number; status: 'active' | 'upcoming' | 'completed' | 'planned'
  startDate?: string; endDate?: string; budget?: number
}

export interface Expense {
  id: number; vendor: string; vendorMr: string; category: string; categoryMr: string
  amount: number; method: string; date: string; dateMr: string
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'paid'
  festival: string; festivalMr: string; festivalId?: number; ref: string
  notes?: string; submittedBy?: string; approvedBy?: string; createdAt: string
}

export interface PendingCollection {
  id: number; name: string; nameMr: string; amount: number; paid: number
  outstanding: number; last: string; lastMr: string; festival: string
  festivalMr: string; festivalId?: number; mobile: string; memberId?: number
}

export interface AppNotification {
  id: number; type: 'approval' | 'payment' | 'expense' | 'reminder' | 'system' | 'festival'
  title: string; titleMr: string; sub: string; subMr: string
  time: string; timeMr: string; unread: boolean; action: string; createdAt: string
}

export interface DocFolder {
  id: number; name: string; nameMr: string; icon: string; count: number
  permission: string; permissionMr: string; size: string
}

export interface AppState {
  lang: Lang; isAuthenticated: boolean; currentUser: User | null
  members: Member[]; transactions: Transaction[]; festivals: Festival[]
  expenses: Expense[]; pendingCollections: PendingCollection[]
  notifications: AppNotification[]; documents: DocFolder[]; mandal: MandalConfig
}

const SEED_MANDAL: MandalConfig = {
  name: 'Shrimant Sahakar Mitra Mandal', nameMr: 'श्रीमंत सहकार मित्र मंडळ',
  location: 'Kasba Peth, Pune', locationMr: 'कसबा पेठ, पुणे',
  established: '1985', mobile: '98765 43210',
  email: 'info@sahakarmandal.org', upiId: 'sahakarmandal@upi',
}

const now = Date.now()

const SEED_MEMBERS: Member[] = [
  { id:1, name:'Suresh Kadam', nameMr:'सुरेश कदम', roleMr:'मुख्य ॲडमिन', role:'Super Admin', mobile:'98765 43210', email:'suresh@mandal.org', status:'active', joinedDisplay:'12 Aug 2026', joinedDisplayMr:'१२ ऑगस्ट २०२६', contributions:45000, avatar:'SK', avatarColor:'#8B0000', hasPhoto:false },
  { id:2, name:'Siddharth Kadam', nameMr:'सिद्धार्थ कदम', roleMr:'खजिनदार', role:'Treasurer', mobile:'87654 32109', email:'sid@mandal.org', status:'active', joinedDisplay:'10 Aug 2026', joinedDisplayMr:'१० ऑगस्ट २०२६', contributions:32000, avatar:'SK', avatarColor:'#7C3AED', hasPhoto:false },
  { id:3, name:'Minal Shinde', nameMr:'मिनल शिंदे', roleMr:'सचिव', role:'Secretary', mobile:'76543 21098', email:'minal@mandal.org', status:'active', joinedDisplay:'8 Aug 2026', joinedDisplayMr:'८ ऑगस्ट २०२६', contributions:18500, avatar:'MS', avatarColor:'#DB2777', hasPhoto:false },
  { id:4, name:'Rahul Patil', nameMr:'राहुल पाटील', roleMr:'ॲडमिन', role:'Admin', mobile:'65432 10987', email:'rahul@mandal.org', status:'active', joinedDisplay:'5 Aug 2026', joinedDisplayMr:'५ ऑगस्ट २०२६', contributions:22000, avatar:'RP', avatarColor:'#0369A1', hasPhoto:false },
  { id:5, name:'Rajesh Deshmukh', nameMr:'राजेश देशमुख', roleMr:'स्वयंसेवक', role:'Volunteer', mobile:'54321 09876', email:'rajesh@mandal.org', status:'active', joinedDisplay:'1 Aug 2026', joinedDisplayMr:'१ ऑगस्ट २०२६', contributions:5500, avatar:'RD', avatarColor:'#8B0000', hasPhoto:false },
  { id:6, name:'Amit Pawar', nameMr:'अमित पवार', roleMr:'सदस्य', role:'Member', mobile:'93210 56784', email:'amit@mandal.org', status:'inactive', joinedDisplay:'28 Jul 2026', joinedDisplayMr:'२८ जुलै २०२६', contributions:2000, avatar:'AP', avatarColor:'#78716C', hasPhoto:false },
  { id:7, name:'Payal Patil', nameMr:'पायल पाटील', roleMr:'सदस्य', role:'Member', mobile:'98675 43210', email:'payal@mandal.org', status:'pending', joinedDisplay:'22 Sep 2026', joinedDisplayMr:'२२ सप्टेंबर २०२६', contributions:0, avatar:'PP', avatarColor:'#BE185D', hasPhoto:false },
]

const SEED_FESTIVALS: Festival[] = [
  { id:1, name:'Ganeshotsav 2026', nameMr:'गणेशोत्सव २०२६', quote:'"One Mandal, One Vision"', quoteMr:'"एक मंडळ, एक ध्येय"', dates:'27 Aug – 5 Sep 2026', datesMr:'२७ ऑगस्ट – ५ सप्टें २०२६', location:'Main Mandap, Ganesh Nagar', locationMr:'मुख्य मंडप, गणेश नगर', income:178400, expense:73000, balance:105400, pending:18502, pendingCount:5, entries:142, status:'active', startDate:'2026-08-27', endDate:'2026-09-05', budget:200000 },
  { id:2, name:'Navratri 2026', nameMr:'नवरात्री २०२६', quote:'"Strength, Devotion"', quoteMr:'"शक्ती, श्रद्धा"', dates:'2 – 11 Oct 2026', datesMr:'२ – ११ ऑक्टो २०२६', location:'Main Mandap, Ganesh Nagar', locationMr:'मुख्य मंडप, गणेश नगर', income:42000, expense:18500, balance:23500, pending:4200, pendingCount:3, entries:38, status:'upcoming', startDate:'2026-10-02', endDate:'2026-10-11', budget:80000 },
  { id:3, name:'Dahi Handi 2026', nameMr:'दही हंडी २०२६', quote:'"Enthusiasm, Unity"', quoteMr:'"उत्साह, एकता"', dates:'15 Aug 2026', datesMr:'१५ ऑगस्ट २०२६', location:'Sports Ground', locationMr:'क्रीडा मैदान', income:31000, expense:22500, balance:8500, pending:0, pendingCount:0, entries:29, status:'completed', startDate:'2026-08-15', endDate:'2026-08-15', budget:40000 },
  { id:4, name:'Shiv Jayanti 2027', nameMr:'शिव जयंती २०२७', quote:'"Bravery, Wisdom"', quoteMr:'"शौर्य, विचार"', dates:'19 Feb 2027', datesMr:'१९ फेब्रु २०२७', location:'Main Mandap', locationMr:'मुख्य मंडप', income:0, expense:0, balance:0, pending:0, pendingCount:0, entries:0, status:'planned', startDate:'2027-02-19', endDate:'2027-02-19', budget:60000 },
]

const SEED_TRANSACTIONS: Transaction[] = [
  { id:1, type:'income', person:'Mahadev Khadye', personMr:'महादेव खडये', desc:'Collection - Ganeshotsav 2026', descMr:'वर्गणी - गणेशोत्सव २०२६', amount:5001, method:'UPI', methodMr:'UPI', time:'2 hrs ago', timeMr:'२ तासांपूर्वी', status:'paid', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', receipt:'RCP-2026-0841', festivalId:1, createdAt:new Date(now-2*3600000).toISOString() },
  { id:2, type:'expense', person:'Shri Decor Works', personMr:'श्री डेकोर वर्क्स', desc:'Decoration - Stage Setup', descMr:'सजावट - स्टेज उभारणी', amount:18500, method:'NEFT', methodMr:'NEFT', time:'5 hrs ago', timeMr:'५ तासांपूर्वी', status:'approved', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', receipt:'EXP-2026-0122', festivalId:1, createdAt:new Date(now-5*3600000).toISOString() },
  { id:3, type:'income', person:'Rahul Patil', personMr:'राहुल पाटील', desc:'Donation - General', descMr:'देणगी - सर्वसाधारण', amount:1001, method:'Cash', methodMr:'रोख', time:'Yesterday', timeMr:'काल', status:'paid', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', receipt:'RCP-2026-0840', festivalId:1, createdAt:new Date(now-24*3600000).toISOString() },
  { id:4, type:'income', person:'Minal Shinde', personMr:'मिनल शिंदे', desc:'Collection - Annual', descMr:'वर्गणी - वार्षिक', amount:501, method:'UPI', methodMr:'UPI', time:'Yesterday', timeMr:'काल', status:'paid', festival:'General', festivalMr:'सर्वसाधारण', receipt:'RCP-2026-0839', createdAt:new Date(now-26*3600000).toISOString() },
  { id:5, type:'expense', person:'Om Sound Systems', personMr:'ओम साउंड सिस्टिम्स', desc:'Sound System - 5 Days', descMr:'ध्वनी व्यवस्था - ५ दिवस', amount:25000, method:'Cheque', methodMr:'धनादेश', time:'2 days ago', timeMr:'२ दिवसांपूर्वी', status:'paid', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', receipt:'EXP-2026-0121', festivalId:1, createdAt:new Date(now-48*3600000).toISOString() },
  { id:6, type:'income', person:'Suresh Kadam', personMr:'सुरेश कदम', desc:'Sponsorship - Banner', descMr:'प्रायोजकत्व - फलक', amount:10000, method:'Bank', methodMr:'बँक', time:'3 days ago', timeMr:'३ दिवसांपूर्वी', status:'paid', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', receipt:'RCP-2026-0838', festivalId:1, createdAt:new Date(now-72*3600000).toISOString() },
  { id:7, type:'income', person:'Prasad Kulkarni', personMr:'प्रसाद कुलकर्णी', desc:'Collection - Ganeshotsav', descMr:'वर्गणी - गणेशोत्सव', amount:2001, method:'UPI', methodMr:'UPI', time:'4 days ago', timeMr:'४ दिवसांपूर्वी', status:'paid', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', receipt:'RCP-2026-0837', festivalId:1, createdAt:new Date(now-96*3600000).toISOString() },
  { id:8, type:'expense', person:'Sai Mandap House', personMr:'साई मंडप हाउस', desc:'Mandap Rental', descMr:'मंडप भाडे', amount:15000, method:'Cash', methodMr:'रोख', time:'5 days ago', timeMr:'५ दिवसांपूर्वी', status:'under-review', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', receipt:'EXP-2026-0120', festivalId:1, createdAt:new Date(now-120*3600000).toISOString() },
]

const SEED_EXPENSES: Expense[] = [
  { id:1, vendor:'Om Sound Systems', vendorMr:'ओम साउंड सिस्टिम्स', category:'Sound & DJ', categoryMr:'ध्वनी व डीजे', amount:25000, method:'Cheque', date:'22 Aug 2026', dateMr:'२२ ऑगस्ट २०२६', status:'paid', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', festivalId:1, ref:'CHQ-004521', createdAt:new Date(now-48*3600000).toISOString() },
  { id:2, vendor:'Shri Decor Works', vendorMr:'श्री डेकोर वर्क्स', category:'Decoration', categoryMr:'सजावट', amount:18500, method:'NEFT', date:'24 Aug 2026', dateMr:'२४ ऑगस्ट २०२६', status:'approved', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', festivalId:1, ref:'NEFT-20260824', createdAt:new Date(now-30*3600000).toISOString() },
  { id:3, vendor:'Sai Mandap House', vendorMr:'साई मंडप हाउस', category:'Mandap', categoryMr:'मंडप', amount:15000, method:'Cash', date:'20 Aug 2026', dateMr:'२० ऑगस्ट २०२६', status:'under-review', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', festivalId:1, ref:'', createdAt:new Date(now-5*3600000).toISOString() },
  { id:4, vendor:'Prasanna Catering', vendorMr:'प्रसन्न कॅटरर्स', category:'Food', categoryMr:'प्रसाद व भोजन', amount:8200, method:'UPI', date:'21 Aug 2026', dateMr:'२१ ऑगस्ट २०२६', status:'paid', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', festivalId:1, ref:'UPI-826341', createdAt:new Date(now-36*3600000).toISOString() },
  { id:5, vendor:'Datta Electricals', vendorMr:'दत्त इलेक्ट्रिकल्स', category:'Lighting', categoryMr:'रोषणाई', amount:6300, method:'Cash', date:'19 Aug 2026', dateMr:'१९ ऑगस्ट २०२६', status:'paid', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', festivalId:1, ref:'', createdAt:new Date(now-60*3600000).toISOString() },
]

const SEED_PENDING: PendingCollection[] = [
  { id:1, name:'Sunil Joshi', nameMr:'सुनील जोशी', amount:2000, paid:500, outstanding:1500, last:'12 Jun 2026', lastMr:'१२ जून २०२६', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', festivalId:1, mobile:'91234 56789' },
  { id:2, name:'Ganesh Bodke', nameMr:'गणेश बोडके', amount:1000, paid:0, outstanding:1000, last:'Never', lastMr:'कधीही नाही', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', festivalId:1, mobile:'90123 45678' },
  { id:3, name:'Priya Joshi', nameMr:'प्रिया जोशी', amount:501, paid:0, outstanding:501, last:'Never', lastMr:'कधीही नाही', festival:'General', festivalMr:'सर्वसाधारण', mobile:'89012 34567' },
  { id:4, name:'Vijay Kulkarni', nameMr:'विजय कुलकर्णी', amount:3000, paid:1000, outstanding:2000, last:'3 May 2026', lastMr:'३ मे २०२६', festival:'Ganeshotsav 2026', festivalMr:'गणेशोत्सव २०२६', festivalId:1, mobile:'78901 23456' },
  { id:5, name:'Meena Patil', nameMr:'मीना पाटील', amount:501, paid:0, outstanding:501, last:'Never', lastMr:'कधीही नाही', festival:'Navratri 2026', festivalMr:'नवरात्री २०२६', festivalId:2, mobile:'67890 12345' },
]

const SEED_NOTIFICATIONS: AppNotification[] = [
  { id:1, type:'approval', title:'2 Member Approvals Pending', titleMr:'२ सदस्य मंजुरी प्रलंबित', sub:'Ganesh Bodke and Priya Joshi are waiting for approval.', subMr:'गणेश बोडके आणि प्रिया जोशी मंजुरीच्या प्रतीक्षेत आहेत.', time:'10 min ago', timeMr:'१० मिनिटांपूर्वी', unread:true, action:'approve', createdAt:new Date(now-10*60000).toISOString() },
  { id:2, type:'payment', title:'New Payment Received', titleMr:'नवीन देणगी प्राप्त', sub:'Mahadev Khadye paid ₹5,001 via UPI for Ganeshotsav 2026.', subMr:'महादेव खड्ये यांनी ₹५,००१ UPI द्वारे भरले.', time:'2 hrs ago', timeMr:'२ तासांपूर्वी', unread:true, action:'view', createdAt:new Date(now-2*3600000).toISOString() },
  { id:3, type:'expense', title:'Expense Awaiting Approval', titleMr:'खर्च मंजुरीच्या प्रतीक्षेत', sub:'Sai Mandap House bill ₹15,000 submitted.', subMr:'साई मंडप हाऊसचे ₹१५,००० चे बिल सादर.', time:'5 hrs ago', timeMr:'५ तासांपूर्वी', unread:true, action:'review', createdAt:new Date(now-5*3600000).toISOString() },
  { id:4, type:'reminder', title:'3 Outstanding Donations', titleMr:'३ थकित वर्गणी', sub:'Total outstanding: ₹4,001 — Ganeshotsav 2026', subMr:'एकूण बाकी: ₹४,००१ — गणेशोत्सव २०२६', time:'Yesterday', timeMr:'काल', unread:false, action:'remind', createdAt:new Date(now-24*3600000).toISOString() },
  { id:5, type:'system', title:'Report Ready', titleMr:'अहवाल तयार आहे', sub:'Ganeshotsav 2026 financial report generated.', subMr:'गणेशोत्सव २०२६ चा अहवाल तयार.', time:'2 days ago', timeMr:'२ दिवसांपूर्वी', unread:false, action:'view', createdAt:new Date(now-48*3600000).toISOString() },
]

const SEED_DOCS: DocFolder[] = [
  { id:1, name:'Permissions', nameMr:'परवानग्या', icon:'📋', count:4, permission:'Admin', permissionMr:'प्रशासक', size:'2.4 MB' },
  { id:2, name:'Bills & Receipts', nameMr:'बिले आणि पावत्या', icon:'🧾', count:28, permission:'Committee', permissionMr:'समिती', size:'18.2 MB' },
  { id:3, name:'Bank Documents', nameMr:'बँक कागदपत्रे', icon:'🏦', count:6, permission:'Super Admin', permissionMr:'मुख्य प्रशासक', size:'5.1 MB' },
  { id:4, name:'Festival Photos', nameMr:'उत्सव फोटो', icon:'📸', count:142, permission:'Everyone', permissionMr:'सर्व', size:'892 MB' },
  { id:5, name:'QR Codes', nameMr:'QR कोड', icon:'⬛', count:3, permission:'Committee', permissionMr:'समिती', size:'0.3 MB' },
  { id:6, name:'Official Documents', nameMr:'अधिकृत कागदपत्रे', icon:'📄', count:9, permission:'Super Admin', permissionMr:'मुख्य प्रशासक', size:'12.8 MB' },
]

const INITIAL_STATE: AppState = {
  lang:'mr', isAuthenticated:false, currentUser:null,
  members:SEED_MEMBERS, transactions:SEED_TRANSACTIONS, festivals:SEED_FESTIVALS,
  expenses:SEED_EXPENSES, pendingCollections:SEED_PENDING,
  notifications:SEED_NOTIFICATIONS, documents:SEED_DOCS, mandal:SEED_MANDAL,
}

const STORAGE_KEY = 'sahakar_mandal_state_v2'

function nextId(arr: {id:number}[]) { return arr.length > 0 ? Math.max(...arr.map(x=>x.id))+1 : 1 }

function generateReceipt(type: 'income'|'expense') {
  const p = type==='income'?'RCP':'EXP'
  return `${p}--`
}

function relativeTime(iso: string): {en:string;mr:string} {
  const d = Date.now()-new Date(iso).getTime()
  const m = Math.floor(d/60000), h = Math.floor(d/3600000), dy = Math.floor(d/86400000)
  if(m<60) return {en:`${m} min ago`,mr:`${m} मिनिटांपूर्वी`}
  if(h<24) return {en:`${h} hrs ago`,mr:`${h} तासांपूर्वी`}
  if(dy===1) return {en:'Yesterday',mr:'काल'}
  return {en:`${dy} days ago`,mr:`${dy} दिवसांपूर्वी`}
}

export function useAppStore() {
  const [state, _setState] = useState<AppState>(()=>{
    try { const s=localStorage.getItem(STORAGE_KEY); if(s) return {...INITIAL_STATE,...JSON.parse(s)} } catch{}
    return INITIAL_STATE
  })
  useEffect(()=>{ try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{} },[state])
  const set = useCallback((fn:(p:AppState)=>AppState)=>_setState(fn),[])

  const setLang=(lang:Lang)=>set(s=>({...s,lang}))
  const login=(user:User)=>set(s=>({...s,isAuthenticated:true,currentUser:user}))
  const logout=()=>set(s=>({...s,isAuthenticated:false,currentUser:null}))
  const updateCurrentUser=(data:Partial<User>)=>set(s=>({...s,currentUser:s.currentUser?{...s.currentUser,...data}:data as User}))

  const addMember=(data:Omit<Member,'id'|'contributions'>)=>set(s=>{
    const m:Member={...data,id:nextId(s.members),contributions:0}
    const iso=new Date().toISOString();const t=relativeTime(iso)
    const n:AppNotification={id:nextId(s.notifications),type:'approval',title:`New Member: `,titleMr:`नवीन सदस्य: `,sub:`${data.name} requested to join.`,subMr:`${data.nameMr} सामील होण्यास विनंती केली.`,time:t.en,timeMr:t.mr,unread:true,action:'approve',createdAt:iso}
    return {...s,members:[...s.members,m],notifications:[n,...s.notifications]}
  })
  const updateMember=(id:number,data:Partial<Member>)=>set(s=>({...s,members:s.members.map(m=>m.id===id?{...m,...data}:m)}))
  const deleteMember=(id:number)=>set(s=>({...s,members:s.members.filter(m=>m.id!==id)}))
  const approveMember=(id:number)=>set(s=>{
    const m=s.members.find(x=>x.id===id);if(!m)return s
    const iso=new Date().toISOString();const t=relativeTime(iso)
    const n:AppNotification={id:nextId(s.notifications),type:'approval',title:`Member Approved: `,titleMr:`सदस्य मंजूर: `,sub:`${m.name} is now active.`,subMr:`${m.nameMr} आता सक्रिय आहे.`,time:t.en,timeMr:t.mr,unread:true,action:'view',createdAt:iso}
    return {...s,members:s.members.map(x=>x.id===id?{...x,status:'active' as const}:x),notifications:[n,...s.notifications]}
  })

  const addTransaction=(data:Omit<Transaction,'id'|'receipt'|'time'|'timeMr'|'createdAt'>)=>set(s=>{
    const iso=new Date().toISOString();const t=relativeTime(iso)
    const tx:Transaction={...data,id:nextId(s.transactions),receipt:generateReceipt(data.type),time:t.en,timeMr:t.mr,createdAt:iso}
    let festivals=s.festivals
    if(data.festivalId){festivals=s.festivals.map(f=>{if(f.id!==data.festivalId)return f;const inc=data.type==='income'?f.income+data.amount:f.income;const exp=data.type==='expense'?f.expense+data.amount:f.expense;return{...f,income:inc,expense:exp,balance:inc-exp,entries:f.entries+1}})}
    let members=s.members
    if(data.type==='income'&&data.memberId){members=s.members.map(m=>m.id===data.memberId?{...m,contributions:m.contributions+data.amount}:m)}
    const n:AppNotification={id:nextId(s.notifications),type:'payment',title:data.type==='income'?`Payment: ₹`:`Expense: ₹`,titleMr:data.type==='income'?`देणगी: ₹`:`खर्च: ₹`,sub:`${data.person} — `,subMr:`${data.personMr} — `,time:t.en,timeMr:t.mr,unread:true,action:'view',createdAt:iso}
    return{...s,transactions:[tx,...s.transactions],festivals,members,notifications:[n,...s.notifications]}
  })
  const updateTransaction=(id:number,data:Partial<Transaction>)=>set(s=>({...s,transactions:s.transactions.map(tx=>tx.id===id?{...tx,...data}:tx)}))

  const addExpense=(data:Omit<Expense,'id'|'createdAt'>)=>set(s=>{
    const iso=new Date().toISOString();const t=relativeTime(iso)
    const e:Expense={...data,id:nextId(s.expenses),createdAt:iso}
    let festivals=s.festivals
    if(data.festivalId&&(data.status==='approved'||data.status==='paid')){festivals=s.festivals.map(f=>{if(f.id!==data.festivalId)return f;const exp=f.expense+data.amount;return{...f,expense:exp,balance:f.income-exp}})}
    const n:AppNotification={id:nextId(s.notifications),type:'expense',title:`Expense Submitted: ₹`,titleMr:`खर्च सादर: ₹`,sub:`${data.vendor} — `,subMr:`${data.vendorMr} — `,time:t.en,timeMr:t.mr,unread:true,action:'review',createdAt:iso}
    return{...s,expenses:[e,...s.expenses],festivals,notifications:[n,...s.notifications]}
  })
  const updateExpense=(id:number,data:Partial<Expense>)=>set(s=>{
    const old=s.expenses.find(e=>e.id===id)
    const expenses=s.expenses.map(e=>e.id===id?{...e,...data}:e)
    let festivals=s.festivals
    if(old&&old.festivalId&&(data.status==='approved'||data.status==='paid')&&old.status!=='approved'&&old.status!=='paid'){festivals=s.festivals.map(f=>{if(f.id!==old.festivalId)return f;const exp=f.expense+old.amount;return{...f,expense:exp,balance:f.income-exp}})}
    return{...s,expenses,festivals}
  })
  const deleteExpense=(id:number)=>set(s=>({...s,expenses:s.expenses.filter(e=>e.id!==id)}))

  const addFestival=(data:Omit<Festival,'id'|'income'|'expense'|'balance'|'pending'|'pendingCount'|'entries'>)=>set(s=>{
    const f:Festival={...data,id:nextId(s.festivals),income:0,expense:0,balance:0,pending:0,pendingCount:0,entries:0}
    return{...s,festivals:[f,...s.festivals]}
  })
  const updateFestival=(id:number,data:Partial<Festival>)=>set(s=>({...s,festivals:s.festivals.map(f=>f.id===id?{...f,...data}:f)}))

  const addPendingCollection=(data:Omit<PendingCollection,'id'>)=>set(s=>({...s,pendingCollections:[{...data,id:nextId(s.pendingCollections)},...s.pendingCollections]}))
  const recordPendingPayment=(id:number,paid:number)=>set(s=>({...s,pendingCollections:s.pendingCollections.map(p=>{if(p.id!==id)return p;const newPaid=p.paid+paid;const outstanding=Math.max(0,p.amount-newPaid);return{...p,paid:newPaid,outstanding,last:new Date().toLocaleDateString('en-IN'),lastMr:new Date().toLocaleDateString('mr-IN')}}).filter(p=>p.outstanding>0)}))

  const markNotificationRead=(id:number)=>set(s=>({...s,notifications:s.notifications.map(n=>n.id===id?{...n,unread:false}:n)}))
  const markAllRead=()=>set(s=>({...s,notifications:s.notifications.map(n=>({...n,unread:false}))}))
  const dismissNotification=(id:number)=>set(s=>({...s,notifications:s.notifications.filter(n=>n.id!==id)}))

  const updateMandal=(data:Partial<MandalConfig>)=>set(s=>({...s,mandal:{...s.mandal,...data}}))
  const updateDocFolder=(id:number,data:Partial<DocFolder>)=>set(s=>({...s,documents:s.documents.map(d=>d.id===id?{...d,...data}:d)}))

  const resetToDefaults=()=>{localStorage.removeItem(STORAGE_KEY);_setState(INITIAL_STATE)}

  const totalIncome=state.transactions.filter(t=>t.type==='income'&&t.status==='paid').reduce((s,t)=>s+t.amount,0)
  const totalExpense=state.transactions.filter(t=>t.type==='expense'&&(t.status==='paid'||t.status==='approved')).reduce((s,t)=>s+t.amount,0)
  const currentBalance=totalIncome-totalExpense
  const unreadCount=state.notifications.filter(n=>n.unread).length
  const pendingMemberCount=state.members.filter(m=>m.status==='pending').length
  const activeMemberCount=state.members.filter(m=>m.status==='active').length
  const totalOutstanding=state.pendingCollections.reduce((s,p)=>s+p.outstanding,0)

  return {
    state, setLang, login, logout, updateCurrentUser,
    addMember, updateMember, deleteMember, approveMember,
    addTransaction, updateTransaction,
    addExpense, updateExpense, deleteExpense,
    addFestival, updateFestival,
    addPendingCollection, recordPendingPayment,
    markNotificationRead, markAllRead, dismissNotification,
    updateMandal, updateDocFolder, resetToDefaults,
    totalIncome, totalExpense, currentBalance,
    unreadCount, pendingMemberCount, activeMemberCount, totalOutstanding,
  }
}

export type AppStore = ReturnType<typeof useAppStore>
