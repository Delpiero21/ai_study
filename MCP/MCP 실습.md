# MCP 실습 (실습 워크북)

> **출처 안내:** 이 워크북은 공식 커리큘럼이 아니라, 각 기술의 공식 자료(FastAPI 공식 튜토리얼, Anthropic tool use 공식 문서, LangChain/LangGraph 공식 문서, modelcontextprotocol.io 공식 퀵스타트)를 기반으로 스터디용으로 자체 구성한 것이다. 실습 코드는 공식 문서의 패턴을 따르되, 단계 순서·시간 배분·체크포인트·실습 간 연결 설계는 자체 구성이다. fastapi-mcp, langchain-mcp-adapters는 서드파티 라이브러리(생태계 표준급). 공식 강좌는 부록 참고.

> 전체 흐름: **REST API(기능을 외부에 노출) → Tool Calling(LLM이 그 기능을 사용) → MCP(그 연결 방식을 표준화)**
> 각 실습의 결과물이 다음 실습에서 그대로 재사용된다. 따라 하면서 직접 만들어보는 것이 목표.

## 이론 ↔ 실습 대응표

이 워크북은 [MCP 이론.md](MCP%20이론.md)에 바탕을 둔 실습이다. 각 세션에서 **이론 문서의 해당 장으로 개념을 먼저 잡고 → 아래 대응하는 실습 단계를 따라 한다.**

| MCP 이론.md의 개념 | MCP 실습.md에서 확인하는 곳 |
|---|---|
| 1장: HTTP 메서드/상태 코드, Pydantic 검증(422), OpenAPI 스키마 | 실습 1: Hello FastAPI에서 422 직접 유발, `/openapi.json` 열어보기, Todo CRUD에서 201/404/204 구현 |
| 2장: tool schema, agentic loop(`tool_use`→실행→`tool_result`) | 실습 2-1: while 수동 루프를 직접 작성하고 `stop_reason`이 두 번 찍히는 멀티스텝 관찰 |
| 2장: StateGraph, ToolNode, 조건부 엣지, checkpointer | 실습 2-2: 같은 에이전트를 그래프로 재구성 — "while 루프가 그래프의 cycle이 됐다" 체크포인트 |
| 3장: Host–Client–Server, JSON-RPC, `tools/list`/`tools/call` | 실습 3-2: Inspector 화면에서 JSON-RPC 요청/응답 메시지를 직접 관찰 |
| 3장: stdio vs Streamable HTTP 두 전송 방식 | 실습 3-1(stdio 날씨 서버)과 3-4(HTTP Todo 서버)로 둘 다 사용 |
| 3장: N×M 문제 → N+M 표준화 | 실습 3-3: 같은 서버를 코드 수정 없이 Inspector/Claude Desktop/Claude Code에 꽂아보기 |
| 1·3장: "REST 엔드포인트 = MCP 도구" 연결점 | 실습 3-4: fastapi-mcp 3줄로 Todo API가 MCP 서버가 되는 것 확인 |

이론 문서에만 있는 내용(추천 자료 표, 학습 개념 전체 목록)은 예습·복습용, 실습 문서에만 있는 내용(전체 코드, 체크포인트)은 세션 당일용.

## 실습 0. 환경 준비

```bash
# Python 3.10+ 확인
python --version

# uv 설치 (권장 — pip 사용해도 무방)
# Windows: powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Node.js 설치 확인 (실습 3의 MCP Inspector용)
node --version
```

- LLM API 키 준비: `ANTHROPIC_API_KEY` 환경 변수 설정 (실습 2부터 필요)
- 에디터 + 터미널만 있으면 됨. DB, 배포, 인증은 전부 범위 밖.

---

# 실습 1. REST API + FastAPI

> **목표:** API를 직접 만들고 호출해 본다. "Swagger UI에서 사람이 누르는 버튼을, 나중에 LLM이 대신 누르게 된다."

## 1-1. Hello FastAPI (30분)

```bash
pip install "fastapi[standard]" httpx
```

`main.py`:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

```bash
fastapi dev main.py
```

