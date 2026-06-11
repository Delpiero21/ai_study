# MCP 실습

> REST API → LLM Tool Calling → MCP 순서로 학습한다.
> 전체 흐름: **REST API(기능을 외부에 노출) → Tool Calling(LLM이 그 기능을 사용) → MCP(그 연결 방식을 표준화)**
> 각 단계의 실습물이 다음 단계에서 그대로 재사용된다.
> (조사 기준: 2026-06, 주요 URL 실제 접속 검증 완료)

---

## 1. REST API 이해, FastAPI 실습

> REST API가 처음인 분들을 위한 기초 단계. MCP 서버도 결국 "표준화된 API 서버"이므로 여기서 배우는 클라이언트/서버, JSON, 스키마 검증이 그대로 전제 지식이 된다.

### 핵심 학습 개념

**REST API 기초**
- 클라이언트–서버 모델과 HTTP 요청/응답 구조 (요청 = 메서드 + URL + 헤더 + 바디 / 응답 = 상태 코드 + 헤더 + 바디)
- HTTP 메서드와 CRUD 매핑: GET(조회), POST(생성), PUT/PATCH(수정), DELETE(삭제)
- HTTP 상태 코드: 2xx(200, 201, 204), 4xx(400, 401, 404, 422), 5xx(500)
- JSON 직렬화 (`Content-Type: application/json`)
- URL 설계: 리소스 중심 경로(`/items/{id}`), Path Parameter vs Query Parameter(`?skip=0&limit=10`)
- 무상태성(Statelessness) — 이후 LLM 대화/세션 설계 이해와도 연결

**FastAPI**
- 설치/실행: `pip install "fastapi[standard]"` → `fastapi dev main.py` (현행 공식 방식, 내부적으로 uvicorn + auto-reload)
- Path Operation 데코레이터: `@app.get("/")`, `@app.post(...)`
- 타입 힌트 기반 Path/Query 파라미터 자동 변환·검증
- Pydantic `BaseModel`로 Request Body 정의 → 자동 검증 (실패 시 422)
- 자동 문서: Swagger UI `/docs`, ReDoc `/redoc`, OpenAPI 스키마 `/openapi.json`
- `async def` 지원 (개념만 — LLM API 호출은 수 초짜리 I/O 작업이라 다음 단계에서 중요해짐)
- 스킵 권장: Dependencies, Security/OAuth2, Middleware, DB 연동 — "이런 게 있다" 소개만

### 추천 자료

| 자료 | URL | 비고 |
|---|---|---|
| MDN HTTP 개요 (한국어) | https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Overview | API 미경험자 첫 읽기 자료 |
| MDN HTTP 메서드 (한국어) | https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Methods | 실습 중 사전처럼 참조 |
| MDN HTTP 상태 코드 (한국어) | https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Status | 상태 코드 사전 |
| AWS "RESTful API란?" (한국어) | https://aws.amazon.com/ko/what-is/restful-api/ | 쉬운 한국어 개념 정리 |
| FastAPI 공식 문서 (한국어 번역) | https://fastapi.tiangolo.com/ko/ | 공식 한국어 번역 존재 |
| FastAPI 공식 튜토리얼 | https://fastapi.tiangolo.com/tutorial/ | 학습 경로 그대로 사용 가능 |

**공식 튜토리얼 필수 구간(순서대로):** First Steps → Path Parameters → Query Parameters → Request Body → Response Model → Response Status Code → Handling Errors(HTTPException까지)

### 실습 과제

**세션 1 — REST 개념 + Hello FastAPI**
1. `pip install "fastapi[standard]"` → Hello World → `fastapi dev main.py`
2. `/docs` 열어 Swagger UI에서 직접 호출, `/openapi.json` 구경
3. `GET /items/{item_id}?q=...` — 타입 힌트로 자동 검증 확인 (`/items/abc` 호출 시 422)
4. curl로 호출 — 브라우저 밖에서도 API는 같다는 체감

