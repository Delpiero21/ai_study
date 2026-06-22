# MCP 학습 커리큘럼 (추천 학습법)

> 자료가 여러 개라 헷갈리지 않도록, **무엇을 어떤 순서로, 어떤 세부 목차로** 학습할지 정리한 단일 문서다.
> 핵심: **공식 정석 강의(영어, 1.5h) → 우리 워크북 직접 실습 → 막힐 때 한국어 자료 보충.**

## 추천 순서 한눈에

| 단계 | 무엇 | 형식 | 분량 |
|---|---|---|---|
| **1단계** | DeepLearning.AI 정석 강의 (영어 자막) | 영상 | 약 1.5시간 |
| **2단계** | 이 저장소 워크북 + examples 직접 실행 | 실습 | 본인 페이스 |
| **3단계** | 막히는 개념만 한국어 자료로 보충 | 텍스트/영상 | 필요할 때만 |

→ "공식 정석 + 직접 실습 + 한국어 보완"이 한 번에 채워진다.

---

# 1단계 — 정석 강의 (영어, 무료)

MCP를 **만든 회사(Anthropic)가 직접** 참여한 자료라 가장 정확하고 최신이다. 군더더기 없이 MCP만 정면으로 다룬다.

## ⭐ 메인: [MCP: Build Rich-Context AI Apps](https://learn.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic/) (DeepLearning.AI × Anthropic)

- 강사: Elie Schoppik (Anthropic 기술교육 총괄)
- 총 12강 / 약 83분 / 무료

### 세부 목차 (강의 순서대로)

| # | 강의 | 길이 | 다루는 것 |
|---|---|---|---|
| 1 | Introduction | 3분 | 강의 소개 |
| 2 | Why MCP | 7분 | MCP가 왜 필요한가 (N×M 문제) |
| 3 | MCP Architecture | 14분 | Host–Client–Server, JSON-RPC, 전송 방식 |
| 4 | Chatbot Example | 7분 | 챗봇 코드 예제 (MCP 적용 전) |
| 5 | Creating an MCP Server | 8분 | **MCP 서버 직접 제작** |
| 6 | Creating an MCP Client | 9분 | **MCP 클라이언트 제작** |
| 7 | Connecting to Reference Servers | 12분 | 공식 레퍼런스 서버 연결 |
| 8 | Adding Prompt and Resource Features | 11분 | Prompts·Resources 프리미티브 추가 |
| 9 | Configuring Servers for Claude Desktop | 6분 | Claude Desktop에 서버 등록 |
| 10 | Creating and Deploying Remote Servers | 7분 | 원격 서버 배포 |
| 11 | Conclusion | 9분 | 마무리 |
| 12 | Appendix – Tips and Help | 10분 | 팁·도움말 (읽기) |

> 우리 2단계 워크북의 실습 3과 범위가 거의 같다. 영상으로 전체 그림을 잡고 → 2단계에서 손으로 만들면 된다.

## 보조 (선택)