**✅ 체크포인트**
1. 브라우저에서 `http://127.0.0.1:8000/docs` 열기 → Swagger UI에서 직접 호출해 보기
2. `http://127.0.0.1:8000/openapi.json` 열어보기 — **이 JSON 스키마가 실습 2의 tool schema와 사실상 같은 것**
3. `curl "http://127.0.0.1:8000/items/5?q=test"` — 브라우저 밖에서도 API는 같다
4. `curl http://127.0.0.1:8000/items/abc` → **422 응답** 확인 (타입 힌트 `item_id: int`만으로 자동 검증)

## 1-2. Todo CRUD API (60~90분)

`todo_api.py` — 메모리 dict 저장소, DB 없이:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Todo(BaseModel):
    title: str
    done: bool = False

todos: dict[int, Todo] = {}
next_id = 1

@app.post("/todos", status_code=201)
def create_todo(todo: Todo):
    global next_id
    todos[next_id] = todo
    next_id += 1
    return {"id": next_id - 1, **todo.model_dump()}

@app.get("/todos")
def list_todos():
    return [{"id": i, **t.model_dump()} for i, t in todos.items()]

@app.get("/todos/{todo_id}")
def get_todo(todo_id: int):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"id": todo_id, **todos[todo_id].model_dump()}

@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: Todo):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    todos[todo_id] = todo
    return {"id": todo_id, **todo.model_dump()}

@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    del todos[todo_id]
```

**✅ 체크포인트**
1. `/docs`에서 5개 엔드포인트 전부 테스트 (POST → GET → PUT → DELETE 순서로)
2. POST에 `{"name": "잘못된 필드"}` 보내기 → **422** 응답 바디 관찰 (Pydantic이 어떤 필드가 왜 틀렸는지 알려줌)
3. 없는 id로 GET → **404** 확인

**🎯 도전 과제 — LLM 입장 체험하기:** 파이썬 스크립트에서 httpx로 자기 API 호출

```python
import httpx

r = httpx.post("http://127.0.0.1:8000/todos", json={"title": "MCP 공부"})
print(r.status_code, r.json())
print(httpx.get("http://127.0.0.1:8000/todos").json())
```

→ 실습 2에서 LLM이 하는 일이 정확히 이것(스키마를 보고 → 요청을 만들어 → 호출)이다.

**📚 막힐 때:** [FastAPI 공식 튜토리얼(한국어)](https://fastapi.tiangolo.com/ko/tutorial/) — First Steps → Path/Query Parameters → Request Body → Handling Errors 구간만 보면 됨

---

# 실습 2. LLM Tool Calling (raw SDK → LangGraph)

> **목표:** agentic loop를 손으로 직접 짜본 뒤, 같은 것을 LangGraph로 재구성한다. "프레임워크가 감춰주는 게 뭔지" 아는 것이 목표.

## 2-1. Raw SDK로 수동 agentic loop (90분, 프레임워크 금지)

```bash
pip install anthropic
```

`manual_agent.py`:

```python
import anthropic

client = anthropic.Anthropic()

# 1) 툴 스키마 정의 — 1-1에서 본 openapi.json과 비교해 볼 것
tools = [
    {
        "name": "get_weather",
        "description": "지정한 도시의 현재 날씨를 조회한다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "도시 이름 (예: Seoul)"}
            },
            "required": ["city"],
        },
    },
    {
        "name": "calculator",
        "description": "수식 문자열을 계산해 결과를 돌려준다. 예: '(72 - 32) * 5 / 9'",
        "input_schema": {
            "type": "object",
            "properties": {"expression": {"type": "string"}},
            "required": ["expression"],
        },
    },
]

# 2) 실제 실행 함수 (실습용 더미 — 1단계 FastAPI 엔드포인트를 httpx로 호출해도 됨)
def get_weather(city: str) -> str:
    return f"{city}: 맑음, 화씨 73도"

def calculator(expression: str) -> str:
    return str(eval(expression))  # 실습용. 실전에서는 eval 금지

def run_tool(name: str, args: dict) -> str:
    if name == "get_weather":
        return get_weather(**args)
    if name == "calculator":
        return calculator(**args)
    return f"unknown tool: {name}"

