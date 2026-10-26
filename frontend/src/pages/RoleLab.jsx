import React from "react";
import { useAuth } from "../context/AuthContext";

export default function RoleLab() {
  const { user, quickLoginAs } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mb-3">
          RBAC Security Verification Lab
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Role-Based Access Control &amp; Token Inspector
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl">
          Test permission enforcement between Customer and Admin roles in real-time. Verify how JWT claims, route guards, and UI components adapt dynamically.
        </p>

        {/* Current Identity Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Current Session Context</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {user ? (
                <span>
                  {user.name} <span className="text-slate-400 text-sm font-normal">({user.email})</span>
                </span>
              ) : (
                <span className="text-slate-500">Unauthenticated Anonymous Visitor</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => quickLoginAs("customer")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                user?.role === "customer"
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Switch to Customer
            </button>
            <button
              onClick={() => quickLoginAs("admin")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                user?.role === "admin"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Switch to Admin
            </button>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8">
        <h2 className="text-lg font-bold text-white mb-4">RBAC Permission Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-4">Feature / Action</th>
                <th className="py-3 px-4">Customer Role</th>
                <th className="py-3 px-4">Super Admin Role</th>
                <th className="py-3 px-4">Your Effective Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-medium text-white">View Personal Balance &amp; Ledger</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">&#10003; Granted</td>
                <td className="py-3 px-4 text-slate-400">Restricted (Admin view)</td>
                <td className="py-3 px-4">
                  {user?.role === "customer" ? (
                    <span className="text-emerald-400 font-semibold">&#10003; Allowed</span>
                  ) : (
                    <span className="text-slate-500">&#8212; Redirected</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Execute Fund Wire Transfer</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">&#10003; Granted</td>
                <td className="py-3 px-4 text-slate-500">&#10007; Denied (Control room only)</td>
                <td className="py-3 px-4">
                  {user?.role === "customer" ? (
                    <span className="text-emerald-400 font-semibold">&#10003; Allowed</span>
                  ) : (
                    <span className="text-slate-500">&#8212; Blocked</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Trigger Emergency Circuit Breaker Freeze</td>
                <td className="py-3 px-4 text-rose-400 font-bold">&#10007; Denied (403 Forbidden)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">&#10003; Granted (Exclusive)</td>
                <td className="py-3 px-4">
                  {user?.role === "admin" ? (
                    <span className="text-emerald-400 font-semibold">&#10003; Full Control</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">&#10007; 403 Forbidden</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Real-Time Global System Broadcast</td>
                <td className="py-3 px-4 text-rose-400 font-bold">&#10007; Denied (403 Forbidden)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">&#10003; Granted (Exclusive)</td>
                <td className="py-3 px-4">
                  {user?.role === "admin" ? (
                    <span className="text-emerald-400 font-semibold">&#10003; Full Control</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">&#10007; 403 Forbidden</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Central Liquidity Injection ($5M Reserve)</td>
                <td className="py-3 px-4 text-rose-400 font-bold">&#10007; Denied (403 Forbidden)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">&#10003; Granted (Exclusive)</td>
                <td className="py-3 px-4">
                  {user?.role === "admin" ? (
                    <span className="text-emerald-400 font-semibold">&#10003; Full Control</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">&#10007; 403 Forbidden</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Audit Trail &amp; KYC Account Locking</td>
                <td className="py-3 px-4 text-rose-400 font-bold">&#10007; Denied (403 Forbidden)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">&#10003; Granted (Exclusive)</td>
                <td className="py-3 px-4">
                  {user?.role === "admin" ? (
                    <span className="text-emerald-400 font-semibold">&#10003; Full Control</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">&#10007; 403 Forbidden</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