**세션 2 — 미니 Todo CRUD API (메모리 dict 저장소, DB 없이)**
1. Pydantic 모델: `class Todo(BaseModel): title: str; done: bool = False`
2. 5개 엔드포인트: `POST /todos`(201), `GET /todos`, `GET /todos/{id}`(404 처리), `PUT /todos/{id}`, `DELETE /todos/{id}`(204)
3. Swagger UI에서 전 메서드 테스트, 잘못된 바디로 422 응답 관찰
4. httpx로 자기 API를 호출하는 파이썬 클라이언트 작성 — "LLM이 tool을 호출하는 입장" 미리 체험

### 다음 주제와의 연결점
- LLM tool 정의(JSON Schema)는 FastAPI가 자동 생성하는 `/openapi.json`과 사실상 동형 — "Swagger UI에서 사람이 누르던 버튼을 LLM이 대신 누르는 것"
- 여기서 만든 Todo API는 3단계에서 fastapi-mcp로 그대로 MCP 서버가 된다
- Pydantic 학습은 OpenAI/Anthropic SDK의 tool 정의·structured output 패턴에서 직접 재사용됨

---

## 2. LLM Tool Calling 실습 (LangGraph)

### 핵심 학습 개념

**Tool calling 기본 사이클 (프레임워크 무관, 모든 것의 기반)**
- 툴 스키마 정의: `name` + `description` + `input_schema`(JSON Schema) — description 품질이 모델의 툴 선택 정확도를 좌우
- 모델 응답: Anthropic은 `stop_reason: "tool_use"` + `tool_use` 블록, OpenAI는 `tool_calls`
- 앱이 직접 실행 → `tool_result`(매칭되는 `tool_use_id` 필수)를 대화에 추가해 재호출
- 이 루프를 모델이 텍스트로 최종 응답할 때까지 반복 = **agentic loop (에이전트의 본질)**
- client tools(앱이 실행) vs server tools(제공자가 실행: web_search 등), `tool_choice` 제어(auto/any/특정 tool/none)

**LangGraph**
- `StateGraph` — State(TypedDict + `add_messages` reducer), Node, Edge
- `model.bind_tools()` — LLM에 툴 스키마 바인딩
- `ToolNode` + 조건부 엣지(`tools_condition`) — "툴 호출 있으면 tool 노드로, 없으면 종료"
- Checkpointer(`InMemorySaver`) + `thread_id` = 대화 메모리
- Human-in-the-loop(interrupt), 스트리밍
- ⚠️ **v1.0 이후 문서가 docs.langchain.com으로 통합됨.** 구 `langchain-ai.github.io/langgraph/tutorials/...` 경로는 404. prebuilt도 구 `create_react_agent` 대신 `langchain.agents.create_agent`가 v1 표준

**학습 순서 권장:** raw SDK로 수동 루프를 직접 짜서 원리 체득 → LangGraph로 그래프 재구성 → prebuilt(`create_agent`) 한 줄로 축약. "프레임워크가 감춰주는 게 뭔지" 아는 것이 목표

### 추천 자료

| 자료 | URL | 비고 |
|---|---|---|
| Anthropic: Tool use overview | https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview | 공식 진입점 |
| Anthropic: Build a tool-using agent | https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent | 수동 루프→멀티 툴 5단계 실습 튜토리얼, 실습용 최적 |
| OpenAI: Function calling | https://platform.openai.com/docs/guides/function-calling | 비교용 |
| LangGraph Quickstart | https://docs.langchain.com/oss/python/langgraph/quickstart | 현재 공식 1순위 입문 자료 |
| LangGraph Graph API 개념 | https://docs.langchain.com/oss/python/langgraph/graph-api | State/Node/Edge 정리 |
| LangChain Agents (`create_agent`) | https://docs.langchain.com/oss/python/langchain/agents | v1 prebuilt ReAct 에이전트 |
| LangChain Academy: Intro to LangGraph | https://academy.langchain.com/courses/intro-to-langgraph | 무료, 약 6시간/55강 |
| 테디노트 랭체인 노트 (위키독스) | https://wikidocs.net/book/14314 | 한국어 최대 튜토리얼, CH17 LangGraph |
| 테디노트 langchain-kr | https://github.com/teddylee777/langchain-kr | 실행 가능한 노트북 저장소 |
| LangGraph 가이드북 [ver 1.0+] | https://wikidocs.net/book/16723 | 한국어, v1.0 대응 |