# 3) 수동 agentic loop — 에이전트의 본질은 이 while 루프가 전부다
messages = [{"role": "user", "content": "서울 날씨 알려주고, 기온을 섭씨로 변환해줘"}]

while True:
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=16000,
        tools=tools,
        messages=messages,
    )
    print(f"--- stop_reason: {response.stop_reason}")

    if response.stop_reason != "tool_use":
        break  # 모델이 툴 호출 없이 텍스트로 답하면 종료

    # 모델의 응답(tool_use 블록 포함)을 대화에 그대로 추가
    messages.append({"role": "assistant", "content": response.content})

    # tool_use 블록을 전부 실행하고 결과를 모아서 반환
    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            print(f"    tool: {block.name}({block.input})")
            result = run_tool(block.name, block.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,  # 어떤 호출의 결과인지 매칭 (필수)
                "content": result,
            })
    messages.append({"role": "user", "content": tool_results})

print(next(b.text for b in response.content if b.type == "text"))
```

**✅ 체크포인트**
1. 실행하면 `stop_reason: tool_use`가 **두 번** 찍히는지 확인 (날씨 조회 → 화씨→섭씨 계산, 멀티스텝)
2. `block.input`이 우리가 정의한 JSON Schema대로 들어오는지 print로 관찰
3. `tool_use_id` 매칭을 일부러 빼고 실행해서 API 에러 메시지 확인해 보기

**🎯 도전 과제:** `get_weather`의 description을 일부러 모호하게 바꿔보고 모델이 툴을 잘못 고르거나 안 고르는지 실험 — **description 품질이 툴 선택 정확도를 좌우한다**는 것을 체감

## 2-2. 같은 에이전트를 LangGraph로 (90분)

```bash
pip install langchain langgraph langchain-anthropic
```

> ⚠️ LangChain/LangGraph **v1.0 기준**. 구글 검색에 나오는 구 문서(`langchain-ai.github.io/...`)는 404가 많으니 [docs.langchain.com](https://docs.langchain.com/oss/python/langgraph/quickstart)을 기준으로 할 것.

`graph_agent.py`:

```python
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
    return str(eval(expression))

tools = [get_weather, calculator]
model = init_chat_model("anthropic:claude-opus-4-8").bind_tools(tools)

# 2) 그래프 구성 — 2-1의 while 루프가 chatbot ↔ tools 사이클로 바뀐 것
def chatbot(state: MessagesState):
    return {"messages": [model.invoke(state["messages"])]}

builder = StateGraph(MessagesState)
builder.add_node("chatbot", chatbot)
builder.add_node("tools", ToolNode(tools))          # 2-1의 run_tool + tool_result 처리
builder.add_edge(START, "chatbot")
builder.add_conditional_edges("chatbot", tools_condition)  # 2-1의 if stop_reason != "tool_use"
builder.add_edge("tools", "chatbot")

# 3) checkpointer = 멀티턴 메모리
graph = builder.compile(checkpointer=InMemorySaver())

config = {"configurable": {"thread_id": "study-1"}}

r1 = graph.invoke({"messages": [("user", "서울 날씨 알려주고 섭씨로 변환해줘")]}, config)
print(r1["messages"][-1].content)

# 같은 thread_id → 이전 대화를 기억한다
r2 = graph.invoke({"messages": [("user", "아까 그 도시 어디였지?")]}, config)
print(r2["messages"][-1].content)
```

**✅ 체크포인트**
1. 2-1과 같은 질문에 같은 동작을 하는지 확인 — **내가 짠 while 루프가 그래프의 cycle이 됐다**는 대응 관계 확인
2. `thread_id`를 바꿔서 두 번째 질문 → 기억 못 하는 것 확인 (메모리는 thread 단위)
3. `r1["messages"]` 전체를 출력해서 AIMessage(tool_calls) → ToolMessage 순서가 2-1의 messages 배열과 같은 구조인지 비교

## 2-3. prebuilt 한 줄 버전과 비교 (15분)

```python
from langchain.agents import create_agent

