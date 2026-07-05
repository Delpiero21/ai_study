"""FastMCP 순수 학습 예제 서버 — LLM / API 키 / 인터넷 전혀 불필요.

MCP 서버의 3대 프리미티브(Tools · Resources · Prompts)를 한 파일에서 보여준다.
Claude 없이 Inspector로만 직접 눌러보며 테스트한다 (내가 '뇌' 역할).

실행:
    uv run mcp dev mcp_server.py    (또는:  mcp dev mcp_server.py)
    → 브라우저 http://127.0.0.1:6274 → Connect
    → 상단 탭 Tools / Resources / Prompts 를 각각 눌러 확인

주의: stdio 서버에서는 print() 금지 (stdout이 프로토콜 채널). 디버깅은 stderr로.
"""
from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.prompts import base
from pydantic import Field

mcp = FastMCP("mcp-example", log_level="ERROR")

# 외부 API 대신 메모리 dict (완전 오프라인)
FAKE_WEATHER = {
    "서울": "맑음, 24도",
    "부산": "흐림, 22도",
    "제주": "비, 20도",
}


# ─────────────────────────────────────────────
# 1) Tools — 모델이 실행 시점을 결정하는 '행동' (HTTP POST 느낌)
# ─────────────────────────────────────────────
@mcp.tool(name="add", description="두 정수를 더한다.")
def add(
    a: int = Field(description="첫 번째 숫자"),
    b: int = Field(description="두 번째 숫자"),
) -> int:
    return a + b


@mcp.tool(name="get_weather", description="지정한 도시의 (가짜) 현재 날씨를 반환한다.")
def get_weather(
    city: str = Field(description="도시 이름 (예: 서울, 부산, 제주)"),
) -> str:
    if city not in FAKE_WEATHER:
        raise ValueError(f"'{city}' 날씨 데이터가 없습니다. (서울/부산/제주 중 선택)")
    return f"{city}: {FAKE_WEATHER[city]}"


# ─────────────────────────────────────────────
# 2) Resources — 앱이 읽어가는 '데이터' (HTTP GET 느낌)
# ─────────────────────────────────────────────
@mcp.resource("weather://cities", mime_type="application/json")
def list_cities() -> list[str]:
    """도시 목록 (Direct: 고정 URI)"""
    return list(FAKE_WEATHER.keys())


@mcp.resource("weather://cities/{city}", mime_type="text/plain")
def city_weather(city: str) -> str:
    """특정 도시 날씨 (Templated: {city}가 함수 인자로 자동 전달)"""
    if city not in FAKE_WEATHER:
        raise ValueError(f"'{city}' 없음")
    return f"{city}: {FAKE_WEATHER[city]}"


# ─────────────────────────────────────────────
# 3) Prompt — 사용자가 호출하는 '템플릿' (슬래시 명령 느낌)
# ─────────────────────────────────────────────
@mcp.prompt(name="weather_report", description="특정 도시의 날씨 리포트를 요청하는 프롬프트.")
def weather_report(
    city: str = Field(description="도시 이름"),
) -> list[base.Message]:
    return [
        base.UserMessage(
            f"{city}의 현재 날씨를 조회해서, 우산이 필요한지까지 한 문장으로 알려줘."
        )
    ]


# ═════════════════════════════════════════════
#  추가 연습 — 새로운 패턴들 (Inspector에서 Restart 후 확인)
# ═════════════════════════════════════════════

# (연습 1) 선택지 파라미터 + 계산 — 섭씨를 화씨/켈빈으로 변환
#          → 인자에 "정해진 값 중 하나"를 받는 패턴 + 검증
@mcp.tool(name="convert_temp", description="섭씨를 화씨(fahrenheit) 또는 켈빈(kelvin)으로 변환한다.")
def convert_temp(
    celsius: float = Field(description="섭씨 온도"),
    to: str = Field(description="변환 단위: 'fahrenheit' 또는 'kelvin'"),
) -> str:
    if to == "fahrenheit":
        return f"{celsius}°C = {celsius * 9 / 5 + 32}°F"
    if to == "kelvin":
        return f"{celsius}°C = {celsius + 273.15}K"
    raise ValueError("to 는 'fahrenheit' 또는 'kelvin' 이어야 합니다")


# (연습 2) ★상태를 바꾸는 도구★ — 도시를 추가/수정한다.
#          Inspector는 호출 사이 상태를 유지하므로:
#          add_city("대구","폭염 35도") 실행 → 그 다음 get_weather("대구") 나 list_cities 로 확인!
@mcp.tool(name="add_city", description="새 도시의 날씨를 추가하거나 기존 도시를 수정한다.")
def add_city(
    city: str = Field(description="도시 이름"),
    weather: str = Field(description="날씨 설명 (예: '폭염, 35도')"),
) -> str:
    existed = city in FAKE_WEATHER
    FAKE_WEATHER[city] = weather
    return f"{city} {'수정됨' if existed else '추가됨'}: {weather} (현재 도시 {len(FAKE_WEATHER)}개)"


# (연습 3) 계산 결과를 돌려주는 리소스 — 등록된 도시 개수/목록
#          → 리소스는 저장된 값뿐 아니라 '계산한 값'도 돌려줄 수 있다
@mcp.resource("weather://count", mime_type="application/json")
def city_count() -> dict:
    return {"city_count": len(FAKE_WEATHER), "cities": list(FAKE_WEATHER.keys())}


# (연습 4) 인자 2개를 받는 프롬프트 — 두 도시 비교
@mcp.prompt(name="compare_weather", description="두 도시의 날씨를 비교하는 프롬프트.")
def compare_weather(
    city_a: str = Field(description="첫 번째 도시"),
    city_b: str = Field(description="두 번째 도시"),
) -> list[base.Message]:
    return [
        base.UserMessage(
            f"{city_a}와 {city_b}의 날씨를 조회해서, 어느 쪽이 더 나들이하기 좋은지 한 문장으로 비교해줘."
        )
    ]


if __name__ == "__main__":
    mcp.run(transport="stdio")
