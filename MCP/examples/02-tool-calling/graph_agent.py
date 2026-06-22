"""실습 2-2. 같은 에이전트를 LangGraph로

준비:
    pip install langchain langgraph langchain-anthropic
    export ANTHROPIC_API_KEY="sk-ant-..."

실행:
    python graph_agent.py

확인:
    - 2-1과 같은 동작을 하는지 (내가 짠 while 루프가 그래프의 cycle이 됐다)
    - 같은 thread_id로 두 번째 질문 → 이전 대화를 기억하는지

주의: LangChain/LangGraph v1.0 기준. 구 문서(langchain-ai.github.io/...)는 404가 많으니
      docs.langchain.com 을 기준으로 할 것.
"""
from langchain.chat_models import init_chat_model
from langchain_core.tools import tool
from langgraph.graph import StateGraph, MessagesState, START
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import InMemorySaver


# 1) 툴 정의 — 2-1의 JSON Schema를 @tool 데코레이터가 docstring/타입힌트로 자동 생성
@tool
def get_weather(city: str) -> str:
    """지정한 도시의 현재 날씨를 조회한다."""
    return f"{city}: 맑음, 화씨 73도"


@tool
def calculator(expression: str) -> str:
    """수식 문자열을 계산해 결과를 돌려준다. 예: '(72 - 32) * 5 / 9'"""
    return str(eval(expression))  # 실습용. 실전에서는 eval 금지


tools = [get_weather, calculator]
model = init_chat_model("anthropic:claude-opus-4-8").bind_tools(tools)


# 2) 그래프 구성 — 2-1의 while 루프가 chatbot ↔ tools 사이클로 바뀐 것
def chatbot(state: MessagesState):
    return {"messages": [model.invoke(state["messages"])]}


builder = StateGraph(MessagesState)
builder.add_node("chatbot", chatbot)
builder.add_node("tools", ToolNode(tools))            # 2-1의 run_tool + tool_result 처리
builder.add_edge(START, "chatbot")
builder.add_conditional_edges("chatbot", tools_condition)  # 2-1의 if stop_reason != "tool_use"
builder.add_edge("tools", "chatbot")

# 3) checkpointer = 멀티턴 메모리
graph = builder.compile(checkpointer=InMemorySaver())


def main():
    config = {"configurable": {"thread_id": "study-1"}}

    r1 = graph.invoke(
        {"messages": [("user", "서울 날씨 알려주고 섭씨로 변환해줘")]}, config
    )
    print(r1["messages"][-1].content)

    # 같은 thread_id → 이전 대화를 기억한다
    r2 = graph.invoke({"messages": [("user", "아까 그 도시 어디였지?")]}, config)
    print(r2["messages"][-1].content)


if __name__ == "__main__":
    main()
