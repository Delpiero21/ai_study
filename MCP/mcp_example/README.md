# mcp_example — FastMCP 순수 학습 예제

Claude(`cli_project`)와 **분리된** 폴더. LLM · API 키 · 인터넷 **전혀 필요 없음.**
MCP 서버의 3대 프리미티브(Tools · Resources · Prompts)를 Inspector로 직접 눌러보며 배운다.

> 원리: LLM이 도구를 호출하는 대신, **내가 웹 UI에서 버튼을 눌러** 도구를 실행한다. (내가 '뇌' 역할)

## 준비물
- Python 3.10+
- Node.js (Inspector 실행용)
- (API 키 불필요)

## 실행 방법

### 방법 A — uv (권장, 가장 간단)
```bash
uv run --with "mcp[cli]" mcp dev server.py
```

### 방법 B — 일반 venv
```bash
python -m venv .venv
.venv\Scripts\activate        # Windows (Git Bash: source .venv/Scripts/activate)
pip install -r requirements.txt
mcp dev server.py
```

→ 터미널에 `http://127.0.0.1:6274` 주소가 뜨면 브라우저로 열기.

## Inspector에서 확인할 것

브라우저에서 **Connect** 누른 뒤, 상단 세 탭을 각각 확인:

| 탭 | 확인 | 해보기 |
|---|---|---|
| **Tools** | `add`, `get_weather` 보임 | `add` → a=2, b=3 → Run → **5** / `get_weather` → city=서울 → **맑음, 24도** |
| **Resources** | `weather://cities` (목록) | 클릭 → 도시 목록 JSON 확인 |
| **Resource Templates** | `weather://cities/{city}` | city=부산 입력 → **흐림, 22도** |
| **Prompts** | `weather_report` | city=제주 입력 → 생성된 프롬프트 문장 확인 |

### 에러도 일부러 내보기
- `get_weather` 에 없는 도시(예: `런던`) → 에러 메시지 뜨는지 (검증 동작 확인)

## 다음 단계
- 서버 동작을 눈으로 확인했으면 → 여기에 도구/리소스를 더 추가해보기
- LLM과 연결하고 싶으면 → (키 없이) Ollama 로컬 모델, 또는 Gemini 무료 키로 별도 클라이언트 붙이기
- 핵심 개념 복습 → 상위 폴더의 [강의노트.md](../강의노트.md)
