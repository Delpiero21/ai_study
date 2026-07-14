# 3주제 학습 — 이론 + 실습 (전부 로컬, API 키 불필요)

원래 스터디 계획 그대로, 각 주제를 **이론 정리(README) + 바로 실행되는 실습 코드**로 맞췄다.
흐름: **REST API(기능 노출) → Tool Calling(LLM이 사용) → MCP(연결 표준화)** — 각 단계가 다음의 토대.

```
examples/
├── 01-fastapi/        주제 1 · REST API / FastAPI
├── 02-tool-calling/   주제 2 · LLM Tool Calling (로컬 Ollama)
└── 03-mcp/            주제 3 · MCP (실습 메인은 ../mcp_example/)
```

## 주제별 요약

| # | 주제 | 이론 | 실습 (키 없이) | 실행 |
|---|---|---|---|---|
| 1 | REST API / FastAPI | [01-fastapi/README](01-fastapi/README.md) | main.py · todo_api.py · client.py | `fastapi dev main.py` |
| 2 | LLM Tool Calling | [02-tool-calling/README](02-tool-calling/README.md) | manual_loop.py · langchain_agent.py | `uv run --with ollama python manual_loop.py` |
| 3 | MCP | [03-mcp/README](03-mcp/README.md) · [강의노트](../강의노트.md) | [../mcp_example/](../mcp_example/) (mcp_server + mcp_host) | `python mcp_host.py` |

## 공통 준비물
- Python 3.10+
- 주제 2·3(Ollama): [Ollama](https://ollama.com/download) 설치 + `ollama pull qwen2.5`
- 주제 3(Inspector): Node.js
- **API 키 불필요** — 전부 로컬에서 동작 (사내에서도 그대로)

> 사내(다른 PC) 재현: [mcp_example/SETUP-사내재현.md](../mcp_example/SETUP-사내재현.md) 참고. qwen2.5 모델은 주제 2·3 공용.
