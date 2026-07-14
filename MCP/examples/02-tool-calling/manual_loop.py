"""주제 2 · LLM Tool Calling — 수동 루프 (로컬 Ollama, API 키 불필요)

tool calling의 '원리'를 직접 눈으로 보는 예제.
프레임워크 없이, 모델이 도구를 부르고 → 우리가 실행하고 → 결과를 돌려주는
루프(agentic loop)를 손으로 구현한다.

준비:
    Ollama 설치 + 모델:  ollama pull qwen2.5
    실행:  uv run --with ollama python manual_loop.py
          (또는  pip install ollama  후  python manual_loop.py)
"""
import ollama

MODEL = "qwen2.5"

# 1) 실제 실행될 함수 (도구의 몸통)
WEATHER = {"서울": "맑음, 24도", "부산": "흐림, 22도", "제주": "비, 20도"}


def get_weather(city: str) -> str:
    return WEATHER.get(city, f"{city} 날씨 데이터 없음")


def calculator(expression: str) -> str:
    return str(eval(expression))  # 학습용. 실전에서는 eval 금지


FUNCS = {"get_weather": get_weather, "calculator": calculator}

# 2) 도구 스키마 (모델에게 "이런 도구가 있다"고 알려주는 명세)
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "지정한 도시의 현재 날씨를 조회한다.",
            "parameters": {
                "type": "object",
                "properties": {"city": {"type": "string", "description": "도시 이름 (예: 서울)"}},
                "required": ["city"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "수식 문자열을 계산한다. 예: '12 * 8'",
            "parameters": {
                "type": "object",
                "properties": {"expression": {"type": "string"}},
                "required": ["expression"],
            },
        },
    },
]


def main():
    messages = [
        {"role": "system", "content": "너는 한국어로만 답한다. 계산·날씨는 반드시 도구를 사용한다."},
        {"role": "user", "content": "서울 날씨 알려주고, 12 곱하기 8도 계산해줘."},
    ]

    # 3) 수동 agentic loop — tool calling의 본질
    while True:
        resp = ollama.chat(model=MODEL, messages=messages, tools=TOOLS)
        msg = resp["message"]
        messages.append(msg)

        tool_calls = msg.get("tool_calls")
        if not tool_calls:
            print("\n=== 최종 답변 ===")
            print(msg["content"])
            break

        for tc in tool_calls:
            name = tc["function"]["name"]
            args = tc["function"]["arguments"]  # dict
            result = FUNCS[name](**args)
            print(f"[도구 호출] {name}({args}) → {result}")
            # 결과를 tool 메시지로 되돌려준다 (다음 루프에서 모델이 이걸 보고 답함)
            messages.append({"role": "tool", "name": name, "content": str(result)})


if __name__ == "__main__":
    main()
