import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableVirtuoso } from 'react-virtuoso';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Terminal as TerminalIcon,
  BarChart3,
  Globe,
  MessageSquare,
  ShieldCheck,
  Briefcase,
  Play,
  XCircle,
  RotateCcw,
  Loader2,
  AlertTriangle,
  ChevronRight,
  Monitor,
  CheckCircle2,
  Circle,
  Clock,
  ArrowLeft
} from 'lucide-react';



const SignalBadge = ({ signal }) => {
  if (!signal) return <span className="text-[8px] text-slate-700 italic opacity-30">—</span>;

  const configs = {
    BUY: { color: '#22c55e', className: 'border-[#22c55e]/30 bg-[#22c55e]/5 shadow-[0_0_10px_rgba(34,197,94,0.1)]' },
    HOLD: { color: '#f97316', className: 'border-[#f97316]/30 bg-[#f97316]/5' },
    SELL: { color: '#ef4444', className: 'border-[#ef4444]/30 bg-[#ef4444]/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]' },
    DONE: { color: '#94a3b8', className: 'border-slate-500/20 bg-slate-500/5' }
  };

  const cleanSignal = signal.toUpperCase().trim();
  const current = configs[cleanSignal] || { color: '#94a3b8', className: 'border-slate-500/20' };

  return (
    <div
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest transition-all duration-500 ${current.className}`}
      style={{ color: current.color }}
    >
      {cleanSignal}
    </div>
  );
};

const AnalystRecommendationGauge = ({ data }) => {
  if (!data) return null;

  const { recommendation, mean_score, total_analysts, counts } = data;

  // Mapping 1.0-5.0 to 90 to -90 degrees for a full 180-degree semicircle
  const rotation = 90 - ((mean_score - 1) * 45);

  const getRecommendationColor = (score) => {
    if (score <= 1.5) return '#22c55e'; // Strong Buy
    if (score <= 2.5) return '#10b981'; // Buy
    if (score <= 3.5) return '#eab308'; // Hold
    if (score <= 4.5) return '#f97316'; // Sell
    return '#ef4444'; // Strong Sell
  };

  const recColor = getRecommendationColor(mean_score);

  const rows = [
    { label: 'Strong Buy', count: counts.strongBuy, color: '#22c55e' },
    { label: 'Buy', count: counts.buy, color: '#10b981' },
    { label: 'Hold', count: counts.hold, color: '#eab308' },
    { label: 'Sell', count: counts.sell, color: '#f97316' },
    { label: 'Strong Sell', count: counts.strongSell, color: '#ef4444' }
  ];

  return (
    <section className="terminal-box" data-title="Analyst Consensus" style={{ flex: 3, minWidth: '320px' }}>
      <div className="flex flex-col items-center py-4 px-2 h-full">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Analyst Recommendations</h3>

        <div className="text-2xl font-black mb-1" style={{ color: recColor }}>
          {recommendation === 'STRONG_BUY' ? 'Strong Buy' :
            recommendation === 'BUY' ? 'Buy' :
              recommendation === 'HOLD' ? 'Hold' :
                recommendation === 'SELL' ? 'Sell' :
                  recommendation === 'STRONG_SELL' ? 'Strong Sell' : 'Neutral'}
        </div>

        <div className="text-[9px] text-slate-500 font-bold mb-8 uppercase tracking-widest">
          Based on {total_analysts} Analysts
        </div>

        {/* Speedometer Gauge - Mathematically Fixed Semi-Circle */}
        <div className="relative w-full max-w-[260px] mb-6" style={{ aspectRatio: '100 / 70' }}>
          <svg viewBox="0 0 100 70" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
            {/* Background Arc - Precise 180 deg (Radius 40, Center 50,55) */}
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Colored Segments - Mathematically exact points on r=40 arc centered at 50,55 */}
            <path d="M 10 55 A 40 40 0 0 1 17.6 31.5" fill="none" stroke="#ef4444" strokeWidth="8" />
            <path d="M 17.6 31.5 A 40 40 0 0 1 37.6 17.0" fill="none" stroke="#f97316" strokeWidth="8" />
            <path d="M 37.6 17.0 A 40 40 0 0 1 62.4 17.0" fill="none" stroke="#eab308" strokeWidth="8" />
            <path d="M 62.4 17.0 A 40 40 0 0 1 82.4 31.5" fill="none" stroke="#10b981" strokeWidth="8" />
            <path d="M 82.4 31.5 A 40 40 0 0 1 90 55" fill="none" stroke="#22c55e" strokeWidth="8" />

            {/* Center Pin Shadow */}
            <circle cx="50" cy="55" r="3" fill="#0f172a" />

            {/* Needle - Precise rotation around 50,55 */}
            <g transform={`rotate(${rotation}, 50, 55)`}>
              <path d="M 50 55 L 48.5 55 L 50 17 L 51.5 55 Z" fill="white" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }} />
              <circle cx="50" cy="55" r="5" fill="white" />
              <circle cx="50" cy="55" r="2" fill="#0f172a" />
            </g>

            {/* Labels - Positioned outside the stroke area to avoid overlap */}
            <text x="10" y="68" fontSize="5" fill="#64748b" textAnchor="middle" className="font-bold font-display">SELL</text>
            <text x="50" y="8" fontSize="5" fill="#64748b" textAnchor="middle" className="font-bold font-display">HOLD</text>
            <text x="90" y="68" fontSize="5" fill="#64748b" textAnchor="middle" className="font-bold font-display">BUY</text>
          </svg>
        </div>

        {/* Distribution Bars */}
        <div className="w-full space-y-3 mt-auto">
          {rows.map((row, idx) => {
            const percentage = total_analysts > 0 ? (row.count / total_analysts) * 100 : 0;
            return (
              <div key={idx} className="flex items-center gap-3">
                <span 
                  className="text-[8px] font-bold w-24 uppercase tracking-widest truncate"
                  style={{ color: row.color, textShadow: `0 0 10px ${row.color}30` }}
                >
                  {row.label}
                </span>
                <div className="flex-1 h-1 bg-slate-800/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: row.color, boxShadow: `0 0 8px ${row.color}40` }}
                  />
                </div>
                <span className="text-[8px] font-mono text-slate-500 w-4 text-right">{row.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const StatusBadge = ({ state }) => {
  const configs = {
    pending: {
      icon: Clock,
      text: 'Waiting',
      className: 'text-slate-500 border-slate-500/20 bg-slate-500/5',
      color: '#64748b',
      iconClass: ''
    },
    'in-progress': {
      icon: Loader2,
      text: 'Active',
      className: 'border-[var(--accent-blue)]/30 bg-[var(--accent-blue)]/10 shadow-[0_0_10px_rgba(91,155,213,0.2)]',
      color: '#5b9bd5',
      iconClass: 'animate-spin'
    },
    completed: {
      icon: CheckCircle2,
      text: 'Done',
      className: 'border-[#22c55e]/30 bg-[#22c55e]/10',
      color: '#22c55e',
      iconClass: ''
    }
  };

  const current = configs[state.replace('_', '-')] || configs.pending;
  const Icon = current.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-widest transition-all duration-500 ${current.className}`}
      style={{ color: current.color }}
    >
      <Icon size={10} className={current.iconClass} strokeWidth={3} />
      <span>{current.text}</span>
    </div>
  );
};