### 실습 과제

**세션 1 — Raw SDK로 원리 체득 (프레임워크 금지)**
1. `get_weather(location)` + `calculator(expression)` 두 툴을 JSON Schema로 정의 (1단계 FastAPI 엔드포인트를 툴 함수로 재활용하면 연결성 좋음)
2. SDK로 1회 호출 → `stop_reason: "tool_use"`와 `tool_use` 블록을 print해서 구조 관찰
3. `while` 수동 agentic loop 작성: tool_use 파싱 → 함수 실행 → `tool_result` 반환 → 반복
4. 도전: "서울 기온 화씨→섭씨 변환"처럼 두 툴 연쇄 호출이 필요한 질문으로 멀티스텝 확인

**세션 2 — 같은 에이전트를 LangGraph로**
1. `StateGraph` + `bind_tools` + `ToolNode` + `tools_condition`으로 세션 1과 동일한 에이전트 재구현 — "내가 짠 while 루프가 그래프의 cycle이 됐다"는 대응 관계 확인
2. `InMemorySaver` + `thread_id`로 멀티턴 메모리 추가 ("아까 그 도시 내일 날씨는?")
3. `create_agent(model, tools=[...])` 한 줄 버전과 비교 — 추상화 3단계(수동 루프/그래프/prebuilt) 체감
4. (선택) `interrupt`로 human-in-the-loop: 툴 실행 전 승인 — MCP의 권한 승인 UX와 연결

### 다음 주제와의 연결점
- MCP는 tool calling의 **표준화 레이어**. 여기서는 툴을 내 코드 안에 정의하고 내 앱이 실행하지만, MCP는 이를 별도 서버로 분리하고 발견(`tools/list`)·호출(`tools/call`)을 JSON-RPC로 표준화한 것. 모델이 `tool_use`를 내고 결과를 돌려받는 **루프 자체는 완전히 동일**
- 여기서 만든 weather/calculator 툴을 다음 단계에서 MCP 서버로 옮기면 그대로 이어짐
- `langchain-mcp-adapters`로 MCP 서버의 툴을 LangGraph 에이전트에 그대로 바인딩 가능

---

## 3. MCP 조사 및 실습

### 핵심 학습 개념

- **MCP 정의**: AI 애플리케이션을 외부 시스템(데이터, 도구, 워크플로)에 연결하는 오픈 표준 프로토콜. 공식 비유: "AI 앱의 USB-C 포트"
- **해결하는 문제**: N개 앱 × M개 도구의 통합 조합 폭발 → 프로토콜 표준화로 N+M으로 축소
- **아키텍처**: **Host**(Claude Desktop, Claude Code 등 AI 앱) – **Client**(서버와 1:1 연결 유지) – **Server**(컨텍스트/도구 제공)
- **2계층 구조**:
  - 데이터 계층: JSON-RPC 2.0 (initialize → capability 협상 → 요청/응답/알림)
  - 전송 계층: **stdio**(로컬) / **Streamable HTTP**(원격, HTTP POST + 선택적 SSE). 구 SSE 단독 전송은 deprecated
