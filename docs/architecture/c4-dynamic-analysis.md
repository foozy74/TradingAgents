# Dynamic Diagram - Stock Analysis Flow

```mermaid
C4Dynamic
  title Dynamic Diagram - Stock Analysis Request Flow

  Person(user, "User")
  Container(frontend, "Web Frontend", "React")
  Container(backend, "Web Backend", "FastAPI")
  Container(logic, "Agents Core", "LangGraph")
  System_Ext(openrouter, "OpenRouter")
  System_Ext(data_api, "Financial APIs")

  Rel(user, frontend, "1. Submits ticker & date")
  Rel(frontend, backend, "2. Opens WebSocket & sends params")
  Rel(backend, logic, "3. Initializes TradingAgentsGraph")
  
  Rel(logic, data_api, "4. Fetches Market Data & News")
  Rel(logic, openrouter, "5. Analyst Agents process data")
  Rel(logic, backend, "6. Streams live agent reasoning", "WS")
  Rel(backend, frontend, "7. Updates live feed UI", "WS")
  
  Rel(logic, openrouter, "8. Research Team debates thesis")
  Rel(logic, openrouter, "9. Risk Management evaluates plan")
  Rel(logic, openrouter, "10. Portfolio Manager makes decision")
  
  Rel(logic, backend, "11. Sends final reports & signals", "WS")
  Rel(backend, frontend, "12. Displays final verdict", "WS")
```

## Workflow Description
1. **Initiation**: The user selects a stock symbol and target date.
2. **Streaming**: As agents work, their thoughts and intermediate reports are streamed back to the frontend in real-time.
3. **Multi-Agent Chain**:
    - **Analysts**: Gather and interpret raw data (Financials, Social, News).
    - **Researchers**: Debate bullish and bearish cases.
    - **Risk Mgmt**: Analyzes the proposed strategy for potential downsides.
    - **Portfolio Manager**: Synthesizes all inputs into a final BUY/HOLD/SELL recommendation.
