from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
<<<<<<< HEAD
from tradingagents.agents.utils.agent_utils import build_instrument_context, get_language_instruction, get_news
=======
import time
import json
from tradingagents.agents.utils.agent_utils import (
    build_instrument_context, 
    get_language_instruction, 
    get_news, 
    get_reddit_sentiment, 
    get_stocktwits_sentiment,
    get_global_news,
    get_insider_transactions,
    get_web_search
)
>>>>>>> df5dd29 (chore: update web frontend and skills)
from tradingagents.dataflows.config import get_config


def create_social_media_analyst(llm):
    def social_media_analyst_node(state):
        current_date = state["trade_date"]
        ticker = state["company_of_interest"]
        full_name = state.get("company_full_name", ticker)
        wkn = state.get("wkn", "Unknown")
        isin = state.get("isin", "Unknown")
        
        instrument_context = build_instrument_context(ticker, full_name)
        # Add more descriptive context for the social analyst
        detailed_context = f"{instrument_context}\nFull Company Name: {full_name}\nWKN: {wkn}, ISIN: {isin}"

        tools = [
            get_news,
            get_global_news,
            get_insider_transactions,
            get_reddit_sentiment,
            get_stocktwits_sentiment,
            get_web_search,
        ]

        system_message = (
            f"You are a social media and company-specific news researcher/analyst for **{full_name}** ({ticker})."
            " Your objective is to write a comprehensive report detailing your analysis, insights, and implications for traders and investors."
            "\n\nUse the following tools to gather a wide range of data:"
            f"\n- **get_news**: Search for '{ticker}' and '{full_name}'."
            f"\n- **get_reddit_sentiment**: Use ticker '{ticker}'."
            f"\n- **get_stocktwits_sentiment**: Use ticker '{ticker}'."
            "\n- **get_global_news**: For broader market context."
            "\n- **get_insider_transactions**: Check executive behavior."
            f"\n- **get_web_search**: Use this for a **deep dive**. Search for: '{full_name} stock sentiment', '{full_name} forum discussions', '{ticker} WKN {wkn}', or '{isin} analysis'."
            "\n\n**Strategy:**"
            "\n1. First, check specialized social sources (Reddit, StockTwits)."
            "\n2. Then, use get_web_search to find niche blogs, forum discussions, or specific German finance sites using the WKN."
            "\n3. Cross-reference social buzz with actual news and insider behavior."
            "\n4. Identify if the current 'hype' matches the fundamentals or if there's a disconnect."
            "\n\nProvide specific, actionable insights with supporting evidence."
            + """ Make sure to append a Markdown table at the end of the report to organize key points."""
            + get_language_instruction()
        )

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful AI assistant, collaborating with other assistants."
                    " Use the provided tools to progress towards answering the question."
                    " If you are unable to fully answer, that's OK; another assistant with different tools"
                    " will help where you left off. Execute what you can to make progress."
                    " If you or any other assistant has the FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL** or deliverable,"
                    " prefix your response with FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL** so the team knows to stop."
                    " You have access to the following tools: {tool_names}.\n{system_message}"
                    "For your reference, the current date is {current_date}. {detailed_context}",
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        prompt = prompt.partial(system_message=system_message)
        prompt = prompt.partial(tool_names=", ".join([tool.name for tool in tools]))
        prompt = prompt.partial(current_date=current_date)
        prompt = prompt.partial(detailed_context=detailed_context)

        chain = prompt | llm.bind_tools(tools)

        result = chain.invoke(state["messages"])

        report = ""

        if len(result.tool_calls) == 0:
            report = result.content

        return {
            "messages": [result],
            "sentiment_report": report,
        }

    return social_media_analyst_node
