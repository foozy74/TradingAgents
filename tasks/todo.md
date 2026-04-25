# Project Audit & Health Check Roadmap

## 1. Workspace Initialization [DONE]
- [x] Create `tasks/` directory
- [x] Initialize `tasks/todo.md`
- [x] Initialize `tasks/lessons.md`

## 2. System Health Check (Baseline) [DONE]
- [x] Run existing tests (`pytest`) -> **PASSED (5/5)**
- [x] Check `tradingagents/agents/` for consistency -> **CONSISTENT**
- [x] Verify `DEFAULT_CONFIG` loading -> **SUCCESS**

## 3. Architectural Review [DONE]
- [x] Inspect `langgraph` connections in `tradingagents/graph/setup.py` -> **SEQUENTIAL ANALYSTS -> DEBATE -> JUDGE**
- [x] Review `portfolio_manager` prompt for hallucination risks in weighting -> **QUALITATIVE & HIERARCHICAL**
- [x] Evaluate `deep_think_llm` vs `quick_think_llm` usage -> **STRATEGICALLY ASSIGNED**

## 4. Verification & Reporting [DONE]
- [x] Document test results
- [x] Provide "Health Status" summary to user

## 5. API Usage Forecast Tool [DONE]
- [x] Create `cli/api_usage.py` with API fetching logic
- [x] Implement forecasting logic
- [x] Test the tool output

## 6. Social Media Analyst Improvement [DONE]
- [x] Implement `get_web_search` tool using Firecrawl
- [x] Fix tool node configuration in `trading_graph.py`
- [x] Enhance `social_media_analyst.py` with broader search capabilities and deep-dive prompt

## 7. Memory Persistence [DONE]
- [x] Implement disk-backed persistence in `FinancialSituationMemory` (JSON)
- [x] Add auto-loading of memories on initialization
- [x] Add automatic saving on memory updates (`add_situations`, `clear`)
- [x] Verify persistence with unit tests -> **PASSED**
- [x] Integrate learning/reflection into Web Backend (`app.py`)
- [x] Add REST API endpoints for memory management (`GET`, `DELETE`)
- [x] Implement "Agent Knowledge Base" UI in Frontend (`App.jsx`)
- [x] Add automatic memory refresh after analysis cycles
