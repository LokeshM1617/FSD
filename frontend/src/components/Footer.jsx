import React from "react";
import { API_BASE_URL } from "../config";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-slate-400">SecureBank Cloud</span> &bull; EXP NO. 10 CI/CD Deployment with GitHub Actions + Render/Vercel
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="text-cyan-400">Target Backend: {API_BASE_URL}</span>
          <span className="text-purple-400">Vercel: Frontend</span>
          <span className="text-emerald-400">Render: Backend</span>
        </div>
      </div>
    </footer>
  );
}
