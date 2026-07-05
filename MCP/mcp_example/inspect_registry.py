"""등록된 목록(registry)을 실제로 찍어보는 스크립트.

server.py를 import 하면 @mcp.tool 등이 실행되며 mcp 인스턴스에 등록된다.
(if __name__ == "__main__" 가드 덕분에 import 만으로는 서버가 시작되지 않음)

실행:
    uv run --with "mcp[cli]" python inspect_registry.py
"""
import asyncio
from server import mcp


async def main():
    tools = await mcp.list_tools()
    print("TOOLS      :", [t.name for t in tools])

    resources = await mcp.list_resources()
    print("RESOURCES  :", [str(r.uri) for r in resources])

    templates = await mcp.list_resource_templates()
    print("TEMPLATES  :", [t.uriTemplate for t in templates])

    prompts = await mcp.list_prompts()
    print("PROMPTS    :", [p.name for p in prompts])


if __name__ == "__main__":
    asyncio.run(main())
