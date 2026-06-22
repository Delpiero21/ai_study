"""실습 2-3. prebuilt 한 줄 버전과 비교

준비:
    pip install langchain langgraph langchain-anthropic
    export ANTHROPIC_API_KEY="sk-ant-..."

실행:
    python prebuilt_agent.py

확인:
    추상화 3단계를 한 문장으로 정리해 발표:
    ① 수동 루프(원리) → ② StateGraph(제어) → ③ create_agent(생산성)
"""
from langchain.agents import create_agent
from langchain_core.tools import tool


@tool
def get_weather(city: str) -> str:
    """지정한 도시의 현재 날씨를 조회한다."""
    return f"{city}: 맑음, 화씨 73도"


@tool
def calculator(expression: str) -> str:
    """수식 문자열을 계산해 결과를 돌려준다. 예: '(72 - 32) * 5 / 9'"""
    return str(eval(expression))  # 실습용. 실전에서는 eval 금지


def main():
    agent = create_agent("anthropic:claude-opus-4-8", tools=[get_weather, calculator])
    result = agent.invoke(
        {"messages": [("user", "서울 날씨 알려주고 섭씨로 변환해줘")]}
    )
    print(result["messages"][-1].content)


if __name__ == "__main__":
    main()
