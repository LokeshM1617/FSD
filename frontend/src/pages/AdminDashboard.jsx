import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { API_BASE_URL } from "../config";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const { socket, systemFrozen } = useSocket();

  // Strict RBAC Guard: non-admins cannot access this view
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin restricted feature state
  const [frozen, setFrozen] = useState(systemFrozen);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastType, setBroadcastType] = useState("critical");
  const [liquidity, setLiquidity] = useState(5000000);
  const [injectAmount, setInjectAmount] = useState(250000);
  const [users, setUsers] = useState([
    { id: "usr_1", name: "Alex Mercer", email: "alex@bank.com", role: "customer", status: "active", balance: 12450.75 },
    { id: "usr_2", name: "Sarah Chen", email: "sarah@bank.com", role: "customer", status: "active", balance: 8900.0 },
    { id: "usr_3", name: "Marcus Brody", email: "marcus@bank.com", role: "customer", status: "flagged", balance: 450.0 }
  ]);
  const [auditLogs, setAuditLogs] = useState([
    { id: "log_1", action: "SYSTEM_BOOT", user: "system", timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(), details: "CI/CD deployment online via Render + Vercel." },
    { id: "log_2", action: "AUTH_LOGIN", user: "admin@bank.com", timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(), details: "Administrator control session verified." }
  ]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setFrozen(systemFrozen);
  }, [systemFrozen]);

  const addAudit = (action, details) => {
    setAuditLogs((prev) => [
      {
        id: "log_" + Date.now(),
        action,
        user: user.email,
        timestamp: new Date().toLocaleTimeString(),
        details
      },
      ...prev.slice(0, 20)
    ]);
  };

  // Feature 1: Emergency Circuit Breaker Freeze
  const handleToggleFreeze = async () => {
    const nextState = !frozen;
    setFrozen(nextState);
    if (socket) {
      socket.emit("emergencyFreeze", { frozen: nextState });
    }
    try {
      await fetch(`${API_BASE_URL}/api/users/freeze-system`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ frozen: nextState })
      });
    } catch {}

    addAudit(
      nextState ? "CIRCUIT_BREAKER_TRIGGERED" : "CIRCUIT_BREAKER_LIFTED",
      `System transactions were ${nextState ? "FROZEN" : "UNFROZEN"} by admin.`
    );
    setFeedback(`Circuit breaker is now: ${nextState ? "FROZEN" : "ACTIVE / OPERATIONAL"}`);
    setTimeout(() => setFeedback(""), 4000);
  };

  // Feature 2: Bank-Wide Emergency Broadcast
  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    if (socket) {
      socket.emit("adminBroadcast", {
        message: broadcastMsg,
        severity: broadcastType,
        sender: user.email,
        timestamp: new Date().toLocaleTimeString()
      });
    }

    addAudit("BROADCAST_TRANSMITTED", `[${broadcastType.toUpperCase()}] ${broadcastMsg}`);
    setFeedback("Broadcast dispatched to all connected clients & dashboards.");
    setBroadcastMsg("");
    setTimeout(() => setFeedback(""), 4000);
  };

  // Feature 3: Central Bank Reserve Liquidity Injection
  const handleInjectLiquidity = () => {
    const val = Number(injectAmount);
    if (!val || val <= 0) return;
    setLiquidity((prev) => prev + val);
    addAudit("LIQUIDITY_INJECTION", `Injected $${val.toLocaleString()} to central reserve vault.`);
    setFeedback(`Reserve pool updated: +$${val.toLocaleString()}`);
    setTimeout(() => setFeedback(""), 4000);
  };

  // Feature 4: User KYC Account Freezing / Status Toggle
  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "active" ? "locked" : "active";
          addAudit("USER_STATUS_CHANGE", `User ${u.email} changed to ${nextStatus}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Admin Exclusive Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">Tier: Super-Admin (Level 4)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
            SecureBank Core Banking Control Room
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted tools: Circuit Breaker, Global Socket Broadcast, Liquidity Injections, KYC Locks, and Audit Trails.
          </p>
        </div>

        {/* Global Freeze Toggle Widget */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl min-w-[280px]">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Emergency Switch</div>
          <button
            onClick={handleToggleFreeze}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg ${
              frozen
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            {frozen ? "LIFT CIRCUIT BREAKER" : "ACTIVATE EMERGENCY FREEZE"}
          </button>
          <div className="text-[11px] text-center text-slate-400 mt-2 font-mono">
            Status: <span className={frozen ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {frozen ? "ALL TRANSACTIONS LOCKED" : "TRANSACTIONS FLOWING"}
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid: Feature 2 (Broadcast) & Feature 3 (Liquidity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature 2: Bank-Wide Emergency Broadcast */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </span>
              Real-Time Push Broadcast
            </h2>
            <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
              WebSocket Channel
            </span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Announcement Message
              </label>
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="e.g. System maintenance scheduled at 02:00 UTC / Urgent security advisory..."
                rows="3"
                required
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Severity:</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value)}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="critical">Critical / Alert</option>
                  <option value="warning">Warning</option>
                  <option value="info">Information</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-md transition"
              >
                Dispatch Broadcast &rarr;
              </button>
            </div>
          </form>
        </div>

        {/* Feature 3: Central Bank Reserve Liquidity Injection */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Central Liquidity Reserve
              </h2>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                Tier-1 Capital
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-4">
              <div className="text-xs text-slate-400 font-mono uppercase">Total Reserve Liquidity</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-1">
                ${liquidity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Collateralized against federal wire system.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              step="50000"
              value={injectAmount}
              onChange={(e) => setInjectAmount(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleInjectLiquidity}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-md transition whitespace-nowrap"
            >
              + Inject Liquidity
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Feature 4 (KYC Account Lock) & Feature 5 (Audit Log Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature 4: KYC Account Lock & User Management */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              User Accounts &amp; KYC Enforcement
            </h2>
            <span className="text-[10px] font-mono text-slate-400">{users.length} Active Records</span>
          </div>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between hover:border-slate-600 transition"
              >
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    {u.name}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {u.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{u.email} &bull; Bal: ${u.balance.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      u.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {u.status}
                  </span>
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-[11px] text-white transition"
                  >
                    {u.status === "active" ? "Freeze Account" : "Unfreeze"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 5: Real-Time Audit Log Ledger */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              Administrative Security Audit Trail
            </h2>
            <span className="text-[10px] font-mono text-emerald-400">Live Recording</span>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto font-mono text-xs pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/40 text-slate-300 flex items-start justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-cyan-400">{log.action}: </span>
                  <span className="text-slate-300">{log.details}</span>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
