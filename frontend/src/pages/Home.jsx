import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { API_BASE_URL } from "../config";

export default function Home() {
  const { user } = useAuth();
  const { connected, systemFrozen } = useSocket();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Header with CI/CD Cloud Focus */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            EXPERIMENT 10: CI/CD DEPLOYMENT WITH GITHUB ACTIONS + RENDER / VERCEL
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            SecureBank <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Continuous Cloud Architecture</span>
          </h1>
          <p className="text-slate-300 max-w-2xl text-base md:text-lg leading-relaxed">
            The complete cumulative banking platform fully integrated from Experiments 1 through 9, prepared for 
            automated <strong>GitHub Actions CI</strong> validation, <strong>Vercel</strong> frontend hosting, and <strong>Render</strong> cloud backend deployment.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {user ? (
              user.role === "admin" ? (
                <Link
                  to="/admin"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-semibold shadow-lg hover:shadow-rose-500/25 transition transform hover:-translate-y-0.5"
                >
                  Open Admin Command Center &rarr;
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
                >
                  Access Customer Dashboard &rarr;
                </Link>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
                >
                  Log In to Banking Portal &rarr;
                </Link>
                <Link
                  to="/role-lab"
                  className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition"
                >
                  Inspect RBAC Matrix &rarr;
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CI/CD & Cloud Pipeline Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono">Frontend Host</div>
            <div className="text-sm font-semibold text-slate-200">Vercel (Vite/React)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono">Backend Host</div>
            <div className="text-sm font-semibold text-slate-200">Render Cloud Web Service</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono">CI Automation</div>
            <div className="text-sm font-semibold text-slate-200">GitHub Actions ci.yml</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${systemFrozen ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono">Circuit Breaker</div>
            <div className={`text-sm font-semibold ${systemFrozen ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}>
              {systemFrozen ? "EMERGENCY FROZEN" : "Operational (Normal)"}
            </div>
          </div>
        </div>
      </div>

      {/* Cloud CI/CD Deployment Flow (Step-by-step matching PDF) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
          <span>Continuous Integration &amp; Deployment Pipeline Flow</span>
          <span className="text-xs font-mono text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
            Exp 10 Lab Workflow
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="text-xs font-mono text-cyan-400 font-bold mb-1">Step 1: Local Code &amp; Git</div>
            <div className="text-sm font-semibold text-white mb-1">Push to GitHub</div>
            <p className="text-xs text-slate-400">
              Commit code changes and push to <code className="text-slate-300">main</code> branch on GitHub.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="text-xs font-mono text-purple-400 font-bold mb-1">Step 2: CI Automated Checks</div>
            <div className="text-sm font-semibold text-white mb-1">GitHub Actions</div>
            <p className="text-xs text-slate-400">
              Runs <code className="text-slate-300">ci.yml</code>: executes frontend <code className="text-slate-300">npm run build</code> and backend start script validation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="text-xs font-mono text-emerald-400 font-bold mb-1">Step 3: Backend Deploy</div>
            <div className="text-sm font-semibold text-white mb-1">Render Cloud API</div>
            <p className="text-xs text-slate-400">
              Deploys Express server with environment variables and exposes public HTTPS endpoint.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="text-xs font-mono text-indigo-400 font-bold mb-1">Step 4: Frontend Deploy</div>
            <div className="text-sm font-semibold text-white mb-1">Vercel Edge Hosting</div>
            <p className="text-xs text-slate-400">
              Builds Vite React bundle with <code className="text-slate-300">VITE_API_URL</code> pointed to Render API.
            </p>
          </div>
        </div>

        {/* Live Config Summary */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs font-mono flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <span className="text-slate-400">Current Client Connected API: </span>
            <span className="text-cyan-400 font-bold">{API_BASE_URL}</span>
          </div>
          <div className="text-slate-400">
            WebSocket Status: <span className={connected ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{connected ? "Synchronized" : "Reconnecting"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
