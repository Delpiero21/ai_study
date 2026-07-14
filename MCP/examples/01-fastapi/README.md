# 주제 1 · REST API 이해 + FastAPI 실습 (이론 + 실습)

> 기능을 외부에 노출하는 표준 방식 = REST API. MCP 서버도 결국 API 서버이므로 여기가 토대다.
> **API 키·인터넷 불필요** (로컬에서 서버 띄우고 호출).

---

## 이론

### REST API 기초
- **클라이언트–서버 구조**: 요청(메서드+URL+헤더+바디) → 응답(상태코드+바디)
- **HTTP 메서드 = CRUD**: GET(조회) · POST(생성) · PUT/PATCH(수정) · DELETE(삭제)
- **상태 코드**: 200(성공) · 201(생성됨) · 404(없음) · 422(검증 실패) · 500(서버 오류)
- **JSON**으로 데이터 주고받음, URL은 리소스 중심(`/todos/{id}`)

### FastAPI
- 파이썬으로 API를 빠르게 만드는 프레임워크
- **타입 힌트 + Pydantic**으로 요청 자동 검증 (틀리면 자동 422)
- **자동 문서**: `/docs`(Swagger UI)에서 브라우저로 API를 눌러 테스트

---

## 실습

| 파일 | 내용 |
|---|---|
| `main.py` | Hello FastAPI — 엔드포인트·타입검증·`/docs` |
| `todo_api.py` | Todo CRUD API — 5개 엔드포인트, 404/422 처리 |
| `client.py` | httpx로 자기 API 호출 ("LLM이 API 부르는 입장" 체험) |

### 준비
```bash
pip install "fastapi[standard]" httpx
# 또는:  uv run --with "fastapi[standard],httpx" fastapi dev main.py
```

### 실행
```bash
fastapi dev main.py        # → http://127.0.0.1:8000/docs 에서 직접 호출
fastapi dev todo_api.py    # Todo CRUD
python client.py           # (서버 켠 상태에서) 스크립트로 호출
```

### 확인 포인트
- `/docs`에서 버튼으로 호출해보기
- `GET /items/abc` → **422** (타입 힌트만으로 자동 검증)
- 없는 id로 GET → **404**

---

## 다음 주제와의 연결
- FastAPI가 자동 생성하는 `/openapi.json`(도구 명세)은 **주제 2의 tool 스키마와 사실상 같은 형태**.
- "Swagger UI에서 사람이 누르던 버튼을, 주제 2에서는 LLM이 대신 누른다."
- 주제 3(MCP): Resources ≈ GET(읽기), Tools ≈ POST(실행). MCP 서버 = API 서버.