agent = create_agent("anthropic:claude-opus-4-8", tools=tools)
result = agent.invoke({"messages": [("user", "서울 날씨 알려주고 섭씨로 변환해줘")]})
print(result["messages"][-1].content)
```

**✅ 체크포인트:** 추상화 3단계를 한 문장으로 정리해 발표 — ① 수동 루프(원리) → ② StateGraph(제어) → ③ `create_agent`(생산성)

**📚 막힐 때:** [Anthropic: Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent) · [LangGraph Quickstart](https://docs.langchain.com/oss/python/langgraph/quickstart) · 한국어: [테디노트 랭체인 노트](https://wikidocs.net/book/14314) CH17

---

# 실습 3. MCP 서버 만들기와 연결

> **목표:** 실습 2에서 코드 안에 하드코딩했던 툴을 **별도 서버로 분리**하고, 표준 프로토콜(`tools/list` / `tools/call`)로 어디서나 연결해 본다. 모델이 `tool_use`를 내고 결과를 받는 루프 자체는 실습 2와 완전히 동일하다.

## 3-1. 날씨 MCP 서버 작성 (60분)

```bash
uv init mcp-weather && cd mcp-weather
uv add "mcp[cli]" httpx
```

`weather.py`:

```python
from mcp.server.fastmcp import FastMCP
import httpx

mcp = FastMCP("weather")
HEADERS = {"User-Agent": "mcp-study/1.0"}

@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """좌표의 일기예보를 조회한다. (미국 NWS API — 예: 뉴욕 40.71, -74.01)"""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"https://api.weather.gov/points/{latitude},{longitude}",
            headers=HEADERS, timeout=30.0,
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
```

> ⚠️ **stdio 서버에서는 `print()` 금지** — stdout이 JSON-RPC 프로토콜 채널이다. 디버깅 출력은 `import sys; print(..., file=sys.stderr)` 로.

**🎯 도전 과제:** NWS는 미국 전용이므로, [기상청 단기예보 API](https://www.data.go.kr/data/15084084/openapi.do)로 한국판 `get_forecast`를 만들어 보기

## 3-2. MCP Inspector로 테스트 (30분)

```bash
npx @modelcontextprotocol/inspector uv run weather.py
```

**✅ 체크포인트**
1. 브라우저(`localhost:6274`)에서 **Tools 탭** → `get_forecast`가 보이는지 확인 — 이것이 `tools/list`
2. 좌표 입력 후 실행 — 이것이 `tools/call`. 화면의 JSON-RPC 요청/응답 메시지를 직접 관찰
3. 실습 2-1의 tool schema와 Inspector에 보이는 inputSchema가 같은 형태인지 비교

**🎯 도전 과제:** `@mcp.resource("config://app")` 리소스 1개, `@mcp.prompt()` 프롬프트 1개 추가 → Inspector의 Resources/Prompts 탭에서 **3종 프리미티브**(Tools=실행 / Resources≈GET / Prompts=템플릿) 차이 체감

## 3-3. Claude에 연결 (30분)

**Claude Code:**

```bash
claude mcp add weather -- uv run --directory <절대경로>/mcp-weather weather.py
```

**Claude Desktop:** `claude_desktop_config.json`에 추가 후 재시작:

```json
{
  "mcpServers": {
    "weather": {
      "command": "uv",
      "args": ["run", "--directory", "<절대경로>/mcp-weather", "weather.py"]
    }
  }
}
```

**✅ 체크포인트:** "뉴욕 내일 날씨 어때?" 질의 → 툴 호출 승인 팝업 → 응답 확인. **내 서버를 한 줄도 안 고치고 다른 클라이언트(Claude Desktop ↔ Claude Code ↔ Inspector)에 꽂았다** = N×M 문제가 N+M이 되는 순간.

## 3-4. 실습 1의 Todo API를 MCP 서버로 (30분)

```bash
pip install fastapi-mcp
```

`todo_api.py` 끝에 3줄 추가:

```python
from fastapi_mcp import FastApiMCP

