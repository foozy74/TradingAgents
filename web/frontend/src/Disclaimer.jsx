import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Mail } from 'lucide-react';

const DisclaimerPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] selection:bg-[var(--teal)]/30">
      <div className="grid-bg"></div>
      
      <main className="max-w-[1000px] mx-auto pb-20">
        <header className="app-header !bg-transparent !border-b-0 px-0">
          <div className="header-left">
            <div className="flex items-center gap-4">
              <ShieldAlert size={32} className="text-blue" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight uppercase">Legal Disclaimer</h1>
                <p className="text-[10px] text-text-faint uppercase tracking-widest mt-1">thesolution.at // Intelligence Framework</p>
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

        <section className="terminal-box mt-8" data-title="LEGAL_FRAMEWORK">
          <div className="space-y-8 p-4">
            <p className="text-sm italic text-text-dim leading-relaxed">
              The Organization provides research and analysis aimed at advancing trading excellence through AI-powered market intelligence, advanced reasoning, and autonomous agents. This disclaimer governs the use of all information and materials (“Research”) produced by the Organization. By accessing or using the Research, you agree to the following terms:
            </p>

            <div className="space-y-8 mt-10">
              <div>
                <h3 className="text-teal text-[10px] uppercase tracking-widest font-black mb-2">01 // Educational and Research Purposes Only</h3>
                <p className="text-sm text-text-dim leading-relaxed">The Research is provided solely for educational and research purposes. It offers general information and insights into AI applications in trading and market intelligence. It is not intended as financial, investment, or trading advice, nor does it constitute a recommendation to buy, sell, or hold any financial instruments. Users should not rely on the Research for financial decision-making.</p>
              </div>

              <div>
                <h3 className="text-teal text-[10px] uppercase tracking-widest font-black mb-2">02 // No Warranties or Guarantees</h3>
                <p className="text-sm text-text-dim leading-relaxed">The Organization makes no representations or warranties, express or implied, about the accuracy, completeness, reliability, or timeliness of the Research. This includes any implied warranties of merchantability, fitness for a particular purpose, or non-infringement. The Research is provided “as is,” and users accept all associated risks.</p>
              </div>

              <div>
                <h3 className="text-teal text-[10px] uppercase tracking-widest font-black mb-2">03 // Past Performance Not Indicative of Future Results</h3>
                <p className="text-sm text-text-dim leading-relaxed">Any historical data, backtesting results, or performance metrics in the Research are for illustrative purposes only. Past performance is not a guarantee or predictor of future outcomes. Market conditions and other variables can change, and users should not assume historical data reflects future results.</p>
              </div>

              <div>
                <h3 className="text-teal text-[10px] uppercase tracking-widest font-black mb-2">04 // Risk of Financial Loss</h3>
                <p className="text-sm text-text-dim leading-relaxed">Trading and investment activities carry a high risk of financial loss. The Organization is not responsible or liable for any losses, damages, or adverse outcomes resulting from the use of the Research. Users bear full responsibility for their trading and investment decisions.</p>
              </div>

              <div>
                <h3 className="text-teal text-[10px] uppercase tracking-widest font-black mb-2">05 // Consult a Qualified Financial Advisor</h3>
                <p className="text-sm text-text-dim leading-relaxed">Users are strongly encouraged to consult a qualified financial advisor, broker, or other professional before making investment or trading decisions. The Research does not account for individual financial situations, risk tolerance, or goals and is not a substitute for personalized advice.</p>
              </div>

              <div>
                <h3 className="text-teal text-[10px] uppercase tracking-widest font-black mb-2">06 // Limitations of AI and Autonomous Agents</h3>
                <p className="text-sm text-text-dim leading-relaxed">The Research leverages AI-powered tools, advanced reasoning, and autonomous agents, which rely on historical data, algorithms, and probabilistic models. These tools have limitations, including:</p>
                <ul className="list-disc pl-5 mt-4 text-sm text-text-dim space-y-2 font-mono">
                  <li>Dependence on historical data, which may not reflect future conditions or unexpected events.</li>
                  <li>Potential errors in data processing, model assumptions, or algorithmic outputs.</li>
                  <li>Inability to predict sudden market changes, geopolitical events, or other external factors.</li>
                </ul>
                <p className="text-sm text-text-dim mt-4 leading-relaxed">Users should recognize that AI-driven insights are not infallible and may be inaccurate or incomplete, especially in volatile markets.</p>
              </div>

              <div className="glass p-6 rounded-2xl border border-blue/20">
                <h3 className="text-blue text-[10px] uppercase tracking-widest font-black mb-2">07 // User Acknowledgment</h3>
                <p className="text-sm text-text-dim leading-relaxed">By accessing or using the Research, you confirm that you have read, understood, and agreed to this disclaimer. You also acknowledge that the Organization, its affiliates, and contributors are not liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Research.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-text-faint hover:text-teal transition-colors cursor-pointer group">
            <Mail size={14} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-black tracking-widest">[email protected]</span>
          </div>
          <p className="text-[9px] text-text-faint uppercase tracking-widest font-mono">Protocol_Version: 2.4.0 // Effective: 2026-04-03</p>
        </footer>
      </main>
    </div>
  );
};

export default DisclaimerPage;
