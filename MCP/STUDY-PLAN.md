# MCP 스터디 진행 계획

> 파트장 공유용 진행 계획. 세부 실습 목차 포함.
> 상세 커리큘럼은 [CURRICULUM.md](CURRICULUM.md), 실행 코드는 [examples/](examples/).

## 1. 목표

MCP(Model Context Protocol)를 직접 서버로 만들고 클라이언트에 연결할 수 있는 수준까지 익힌다. MCP는 결국 API 서버이고, LLM 도구 호출(tool calling)을 표준화한 것이므로, 그 두 가지 선수지식을 먼저 다진 뒤 MCP 본체로 들어간다.

**학습 흐름:** REST API(기능 노출) → Tool Calling(LLM이 사용) → MCP(연결 표준화)

## 2. 진행 방식 (3단계)

공식 강의(영어)로 전체 그림을 잡고 → 직접 코드를 돌려보며 익히고 → 막히는 부분만 한국어 자료로 보충한다. MCP만 깊게 다루는 한국어 영상 강의는 사실상 없어, 공식 강의를 기준으로 잡았다.

### [1단계] 공식 강의 — DeepLearning.AI "MCP: Build Rich-Context AI Apps" (무료, 약 1.5시간)

MCP를 만든 Anthropic이 직접 참여한 12강 강의.

- Why MCP / MCP Architecture (Host–Client–Server, JSON-RPC, 전송 방식)
- Creating an MCP Server / Client
- Connecting to Reference Servers
- Adding Prompt and Resource Features
- Configuring Servers for Claude Desktop / Deploying Remote Servers

### [2단계] 직접 실습 — 세부 목차 (저장소 examples 코드)

각 단계의 결과물이 다음 단계에서 재사용되도록 설계.

**실습 0. 환경 준비**
- Python 3.10+, Node.js(Inspector용), API 키 설정

**실습 1. REST API / FastAPI — MCP 서버의 기반**
- 1-1. Hello FastAPI: 엔드포인트 작성, `/docs`로 호출, 타입 검증(422) 확인
- 1-2. Todo CRUD API: 생성·조회·수정·삭제 5개 엔드포인트, 404/422 처리
- 1-3. httpx 클라이언트: 스크립트로 자기 API 호출 (LLM이 API를 호출하는 입장 체험)

**실습 2. LLM Tool Calling**
- 2-1. 수동 도구 호출 루프: 도구 스키마 정의 → 모델 호출 → 실행 → 결과 반환 루프를 직접 구현 (멀티스텝 확인)
- 2-2. LangGraph 재구성: 같은 에이전트를 그래프(상태·노드·조건분기)로 재구성, 대화 메모리 추가
- 2-3. prebuilt 비교: `create_agent` 한 줄 버전과 비교, 추상화 단계 정리

**실습 3. MCP 서버 제작과 연결 — 본체**
- 3-1. 날씨 MCP 서버 제작 (FastMCP, stdio 전송)
- 3-2. MCP Inspector로 테스트 (도구 목록·호출, JSON-RPC 메시지 관찰)
- 3-3. Claude Desktop / Claude Code에 서버 연결
- 3-4. 실습 1의 Todo API를 MCP 서버로 변환 (REST 엔드포인트 = MCP 도구)
- 3-5. 실습 2의 LangGraph 에이전트에 MCP 도구 연결 (여러 서버 동시 사용)

> 실행 코드와 단계별 확인 포인트는 [CURRICULUM.md](CURRICULUM.md) 2단계와 [examples/](examples/)에 정리.

### [3단계] 한국어 보충 (필요 시)

- [테디노트 MCP 가이드 (WikiDocs, LangChain 기반)](https://wikidocs.net/book/17801)
- [FastMCP 서버 개발 가이드 (WikiDocs)](https://wikidocs.net/289908)

## 3. 예상 소요

하루 1시간 기준 약 3주, 하루 2시간 기준 약 1.5주. 환경 설정(Python, Node.js, API 키)은 첫 세션 전 각자 준비해오는 것으로 하면 일정을 줄일 수 있다.
