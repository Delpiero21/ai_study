# 주제 3 · MCP 조사 및 실습 (이론 + 실습)

> tool calling(주제 2)을 표준 프로토콜로 만든 것이 MCP. 도구의 정의·실행을 별도 서버로 분리한다.

---

## 이론
- **MCP** = AI 애플리케이션을 외부 도구·데이터에 잇는 오픈 표준 ("AI의 USB-C").
- **3요소**: Host(지휘관) · Client(중개자) · Server(도구 제공).
- **서버 프리미티브**: Tools(실행) · Resources(읽기) · Prompts(템플릿).
- **전송 방식**: stdio(로컬) · Streamable HTTP(원격).

자세한 이론 정리 → 상위 폴더 [강의노트.md](../../강의노트.md) / 발표자료 [mcp_스터디.pptx](../../mcp_스터디.pptx)

---

## 실습 (권장: 키 없이 돌아가는 완성본)

**★ MCP 실습의 메인은 [../../mcp_example/](../../mcp_example/) 입니다** — 로컬 Ollama 기반이라 API 키 없이 사내에서도 동작.
- `mcp_server.py` (서버) + `mcp_host.py` (호스트+클라이언트, 대화형)
- 실행법: [mcp_example/SETUP-사내재현.md](../../mcp_example/SETUP-사내재현.md)

### 이 폴더의 참고용 개별 예제
| 파일 | 내용 | 키 필요? |
|---|---|---|
| `weather.py` | FastMCP 날씨 서버 (NWS 실제 API) | 인터넷 필요 |
| `todo_mcp.py` | 주제 1의 Todo API를 fastapi-mcp로 MCP화 | 불필요 |
| `mcp_agent.py` | LangGraph 에이전트에 MCP 툴 연결 | ⚠️ Anthropic API 키 필요 |

> 키 없이 MCP 전체 흐름을 보려면 `mcp_example`의 `mcp_host.py`(Ollama)를 쓰세요.
