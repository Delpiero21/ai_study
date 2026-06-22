"""실습 1-2. Todo CRUD API (메모리 dict 저장소, DB 없이)

실행:
    fastapi dev todo_api.py

확인:
    - /docs 에서 5개 엔드포인트 전부 테스트 (POST → GET → PUT → DELETE)
    - POST에 {"name": "잘못된 필드"} 보내기 → 422 응답 바디 관찰
    - 없는 id로 GET → 404
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class Todo(BaseModel):
    title: str
    done: bool = False


todos: dict[int, Todo] = {}
next_id = 1


@app.post("/todos", status_code=201)
def create_todo(todo: Todo):
    global next_id
    todos[next_id] = todo
    next_id += 1
    return {"id": next_id - 1, **todo.model_dump()}


@app.get("/todos")
def list_todos():
    return [{"id": i, **t.model_dump()} for i, t in todos.items()]


@app.get("/todos/{todo_id}")
def get_todo(todo_id: int):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"id": todo_id, **todos[todo_id].model_dump()}


@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: Todo):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    todos[todo_id] = todo
    return {"id": todo_id, **todo.model_dump()}


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    del todos[todo_id]
