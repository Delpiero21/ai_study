"""주제 2 · LLM Tool Calling — 프레임워크 버전 (LangChain/LangGraph + 로컬 Ollama)

manual_loop.py에서 손으로 짠 while 루프를, 프레임워크가 대신 처리한다.
도구만 @tool로 정의하면 나머지(모델 호출 → 도구 실행 → 결과 반영 → 반복)는 자동.

준비:
    ollama pull qwen2.5
실행:
    uv run --with "langchain,langgraph,langchain-ollama" python langchain_agent.py
"""
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent

MODEL = "qwen2.5"


@tool
def get_weather(city: str) -> str:
    """지정한 도시의 현재 날씨를 조회한다."""
    return {"서울": "맑음, 24도", "부산": "흐림, 22도", "제주": "비, 20도"}.get(city, f"{city} 없음")


@tool
def calculator(expression: str) -> str:
    """수식 문자열을 계산한다. 예: '12 * 8'"""
    return str(eval(expression))  # 학습용. 실전에서는 eval 금지


def main():
    llm = ChatOllama(model=MODEL, temperature=0)
    agent = create_react_agent(
        llm,
        [get_weather, calculator],
        prompt="너는 한국어로만 답한다. 계산·날씨는 반드시 도구를 사용한다.",
    )
    result = agent.invoke(
        {"messages": [("user", "서울 날씨 알려주고, 12 곱하기 8도 계산해줘")]}
    )
    print(result["messages"][-1].content)


if __name__ == "__main__":
    main()
