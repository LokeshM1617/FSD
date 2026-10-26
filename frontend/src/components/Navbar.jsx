import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { connected, systemFrozen, activeAlert } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Real-time Global Push Alert Banner */}
      {activeAlert && (
        <div className={`px-4 py-2.5 text-xs text-center font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
          activeAlert.severity === "critical"
            ? "bg-rose-600 text-white animate-pulse"
            : "bg-amber-500 text-slate-950"
        }`}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>[SYSTEM BROADCAST] {activeAlert.message}</span>
          <span className="text-[10px] font-mono opacity-80">({activeAlert.timestamp || "Just now"})</span>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Milestone Badges */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition">
                  Secure<span className="text-cyan-400">Bank</span>
                </span>
              </Link>

              {/* Exp 10 CI/CD Deployment Badge */}
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">
                EXP 10: CI/CD CLOUD
              </span>

              {/* Socket & Circuit Breaker status indicators */}
              <div className="hidden lg:flex items-center gap-2 text-xs">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                  connected
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-rose-400 animate-pulse"}`}></span>
                  {connected ? "Render Socket Connected" : "Local Polling"}
                </span>

                {systemFrozen && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase animate-pulse">
                    FROZEN
                  </span>
                )}
              </div>
            </div>

            {/* Strict RBAC Links */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isActive("/") ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Overview
              </Link>

              {/* Customer Dashboard is STRICTLY visible to non-admins */}
              {user && user.role !== "admin" && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive("/dashboard") ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Customer Account
                </Link>
              )}

              {/* Admin Portal is STRICTLY visible to administrators */}
              {user && user.role === "admin" && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive("/admin")
                      ? "bg-rose-600/30 text-rose-300 border border-rose-500/40"
                      : "text-rose-400 hover:bg-rose-950/40"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Admin Control Room
                </Link>
              )}

              <Link
                to="/role-lab"
                className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isActive("/role-lab") ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                RBAC Matrix
              </Link>

              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                    <div className="text-[10px] font-mono text-cyan-400 capitalize">{user.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-300 border border-slate-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
