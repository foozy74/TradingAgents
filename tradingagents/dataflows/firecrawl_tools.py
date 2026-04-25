import os
from typing import List, Dict, Any

try:
    from firecrawl import FirecrawlApp
    FIRECRAWL_AVAILABLE = True
except ImportError:
    FIRECRAWL_AVAILABLE = False

def get_firecrawl_app():
    if not FIRECRAWL_AVAILABLE:
        return None
    api_key = os.getenv("FIRECRAWL_API_KEY")
    if not api_key:
        return None
    return FirecrawlApp(api_key=api_key)

def scrape_reddit_sentiment(ticker: str) -> str:
    """Scrape Reddit for sentiment using Firecrawl."""
    if not FIRECRAWL_AVAILABLE:
        return "Error: firecrawl-py library not installed. Please run 'pip install firecrawl-py'."
    
    app = get_firecrawl_app()
    if not app:
        return "Error: FIRECRAWL_API_KEY not set or invalid."
    
    # Search for ticker on Reddit
    query = f"site:reddit.com {ticker} stock sentiment"
    try:
        # Using search instead of just crawl for better targeting
        search_result = app.search(query, params={"limit": 5})
        
        if not search_result or "data" not in search_result:
            return f"No Reddit data found for {ticker}."
            
        formatted_results = [f"Reddit Sentiment for {ticker}:"]
        for item in search_result["data"]:
            title = item.get("title", "No title")
            snippet = item.get("description", "No snippet")
            url = item.get("url", "No URL")
            formatted_results.append(f"- {title}: {snippet} ({url})")
            
        return "\n".join(formatted_results)
    except Exception as e:
        return f"Error scraping Reddit: {str(e)}"

def scrape_stocktwits_sentiment(ticker: str) -> str:
    """Scrape StockTwits for sentiment using Firecrawl."""
    if not FIRECRAWL_AVAILABLE:
        return "Error: firecrawl-py library not installed. Please run 'pip install firecrawl-py'."
        
    app = get_firecrawl_app()
    if not app:
        return "Error: FIRECRAWL_API_KEY not set or invalid."
    
    # Target StockTwits symbol page
    url = f"https://stocktwits.com/symbol/{ticker}"
    try:
        # Scrape the specific symbol page
        scrape_result = app.scrape_url(url, params={"formats": ["markdown"]})
        
        if not scrape_result or "markdown" not in scrape_result:
            return f"No StockTwits data found for {ticker}."
            
        # Extract meaningful part of the markdown (usually the stream)
        content = scrape_result["markdown"]
        # Limit content to avoid token bloat
        if len(content) > 2000:
            content = content[:2000] + "..."
            
        return f"StockTwits Sentiment for {ticker}:\n{content}"
    except Exception as e:
        return f"Error scraping StockTwits: {str(e)}"

def firecrawl_web_search(query: str, limit: int = 5) -> str:
    """Perform a general web search using Firecrawl."""
    if not FIRECRAWL_AVAILABLE:
        return "Error: firecrawl-py library not installed. Please run 'pip install firecrawl-py'."
        
    app = get_firecrawl_app()
    if not app:
        return "Error: FIRECRAWL_API_KEY not set or invalid."
    
    try:
        search_result = app.search(query, params={"limit": limit})
        
        if not search_result or "data" not in search_result:
            return f"No results found for search: {query}."
            
        formatted_results = [f"Web search results for '{query}':"]
        for item in search_result["data"]:
            title = item.get("title", "No title")
            snippet = item.get("description", "No snippet")
            url = item.get("url", "No URL")
            formatted_results.append(f"- {title}: {snippet} ({url})")
            
        return "\n".join(formatted_results)
    except Exception as e:
        return f"Error performing web search: {str(e)}"
