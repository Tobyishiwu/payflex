import React, { useState } from 'react';

export default function App() {
  // --- 1. STATE MANAGEMENT ---
  const [wallet, setWallet] = useState({
    balance: 450000.00,
    bonusPoints: 2450
  });

  const [transactions, setTransactions] = useState([
    { id: 'tx-1', service: 'Airtel Airtime', amount: 2000, type: 'debit', date: 'Today, 2:30 PM', status: 'Success' },
    { id: 'tx-2', service: 'IKEDC Prepaid Token', amount: 15000, type: 'debit', date: 'Yesterday, 11:15 AM', status: 'Success' },
    { id: 'tx-3', service: 'Wallet Funding', amount: 50000, type: 'credit', date: 'May 20, 2026', status: 'Success' },
    { id: 'tx-4', service: 'DSTV Premium', amount: 29500, type: 'debit', date: 'May 18, 2026', status: 'Success' }
  ]);

  const [activeModalFlow, setActiveModalFlow] = useState(null); // 'Airtime' | 'Data' | 'Electricity' | 'Cable' | null
  const [formData, setFormData] = useState({ phone: '', provider: '', amount: '', meterNumber: '', smartCard: '' });
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', message: '' }

  // --- 2. NOTIFICATION ENGINE HELPER ---
  const triggerNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- 3. VALIDATION & TRANSACTION PROCESSING ---
  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    // Universal Form Validation
    if (['Airtime', 'Data'].includes(activeModalFlow) && !formData.phone) {
      return triggerNotification('error', 'Please enter a valid recipient phone number.');
    }
    if (activeModalFlow === 'Electricity' && !formData.meterNumber) {
      return triggerNotification('error', 'Please enter a valid 11-digit Meter Number.');
    }
    if (activeModalFlow === 'Cable' && !formData.smartCard) {
      return triggerNotification('error', 'Please enter a valid SmartCard/IUC number.');
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return triggerNotification('error', 'Please specify a valid payment amount.');
    }

    const paymentAmount = parseFloat(formData.amount);

    // Balance Check
    if (paymentAmount > wallet.balance) {
      return triggerNotification('error', 'Transaction Declined: Insufficient wallet balance.');
    }

    // Deduct Balance & Append to Transaction History
    setWallet(prev => ({ ...prev, balance: prev.balance - paymentAmount }));
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        service: `${formData.provider || 'Utility'} ${activeModalFlow}`,
        amount: paymentAmount,
        type: 'debit',
        date: 'Just Now',
        status: 'Success'
      },
      ...prev
    ]);

    triggerNotification('success', `${activeModalFlow} purchase of ₦${paymentAmount.toLocaleString()} completed successfully!`);
    closeModal();
  };

  const closeModal = () => {
    setActiveModalFlow(null);
    setFormData({ phone: '', provider: '', amount: '', meterNumber: '', smartCard: '' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative antialiased">
      
      {/* GLOBAL NOTIFICATION SYSTEM BANNER */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 animate-bounce ${
          notification.type === 'success' 
            ? 'bg-emerald-950 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-950 border-rose-500/30 text-rose-400'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${notification.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <p className="text-sm font-semibold tracking-wide">{notification.message}</p>
        </div>
      )}

      {/* DASHBOARD NAVBAR CONTAINER */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-lg shadow-md tracking-wider">P</div>
          <span className="text-xl font-black tracking-tight text-white">Pay<span className="text-blue-500">Flex</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/60">Production Sandbox</span>
          <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-sm">TI</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* PREMIUM ACCOUNT SUMMARY CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-800 to-slate-800/80 border border-slate-700/70 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-48 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all duration-500" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Cash Balance</p>
                <h2 className="text-4xl font-extrabold tracking-tight text-white mt-1">₦{wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <span className="text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md tracking-widest">VISA PLATINUM</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono tracking-widest">
              <span>•••• •••• •••• 4892</span>
              <span className="font-sans font-medium text-slate-500">Tobias Ishiwu</span>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700/70 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-48">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Flex Reward Points</p>
              <h3 className="text-3xl font-bold text-amber-400 mt-2">{wallet.bonusPoints.toLocaleString()} <span className="text-sm font-normal text-slate-500">PTS</span></h3>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs p-3 rounded-xl font-medium">
              🔥 You earn 1% cashback points on all your utilities renewals and data purchases.
            </div>
          </div>
        </section>

        {/* QUICK SERVICE PORTAL HUB */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-white">Utility Ecosystem Integrations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'Airtime', icon: '📱', desc: 'VTU Recharge', color: 'hover:border-blue-500/50' },
              { id: 'Data', icon: '🌐', desc: 'Internet Bundles', color: 'hover:border-indigo-500/50' },
              { id: 'Electricity', icon: '⚡', desc: 'Prepaid Tokens', color: 'hover:border-amber-500/50' },
              { id: 'Cable', icon: '📺', desc: 'TV Subscriptions', color: 'hover:border-purple-500/50' }
            ].map(flow => (
              <button
                key={flow.id}
                onClick={() => setActiveModalFlow(flow.id)}
                className={`bg-slate-800 border border-slate-700/50 p-5 rounded-xl text-left transition duration-200 shadow-md group ${flow.color}`}
              >
                <span className="text-3xl block mb-2 transform group-hover:scale-110 transition duration-200">{flow.icon}</span>
                <h4 className="font-bold text-slate-200 text-sm group-hover:text-white">{flow.id} Portal</h4>
                <p className="text-xs text-slate-400 mt-0.5">{flow.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* TRANSACTION LEDGER */}
        <section className="bg-slate-800 border border-slate-700/60 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/50">
            <h3 className="text-base font-bold text-white tracking-tight">Recent Activity Ledger</h3>
            <span className="text-xs text-slate-400 font-medium">Live sync tracking operational</span>
          </div>
          <div className="divide-y divide-slate-700/40">
            {transactions.map(tx => (
              <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/20 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                    tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {tx.type === 'credit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{tx.service}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-mono text-sm font-extrabold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] uppercase font-bold text-emerald-400/80 tracking-widest">{tx.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* DYNAMIC MORPHING MODAL INTERFACE */}
      {activeModalFlow && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-slate-700/60 bg-slate-800/40 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Setup {activeModalFlow} Renewal</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white text-xl p-1 font-mono transition">×</button>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              
              {/* MORPHING FIELDS CONDITIONAL LOGIC */}
              {['Airtime', 'Data'].includes(activeModalFlow) && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Network Operator</label>
                    <select
                      required
                      value={formData.provider}
                      onChange={e => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="">Select network...</option>
                      <option value="MTN Nigeria">MTN Nigeria</option>
                      <option value="Airtel">Airtel Africa</option>
                      <option value="Glo">Glo Mobile</option>
                      <option value="9mobile">9mobile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g., 08030000000"
                      value={formData.phone}
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </>
              )}

              {activeModalFlow === 'Electricity' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Distribution Company (Disco)</label>
                    <select
                      required
                      value={formData.provider}
                      onChange={e => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="">Select disco area...</option>
                      <option value="AEDC (Abuja)">AEDC (Abuja)</option>
                      <option value="EKEDC (Eko)">EKEDC (Eko)</option>
                      <option value="IKEDC (Ikeja)">IKEDC (Ikeja)</option>
                      <option value="KEDCO (Kano)">KEDCO (Kano)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Prepaid Meter Number</label>
                    <input
                      type="text"
                      placeholder="Enter 11-digit meter ID"
                      value={formData.meterNumber}
                      onChange={e => setFormData(prev => ({ ...prev, meterNumber: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </>
              )}

              {activeModalFlow === 'Cable' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Service Provider</label>
                    <select
                      required
                      value={formData.provider}
                      onChange={e => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="">Select bouquet...</option>
                      <option value="DSTV Premium">DSTV Africa</option>
                      <option value="GOTV Max">GOTV Nigeria</option>
                      <option value="StarTimes">StarTimes Bouquet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">SmartCard / IUC Number</label>
                    <input
                      type="text"
                      placeholder="Enter device number"
                      value={formData.smartCard}
                      onChange={e => setFormData(prev => ({ ...prev, smartCard: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </>
              )}

              {/* UNIVERSAL REUSABLE AMOUNT FIELD */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Transaction Amount (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 font-mono rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* ACTION FOOTER */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-3 rounded-xl text-sm transition"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/20"
                >
                  Authorize Securely
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}