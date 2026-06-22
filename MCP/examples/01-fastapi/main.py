"""실습 1-1. Hello FastAPI

실행:
    pip install "fastapi[standard]"
    fastapi dev main.py

확인:
    - http://127.0.0.1:8000/docs  (Swagger UI에서 직접 호출)
    - http://127.0.0.1:8000/openapi.json  (이 스키마가 실습 2의 tool schema와 사실상 같다)
    - curl "http://127.0.0.1:8000/items/5?q=test"
    - curl http://127.0.0.1:8000/items/abc   → 422 (타입 힌트만으로 자동 검증)
"""
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    # item_id: int 타입 힌트만으로 /items/abc 호출이 자동으로 422가 된다
    return {"item_id": item_id, "q": q}
