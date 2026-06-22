"""실습 3-1. 날씨 MCP 서버

준비:
    pip install "mcp[cli]" httpx
    (uv 사용 시: uv init && uv add "mcp[cli]" httpx)

실행 방법 1 — 직접:
    python weather.py

실행 방법 2 — Inspector로 테스트 (실습 3-2):
    npx @modelcontextprotocol/inspector python weather.py
    → 브라우저(localhost:6274) Tools 탭에서 get_forecast 호출, JSON-RPC 메시지 관찰

Claude 연결 (실습 3-3):
    Claude Code:   claude mcp add weather -- python <절대경로>/weather.py
    Claude Desktop: claude_desktop_config.json 의 mcpServers 에 등록

주의: stdio 서버에서는 print() 금지! (stdout이 JSON-RPC 프로토콜 채널)
      디버깅 출력은 sys.stderr 로.

NWS는 미국 전용 API다. 예) 뉴욕 latitude=40.71, longitude=-74.01
"""
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather")
HEADERS = {"User-Agent": "mcp-study/1.0"}


@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """좌표의 일기예보를 조회한다. (미국 NWS API — 예: 뉴욕 40.71, -74.01)"""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"https://api.weather.gov/points/{latitude},{longitude}",
            headers=HEADERS,
            timeout=30.0,
        )
        forecast_url = r.json()["properties"]["forecast"]
        r = await client.get(forecast_url, headers=HEADERS, timeout=30.0)
        periods = r.json()["properties"]["periods"][:3]
    return "\n".join(
        f"{p['name']}: {p['temperature']}°{p['temperatureUnit']}, {p['shortForecast']}"
        for p in periods
    )


if __name__ == "__main__":
    mcp.run(transport="stdio")
