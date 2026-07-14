"""실습 1-2 도전 과제. httpx로 자기 API 호출하기

먼저 다른 터미널에서 서버를 켜둔다:
    fastapi dev todo_api.py

그 다음 실행:
    python client.py

→ 여기서 하는 일(스키마를 보고 → 요청을 만들어 → 호출)이
   실습 2에서 LLM이 tool을 호출하며 하는 일과 정확히 같다.
"""
import httpx

BASE = "http://127.0.0.1:8000"


def main():
    # 1) 생성 (POST → 201)
    r = httpx.post(f"{BASE}/todos", json={"title": "MCP 공부"})
    print("POST /todos:", r.status_code, r.json())

    # 2) 목록 조회 (GET)
    r = httpx.get(f"{BASE}/todos")
    print("GET /todos:", r.status_code, r.json())

    # 3) 잘못된 바디 → 422 관찰
    r = httpx.post(f"{BASE}/todos", json={"name": "잘못된 필드"})
    print("POST (bad body):", r.status_code, r.json())

    # 4) 없는 id 조회 → 404
    r = httpx.get(f"{BASE}/todos/999")
    print("GET /todos/999:", r.status_code, r.json())

    # 5) HTTP 헤더 + 인증 예제 --------------------------------
    #    요청에 헤더를 직접 붙여서 보낸다.
    headers = {
        "Content-Type": "application/json",         # 본문 형식
        "Authorization": "Bearer my-test-token",    # 인증 헤더 (Bearer 토큰 방식)
        "Accept": "application/json",               # 받고 싶은 형식
    }
    r = httpx.post(f"{BASE}/todos", json={"title": "헤더 테스트"}, headers=headers)

    print("\n--- HTTP 헤더/인증 예제 ---")
    print("상태코드:", r.status_code)               # 상태 코드 (201 등)
    print("보낸 요청 헤더:", dict(r.request.headers))  # 우리가 보낸 헤더 (Authorization 포함)
    print("받은 응답 헤더:", dict(r.headers))          # 서버가 보낸 헤더 (Content-Type 등)
    print("본문:", r.json())


if __name__ == "__main__":
    main()
