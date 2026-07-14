# 주제 2 · LLM Tool Calling (이론 + 실습)

> LLM이 스스로 "도구를 써야겠다"고 판단하고, 우리가 만든 함수를 호출해 답하는 원리.
> **로컬 Ollama 기반이라 API 키·인터넷 없이** 돌아간다 (모델만 받아두면 됨).

---

## 이론

### tool calling이 뭔가
LLM은 원래 "말"만 한다. 도구(tool)를 주면, 필요할 때 **"이 도구를 이 인자로 실행해줘"** 하고 요청할 수 있다.
실제 실행은 우리 코드가 하고, 결과를 다시 모델에게 돌려주면 모델이 그걸 보고 최종 답을 만든다.

### 핵심 사이클 = agentic loop
```
① 도구 스키마 정의 (name·description·parameters)
② 모델 호출 → 모델이 "도구 호출" 요청 (tool_calls)
③ 우리가 그 함수를 실행
④ 결과를 모델에게 되돌려줌
⑤ 모델이 도구 없이 답하면 종료, 아니면 ②로 반복
```
이 반복(loop)이 "에이전트"의 본질이다.

### description이 중요하다
모델은 도구의 **description을 보고 언제 쓸지 판단**한다. 설명이 부실하면 도구를 안 부르거나 잘못 부른다.

---

## 실습

| 파일 | 내용 | 배우는 것 |
|---|---|---|
| `manual_loop.py` | 프레임워크 없이 **손으로** 루프 구현 | tool calling의 원리(②~⑤)를 눈으로 |
| `langchain_agent.py` | LangChain/LangGraph가 루프를 **대신** 처리 | 프레임워크가 감춰주는 것 |

둘 다 같은 도구(`get_weather`, `calculator`)를 쓰고, qwen2.5가 스스로 호출한다.

### 준비
```bash
# Ollama 설치 후 모델 받기 (한 번)
ollama pull qwen2.5
```

### 실행
```bash
# 수동 루프 (원리 체득)
uv run --with ollama python manual_loop.py

# 프레임워크 버전
uv run --with "langchain,langgraph,langchain-ollama" python langchain_agent.py
```

기대 결과: 모델이 `get_weather("서울")`와 `calculator("12 * 8")`를 호출 →
"서울의 현재 날씨는 맑음, 24도입니다. 그리고 12 곱하기 8은 96입니다."

> 로컬 소형 모델이 도구를 안 부르면 → 질문을 "반드시 도구를 사용해서…"로 강조하거나 모델을 바꿔본다.

---

## 다음 주제와의 연결
- 지금은 도구를 **내 코드 안에** 정의했다.
- 주제 3(MCP)는 이 도구의 **정의·실행을 별도 서버로 분리**하고 표준화한 것.
- tool calling 루프(②~⑤)는 MCP에서도 **완전히 동일**하다 — 실행 위치만 내부 → 외부 서버로 바뀐다.
