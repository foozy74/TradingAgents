import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Cpu, ShieldCheck, Terminal, Download, Key } from 'lucide-react';

const FrameworkPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] selection:bg-[var(--teal)]/30">
      <div className="grid-bg"></div>
      
      <main className="max-w-[1000px] mx-auto pb-20">
        <header className="app-header !bg-transparent !border-b-0 px-0">
          <div className="header-left">
            <div className="flex items-center gap-4">
              <BookOpen size={32} className="text-teal" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight uppercase">Framework Info</h1>
                <p className="text-[10px] text-text-faint uppercase tracking-widest mt-1">thesolution.at // Technical Documentation</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button 
              onClick={() => window.history.back()}
              className="btn btn-primary !h-10"
            >
              <ArrowLeft size={14} /> 
              <span>BACK_TO_DASHBOARD</span>
            </button>
          </div>
        </header>

        <section className="space-y-12 mt-8">
          <div className="terminal-box" data-title="SYSTEM_OVERVIEW">
            <div className="space-y-6 p-4">
              <h2 className="text-2xl font-bold text-teal flex items-center gap-3">
                <Cpu size={24} /> TradingAgents Framework
              </h2>
              <p className="text-lg text-text-dim leading-relaxed">
                TradingAgents ist ein Multi-Agenten-Handelsframework, das die Dynamik realer Handelsunternehmen abbildet. Durch den Einsatz spezialisierter, LLM-basierter Agenten bewertet die Plattform Marktbedingungen gemeinsam und trifft Handelsentscheidungen.
              </p>

              <div className="glass p-6 rounded-2xl border border-blue/20 italic text-sm text-text-dim">
                Das TradingAgents-Framework ist für Forschungszwecke konzipiert. Die Handelsperformance kann je nach verschiedenen Faktoren variieren. Es ist nicht als finanzielle, investitions- oder handelsbezogene Beratung gedacht.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div className="space-y-4">
                  <h4 className="text-blue text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue"></div>
                    Analysten-Team
                  </h4>
                  <ul className="space-y-3 text-sm text-text-dim font-mono">
                    <li className="flex gap-2"><span className="text-teal">{'>>'}</span> <span>Fundamentalanalyst: Identifiziert innere Werte und potenzielle Warnsignale.</span></li>
                    <li className="flex gap-2"><span className="text-teal">{'>>'}</span> <span>Stimmungsanalyst: Analysiert soziale Medien und öffentliche Stimmung.</span></li>
                    <li className="flex gap-2"><span className="text-teal">{'>>'}</span> <span>Nachrichtenanalyst: Überwacht globale News und makroökonomische Indikatoren.</span></li>
                    <li className="flex gap-2"><span className="text-teal">{'>>'}</span> <span>Technischer Analyst: Nutzt Indikatoren wie MACD und RSI für Mustererkennung.</span></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-purple text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple"></div>
                    Entscheidungs-Ebene
                  </h4>
                  <ul className="space-y-3 text-sm text-text-dim font-mono">
                    <li className="flex gap-2"><span className="text-purple">{'>>'}</span> <span>Forschungsteam: Strukturierte Debatten zwischen Bullen und Bären.</span></li>
                    <li className="flex gap-2"><span className="text-purple">{'>>'}</span> <span>Trader Agent: Bestimmt Zeitpunkt und Ausmaß von Trades.</span></li>
                    <li className="flex gap-2"><span className="text-purple">{'>>'}</span> <span>Risk Management: Kontinuierliche Bewertung von Volatilität und Liquidität.</span></li>
                    <li className="flex gap-2"><span className="text-purple">{'>>'}</span> <span>Portfolio Manager: Finale Freigabe oder Ablehnung von Transaktionen.</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-white/5 flex justify-center">
          <p className="text-[9px] text-text-faint uppercase tracking-widest font-mono">
            © 2026 thesolution.at // Open Source Analysis Framework // v2.4.0
          </p>
        </footer>
      </main>
    </div>
  );
};

export default FrameworkPage;
