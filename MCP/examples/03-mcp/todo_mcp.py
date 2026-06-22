"""실습 3-4. 실습 1의 Todo API를 MCP 서버로

실습 1의 todo_api.py에 fastapi-mcp 3줄을 더한 것이 전부다.
REST 엔드포인트 5개가 그대로 MCP 도구로 자동 변환된다.

준비:
    pip install "fastapi[standard]" fastapi-mcp

실행:
    fastapi dev todo_mcp.py

확인 (Inspector, Streamable HTTP):
    npx @modelcontextprotocol/inspector
    → Transport: Streamable HTTP, URL: http://127.0.0.1:8000/mcp
    → REST 엔드포인트 5개가 MCP 툴로 보이는지 확인 ("REST 엔드포인트 = MCP 도구")
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi_mcp import FastApiMCP

app = FastAPI()


class Todo(BaseModel):
    title: str
    done: bool = False


todos: dict[int, Todo] = {}
next_id = 1


@app.post("/todos", status_code=201, operation_id="create_todo")
def create_todo(todo: Todo):
    global next_id
    todos[next_id] = todo
    next_id += 1
    return {"id": next_id - 1, **todo.model_dump()}


@app.get("/todos", operation_id="list_todos")
def list_todos():
    return [{"id": i, **t.model_dump()} for i, t in todos.items()]


@app.get("/todos/{todo_id}", operation_id="get_todo")
def get_todo(todo_id: int):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"id": todo_id, **todos[todo_id].model_dump()}


@app.put("/todos/{todo_id}", operation_id="update_todo")
def update_todo(todo_id: int, todo: Todo):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    todos[todo_id] = todo
    return {"id": todo_id, **todo.model_dump()}


@app.delete("/todos/{todo_id}", status_code=204, operation_id="delete_todo")
def delete_todo(todo_id: int):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    del todos[todo_id]


# --- 여기 3줄이 핵심: 기존 FastAPI 앱을 MCP 서버로 노출 ---
mcp = FastApiMCP(app)
mcp.mount_http()   # fastapi-mcp < 0.4 버전은 mcp.mount()
