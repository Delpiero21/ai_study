"""로컬 LLM(Ollama)이 내 MCP 서버(server.py)를 자동으로 사용하게 하는 클라이언트.

★ API 키 불필요 · 모델 받은 뒤엔 인터넷도 불필요 (사내 오프라인 OK)
server.py 는 전혀 수정하지 않는다 — 서버는 그대로, LLM만 로컬로 바꾸는 것.

────────────────────────────────────────────────
사전 준비 (인터넷 되는 곳에서 미리!)
────────────────────────────────────────────────
1) Ollama 설치:  https://ollama.com/download
2) 도구 호출 가능한 모델 받기 (한 번만, 약 4~5GB):
      ollama pull llama3.1
   (안정성 떨어지면 대안:  ollama pull qwen2.5)
3) 이 폴더에서 가상환경 + 의존성 설치:
      python -m venv .venv
      .venv\\Scripts\\activate          (Git Bash: source .venv/Scripts/activate)
      pip install "mcp[cli]" langchain langgraph langchain-mcp-adapters langchain-ollama

────────────────────────────────────────────────
실행 (위 venv 활성화 상태에서)
────────────────────────────────────────────────
      python ollama_client.py
"""
import asyncio
import sys

from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent

MODEL = "qwen2.5"   # 도구 호출 지원 모델 (대안: "llama3.1")


async def main():
    # 1) 내 MCP 서버에 연결 (server.py 를 자식 프로세스로 띄움)
    #    sys.executable = 지금 이 스크립트를 돌리는 파이썬(= venv) 그대로 사용
    #    → server.py 도 같은 venv에서 실행되어 mcp 패키지를 찾을 수 있다
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

    # 2) 로컬 모델 + 도구로 에이전트 구성
    llm = ChatOllama(model=MODEL, temperature=0)
    agent = create_react_agent(llm, tools)

    # 3) 질문 → 모델이 알아서 get_weather 도구를 호출
    result = await agent.ainvoke(
        {"messages": [("user", "서울 날씨 알려줘. 도구를 사용해서 확인해줘.")]}
    )
    print("\n=== 최종 답변 ===")
    print(result["messages"][-1].content)


if __name__ == "__main__":
    asyncio.run(main())
