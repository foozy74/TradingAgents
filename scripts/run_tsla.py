import os
from datetime import datetime
from dotenv import load_dotenv
from tradingagents.graph.trading_graph import TradingAgentsGraph

# Load environment variables
load_dotenv()

def run_tsla_analysis():
    ticker = "TSLA"
    trade_date = "2026-04-07"
    
    print(f"Starting analysis for {ticker} on {trade_date}...")
    
    # Initialize the graph with all analysts
    # This will use the improved social_media_analyst.py
    graph = TradingAgentsGraph(
        selected_analysts=["market", "social", "news", "fundamentals"],
        debug=True
    )
    
    # Run the propagation
    final_state, decision = graph.propagate(ticker, trade_date)
    
    print("\n" + "="*50)
    print(f"FINAL DECISION FOR {ticker}: {decision}")
    print("="*50 + "\n")
    
    # Check if the social analyst used the new tools
    sentiment_report = final_state.get("sentiment_report", "")
    print("--- Social Sentiment Report Preview ---")
    print(sentiment_report[:1000] + "..." if len(sentiment_report) > 1000 else sentiment_report)

if __name__ == "__main__":
    run_tsla_analysis()
