# System Context - TradingAgents

```mermaid
C4Context
  title System Context for TradingAgents - AI Trading Assistant

  Person(user, "User/Trader", "Interacts with the system to analyze stocks and get trading recommendations.")
  
  System(trading_agents, "TradingAgents System", "A multi-agent AI system that analyzes market data, news, and social sentiment to provide investment advice.")

  System_Ext(openrouter, "OpenRouter API", "Gateway to various LLMs (OpenAI, Anthropic, Google, etc.) used for agent reasoning.")
  System_Ext(financial_apis, "Financial Data APIs", "Provides real-time and historical market data (Yahoo Finance, Alpha Vantage).")
  System_Ext(firecrawl, "Firecrawl API", "Used for scraping retail sentiment from social media platforms (Reddit, StockTwits).")

  Rel(user, trading_agents, "Uses", "HTTPS/WebSockets")
  Rel(trading_agents, openrouter, "Sends prompts and receives reasoning", "JSON/HTTPS")
  Rel(trading_agents, financial_apis, "Fetches market data, news, and fundamentals", "JSON/HTTPS")
  Rel(trading_agents, firecrawl, "Scrapes social media discussions", "JSON/HTTPS")
```

## Description
TradingAgents is an advanced multi-agent system designed to assist traders by aggregating and analyzing vast amounts of financial and social data. It leverages Large Language Models (LLMs) via OpenRouter to simulate a professional trading team, including analysts, researchers, and risk managers.
