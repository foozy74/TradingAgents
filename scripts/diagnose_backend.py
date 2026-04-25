import asyncio
import os
import json
from dotenv import load_dotenv
from pathlib import Path

# Load env
dotenv_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

from tradingagents.graph.trading_graph import TradingAgentsGraph
from tradingagents.default_config import DEFAULT_CONFIG

async def test_graph_execution():
    ticker = "TSLA"
    analysis_date = "2026-04-07"
    
    config = DEFAULT_CONFIG.copy()
    config["llm_provider"] = "openrouter"
    config["backend_url"] = "https://openrouter.ai/api/v1"
    config["api_key"] = os.getenv("OPENROUTER_API_KEY")
    config["deep_think_llm"] = "openai/gpt-4o"
    config["quick_think_llm"] = "openai/gpt-4o-mini"
    
    print("--- Initializing Graph ---")
    try:
        ta = TradingAgentsGraph(
            debug=True,
            config=config,
            selected_analysts=["market", "social"]
        )
        
        init_agent_state = ta.propagator.create_initial_state(ticker, analysis_date)
        args = ta.propagator.get_graph_args()
        
        print("--- Starting Stream ---")
        # Simulate the websocket loop
        async for chunk in ta.graph.astream(init_agent_state, **args):
            print(f"Chunk received: {list(chunk.keys())}")
            
        print("--- Execution Finished Successfully ---")
    except Exception as e:
        import traceback
        print("\n!!! EXECUTION ERROR !!!")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_graph_execution())
