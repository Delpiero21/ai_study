# 사내 PC에서 처음부터 재현하기 (Ollama 로컬 LLM + MCP)

> 목표: **API 키 없이**, 로컬 모델(Ollama)이 내 MCP 서버(`server.py`)의 도구를 자동 호출하게 만들기.
> 사내 PC는 집 PC와 **다른 기계**이므로, 아래를 처음부터 그대로 따라 한다.
> ⚠️ 인터넷이 필요한 단계(★)는 **인터넷 되는 곳에서 미리** 끝내둘 것.

---

## 0. 사전 확인
- Windows PC
- 관리자 설치 권한 (Ollama 설치용) — 사내 정책 확인 필요

## 1. ★ 저장소 받기 (인터넷)
```bash
git clone https://github.com/Delpiero21/ai_study.git
cd ai_study/MCP/mcp_example
```

## 2. ★ Ollama 설치 (인터넷)
- https://ollama.com/download 에서 설치
- 확인:
```bash
ollama --version
```

## 3. ★ 모델 준비 — qwen2.5 (인터넷, 약 4.7GB)
사내에서 인터넷이 되면 그냥 받는다:
```bash
ollama pull qwen2.5
ollama list        # qwen2.5:latest 보이면 OK
```

### 사내가 완전 오프라인이면 → 모델 파일 복사
- 집 PC의 모델 폴더를 통째로 USB 등으로 복사:
  ```
  C:\Users\<집-사용자명>\.ollama\models
     →  사내 PC의  C:\Users\<사내-사용자명>\.ollama\models
  ```
- 복사 후 사내에서 `ollama list` 로 qwen2.5 보이면 성공.

## 4. ★ 파이썬 의존성 설치 (인터넷)
uv 사용 (권장, 빠름):
```bash
uv venv
uv pip install "mcp[cli]" langchain langgraph langchain-mcp-adapters langchain-ollama
```
uv 없으면:
```bash
python -m venv .venv
.venv\Scripts\activate
pip install "mcp[cli]" langchain langgraph langchain-mcp-adapters langchain-ollama
```

> 여기까지가 인터넷 필요 단계. 이후는 오프라인 OK.

## 5. Ollama 서버 켜기
보통 설치 시 자동 실행(트레이 아이콘). 안 켜져 있으면:
```bash
ollama serve
```
(이 창은 켜둔 채로, 새 터미널에서 다음 단계 진행)

## 6. 실행
```bash
# venv 사용 (활성화했다면 python 그대로)
.venv\Scripts\python ollama_chat.py
# 또는 활성화 상태면:  python ollama_chat.py
```

### 기대 출력
```
연결된 도구: ['add', 'get_weather', 'convert_temp', 'add_city', 'city_count', ...]

=== 최종 답변 ===
서울의 현재 날씨는 맑음, 24도입니다. (유사 답변)
```

---

## 문제 해결

| 증상 | 원인 / 해결 |
|---|---|
| `could not connect to a running Ollama instance` | Ollama 서버 안 켜짐 → `ollama serve` 실행 |
| `model 'qwen2.5' not found` | 모델 없음 → `ollama pull qwen2.5` 또는 3번 복사 |
| `No module named mcp` / `langchain...` | venv에 설치 안 됨 → 4번 다시, 실행도 venv 파이썬으로 |
| 모델이 도구를 안 부르고 그냥 대답함 | 로컬 모델 한계 → 질문을 "반드시 도구를 사용해서"로 강조 / `MODEL`을 `llama3.1`로 변경 |
| `server.py` 관련 에러 | 실행 위치가 `mcp_example` 폴더인지 확인 (server.py 가 같은 폴더에 있어야 함) |
| `LangGraphDeprecated... create_react_agent` 경고 | **에러 아님, 무시 OK.** 정상 동작함 (집 PC에서 qwen2.5로 검증 완료) |

> ✅ 검증 완료: 집 PC에서 qwen2.5 + 이 서버로 실행 → 모델이 `get_weather("서울")` 를 자동 호출 →
> "서울의 현재 날씨는 맑음, 24도입니다" 정상 출력 확인. 사내에서도 동일하게 동작함.

## 핵심 요약 (체크리스트)
- [ ] git clone (저장소)
- [ ] Ollama 설치
- [ ] qwen2.5 모델 (pull 또는 폴더 복사)
- [ ] venv + 의존성 설치
- [ ] `ollama serve` 실행 중
- [ ] `python ollama_chat.py`

이 6개가 되면 사내에서도 키 없이 로컬로 돌아간다.