const ReportSection = ({ title, icon: Icon, content, color = 'blue', id }) => {
  if (!content) return null;

  const colorClasses = {
    blue: 'border-[var(--accent-blue)]/30 text-[var(--accent-blue)]',
    indigo: 'border-[var(--accent-blue)]/30 text-[var(--accent-blue)]',
    teal: 'border-[var(--accent-teal)]/30 text-[var(--accent-teal)]',
    green: 'border-[var(--accent-teal)]/30 text-[var(--accent-teal)]',
    purple: 'border-[var(--accent-purple)]/30 text-[var(--accent-purple)]',
    yellow: 'border-amber-500/30 text-amber-400',
    red: 'border-rose-500/30 text-rose-400'
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass report-section overflow-hidden scroll-mt-20"
      style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)' }}
    >
      <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${colorClasses[color]}`}>
        <Icon size={24} aria-hidden="true" strokeWidth={1.5} />
        <h3 className="text-xl font-bold uppercase tracking-wider font-display">{title}</h3>
      </div>
      <div className="prose prose-invert max-w-none text-slate-300 font-sans leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

const TerminalLine = ({ agent, content, time }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > 300 || content.includes('Date,Open,High,Low') || (content.match(/,/g) || []).length > 10;

  const displayContent = isLong && !expanded ? content.substring(0, 150) + '…' : content;

  return (
    <div className="terminal-line flex gap-3 animate-in fade-in duration-500 font-mono">
      <span className="text-slate-600 shrink-0">[{time}]</span>
      <span className="terminal-agent shrink-0 text-[var(--accent-purple)]">{agent}:</span>
      <div className="flex flex-col">
        <span className="text-[var(--accent-teal)] break-words">{displayContent}</span>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] uppercase tracking-widest text-[var(--accent-blue)] hover:text-[var(--accent-teal)] mt-1 font-bold text-left transition-colors"
          >
            {expanded ? 'Show less' : 'Show full data'}
          </button>
        )}
      </div>
    </div>
  );
};

const MarketDynamicsCards = ({ content, id }) => {
  if (!content) return null;

  // Split into intro and indicators
  const sections = content.split(/\d+\.\s+\*\*/);
  const intro = sections[0];
  const items = sections.slice(1).map(item => {
    const [title, ...descParts] = item.split(/\*\*:/);
    return {
      title: title.trim(),
      description: descParts.join('**:').trim().replace(/^- /, '')
    };
  });

  return (
    <div className="space-y-6 scroll-mt-20" id={id}>
      <div className="glass p-8" style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)' }}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--accent-blue)]/30 text-[var(--accent-blue)]">
          <TrendingUp size={24} aria-hidden="true" strokeWidth={1.5} />
          <h3 className="text-xl font-bold uppercase tracking-wider font-display">Market Dynamics</h3>
        </div>
        <div className="prose prose-invert max-w-none text-slate-300 mb-8 font-sans leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{intro}</ReactMarkdown>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-5 hover:bg-white/5 transition-all duration-300 group"
            >
              <h4 className="text-[var(--accent-teal)] font-bold mb-3 flex items-center gap-2 font-display group-hover:translate-x-1 transition-transform">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] shadow-[0_0_8px_var(--accent-teal)]"></div>
                {item.title}
              </h4>
              <div className="text-sm text-slate-400 leading-relaxed prose-sm prose-invert font-sans">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.description}</ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const INITIAL_PROGRESS = {
  'Analyst Team': {
    'Market Analyst': 'pending',
    'Social Analyst': 'pending',
    'News Analyst': 'pending',
    'Fundamentals Analyst': 'pending',
  },
  'Research Team': {
    'Bull Researcher': 'pending',
    'Bear Researcher': 'pending',
    'Research Manager': 'pending',
  },
  'Trading Team': {
    'Trader': 'pending',
  },
  'Risk Management': {
    'Risky Analyst': 'pending',
    'Neutral Analyst': 'pending',
    'Safe Analyst': 'pending',
  },
  'Portfolio Management': {
    'Portfolio Manager': 'pending',
  }
};

const AGENT_TO_TEAM = {
  'Market Analyst': 'Analyst Team',
  'Social Analyst': 'Analyst Team',
  'News Analyst': 'Analyst Team',
  'Fundamentals Analyst': 'Analyst Team',
  'Bull Researcher': 'Research Team',
  'Bear Researcher': 'Research Team',
  'Research Manager': 'Research Team',
  'Trader': 'Trading Team',
  'Risky Analyst': 'Risk Management',
  'Neutral Analyst': 'Risk Management',
  'Safe Analyst': 'Risk Management',
  'Portfolio Manager': 'Portfolio Management'
};

const AGENT_TO_REPORT_ID = {
  'Market Analyst': 'report-market',
  'Social Analyst': 'report-social',
  'News Analyst': 'report-news',
  'Fundamentals Analyst': 'report-fundamentals',
  'Research Manager': 'report-research',
  'Trader': 'report-trader',
  'Portfolio Manager': 'report-pm',
  'Bull Researcher': 'report-research',
  'Bear Researcher': 'report-research'
};

function App() {
  const [ticker, setTicker] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ticker') || 'NVDA';
  });
  const [date, setDate] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('date') || new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('ticker', ticker);
    params.set('date', date);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [ticker, date]);

  const [language, setLanguage] = useState('English');
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o');
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);
  const [reports, setReports] = useState({});
  const [signals, setSignals] = useState({});
  const [analystRecs, setAnalystRecs] = useState(null);
  const [error, setError] = useState(null);
  const [selectedAnalysts, setSelectedAnalysts] = useState(['market', 'social', 'news', 'fundamentals']);

  const getInitialProgress = (selected) => {
    const filteredAnalystTeam = {};
    const mapping = {
      'market': 'Market Analyst',
      'social': 'Social Analyst',
      'news': 'News Analyst',
      'fundamentals': 'Fundamentals Analyst'
    };

    selected.forEach(key => {
      if (mapping[key]) filteredAnalystTeam[mapping[key]] = 'pending';
    });

    return {
      ...INITIAL_PROGRESS,
      'Analyst Team': filteredAnalystTeam
    };
  };

  const [progress, setProgress] = useState(() => getInitialProgress(['market', 'social', 'news', 'fundamentals']));
  const [memories, setMemories] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchMemories = async () => {
    try {
      const response = await fetch(`${window.location.protocol}//${window.location.host}/api/memory`);
      const data = await response.json();
      setMemories(data);
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    }
  };

  const clearMemories = async () => {
    if (!window.confirm('Are you sure you want to clear all agent memories? This cannot be undone.')) return;
    try {
      await fetch(`${window.location.protocol}//${window.location.host}/api/memory`, { method: 'DELETE' });
      setMemories({});
      alert('All agent memories have been cleared.');
    } catch (err) {
      console.error('Failed to clear memories:', err);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const ws = useRef(null);

  const toggleAnalyst = (id) => {
    setSelectedAnalysts(prev => {
      const next = prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id];
      if (next.length === 0) return prev;
      setProgress(getInitialProgress(next));
      return next;
    });
  };

  const selectAllAnalysts = () => {
    const all = ['market', 'social', 'news', 'fundamentals'];
    setSelectedAnalysts(all);
    setProgress(getInitialProgress(all));
  };

  const updateProgress = (agent, state) => {
    const team = AGENT_TO_TEAM[agent];
    if (team) {
      setProgress(prev => ({
        ...prev,
        [team]: {
          ...prev[team],
          [agent]: state
        }
      }));
    }
  };

  const startAnalysis = () => {
    setStatus('analyzing');
    setLogs([]);
    setReports({});
    setSignals({});
    setAnalystRecs(null);
    setError(null);
    setProgress(getInitialProgress(selectedAnalysts));

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    ws.current = new WebSocket(`${protocol}//${host}/ws/analyze`);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        ticker,
        analysis_date: date,
        language,
        deep_think_llm: selectedModel,
        quick_think_llm: 'openai/gpt-4o-mini',
        max_debate_rounds: 1,
        selected_analysts: selectedAnalysts
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const time = new Date().toLocaleTimeString('en-GB', { hour12: false });

      if (data.type === 'status') {
        setLogs(prev => [...prev, { type: 'System', content: data.message, time }]);
      } else if (data.type === 'analyst_recs') {
        setAnalystRecs(data.data);
      } else if (data.type === 'agent_message') {
        const isTool = data.content.includes('get_') || (data.content.includes('{') && data.content.includes(':'));
        updateProgress(data.agent, 'in_progress');
        setLogs(prev => [...prev, {
          type: isTool ? 'Tool' : 'Reasoning',
          agent: data.agent,
          content: data.content,
          time
        }]);
      } else if (data.type === 'report_update') {
        const mappings = {
          'market_report': 'Market Analyst',
          'sentiment_report': 'Social Analyst',
          'news_report': 'News Analyst',
          'fundamentals_report': 'Fundamentals Analyst',
          'investment_plan': 'Research Manager',
          'trader_investment_plan': 'Trader',
          'final_trade_decision': 'Portfolio Manager'
        };

        const extractSignal = (text) => {
          if (!text) return null;

          // Ensure we are working with a string
          let content = "";
          if (typeof text === 'string') {
            content = text;
          } else if (typeof text === 'object') {
            // If it's an object (like a debate state), try to find content in known fields
            content = text.judge_decision || text.final_report || JSON.stringify(text);
          }

          // Clean up the text for easier matching
          const cleanText = content.replace(/\*/g, '');

          // List of common prefixes before a signal
          const prefixes = [
            'FINAL TRANSACTION PROPOSAL',
            'Recommendation',
            'Rating',
            'Action',
            'Decision',
            'Signal',
            'Overall Sentiment',
            'Verdict'
          ];

          // 1. Try to find the signal following one of the prefixes
          for (const prefix of prefixes) {
            const regex = new RegExp(`${prefix}:?\\s*(BUY|HOLD|SELL)`, 'i');
            const match = cleanText.match(regex);
            if (match && match[1]) {
              return match[1].toUpperCase();
            }
          }

          // 2. Fallback: Search for any standalone BUY/HOLD/SELL that is likely a signal
          // (Looking for bolded versions specifically in the original text)
          const boldMatch = content.match(/\*\*\s*(BUY|HOLD|SELL)\s*\*\*/i);
          if (boldMatch && boldMatch[1]) {
            return boldMatch[1].toUpperCase();
          }

          // 3. Last resort: Just find the last occurrence of these words
          const lastWords = cleanText.match(/\b(BUY|HOLD|SELL)\b/gi);
          if (lastWords) {
            return lastWords[lastWords.length - 1].toUpperCase();
          }

          return null;
        };

        if (data.section === 'investment_debate_state') {
          const ds = data.content;
          if (ds.bull_history && ds.bull_history.length > 0) {
            updateProgress('Bull Researcher', 'completed');
            const lastMsg = ds.bull_history[ds.bull_history.length - 1].content;
            const sig = extractSignal(lastMsg);
            if (sig) setSignals(prev => ({ ...prev, 'Bull Researcher': sig }));
          }
          if (ds.bear_history && ds.bear_history.length > 0) {
            updateProgress('Bear Researcher', 'completed');
            const lastMsg = ds.bear_history[ds.bear_history.length - 1].content;
            const sig = extractSignal(lastMsg);
            if (sig) setSignals(prev => ({ ...prev, 'Bear Researcher': sig }));
          }
          if (ds.judge_decision) {
            updateProgress('Research Manager', 'completed');
            const sig = extractSignal(ds.judge_decision);
            if (sig) setSignals(prev => ({ ...prev, 'Research Manager': sig }));
          }
          return;
        }

        if (data.section === 'risk_debate_state') {
          const ds = data.content;
          if (ds.aggressive_history && ds.aggressive_history.length > 0) {
            updateProgress('Risky Analyst', 'completed');
            const lastMsg = ds.aggressive_history[ds.aggressive_history.length - 1].content;
            const sig = extractSignal(lastMsg);
            if (sig) setSignals(prev => ({ ...prev, 'Risky Analyst': sig }));
          }
          if (ds.neutral_history && ds.neutral_history.length > 0) {
            updateProgress('Neutral Analyst', 'completed');
            const lastMsg = ds.neutral_history[ds.neutral_history.length - 1].content;
            const sig = extractSignal(lastMsg);
            if (sig) setSignals(prev => ({ ...prev, 'Neutral Analyst': sig }));
          }
          if (ds.conservative_history && ds.conservative_history.length > 0) {
            updateProgress('Safe Analyst', 'completed');
            const lastMsg = ds.conservative_history[ds.conservative_history.length - 1].content;
            const sig = extractSignal(lastMsg);
            if (sig) setSignals(prev => ({ ...prev, 'Safe Analyst': sig }));
          }
          return;
        }

        const agent = mappings[data.section];
        if (agent) {
          updateProgress(agent, 'completed');
          const sig = extractSignal(data.content);
          if (sig) setSignals(prev => ({ ...prev, [agent]: sig }));
        }
        setReports(prev => ({ ...prev, [data.section]: data.content }));
      } else if (data.type === 'done') {
        setStatus('complete');
        fetchMemories(); // Refresh the UI with new lessons learned
      } else if (data.type === 'error') {
        setStatus('error');
        setError(data.message);
      }
    };

    ws.current.onerror = (e) => {
      if (ws.current) {
        setStatus('error');
        setError('Connection failed. Is the backend running?');
      }
    };

    ws.current.onclose = () => {
      if (ws.current && status === 'analyzing') setStatus('error');
    };
  };

  const cancelAnalysis = () => {
    if (ws.current) {
      ws.current.onclose = null; // Prevent onclose from triggering error status
      ws.current.close();
      ws.current = null;
    }
    setStatus('idle');
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs(prev => [...prev, { type: 'System', content: 'Analysis cancelled by user.', time }]);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] selection:bg-[var(--teal)]/30">
      <div className="grid-bg"></div>

      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <div className="relative group">
              <div className="absolute -inset-2 bg-teal/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/logo_product.svg" alt="TradingAgents" className="logo-image relative" />
            </div>
            <div className="logo-text">
              <div className="logo-main uppercase">
                THESOLUTION<span className="text-teal">.AT</span> // TRADING_AGENTS
              </div>
              <div className="logo-sub uppercase">
                <span className="text-white/20">—</span> DER SMARTE WEG ZU DEINEN TRADES
              </div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="nav-pill-group mr-6">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`nav-pill ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              Neural_Hub
            </button>
            <button 
              onClick={() => setActiveTab('knowledge')}
              className={`nav-pill ${activeTab === 'knowledge' ? 'active' : ''}`}
            >
              Logic_Protocol
            </button>
          </div>

          <div className="status-group">
            <div className="status-pill">
              <span className="dot pulse"></span>
              NEURAL_CLUSTER_ACTIVE
            </div>
            
            <div className="status-pill-sub">
              {selectedModel.split('/').pop()}
            </div>

            <div className={`status-pill-live ${status === 'analyzing' ? 'live' : ''}`}>
              {status.toUpperCase()}
            </div>

            <button onClick={fetchMemories} className="refresh-btn-round">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-[1600px] mx-auto pb-20">
        {activeTab === 'dashboard' ? (
          <>
        <div className="config-grid">
          <section className="terminal-box card-ticker" data-title="SYMBOL_INPUT">
            <div className="flex flex-col gap-4 h-full">
              <div className="flex flex-col gap-2">
                <label htmlFor="ticker-input" className="text-[9px] text-text-faint font-black uppercase tracking-widest">Ticker</label>
                <input
                  id="ticker-input"
                  type="text"
                  value={ticker}
                  onChange={e => setTicker(e.target.value.toUpperCase())}
                  className="font-mono text-xl !border-teal/20 !bg-teal/5"
                  placeholder="NVDA"
                />
              </div>

              <div className="space-y-4 mt-auto">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-text-faint font-black uppercase tracking-widest">Protocol_State</span>
                  <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="text-text-dim">LATENCY</span>
                      <span className="text-teal">12ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-dim">AGENT_COUNT</span>
                      <span className="text-blue">{selectedAnalysts.length + 8}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="terminal-box" style={{ flex: 2, gridColumn: 'span 3' }} data-title="AGENT_SELECTION">
            <div className="flex flex-col gap-3 h-full overflow-hidden">
              <div className="flex flex-col gap-1 pr-1 overflow-y-auto">
                <button
                  onClick={selectAllAnalysts}
                  disabled={status === 'analyzing'}
                  className={`toggle-button-base ${selectedAnalysts.length === 4 ? 'btn-all-list' : ''}`}
                >
                  <span>Select All Agents</span>
                  {selectedAnalysts.length === 4 && <div className="w-1 h-1 rounded-full bg-current"></div>}
                </button>

                {[
                  { id: 'market', label: 'Market Analyst' },
                  { id: 'social', label: 'Social Analyst' },
                  { id: 'news', label: 'News Analyst' },
                  { id: 'fundamentals', label: 'Financial Analyst' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => toggleAnalyst(a.id)}
                    disabled={status === 'analyzing'}
                    className={`toggle-button-base ${selectedAnalysts.includes(a.id) ? 'agent-toggle-active' : ''}`}
                  >
                    <span>{a.label}</span>
                    {selectedAnalysts.includes(a.id) && <div className="w-1 h-1 rounded-full bg-current"></div>}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="terminal-box card-date" data-title="TEMPORAL_WINDOW">
            <div className="flex flex-col gap-4 h-full">
              <div className="flex flex-col gap-2">
                <label htmlFor="date-input" className="text-[9px] text-text-faint font-black uppercase tracking-widest">Target Date</label>
                <input
                  id="date-input"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="mt-auto">
                <span className="text-[9px] text-text-faint font-black uppercase tracking-widest block mb-2">Neural_Engine</span>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="text-xs font-mono !bg-blue/5 !border-blue/20 text-blue"
                  disabled={status === 'analyzing'}
                >
                  <option value="openai/gpt-4o" className="bg-[#030712]">GPT-4o</option>
                  <option value="anthropic/claude-3.5-sonnet" className="bg-[#030712]">Claude 3.5</option>
                  <option value="google/gemini-1.5-pro" className="bg-[#030712]">Gemini 1.5</option>
                  <option value="x-ai/grok-4.20" className="bg-[#030712]">Grok 4.20</option>
                </select>
              </div>
            </div>
          </section>

          <section className="terminal-box card-action" data-title="EXECUTION_CORE">
            <div className="h-full flex flex-col gap-4">
              <button
                onClick={startAnalysis}
                disabled={status === 'analyzing'}
                className={`btn btn-primary w-full h-16 ${status === 'analyzing' ? 'pulse-active' : ''}`}
              >
                {status === 'analyzing' ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>RUNNING_PROTOCOL</span>
                  </div>
                ) : (
                  <>
                    <Play size={16} />
                    <span>INIT_ANALYSIS</span>
                  </>
                )}
              </button>

              {status === 'analyzing' && (
                <button
                  onClick={cancelAnalysis}
                  className="btn w-full border-red-500/20 text-red-400 hover:bg-red-500/10 text-[9px]"
                >
                  ABORT_TASK
                </button>
              )}

              <div className="disclaimer-box pt-4 mt-auto border-t border-white/5">
                <div className="flex items-center gap-2 text-amber-500/50 text-[9px] font-black uppercase tracking-widest mb-2">
                  <AlertTriangle size={10} />
                  Risk_Alert
                </div>
                <p className="text-[9px] text-text-faint italic leading-relaxed">
                  Neural research framework. Experimental output. Not financial advice.
                </p>
              </div>
            </div>
          </section>
        </div>

        {analystRecs && <div className="mb-8"><AnalystRecommendationGauge data={analystRecs} /></div>}



        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Object.entries(progress).map(([team, agents]) => (
            <section key={team} className="terminal-box !p-4 !pt-8" data-title={team}>
              <div className="flex flex-col gap-2">
                {Object.entries(agents).map(([agent, state]) => (
                  <div key={agent} className="flex flex-col gap-1 border-b border-white/5 pb-2 last:border-0">
                    <div className="flex items-center justify-between">
                      <a 
                        href={AGENT_TO_REPORT_ID[agent] ? `#${AGENT_TO_REPORT_ID[agent]}` : undefined}
                        className={`text-[9px] font-black uppercase tracking-tighter ${AGENT_TO_REPORT_ID[agent] ? 'text-blue hover:text-teal' : 'text-text-dim'}`}
                        onClick={(e) => {
                          if (!AGENT_TO_REPORT_ID[agent]) return;
                          const el = document.getElementById(AGENT_TO_REPORT_ID[agent]);
                          if (el) {
                            e.preventDefault();
                            el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {agent}
                      </a>
                      <StatusBadge state={state} />
                    </div>
                    <SignalBadge signal={signals[agent] || (state === 'completed' ? 'DONE' : null)} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="terminal-box" data-title="NEURAL_REPORT">
          <div className="min-h-[400px]">
            <AnimatePresence mode='poplayout'>
              {Object.keys(reports).length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-text-faint">
                  <Monitor size={48} className="mb-4 opacity-20" />
                  <span className="font-mono text-xs uppercase tracking-widest animate-pulse">Waiting_For_Neural_Stream...</span>
                </div>
              )}
              {reports.market_report && <MarketDynamicsCards id="report-market" content={reports.market_report} />}
              {reports.sentiment_report && <ReportSection id="report-social" title="Social Sentiment" icon={MessageSquare} content={reports.sentiment_report} color="blue" />}
              {reports.news_report && <ReportSection id="report-news" title="News Intelligence" icon={Globe} content={reports.news_report} color="purple" />}
              {reports.fundamentals_report && <ReportSection id="report-fundamentals" title="Financial Fundamentals" icon={Briefcase} content={reports.fundamentals_report} color="teal" />}
              {reports.investment_plan && <ReportSection id="report-research" title="Strategic Thesis" icon={BarChart3} content={reports.investment_plan} color="teal" />}
              {reports.trader_investment_plan && <ReportSection id="report-trader" title="Execution Strategy" icon={Play} content={reports.trader_investment_plan} color="blue" />}
              {reports.final_trade_decision && <ReportSection id="report-pm" title="Portfolio Manager Verdict" icon={ShieldCheck} content={reports.final_trade_decision} color="teal" />}
            </AnimatePresence>
          </div>
        </section>

        <section className="terminal-box mt-8 h-[400px]" data-title="LIVE_NEURAL_FEED">
          <TableVirtuoso
            data={logs}
            followOutput="auto"
            className="flex-1"
            style={{ height: '100%', background: 'transparent' }}
            fixedHeaderContent={() => (
              <tr className="bg-[#030712] z-10">
                <th className="w-24 text-left p-3 text-[9px] uppercase tracking-widest text-text-faint font-black">Time</th>
                <th className="w-24 text-left p-3 text-[9px] uppercase tracking-widest text-text-faint font-black">Type</th>
                <th className="text-left p-3 text-[9px] uppercase tracking-widest text-text-faint font-black">Content</th>
              </tr>
            )}
            itemContent={(index, log) => (
              <>
                <td className="p-3 text-[10px] font-mono text-text-faint">{log.time}</td>
                <td className={`p-3 text-[10px] font-mono font-black ${log.type === 'Tool' ? 'text-purple' : 'text-blue'}`}>{log.type}</td>
                <td className="p-3 text-[10px] font-mono text-teal">
                  {log.agent && <span className="text-white mr-2">[{log.agent}]:</span>}
                  {log.content}
                </td>
              </>
            )}
            components={{
              Table: (props) => <table {...props} className="terminal-table" />,
              TableRow: (props) => <tr {...props} />
            }}
          />
        </section>

          </>
        ) : (
          <section className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="terminal-box p-12 flex flex-col min-h-[500px]" data-title="KNOWLEDGE_BASE_MANIFEST">
              <div className="mb-12 border-b border-white/5 pb-12 flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-bold text-white tracking-tight uppercase">Logic Protocol</h2>
                  <p className="text-xs text-text-faint font-medium uppercase tracking-[0.2em] mt-4">Operational guidelines & agent collaboration logic</p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-text-faint hover:text-teal hover:border-teal/30 transition-all group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Back to Hub</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-teal font-bold uppercase tracking-widest text-[11px] flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-teal shadow-[0_0_10px_var(--teal-glow)]"></span> Multi-Agent Collaboration
                    </h4>
                    <p className="text-sm text-text-dim leading-relaxed">
                      TradingAgents nutzt ein hierarchisches Netzwerk spezialisierter LLM-Agenten. <strong>Analyst-Agenten</strong> (Markt, News, Sentiment, Fundamental) liefern Rohdaten, während das <strong>Research-Team</strong> (Bull vs. Bear) diese in einer strukturierten Debatte bewertet. Die finale Entscheidung wird vom <strong>Portfolio Manager</strong> unter Berücksichtigung von Risikoparametern getroffen.
                    </p>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/5">
                    <h4 className="text-purple font-bold uppercase tracking-widest text-[11px] flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-purple shadow-[0_0_10px_var(--purple-glow)]"></span> Neural Pattern Learning
                    </h4>
                    <p className="text-sm text-text-dim leading-relaxed">
                      Nach jedem Handelszyklus durchläuft das Framework eine <strong>Reflektionsphase</strong>. Erfolgreiche Muster und Fehler werden als "Neural Patterns" gespeichert. Diese persistenten Erfahrungen beeinflussen zukünftige Debatten und schärfen die Präzision der Analysten-Ebene.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-blue font-bold uppercase tracking-widest text-[11px] flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue shadow-[0_0_10px_var(--blue-glow)]"></span> Risk Management Protocol
                    </h4>
                    <p className="text-sm text-text-dim leading-relaxed">
                      Jede Transaktion wird gegen ein dynamisches Risikomodell geprüft. Der <strong>Risk Agent</strong> überwacht Volatilität, Liquidität und Korrelationen. Bei Überschreiten definierter Schwellenwerte wird eine Transaktion blockiert, selbst wenn das Analysten-Team eine positive Empfehlung ausspricht.
                    </p>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/5">
                    <h4 className="text-teal font-bold uppercase tracking-widest text-[11px] flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-teal shadow-[0_0_10px_var(--teal-glow)]"></span> PnL Real-Time Validation
                    </h4>
                    <p className="text-sm text-text-dim leading-relaxed">
                      Die Performance-Metriken (Estimated PnL) werden durch den Abgleich von realisierten Gewinnen und aktuellen Marktbewertungen offener Positionen ermittelt. Dies ermöglicht eine lückenlose Überwachung der Strategie-Effizienz und dient als Basis für das kontinuierliche Rebalancing.
                    </p>
                  </div>
                </div>
              </div>


              <div className="mt-20 pt-20 border-t border-white/5">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-xl font-bold uppercase flex items-center gap-3">
                      <RotateCcw size={20} className="text-purple" />
                      Neural_Patterns_Archive
                    </h3>
                    <p className="text-text-faint text-[10px] uppercase tracking-widest mt-1">Cross-market heuristics & evolved agent logic</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={fetchMemories} className="btn-primary !py-1.5 !px-4 !rounded-full !text-[8px]">REFRESH</button>
                    <button onClick={clearMemories} className="text-[8px] text-red-400 font-black uppercase tracking-widest hover:text-red-300">Purge</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(memories).map(([agent, lessons]) => (
                    <div key={agent} className="terminal-box !p-5 bg-white/[0.01] border-white/5">
                      <h4 className="text-blue text-[9px] uppercase font-black tracking-widest mb-4 flex items-center justify-between">
                        <span>{agent.replace('_', ' ')}</span>
                        <span className="text-white/10 font-mono">P_{lessons.length}</span>
                      </h4>
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {lessons.length === 0 ? (
                          <p className="text-text-faint text-[9px] italic uppercase">Pending_Data...</p>
                        ) : (
                          lessons.map((lesson, idx) => (
                            <div key={idx} className="p-3 rounded-lg border border-white/5 bg-white/[0.005] text-[11px] text-text-dim leading-relaxed">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.recommendation}</ReactMarkdown>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8">
          <button onClick={() => setActiveTab('knowledge')} className="text-[9px] font-black uppercase tracking-widest text-text-faint hover:text-teal transition-colors">Logic Protocol</button>
          <Link to="/disclaimer" className="text-[9px] font-black uppercase tracking-widest text-text-faint hover:text-teal transition-colors">Legal Disclaimer</Link>
          <button onClick={() => { setActiveTab('knowledge'); fetchMemories(); }} className="text-[9px] font-black uppercase tracking-widest text-text-faint hover:text-purple transition-colors">
            {activeTab === 'knowledge' ? 'REFRESH_KNOWLEDGE' : 'SHOW_KNOWLEDGE'}
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;
