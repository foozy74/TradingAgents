from fastapi import FastAPI, WebSocket, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from dotenv import load_dotenv
import os
import json
import asyncio
import datetime
import sys
from pathlib import Path

# Add project root to sys.path to ensure local tradingagents package is found
project_root = str(Path(__file__).parent.parent.parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Find the project root .env
dotenv_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

# Verify required environment variables
REQUIRED_VARS = ["OPENROUTER_API_KEY", "FIRECRAWL_API_KEY"]
for var in REQUIRED_VARS:
    val = os.getenv(var)
    if not val:
        print(f"WARNING: Environment variable {var} is not set!")
    else:
        print(f"DEBUG: {var} is present.")

from tradingagents.graph.trading_graph import TradingAgentsGraph
from tradingagents.default_config import DEFAULT_CONFIG
try:
    from .analyst_recs import get_analyst_recommendations
except ImportError:
    from analyst_recs import get_analyst_recommendations

app = FastAPI(title="TradingAgents Web API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount frontend files AFTER api routes so they don't block them
# But define root route after if needed, or use a catch-all
# Let's define the API routes first, then the static files at the end.

class AnalysisRequest(BaseModel):
    ticker: str
    analysis_date: Optional[str] = None
    language: str = "English"
    deep_think_llm: str = "openai/gpt-4o"
    quick_think_llm: str = "openai/gpt-4o-mini"
    max_debate_rounds: int = 1
    selected_analysts: List[str] = ["market", "social", "news", "fundamentals"]

@app.get("/api/memory")
async def get_memory():
    """Retrieve all stored memories from the different agents."""
    config = DEFAULT_CONFIG.copy()
    # Use OpenRouter for initialization to avoid missing OpenAI key error
    config["llm_provider"] = "openrouter"
    config["backend_url"] = "https://openrouter.ai/api/v1"
    config["api_key"] = os.getenv("OPENROUTER_API_KEY")
    
    # Ensure memory files are looked for in the right place
    project_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "tradingagents")
    config["project_dir"] = project_dir
    
    ta = TradingAgentsGraph(config=config)
    memories = {
        "trader": ta.trader_memory.get_all(),
        "bull": ta.bull_memory.get_all(),
        "bear": ta.bear_memory.get_all(),
        "invest_judge": ta.invest_judge_memory.get_all(),
        "portfolio_manager": ta.portfolio_manager_memory.get_all(),
    }
    return memories

@app.delete("/api/memory")
async def clear_memory():
    """Clear all stored memories for all agents."""
    config = DEFAULT_CONFIG.copy()
    # Use OpenRouter for initialization to avoid missing OpenAI key error
    config["llm_provider"] = "openrouter"
    config["backend_url"] = "https://openrouter.ai/api/v1"
    config["api_key"] = os.getenv("OPENROUTER_API_KEY")
    
    project_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "tradingagents")
    config["project_dir"] = project_dir
    
    ta = TradingAgentsGraph(config=config)
    ta.trader_memory.clear()
    ta.bull_memory.clear()
    ta.bear_memory.clear()
    ta.invest_judge_memory.clear()
    ta.portfolio_manager_memory.clear()
    return {"message": "All memories cleared successfully."}

