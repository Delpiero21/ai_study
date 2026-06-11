# MCP 스터디 자료 공유

안녕하세요.

MCP 스터디 자료 정리해서 공유드립니다.

저장소: https://github.com/Delpiero21/ai_study (MCP 폴더)

진행 순서: REST API → LLM Tool Calling → MCP

## ■ MCP 이론.md (세션 전 예습용)

1. REST API / FastAPI : HTTP 메서드·상태 코드, Pydantic 검증, Swagger 자동 문서
2. LLM Tool Calling : tool schema, agentic loop, LangGraph(StateGraph/ToolNode/메모리)
3. MCP : 아키텍처(Host-Client-Server), JSON-RPC, 전송 방식(stdio/HTTP), Tools·Resources·Prompts

- 주제별 추천 자료(공식 문서·무료 강좌) 포함

## ■ MCP 실습.md (세션 당일 워크북)

1. FastAPI로 Todo CRUD API 제작 → Swagger/curl로 호출
2. raw SDK로 agentic loop 직접 구현 → 같은 걸 LangGraph로 재구성
3. 날씨 MCP 서버 제작 → Inspector 테스트 → Claude 연결 → 1·2단계 결과물과 통합

- 단계별 실행 코드 + 체크포인트 + 도전 과제 포함
- 각 단계 결과물을 다음 단계에서 재사용 (1단계 Todo API → 3단계 MCP 서버화)

준비물: Python 3.10+, Node.js, LLM API 키

일정/진행 방식 의견 주시면 반영하겠습니다.

감사합니다.
