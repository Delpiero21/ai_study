const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "AI Study";
pres.title = "MCP 강의노트";

const NAVY = "0F2A3F", NAVY2 = "163B57", TEAL = "0D9488", MINT = "5EEAD4";
const TEALTINT = "E1F5EE", INK = "1E293B", MUTE = "64748B", LIGHT = "F1F5F9", WHITE = "FFFFFF";
const F = "Malgun Gothic";
const sh = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 90, opacity: 0.12 });

// ---------- title ----------
let s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: 10.3, y: -1.5, w: 4.6, h: 4.6, fill: { color: NAVY2 } });
s.addText("ANTHROPIC ACADEMY · 강의노트", { x: 0.9, y: 1.9, w: 11, h: 0.5, fontFace: F, fontSize: 15, bold: true, color: MINT, charSpacing: 3, margin: 0 });
s.addText("MCP 강의노트", { x: 0.9, y: 2.5, w: 11, h: 1.1, fontFace: F, fontSize: 50, bold: true, color: WHITE, margin: 0 });
s.addText("Introduction to Model Context Protocol — 한글 정리", { x: 0.9, y: 3.75, w: 11, h: 0.6, fontFace: F, fontSize: 18, color: "CBD5E1", margin: 0 });
s.addText("Tools · Resources · Prompts  /  서버 + 클라이언트 직접 구현", { x: 0.9, y: 4.5, w: 11, h: 0.5, fontFace: F, fontSize: 15, bold: true, color: WHITE, margin: 0 });

// ---------- overview ----------
s = pres.addSlide();
s.background = { color: WHITE };
s.addText("강의 구성", { x: 0.6, y: 0.45, w: 12, h: 0.35, fontFace: F, fontSize: 13, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
s.addText("4개 섹션 · 핵심 11개 레슨", { x: 0.6, y: 0.8, w: 12, h: 0.7, fontFace: F, fontSize: 28, bold: true, color: INK, margin: 0 });
const secs = [
  { n: "1", t: "Introduction", d: "MCP란? · 클라이언트" },
  { n: "2", t: "서버 만들기", d: "프로젝트 설정 · 도구 정의 · Inspector" },
  { n: "3", t: "클라이언트 연결", d: "클라이언트 구현 · 리소스 · 프롬프트" },
  { n: "4", t: "정리 (Wrap up)", d: "3대 프리미티브 리뷰" },
];
let oy = 1.85;
secs.forEach((b) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: oy, w: 12.13, h: 1.15, rectRadius: 0.08, fill: { color: LIGHT }, shadow: sh() });
  s.addShape(pres.shapes.OVAL, { x: 0.95, y: oy + 0.3, w: 0.55, h: 0.55, fill: { color: TEAL } });
  s.addText(b.n, { x: 0.95, y: oy + 0.3, w: 0.55, h: 0.55, align: "center", valign: "middle", fontFace: F, fontSize: 18, bold: true, color: WHITE, margin: 0 });
  s.addText(b.t, { x: 1.75, y: oy + 0.18, w: 4.0, h: 0.5, fontFace: F, fontSize: 18, bold: true, color: INK, valign: "middle", margin: 0 });
  s.addText(b.d, { x: 5.7, y: oy, w: 6.8, h: 1.15, fontFace: F, fontSize: 15, color: MUTE, valign: "middle", margin: 0 });
  oy += 1.28;
});

