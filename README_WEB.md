# TradingAgents Web UI 🚀

This is the web interface for the TradingAgents framework, featuring a premium MiroFish-style design with real-time agent console streaming.

## 🛠️ Components
- **Backend**: FastAPI with WebSocket support for real-time log and report streaming.
- **Frontend**: React + Vite with Framer Motion, Tailwind (interally via index.css), and Lucide icons.
- **LLM**: Powered by OpenRouter for multi-model access (GPT-4o, Claude 3.5, etc.).

## 🚀 Quick Start (Local)

1. **Set up Environment**:
   ```bash
   export OPENROUTER_API_KEY="your_key_here"
   ```

2. **Run Backend**:
   ```bash
   cd web/backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Run Frontend (Development)**:
   ```bash
   cd web/frontend
   npm install
   npm run dev
   ```

## 🐳 Deployment (Docker)

To deploy the entire stack as a single container (FastAPI + React build):

```bash
docker build -t tradingagents-web -f Dockerfile_web .
docker run -p 8000:8000 -e OPENROUTER_API_KEY="your_key_here" tradingagents-web
```

The application will be available at `http://localhost:8000`.

## ✨ Features
- **Real-time Terminal**: Watch the agents debate and research in a live console.
- **Structured Dashboard**: Deep analysis reports for Market, News, Sentiment, and Fundamentals.
- **Multi-language Support**: All final reports can be generated in your preferred language.
- **Responsive Design**: Works perfectly on mobile and desktop.
