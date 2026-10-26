import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { API_BASE_URL } from "../config";

export default function UserDashboard() {
  const { user, token } = useAuth();
  const { systemFrozen } = useSocket();

  // Strict RBAC Guard: If admin visits, redirect them to admin control room
  if (user && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const [balance, setBalance] = useState(12450.75);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Transfer");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch {
      // In-memory fallback
      setTransactions([
        {
          _id: "tx-1",
          type: "Transfer",
          amount: 250,
          recipient: "sarah@bank.com",
          description: "Cloud Server Subscription",
          createdAt: new Date().toISOString(),
          status: "completed"
        },
        {
          _id: "tx-2",
          type: "Deposit",
          amount: 1500,
          recipient: "Payroll",
          description: "Bi-weekly direct deposit",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: "completed"
        }
      ]);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSendMoney = async (e) => {
    e.preventDefault();
    if (systemFrozen) {
      setMsg({
        text: "TRANSACTION BLOCKED: Administrator has triggered emergency circuit breaker freeze.",
        type: "error"
      });
      return;
    }

    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setMsg({ text: "Please enter a valid transfer amount.", type: "error" });
      return;
    }
    if (val > balance) {
      setMsg({ text: "Insufficient funds in your account.", type: "error" });
      return;
    }

    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient,
          amount: val,
          category,
          description: description || "Direct Wire Transfer"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Transaction rejected by core banking engine.");
      }

      setBalance((b) => b - val);
      setRecipient("");
      setAmount("");
      setDescription("");
      setMsg({ text: `Successfully transferred $${val.toFixed(2)} to ${recipient}!`, type: "success" });
      fetchTransactions();
    } catch (err) {
      setMsg({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* EMERGENCY CIRCUIT BREAKER ALERT BANNER */}
      {systemFrozen && (
        <div className="p-5 rounded-2xl bg-rose-950/80 border-2 border-rose-500 shadow-2xl flex items-center gap-4 animate-pulse">
          <div className="p-3 rounded-xl bg-rose-600 text-white flex-shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-rose-200 uppercase tracking-wide">
              EMERGENCY CIRCUIT BREAKER ACTIVATED
            </h3>
            <p className="text-xs text-rose-300">
              The banking ledger has been placed into frozen state by administrative security. All outgoing transfers and payments are temporarily suspended to protect depositor assets.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            LEDGER LOCKED
          </span>
        </div>
      )}

      {/* Account Overview Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              CUSTOMER ACCOUNT
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {user?.id || "USR-9921"}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name || "Customer"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Primary Checking: <span className="font-mono text-slate-300">•••• •••• •••• 4092</span> (Routing: 021000089)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/60 shadow-lg min-w-[240px]">
          <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Available Balance</div>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-1">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            FDIC Insured Up To $250,000
          </div>
        </div>
      </div>

      {/* Main Grid: Send Money Form + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Send Money Form */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Quick Transfer
            </h2>
            <span className="text-xs font-mono text-slate-400">P2P Wire</span>
          </div>

          {msg.text && (
            <div className={`p-3 rounded-xl mb-4 text-xs font-medium border ${
              msg.type === "error" ? "bg-rose-500/10 border-rose-500/30 text-rose-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSendMoney} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Recipient Email or Account
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. sarah@bank.com"
                required
                disabled={systemFrozen || loading}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={systemFrozen || loading}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={systemFrozen || loading}
                  className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                >
                  <option value="Transfer">Transfer</option>
                  <option value="Payment">Payment</option>
                  <option value="Invoice">Invoice</option>
                  <option value="Escrow">Escrow</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Memo / Note
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional transaction memo"
                disabled={systemFrozen || loading}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={systemFrozen || loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white text-sm shadow-lg transition flex items-center justify-center gap-2 ${
                systemFrozen
                  ? "bg-slate-700/60 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20"
              }`}
            >
              {systemFrozen ? (
                <>
                  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Transactions Frozen by Admin
                </>
              ) : loading ? (
                "Processing Wire via Render API..."
              ) : (
                "Authorize Transfer &rarr;"
              )}
            </button>
          </form>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ledger Activity
              </h2>
              <button
                onClick={fetchTransactions}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <span>&#8635; Refresh</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No transaction records found on the ledger.
                </div>
              ) : (
                transactions.map((tx, idx) => (
                  <div
                    key={tx._id || idx}
                    className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between hover:border-slate-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tx.type === "Deposit" ? "bg-emerald-500/10 text-emerald-400" : "bg-cyan-500/10 text-cyan-400"}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tx.type === "Deposit" ? "M19 14l-7 7m0 0l-7-7m7 7V3" : "M5 10l7-7m0 0l7 7m-7-7v18"} />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {tx.recipient || tx.sender || "Authorized User"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {tx.description || tx.type} &bull; {new Date(tx.createdAt || Date.now()).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-bold font-mono ${tx.type === "Deposit" ? "text-emerald-400" : "text-slate-200"}`}>
                        {tx.type === "Deposit" ? "+" : "-"}${Number(tx.amount || 0).toFixed(2)}
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300">
                        {tx.status || "confirmed"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Synchronized via Render WebSocket</span>
            <span className="text-emerald-400">Endpoint Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