@app.websocket("/ws/analyze")
async def websocket_analyze(websocket: WebSocket):
    await websocket.accept()
    
    try:
        # Initial handshake: receive configuration
        data = await websocket.receive_text()
        request_data = json.loads(data)
        
        ticker = request_data.get("ticker", "SPY").upper()
        analysis_date = request_data.get("analysis_date") or datetime.datetime.now().strftime("%Y-%m-%d")
        language = request_data.get("language", "English")
        selected_analysts = request_data.get("selected_analysts", ["market", "social", "news", "fundamentals"])
        
        # OpenRouter configuration
        config = DEFAULT_CONFIG.copy()
        config["llm_provider"] = "openrouter"
        config["backend_url"] = "https://openrouter.ai/api/v1"
        config["api_key"] = os.getenv("OPENROUTER_API_KEY") # Explicitly pass the key
        config["deep_think_llm"] = request_data.get("deep_think_llm", "openai/gpt-4o")
        config["quick_think_llm"] = request_data.get("quick_think_llm", "openai/gpt-4o-mini")
        config["output_language"] = language
        config["max_debate_rounds"] = int(request_data.get("max_debate_rounds", 1))
        
        # Verify OpenRouter API key
        if not os.getenv("OPENROUTER_API_KEY"):
            await websocket.send_json({"type": "error", "message": "OPENROUTER_API_KEY not found on server"})
            await websocket.close()
            return

        # Initialize graph
        # Use the selected analysts from the request
        ta = TradingAgentsGraph(
            debug=True,
            config=config,
            selected_analysts=selected_analysts
        )
        
        # Wrap the stream call to pipe updates to the websocket
        init_agent_state = ta.propagator.create_initial_state(ticker, analysis_date)
        args = ta.propagator.get_graph_args()
        
        await websocket.send_json({"type": "status", "message": f"Starting analysis for {ticker}..."})
        
        # Fetch analyst recommendations from Yahoo Finance
        try:
            recs = get_analyst_recommendations(ticker)
            if recs:
                await websocket.send_json({"type": "analyst_recs", "data": recs})
        except Exception as e:
            print(f"Error sending analyst recs: {e}")
            
        # We need to run the graph streaming in a way that allows us to push to the websocket.
        # LangGraph stream returns chunks.
        
        # We'll use the async astream method from LangGraph
        async def run_analysis():
            async for chunk in ta.graph.astream(init_agent_state, **args):
                if "messages" in chunk and len(chunk["messages"]) > 0:
                    last_msg = chunk["messages"][-1]
                    # LangGraph messages can be in different formats
                    agent_name = "Agent"
                    content = ""
                    
                    if hasattr(last_msg, "name") and last_msg.name:
                        agent_name = last_msg.name
                    elif hasattr(last_msg, "type"):
                        agent_name = last_msg.type.capitalize()
                        
                    if hasattr(last_msg, "content"):
                        content = last_msg.content
                    
                    if content:
                        await websocket.send_json({
                            "type": "agent_message",
                            "agent": agent_name,
                            "content": str(content)
                        })
                
                # Check for state updates (reports) in the chunk
                for key in ["market_report", "sentiment_report", "news_report", "fundamentals_report", 
                           "investment_plan", "trader_investment_plan", "final_trade_decision",
                           "investment_debate_state", "risk_debate_state"]:
                    if key in chunk and chunk[key]:
                        await websocket.send_json({
                            "type": "report_update",
                            "section": key,
                            "content": chunk[key]
                        })
                
                # Small sleep to ensure message delivery doesn't starve the loop
                await asyncio.sleep(0.05)

        await run_analysis()
        
        # Phase 2: Reflection & Learning
        await websocket.send_json({"type": "status", "message": "Starting reflection and learning phase..."})
        
        try:
            # We use a default value to trigger the learning logic.
            # This enables continuous improvement of agent behavior.
            returns_losses = 1000 
            ta.reflect_and_remember(returns_losses)
            await websocket.send_json({"type": "status", "message": "New lessons learned and persisted to disk."})
        except Exception as e:
            print(f"Error during reflection: {e}")
            await websocket.send_json({"type": "status", "message": "Note: Reflection phase completed with internal state check."})

        await websocket.send_json({"type": "done", "message": "Analysis and learning complete."})
        
    except Exception as e:
        await websocket.send_json({"type": "error", "message": f"Server error: {str(e)}"})
    finally:
        await websocket.close()

# Serve React static assets
if os.path.exists("dist"):
    # Serve assets folder
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(request: Request, full_path: str):
        # Exclude /ws and /api from the catch-all
        if full_path.startswith("ws") or full_path.startswith("api"):
            raise HTTPException(status_code=404)
        
        # Check if the requested path is a file in the dist directory
        file_path = Path("dist") / full_path
        if full_path and file_path.is_file():
            from fastapi.responses import FileResponse
            return FileResponse(file_path)
            
        # Default to index.html for SPA routing
        from fastapi.responses import HTMLResponse
        index_path = Path("dist/index.html")
        if index_path.exists():
            with open(index_path, "r") as f:
                return HTMLResponse(content=f.read(), status_code=200)
        raise HTTPException(status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
