"""실습 3-5. 실습 2의 LangGraph 에이전트에 MCP 툴 연결

실습 2-3과 에이전트 코드는 거의 같은데, 툴 정의 코드가 전부 사라지고
get_tools() 호출로 대체된다. 하나의 에이전트가 stdio 서버(weather)와
HTTP 서버(todo)를 동시에 사용한다.

준비:
    pip install langchain langgraph langchain-anthropic langchain-mcp-adapters
    export ANTHROPIC_API_KEY="sk-ant-..."

먼저 다른 터미널에서 Todo MCP 서버를 켜둔다 (실습 3-4):
    fastapi dev todo_mcp.py

그 다음 아래 <절대경로>를 weather.py가 있는 실제 경로로 바꾸고 실행:
    python mcp_agent.py

확인:
    - print된 툴 목록에 weather + todo 양쪽 툴이 다 보이는지
    - "뉴욕 날씨 확인하고 '우산 챙기기' Todo 등록" 한 문장으로 두 서버가 함께 동작하는지
"""
import asyncio

from langchain.agents import create_agent
from langchain_mcp_adapters.client import MultiServerMCPClient

# weather.py 의 실제 절대경로로 교체할 것
WEATHER_PATH = "<절대경로>/weather.py"


async def main():
    client = MultiServerMCPClient(
        {
            "weather": {
                "command": "python",
                "args": [WEATHER_PATH],
                "transport": "stdio",
            },
            "todo": {
                "url": "http://127.0.0.1:8000/mcp",
                "transport": "streamable_http",
            },
        }
    )

    tools = await client.get_tools()  # 두 서버의 툴을 한꺼번에 동적 발견
    print("발견된 툴:", [t.name for t in tools])

    agent = create_agent("anthropic:claude-opus-4-8", tools=tools)
    result = await agent.ainvoke(
        {"messages": [("user", "뉴욕 날씨 확인하고, '우산 챙기기' Todo를 등록해줘")]}
    )
    print(result["messages"][-1].content)


if __name__ == "__main__":
    asyncio.run(main())
