# Container Diagram - TradingAgents

```mermaid
C4Container
  title Container Diagram for TradingAgents

  Person(user, "User/Trader", "Interacts with the system via the web interface.")

  System_Boundary(trading_agents_boundary, "TradingAgents System") {
    Container(web_frontend, "Web Frontend", "React, Tailwind CSS", "Provides the user interface for ticker selection, model selection, and viewing analysis results.")
    Container(web_backend, "Web Backend (API)", "FastAPI, Python", "Handles user requests, manages WebSocket sessions, and orchestrates the agent workflow.")
    Container(agents_core, "TradingAgents Logic", "Python, LangGraph, LangChain", "The core logic that implements agent roles, reasoning chains, and data processing.")
    ContainerDb(redis_cache, "Data Cache", "Redis (Optional)", "Caches financial data and analysis results to improve performance and reduce API costs.")
  }

  System_Ext(openrouter, "OpenRouter API", "LLM Gateway")
  System_Ext(financial_apis, "Financial Data APIs", "Market Data Source")
  System_Ext(firecrawl, "Firecrawl API", "Social Media Scraper")

  Rel(user, web_frontend, "Uses", "HTTPS")
  Rel(web_frontend, web_backend, "Communicates with", "WebSockets / JSON")
  Rel(web_backend, agents_core, "Invokes analysis graph", "Python Function Calls")
  Rel(agents_core, redis_cache, "Reads/Writes cache", "Redis Protocol")
  
  Rel(agents_core, openrouter, "Sends prompts", "JSON/HTTPS")
  Rel(agents_core, financial_apis, "Fetches market data", "JSON/HTTPS")
  Rel(agents_core, firecrawl, "Scrapes social data", "JSON/HTTPS")
```

## Containers
- **Web Frontend**: A modern React application that displays real-time agent reasoning and final trading recommendations.
- **Web Backend**: A FastAPI server that provides a bridge between the frontend and the complex AI logic. It uses WebSockets to stream live updates from the agents.
- **TradingAgents Logic**: The "brain" of the system. It uses LangGraph to orchestrate a multi-step debate and analysis process between specialized agents.
- **Data Cache**: A Redis-based caching layer to store frequently accessed market data and news.