// ---------- lesson slides (data-driven) ----------
const lessons = [
  { sec: "섹션 1 · INTRODUCTION", t: "MCP란? (Introducing MCP)",
    sum: "도구를 별도 서버로 분리한 통신 표준 — 도구를 매번 직접 코딩하는 수고를 없앤다.",
    pts: ["구조: 클라이언트 ↔ 서버 (서버 안에 tools·resources·prompts)", "도구 정의·실행을 개발자 코드에서 MCP 서버로 분리", "보통 서비스 제공사가 공식 MCP 서버를 제작·배포", "tool use와 같은 게 아니라 상호보완 (누가 도구를 만드냐에 초점)"],
    cli: "학습용이라 클라이언트·서버를 둘 다 구현한다 (실무는 보통 한쪽만)" },
  { sec: "섹션 1 · INTRODUCTION", t: "MCP 클라이언트 (MCP Clients)",
    sum: "내 서버와 MCP 서버 사이의 중개자. 도구를 직접 실행하지 않고 통신만 잇는다.",
    pts: ["전송 방식 무관: stdio · HTTP · WebSocket (흔히 stdio)", "핵심 메시지: list tools(도구 목록) · call tool(실행)", "흐름: 목록 요청 → Claude에 전달 → 실행 요청 → 결과 회신", "클라이언트는 실행 주체가 아니라 통신 중개자"],
    cli: "mcp_client.py 가 이 중개자. chat.py(루프)가 목록·실행을 요청한다" },
  { sec: "섹션 2 · 서버 만들기", t: "프로젝트 설정 (Project Setup)",
    sum: "클라이언트·서버를 한 프로젝트에 같이 만드는 학습용 CLI 챗봇.",
    pts: ["가짜 문서를 메모리에만 저장 (영속성 없음)", "서버 도구 2개: 문서 읽기 · 문서 수정", "준비: zip 해제 → .env에 API 키 → 의존성 설치", "실행: uv run main.py (또는 python main.py)"],
    cli: "지금 받은 그 프로젝트. .env에 ANTHROPIC_API_KEY·CLAUDE_MODEL 필요" },
  { sec: "섹션 2 · 서버 만들기", t: "도구 정의 (Defining Tools)",
    sum: "@mcp.tool 데코레이터로 함수를 도구화. JSON 스키마는 SDK가 자동 생성.",
    pts: ["read_doc_contents: doc_id 받아 내용 반환 (없으면 ValueError)", "edit_document: doc_id·old·new 받아 find/replace", "Field(description=...) 로 인자 설명 (pydantic)", "패턴: 데코레이터 → 함수 → 타이핑 → 검증 → 로직"],
    cli: "mcp_server.py 의 TODO 'read a doc / edit a doc' 두 도구" },
  { sec: "섹션 2 · 서버 만들기", t: "서버 Inspector (The Server Inspector)",
    sum: "실제 앱에 붙이지 않고 브라우저에서 서버를 테스트하는 디버거.",
    pts: ["실행: mcp dev mcp_server.py → localhost:6274", "Connect → Tools 탭 → 파라미터 입력 → Run Tool", "별도 스크립트 없이 즉시 반복 테스트", "Claude 연결 전 검증 단계 (UI는 계속 개선 중)"],
    cli: "서버 TODO 채울 때마다 mcp dev 로 검증 → 통과하면 다음" },
  { sec: "섹션 3 · 클라이언트 연결", t: "클라이언트 구현 (Implementing a Client)",
    sum: "세션(연결)을 감싼 래퍼 클래스. list_tools·call_tool은 세션에 위임한다.",
    pts: ["세션 = SDK가 주는 실제 연결 (닫을 때 정리 필요)", "list_tools → session().list_tools() 의 .tools", "call_tool → session().call_tool(name, input)", "두 함수는 세션에 일을 떠넘기는 얇은 래퍼"],
    cli: "mcp_client.py TODO. uv run mcp_client.py 로 연결·목록 확인" },
  { sec: "섹션 3 · 클라이언트 연결", t: "리소스 정의 (Defining Resources)",
    sum: "Resources = 읽기용 데이터를 노출하는 기능. HTTP의 GET과 같다.",
    pts: ["Direct(고정 URI): docs://documents — 목록", "Templated({doc_id}): docs://documents/{doc_id} — 단건", "@mcp.resource + mime_type (json / text)", "{param}은 함수 인자로 자동 전달, 반환값 자동 직렬화"],
    cli: "mcp_server.py 리소스 2개 (≈ GET /todos, GET /todos/{id})" },
  { sec: "섹션 3 · 클라이언트 연결", t: "리소스 접근 (Accessing Resources)",
    sum: "클라이언트가 리소스를 읽어 와 mime_type 보고 파싱한다.",
    pts: ["read_resource → session().read_resource(AnyUrl(uri))", "contents[0] 꺼내 mime_type 확인", "json이면 json.loads, 아니면 text 그대로", "@멘션한 문서를 프롬프트에 자동 주입 (도구 불필요)"],
    cli: "mcp_client.py read_resource. cli_chat.py 의 @멘션 처리가 사용" },
  { sec: "섹션 3 · 클라이언트 연결", t: "프롬프트 정의 (Defining Prompts)",
    sum: "Prompts = 서버가 제공하는 검증된 프롬프트 템플릿. 슬래시 명령으로 호출.",
    pts: ["서버 제작자가 도메인 맞춤 고품질 프롬프트를 미리 작성", "@mcp.prompt(name, description) + 인자(doc_id)", "메시지 리스트(user/assistant) 반환 → Claude에 전달", "/format → 문서 선택 → 전용 프롬프트 → Claude가 처리"],
    cli: "mcp_server.py 프롬프트(format). cli_chat.py 의 /명령어가 호출" },
  { sec: "섹션 3 · 클라이언트 연결", t: "클라이언트의 프롬프트 (Prompts in the Client)",
    sum: "클라이언트에서 프롬프트 목록·가져오기 구현. 인자를 넘기면 서버가 템플릿에 끼워 넣는다.",
    pts: ["list_prompts → session().list_prompts() 의 .prompts", "get_prompt(name, args) → 의 .messages", "인자 → 프롬프트 함수 인자 → 템플릿에 보간", "/format report.pdf → 문서 ID가 삽입되어 전달"],
    cli: "mcp_client.py 의 list_prompts / get_prompt TODO" },
];

