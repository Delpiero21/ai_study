"""대화형 버전 — 내가 직접 질문을 입력하고, 로컬 모델(Ollama)이 내 MCP 서버 도구를 써서 답한다.

API 키 불필요. server.py 는 수정하지 않는다.

실행 (venv 활성화 or venv 파이썬으로):
    .venv\\Scripts\\python ollama_chat.py

종료:  quit  또는  Enter만 입력

예시 질문:
    - 서울 날씨 알려줘
    - 25도는 화씨로 몇 도야?
    - 12 곱하기 8은?
    - 대구를 '폭염 35도'로 추가해줘   → 그 다음  대구 날씨 알려줘
"""
import asyncio
import sys
import warnings

warnings.filterwarnings("ignore")  # 데코레이터 이전(deprecation) 경고 숨기기 — 화면 깔끔하게

from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent

MODEL = "qwen2.5"

# 시스템 프롬프트 — 모델의 행동 규칙 (한자 섞임·도구 미사용 문제 완화)
SYSTEM_PROMPT = """당신은 한국어로만 답하는 도우미입니다. 다음 규칙을 반드시 지키세요.

1. 반드시 한국어로만 답하세요. 중국어(한자)나 다른 언어 문장을 절대 쓰지 마세요.
2. 계산, 온도 변환, 날씨 조회, 도시 추가 같은 작업은 반드시 제공된 도구(tools)를 호출해서 처리하세요.
   절대 직접 암산하거나 지어내지 마세요.
3. 도구 실행 결과를 바탕으로, 군더더기 없이 한국어 한두 문장으로 간결하게 답하세요.
4. 코드 블록이나 파이썬 코드를 출력하지 마세요.
"""


async def main():
    client = MultiServerMCPClient(
        {
            "example": {
                "command": sys.executable,
                "args": ["server.py"],
                "transport": "stdio",
            }
        }
    )
    tools = await client.get_tools()
    print("연결된 도구:", [t.name for t in tools])

    llm = ChatOllama(model=MODEL, temperature=0)
    agent = create_react_agent(llm, tools, prompt=SYSTEM_PROMPT)

    print("\n로컬 MCP 챗봇 (종료: quit 또는 빈 줄)\n")
    while True:
        try:
            q = input("나 > ").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if q == "" or q.lower() in ("quit", "exit", "종료"):
            print("종료합니다.")
            break

        print("...(생각 중)")
        result = await agent.ainvoke({"messages": [("user", q)]})
        print("AI > " + result["messages"][-1].content + "\n")


if __name__ == "__main__":
    asyncio.run(main())