- **서버 프리미티브 3종**: **Tools**(실행, model-controlled, `tools/list`·`tools/call`) / **Resources**(읽기 컨텍스트, ≈GET) / **Prompts**(재사용 템플릿)
- **클라이언트 프리미티브**: Sampling, Elicitation, Roots, Logging
- 최신 스펙: 2025-11-25 버전 (https://modelcontextprotocol.io/specification/latest)
- **보안**: 도구 = 임의 코드 실행이므로 호출 전 사용자 승인, 프롬프트 인젝션 주의
- **plain tool calling과의 관계**: tool calling은 "모델이 함수를 고르는 능력", MCP는 "그 함수를 어디서 어떻게 공급받는가의 표준". 툴을 하드코딩하는 대신 `tools/list`로 런타임에 동적 발견

### 추천 자료

| 자료 | URL | 비고 |
|---|---|---|
| 공식 사이트 | https://modelcontextprotocol.io/ | 발표 도입부용 |
| 아키텍처 문서 | https://modelcontextprotocol.io/docs/learn/architecture | 이론 파트 핵심 자료 |
| 서버 빌드 퀵스타트 | https://modelcontextprotocol.io/docs/develop/build-server | 날씨 서버 제작 → Claude Desktop 연결 |
| 클라이언트 빌드 퀵스타트 | https://modelcontextprotocol.io/docs/develop/build-client | 심화 실습용 |
| Python SDK | https://github.com/modelcontextprotocol/python-sdk | `pip install "mcp[cli]"`, `@mcp.tool()` 데코레이터 |
| MCP Inspector | https://github.com/modelcontextprotocol/inspector | `npx @modelcontextprotocol/inspector` — 실습 디버깅 필수 도구 |
| 공식 레퍼런스 서버 모음 | https://github.com/modelcontextprotocol/servers | 현행 7종 유지 (GitHub/Slack 등 12종은 archived로 이관 — 주의) |
| langchain-mcp-adapters | https://github.com/langchain-ai/langchain-mcp-adapters | MCP 툴 → LangChain/LangGraph 툴 변환 (2단계와 직결) |
| fastapi-mcp | https://github.com/tadata-org/fastapi_mcp | FastAPI 엔드포인트를 MCP 도구로 노출 (1단계와 직결) |
| Anthropic Academy MCP 입문 | https://anthropic.skilljar.com/introduction-to-model-context-protocol | 무료 강좌 |
| Hugging Face MCP Course | https://huggingface.co/learn/mcp-course/en/unit0/introduction | 무료, 수료증 발급 |

참고: 한국어 블로그 자료는 구버전(SSE 전송 시절) 내용이 많으므로 공식 문서를 기준으로 삼고 보조용으로만 활용

### 실습 과제

**세션 1 — 서버 만들기 + Inspector + Claude 연결 (공식 퀵스타트 트랙)**
1. 환경 준비: `uv init weather && uv add "mcp[cli]" httpx` (Inspector용 Node.js도 설치)
2. 날씨 서버 작성: `FastMCP("weather")` + `@mcp.tool()`로 `get_alerts`, `get_forecast` 구현 → `mcp.run(transport='stdio')`
   - ⚠️ stdio 서버에서는 `print()` 금지 (stdout이 프로토콜 채널) — 로깅은 stderr로
3. Inspector로 테스트: `npx @modelcontextprotocol/inspector uv run weather.py` → 웹 UI(localhost:6274)에서 tools 호출, JSON-RPC 메시지 관찰
4. Claude 연결: Claude Desktop은 `claude_desktop_config.json`의 `mcpServers`에 등록, Claude Code는 `claude mcp add weather -- uv run weather.py`
5. 확장: `@mcp.resource()` 리소스 1개 + `@mcp.prompt()` 프롬프트 1개 추가 → 3종 프리미티브 차이 체감

**세션 2 — 기존 스택과 통합 (이전 단계 복습 겸)**
1. **fastapi-mcp**: 1단계 Todo API에 `FastApiMCP(app).mount()` 추가 → Inspector로 `http://localhost:8000/mcp` 접속 → REST 엔드포인트가 MCP 도구로 자동 변환됨 확인
2. **langchain-mcp-adapters**: 2단계 LangGraph 에이전트의 하드코딩 툴을 `MultiServerMCPClient({...}).get_tools()`로 교체 — 세션 1의 날씨 서버 + 공식 filesystem 서버를 동시 연결
3. (선택) build-client 퀵스타트로 `ClientSession` + LLM API 챗봇 직접 구현 — initialize/tools-list/tools-call 흐름을 코드 레벨에서 확인

### 이전 주제와의 연결점
- **REST API →**: Resources ≈ GET(읽기), Tools ≈ POST(실행). Streamable HTTP 전송은 결국 HTTP POST + SSE이고 인증도 표준 HTTP(Bearer/OAuth). fastapi-mcp가 "REST 엔드포인트 = MCP 도구"를 그대로 증명
- **Tool calling →**: 지난 단계에서 코드에 직접 정의하던 도구를, MCP는 런타임에 동적 발견 + 프로세스/네트워크 경계 너머에서 사용. langchain-mcp-adapters 덕분에 기존 LangGraph 에이전트 코드가 거의 그대로 재사용됨 — N×M 문제 해소를 직접 체험