mcp = FastApiMCP(app)
mcp.mount_http()   # 구버전(<0.4)은 mcp.mount()
```

```bash
fastapi dev todo_api.py
npx @modelcontextprotocol/inspector  # Transport: Streamable HTTP, URL: http://127.0.0.1:8000/mcp
```

**✅ 체크포인트:** 실습 1에서 만든 REST 엔드포인트 5개가 MCP 툴로 자동 변환되어 보이는지 확인 — **"REST 엔드포인트 = MCP 도구"를 코드로 증명.** stdio(3-1)와 Streamable HTTP(3-4) 두 전송 방식을 모두 써본 셈.

## 3-5. 실습 2의 LangGraph 에이전트에 MCP 툴 연결 (45분)

```bash
pip install langchain-mcp-adapters
```

`mcp_agent.py`:

```python
import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent

async def main():
    client = MultiServerMCPClient({
        "weather": {
            "command": "uv",
            "args": ["run", "--directory", "<절대경로>/mcp-weather", "weather.py"],
            "transport": "stdio",
        },
        "todo": {
            "url": "http://127.0.0.1:8000/mcp",
            "transport": "streamable_http",
        },
    })
    tools = await client.get_tools()   # 두 서버의 툴을 한꺼번에 동적 발견
    print([t.name for t in tools])

    agent = create_agent("anthropic:claude-opus-4-8", tools=tools)
    result = await agent.ainvoke(
        {"messages": [("user", "뉴욕 날씨 확인하고, '우산 챙기기' Todo를 등록해줘")]}
    )
    print(result["messages"][-1].content)

asyncio.run(main())
```

**✅ 체크포인트**
1. 실습 2-3과 에이전트 코드는 거의 동일한데, 툴 정의 코드가 **전부 사라지고** `get_tools()` 호출로 대체된 것 확인
2. 하나의 에이전트가 stdio 서버(weather) + HTTP 서버(todo)를 동시에 사용하는 것 확인
3. 마무리 토론: "실습 1~3에서 만든 것들이 어떻게 하나로 연결됐는가" 흐름도 그려보기

**📚 막힐 때:** [MCP 서버 빌드 퀵스타트](https://modelcontextprotocol.io/docs/develop/build-server) · [아키텍처 문서](https://modelcontextprotocol.io/docs/learn/architecture) · [langchain-mcp-adapters](https://github.com/langchain-ai/langchain-mcp-adapters) · [fastapi-mcp](https://github.com/tadata-org/fastapi_mcp)

---

# 부록. 이론 요약 & 더 공부할 자료

## 한 장 요약

| 단계 | 배운 것 | 핵심 개념 |
|---|---|---|
| 실습 1 | 기능을 API로 노출 | HTTP 메서드/상태 코드, Pydantic 검증, OpenAPI 스키마 |
| 실습 2 | LLM이 API를 사용 | tool schema, agentic loop(`tool_use`→실행→`tool_result`), StateGraph/ToolNode/checkpointer |
| 실습 3 | 연결을 표준화 | Host–Client–Server, JSON-RPC 2.0, stdio/Streamable HTTP, Tools/Resources/Prompts, 동적 발견(`tools/list`) |

- **MCP = "AI 앱의 USB-C 포트"**: N개 앱 × M개 도구 → 프로토콜 표준화로 N+M
- **보안**: 툴 = 임의 코드 실행. 호출 전 사용자 승인이 기본, 신뢰할 수 없는 툴 description은 프롬프트 인젝션 경로
- 최신 스펙: https://modelcontextprotocol.io/specification/latest (2025-11-25 버전)

## 더 공부할 자료 (무료 강좌)

| 자료 | URL |
|---|---|
| Anthropic Academy: MCP 입문 | https://anthropic.skilljar.com/introduction-to-model-context-protocol |
| Hugging Face MCP Course (수료증) | https://huggingface.co/learn/mcp-course/en/unit0/introduction |
| LangChain Academy: Intro to LangGraph | https://academy.langchain.com/courses/intro-to-langgraph |
| 공식 레퍼런스 MCP 서버 모음 | https://github.com/modelcontextprotocol/servers |
| MDN HTTP (한국어) | https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Overview |
