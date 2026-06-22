"""실습 2-1. Raw SDK로 수동 agentic loop (프레임워크 금지)

준비:
    pip install anthropic
    export ANTHROPIC_API_KEY="sk-ant-..."   # Windows: $env:ANTHROPIC_API_KEY="..."

실행:
    python manual_agent.py

확인:
    - stop_reason: tool_use 가 두 번 찍히는지 (날씨 조회 → 화씨→섭씨 계산, 멀티스텝)
    - block.input 이 우리가 정의한 JSON Schema대로 들어오는지

에이전트의 본질은 아래 while 루프가 전부다.
"""
import anthropic

client = anthropic.Anthropic()

# 1) 툴 스키마 정의 — 실습 1의 openapi.json과 비교해 볼 것
tools = [
    {
        "name": "get_weather",
        "description": "지정한 도시의 현재 날씨를 조회한다.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "도시 이름 (예: Seoul)"}
            },
            "required": ["city"],
        },
    },
    {
        "name": "calculator",
        "description": "수식 문자열을 계산해 결과를 돌려준다. 예: '(72 - 32) * 5 / 9'",
        "input_schema": {
            "type": "object",
            "properties": {"expression": {"type": "string"}},
            "required": ["expression"],
        },
    },
]


# 2) 실제 실행 함수 (실습용 더미)
def get_weather(city: str) -> str:
    return f"{city}: 맑음, 화씨 73도"


def calculator(expression: str) -> str:
    return str(eval(expression))  # 실습용. 실전에서는 eval 금지


def run_tool(name: str, args: dict) -> str:
    if name == "get_weather":
        return get_weather(**args)
    if name == "calculator":
        return calculator(**args)
    return f"unknown tool: {name}"


# 3) 수동 agentic loop
messages = [{"role": "user", "content": "서울 날씨 알려주고, 기온을 섭씨로 변환해줘"}]

while True:
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=16000,
        tools=tools,
        messages=messages,
    )
    print(f"--- stop_reason: {response.stop_reason}")

    if response.stop_reason != "tool_use":
        break  # 모델이 툴 호출 없이 텍스트로 답하면 종료

    # 모델의 응답(tool_use 블록 포함)을 대화에 그대로 추가
    messages.append({"role": "assistant", "content": response.content})

    # tool_use 블록을 전부 실행하고 결과를 모아서 반환
    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            print(f"    tool: {block.name}({block.input})")
            result = run_tool(block.name, block.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,  # 어떤 호출의 결과인지 매칭 (필수)
                "content": result,
            })
    messages.append({"role": "user", "content": tool_results})

print(next(b.text for b in response.content if b.type == "text"))
