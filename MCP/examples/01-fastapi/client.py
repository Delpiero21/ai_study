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


if __name__ == "__main__":
    main()
