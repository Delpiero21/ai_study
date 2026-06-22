# MCP 스터디 실습 예제 코드

[추천 학습법.md](../추천%20학습법.md) 2단계 커리큘럼의 모든 실습을 바로 실행 가능한 코드로 정리했다.
폴더 순서대로 따라가면 된다.

```
examples/
├── 01-fastapi/        실습 1: REST API / FastAPI
├── 02-tool-calling/   실습 2: LLM Tool Calling (raw SDK → LangGraph)
└── 03-mcp/            실습 3: MCP 서버 제작과 연결
```

## 공통 준비물

- Python 3.10 이상
- Node.js (실습 3의 MCP Inspector용)
- `ANTHROPIC_API_KEY` 환경 변수 (실습 2부터 필요)

```bash
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-..."

# macOS / Linux
export ANTHROPIC_API_KEY="sk-ant-..."
```

각 폴더의 `requirements.txt`로 의존성을 설치한다.

```bash
pip install -r 01-fastapi/requirements.txt
```

## 단계별 실행 순서 요약

| 단계 | 파일 | 실행 |
|---|---|---|
| 1-1 | `01-fastapi/main.py` | `fastapi dev main.py` → http://127.0.0.1:8000/docs |
| 1-2 | `01-fastapi/todo_api.py` | `fastapi dev todo_api.py` |
| 1-2 | `01-fastapi/client.py` | (서버 켠 상태에서) `python client.py` |
| 2-1 | `02-tool-calling/manual_agent.py` | `python manual_agent.py` |
| 2-2 | `02-tool-calling/graph_agent.py` | `python graph_agent.py` |
| 2-3 | `02-tool-calling/prebuilt_agent.py` | `python prebuilt_agent.py` |
| 3-1 | `03-mcp/weather.py` | `python weather.py` (또는 Inspector로 실행) |
| 3-2 | `03-mcp/weather.py` | `npx @modelcontextprotocol/inspector python weather.py` |
| 3-4 | `03-mcp/todo_mcp.py` | `fastapi dev todo_mcp.py` → /mcp |
| 3-5 | `03-mcp/mcp_agent.py` | `python mcp_agent.py` |

> 각 단계의 확인 포인트와 세부 커리큘럼은 [추천 학습법.md](../추천%20학습법.md) 2단계에 정리되어 있다.