lessons.forEach((L) => {
  s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText(L.sec, { x: 0.6, y: 0.42, w: 12, h: 0.35, fontFace: F, fontSize: 12.5, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
  s.addText(L.t, { x: 0.6, y: 0.76, w: 12.1, h: 0.62, fontFace: F, fontSize: 26, bold: true, color: INK, margin: 0 });
  // summary band
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.6, w: 12.13, h: 0.95, rectRadius: 0.08, fill: { color: TEALTINT } });
  s.addText([{ text: "한 줄 요약   ", options: { bold: true, color: "0F6E56" } }, { text: L.sum, options: { color: "04342C" } }],
    { x: 0.95, y: 1.6, w: 11.5, h: 0.95, fontFace: F, fontSize: 15.5, valign: "middle", margin: 0, lineSpacingMultiple: 1.05 });
  // bullets
  s.addText(L.pts.map((p, i) => ({ text: p, options: { bullet: { code: "2022" }, breakLine: i < L.pts.length - 1 } })),
    { x: 0.8, y: 2.85, w: 11.7, h: 2.95, fontFace: F, fontSize: 16.5, color: INK, paraSpaceAfter: 12, margin: 0 });
  // cli footer
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 6.15, w: 12.13, h: 0.85, rectRadius: 0.08, fill: { color: NAVY } });
  s.addText([{ text: "cli_project 연결   ", options: { bold: true, color: MINT } }, { text: L.cli, options: { color: "E2E8F0" } }],
    { x: 0.95, y: 6.15, w: 11.5, h: 0.85, fontFace: F, fontSize: 14, valign: "middle", margin: 0 });
});

// ---------- primitives review table ----------
s = pres.addSlide();
s.background = { color: WHITE };
s.addText("섹션 4 · 정리", { x: 0.6, y: 0.42, w: 12, h: 0.35, fontFace: F, fontSize: 12.5, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
s.addText("3대 프리미티브 — 누가 주도하느냐", { x: 0.6, y: 0.76, w: 12.1, h: 0.62, fontFace: F, fontSize: 26, bold: true, color: INK, margin: 0 });
const rows = [
  [{ text: "프리미티브", options: { bold: true } }, { text: "제어 주체", options: { bold: true } }, { text: "누구를 위해", options: { bold: true } }, { text: "용도 / 예시", options: { bold: true } }],
  ["Tools", "모델(Claude)", "모델", "Claude에 능력 추가 (예: 계산용 코드 실행)"],
  ["Resources", "앱 코드", "앱", "데이터를 앱으로 (UI·프롬프트 보강, 예: 문서 목록)"],
  ["Prompts", "사용자", "사용자", "정해진 워크플로 (예: 채팅 시작 버튼·슬래시 명령)"],
];
s.addTable(rows, { x: 0.6, y: 1.75, w: 12.13, colW: [2.0, 2.3, 1.8, 6.03], rowH: [0.55, 1.0, 1.0, 1.0],
  fontFace: F, fontSize: 15, color: INK, valign: "middle", align: "left",
  border: { type: "solid", pt: 1, color: "D9E2EC" },
  fill: { color: "FFFFFF" }, margin: [4, 8, 4, 8] });
// header + first-col tint via row styling
s.addText("고를 때:  Claude 능력 필요 → Tools  /  앱 데이터 필요 → Resources  /  사용자 워크플로 필요 → Prompts",
  { x: 0.6, y: 5.6, w: 12.13, h: 0.5, fontFace: F, fontSize: 14, bold: true, color: TEAL, align: "center", margin: 0 });

// ---------- closing ----------
s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: -1.4, y: 4.9, w: 4.2, h: 4.2, fill: { color: NAVY2 } });
s.addText("한 문장 정리", { x: 0.9, y: 1.9, w: 11, h: 0.5, fontFace: F, fontSize: 15, bold: true, color: MINT, charSpacing: 2, margin: 0 });
s.addText("MCP 서버에 Tools·Resources·Prompts를 정의하고,\n클라이언트(세션 래퍼)로 호출해 Claude와 연결한다.",
  { x: 0.9, y: 2.5, w: 11.3, h: 1.5, fontFace: F, fontSize: 26, bold: true, color: WHITE, margin: 0, lineSpacingMultiple: 1.15 });
s.addText("tool calling 루프는 그대로, 도구의 정의·실행만 별도 서버로 표준화한 것.",
  { x: 0.9, y: 4.2, w: 11.3, h: 0.6, fontFace: F, fontSize: 16, color: "CBD5E1", margin: 0 });
s.addText("다음 강의: DeepLearning.AI — MCP: Build Rich-Context AI Apps (원격 배포까지)",
  { x: 0.9, y: 6.3, w: 11.3, h: 0.5, fontFace: F, fontSize: 14, italic: true, color: "94A3B8", margin: 0 });

pres.writeFile({ fileName: "MCP-강의노트.pptx" }).then((f) => console.log("created:", f));
