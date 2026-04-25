import yfinance as yf
from typing import Dict, Any

def get_analyst_recommendations(ticker_symbol: str) -> Dict[str, Any]:
    """Fetch analyst recommendations summary from Yahoo Finance."""
    try:
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info
        
        # yfinance info contains recommendationKey and recommendationMean
        # Keys: 'strongBuy', 'buy', 'hold', 'sell', 'strongSell'
        
        recs = info.get('recommendationKey', 'N/A')
        mean = info.get('recommendationMean', 0)
        total_analysts = info.get("numberOfAnalystOpinions", 0)
        
        # We try to get specific counts if available (recommendations attribute)
        try:
            recs_df = ticker.recommendations
            if recs_df is not None and not recs_df.empty:
                # Latest row in yfinance recommendations often contains the summary
                latest = recs_df.iloc[-1]
                counts = {
                    "strongBuy": int(latest.get("strongBuy", 0)),
                    "buy": int(latest.get("buy", 0)),
                    "hold": int(latest.get("hold", 0)),
                    "sell": int(latest.get("sell", 0)),
                    "strongSell": int(latest.get("strongSell", 0))
                }
            else:
                # Fallback distribution based on mean
                counts = {"strongBuy": 0, "buy": 0, "hold": 0, "sell": 0, "strongSell": 0}
                if total_analysts > 0:
                    if mean <= 1.5: counts["strongBuy"] = total_analysts
                    elif mean <= 2.5: counts["buy"] = total_analysts
                    elif mean <= 3.5: counts["hold"] = total_analysts
                    elif mean <= 4.5: counts["sell"] = total_analysts
                    else: counts["strongSell"] = total_analysts
        except:
            counts = {"strongBuy": 0, "buy": 0, "hold": 0, "sell": 0, "strongSell": 0}
            
        return {
            "ticker": ticker_symbol,
            "recommendation": recs.upper(),
            "mean_score": mean,
            "total_analysts": total_analysts,
            "counts": counts
        }
    except Exception as e:
        print(f"Error fetching analyst recs: {e}")
        return {
            "ticker": ticker_symbol,
            "recommendation": "N/A",
            "mean_score": 0,
            "total_analysts": 0,
            "counts": {"strongBuy": 0, "buy": 0, "hold": 0, "sell": 0, "strongSell": 0}
        }