| 강의 | 만든 곳 | 특징 |
|---|---|---|
| [Anthropic Academy: MCP 입문](https://anthropic.skilljar.com/introduction-to-model-context-protocol) | Anthropic 직접 | MCP 만든 회사의 공식 입문 |
| [Hugging Face MCP Course](https://huggingface.co/learn/mcp-course/en/unit0/introduction) | Hugging Face | 이론 + Gradio end-to-end, 수료증 |

> **"정석"의 의미 구분:** DeepLearning.AI는 *내용의 정확성·권위* 기준 정석이다. 다만 **전부 영어**다. 영어 자막으로 따라갈 수 있으면 1순위가 맞고, 영어가 부담되면 한국어로는 3단계(테디노트) + 2단계(워크북)가 현실적인 정석이다.

---

# 2단계 — 직접 실습 (한국어, 이 저장소)

영상으로 그림을 잡았으면 직접 손으로 만들어봐야 내 것이 된다. 코드는 [examples/](examples/) 폴더에 바로 실행 가능하게 다 있다.

> 전체 흐름: **REST API(기능 노출) → Tool Calling(LLM이 사용) → MCP(연결 표준화).** 각 단계 결과물이 다음 단계에서 재사용된다.

## 세부 커리큘럼

### 실습 0. 환경 준비
- Python 3.10+, Node.js(Inspector용), `ANTHROPIC_API_KEY` 설정
- → [examples/README.md](examples/README.md)

### 실습 1. REST API / FastAPI
> MCP 서버도 결국 API 서버. 클라이언트/서버·JSON·스키마 검증이 전제 지식이 된다.

| 단계 | 내용 | 확인 포인트 | 파일 |
|---|---|---|---|
| 1-1 | Hello FastAPI | `/docs` 호출, `/openapi.json` 구경, `/items/abc`→422 | [main.py](examples/01-fastapi/main.py) |
| 1-2 | Todo CRUD API | 5개 엔드포인트, 잘못된 바디→422, 없는 id→404 | [todo_api.py](examples/01-fastapi/todo_api.py) |
| 1-2 | httpx 클라이언트 | 스크립트로 자기 API 호출 = "LLM 입장" 체험 | [client.py](examples/01-fastapi/client.py) |

### 실습 2. LLM Tool Calling (raw SDK → LangGraph)
> tool calling = 구조화된 API 호출. agentic loop가 에이전트의 본질.

| 단계 | 내용 | 확인 포인트 | 파일 |
|---|---|---|---|
| 2-1 | 수동 agentic loop | `stop_reason: tool_use` 2회(멀티스텝), `tool_use_id` 매칭 | [manual_agent.py](examples/02-tool-calling/manual_agent.py) |
| 2-2 | LangGraph 재구성 | while 루프 = 그래프 cycle, `thread_id`로 메모리 | [graph_agent.py](examples/02-tool-calling/graph_agent.py) |
| 2-3 | prebuilt 비교 | 추상화 3단계(수동/그래프/`create_agent`) | [prebuilt_agent.py](examples/02-tool-calling/prebuilt_agent.py) |

### 실습 3. MCP 서버 제작과 연결
> 코드에 하드코딩한 툴을 별도 서버로 분리하고, 표준 프로토콜로 어디서나 연결한다.

| 단계 | 내용 | 확인 포인트 | 파일 |
|---|---|---|---|
| 3-1 | 날씨 MCP 서버 | `@mcp.tool()`, stdio, `print()` 금지 | [weather.py](examples/03-mcp/weather.py) |
| 3-2 | Inspector 테스트 | `npx @modelcontextprotocol/inspector`, JSON-RPC 관찰 | (위 서버) |
| 3-3 | Claude 연결 | Claude Desktop/Code에 등록, 코드 수정 없이 재사용 | (위 서버) |
| 3-4 | Todo API → MCP화 | fastapi-mcp 3줄, "REST 엔드포인트 = MCP 도구" | [todo_mcp.py](examples/03-mcp/todo_mcp.py) |
| 3-5 | LangGraph + MCP | langchain-mcp-adapters로 stdio+HTTP 서버 동시 연결 | [mcp_agent.py](examples/03-mcp/mcp_agent.py) |

---

# 3단계 — 한국어 보충 (필요할 때만)

개념이 막히거나 한국어로 다시 정리하고 싶을 때만 본다.

| 자료 | 형태 | 세부 내용 |
|---|---|---|
| [테디노트 MCP 가이드 (WikiDocs)](https://wikidocs.net/book/17801) | 교재 (무료) | LangChain 기반 MCP 구축 + Cursor AI 연동. Host/Client/Server, 우리가 LangGraph도 하니 강사 연속성이 좋음 |
| [조코딩 유튜브](https://www.youtube.com/@jocoding) | 영상 (무료) | MCP 제작·활용, 입문·쉬움, 빠르게 감 잡기 |
| [MCP 통합 가이드 (WikiDocs, FastMCP)](https://wikidocs.net/289908) | 문서 (무료) | FastMCP 서버 개발 한국어 |
| [프롬프트해커 대니: MCP 서버 총정리](https://www.magicaiprompts.com/docs/claude/mcp-server/) | 블로그 (무료) | 10분 초보자 가이드 |

> **나중에(기초 익힌 뒤) 볼 것:** [전현준 × 테디노트 MCP/A2A 엔터프라이즈 집중탐구 (유튜브)](https://www.youtube.com/watch?v=z2rnK9COhuQ) — 강의가 아니라 약 3시간짜리 **대담**이다. 기초가 있는 상태에서 실무·업계 관점을 듣는 용도. 첫 자료로는 비효율적이니 순서상 마지막에.

---

## 한 줄 요약

**DeepLearning.AI 12강(1.5h, 영어 자막) → 이 저장소 examples 직접 실행 → 막힐 때 테디노트.** 이게 가장 빠르고 정확한 길이다.
