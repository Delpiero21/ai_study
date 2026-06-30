const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "AI Study";
pres.title = "MCP 스터디 진행 현황";

// ---- palette ----
const NAVY = "0F2A3F";    // dark bg
const NAVY2 = "163B57";   // card on dark
const TEAL = "0D9488";    // primary accent
const TEAL2 = "14B8A6";   // lighter teal
const MINT = "5EEAD4";
const INK = "1E293B";     // dark text
const MUTE = "64748B";    // muted
const LIGHT = "F1F5F9";   // light card
const WHITE = "FFFFFF";
const F = "Malgun Gothic";
const FM = "Consolas";

const W = 13.33, H = 7.5;
const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 90, opacity: 0.12 });

function numCircle(slide, n, x, y, d, fill, txtColor) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill } });
  slide.addText(String(n), { x, y, w: d, h: d, align: "center", valign: "middle",
    fontFace: F, fontSize: d > 0.6 ? 22 : 16, bold: true, color: txtColor, margin: 0 });
}

function header(slide, title, kicker) {
  slide.addText(kicker, { x: 0.6, y: 0.42, w: 12, h: 0.35, fontFace: F, fontSize: 13,
    bold: true, color: TEAL, charSpacing: 2, margin: 0 });
  slide.addText(title, { x: 0.6, y: 0.78, w: 12.1, h: 0.7, fontFace: F, fontSize: 30,
    bold: true, color: INK, margin: 0 });
}

// ============ Slide 1: Title ============
let s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: 10.1, y: -1.6, w: 4.8, h: 4.8, fill: { color: NAVY2 } });
s.addShape(pres.shapes.OVAL, { x: 11.4, y: 4.6, w: 3.4, h: 3.4, fill: { color: NAVY2 } });
s.addText("AI STUDY · 진행 현황 보고", { x: 0.9, y: 1.7, w: 10, h: 0.5, fontFace: F,
  fontSize: 15, bold: true, color: MINT, charSpacing: 3, margin: 0 });
s.addText("MCP 스터디 진행 현황", { x: 0.9, y: 2.35, w: 11, h: 1.2, fontFace: F,
  fontSize: 52, bold: true, color: WHITE, margin: 0 });
s.addText("Model Context Protocol — 공식 강의 + 직접 실습 기반 커리큘럼", { x: 0.9, y: 3.7,
  w: 11, h: 0.6, fontFace: F, fontSize: 18, color: "CBD5E1", margin: 0 });
s.addShape(pres.shapes.LINE, { x: 0.95, y: 4.5, w: 2.4, h: 0, line: { color: TEAL2, width: 3 } });
s.addText("REST API  →  Tool Calling  →  MCP", { x: 0.9, y: 4.75, w: 11, h: 0.5, fontFace: F,
  fontSize: 16, bold: true, color: WHITE, margin: 0 });
s.addText("github.com/Delpiero21/ai_study", { x: 0.9, y: 6.5, w: 11, h: 0.4, fontFace: FM,
  fontSize: 13, color: "94A3B8", margin: 0 });

// ============ Slide 2: 배경 & 목표 ============
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "왜 MCP인가, 무엇을 목표로 하나", "배경 & 목표");
// left: what is MCP
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.7, w: 6.0, h: 4.9, rectRadius: 0.1,
  fill: { color: LIGHT }, shadow: shadow() });
s.addText("MCP란?", { x: 0.95, y: 2.0, w: 5.4, h: 0.5, fontFace: F, fontSize: 19, bold: true, color: TEAL, margin: 0 });
s.addText([
  { text: "AI 앱을 외부 도구·데이터에 연결하는 ", options: {} },
  { text: "오픈 표준 프로토콜", options: { bold: true } },
  { text: ".  \"AI 앱의 USB-C 포트\"", options: {} },
], { x: 0.95, y: 2.55, w: 5.35, h: 1.0, fontFace: F, fontSize: 15, color: INK, lineSpacingMultiple: 1.15, margin: 0 });
s.addText([
  { text: "N×M 통합 문제를 N+M 으로", options: { bullet: true, breakLine: true, bold: true } },
  { text: "서버 한 번 만들면 어느 클라이언트든 재사용", options: { bullet: true, breakLine: true } },
  { text: "Anthropic이 2024.11 공개, 빠르게 표준화", options: { bullet: true } },
], { x: 1.0, y: 3.7, w: 5.3, h: 2.6, fontFace: F, fontSize: 14.5, color: INK, paraSpaceAfter: 10, margin: 0 });
// right: goal
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.95, y: 1.7, w: 5.78, h: 4.9, rectRadius: 0.1,
  fill: { color: NAVY }, shadow: shadow() });
s.addText("스터디 목표", { x: 7.3, y: 2.0, w: 5.1, h: 0.5, fontFace: F, fontSize: 19, bold: true, color: MINT, margin: 0 });
s.addText([
  { text: "MCP를 \"쓰는\" 수준이 아니라", options: { breakLine: true } },
  { text: "직접 만들고 연결하는 수준까지", options: { bold: true } },
], { x: 7.3, y: 2.6, w: 5.1, h: 0.9, fontFace: F, fontSize: 17, color: WHITE, lineSpacingMultiple: 1.2, margin: 0 });
s.addText([
  { text: "MCP 서버 = API 서버", options: { bullet: true, breakLine: true } },
  { text: "MCP = tool calling의 표준화 레이어", options: { bullet: true, breakLine: true } },
  { text: "→ 두 선수지식을 먼저 다진 뒤 MCP 본체로", options: { bullet: false } },
], { x: 7.45, y: 3.7, w: 5.0, h: 2.6, fontFace: F, fontSize: 14.5, color: "E2E8F0", paraSpaceAfter: 12, margin: 0 });

// ============ Slide 3: 학습 흐름 ============
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "전체 학습 흐름 — 세 단계가 쌓인다", "LEARNING FLOW");
const flow = [
  { t: "REST API", d: "기능을 외부에\n노출하는 법", sub: "FastAPI · HTTP · JSON", c: TEAL },
  { t: "Tool Calling", d: "LLM이 그 기능을\n사용하는 법", sub: "agentic loop · LangGraph", c: TEAL2 },
  { t: "MCP", d: "그 연결 방식을\n표준화한 것", sub: "서버 · 클라이언트 · 프리미티브", c: NAVY },
];
let fx = 0.7;
const fw = 3.7, gap = 0.62;
flow.forEach((b, i) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: fx, y: 2.4, w: fw, h: 3.4, rectRadius: 0.1,
    fill: { color: i === 2 ? NAVY : LIGHT }, shadow: shadow() });
  numCircle(s, i + 1, fx + 0.35, 2.75, 0.7, b.c, WHITE);
  s.addText(b.t, { x: fx + 1.2, y: 2.82, w: fw - 1.4, h: 0.6, fontFace: F, fontSize: 22, bold: true,
    color: i === 2 ? MINT : INK, valign: "middle", margin: 0 });
  s.addText(b.d, { x: fx + 0.38, y: 3.75, w: fw - 0.7, h: 1.1, fontFace: F, fontSize: 16,
    color: i === 2 ? WHITE : INK, margin: 0, lineSpacingMultiple: 1.1 });
  s.addText(b.sub, { x: fx + 0.38, y: 4.95, w: fw - 0.7, h: 0.6, fontFace: F, fontSize: 13,
    italic: true, color: i === 2 ? "94D3CA" : MUTE, margin: 0 });
  if (i < 2) s.addText("→", { x: fx + fw - 0.02, y: 3.4, w: gap, h: 1.2, align: "center",
    valign: "middle", fontFace: F, fontSize: 30, bold: true, color: TEAL, margin: 0 });
  fx += fw + gap;
});
s.addText("각 단계의 실습 결과물이 다음 단계에서 그대로 재사용된다.", { x: 0.7, y: 6.2, w: 12, h: 0.5,
  fontFace: F, fontSize: 15, bold: true, color: TEAL, align: "center", margin: 0 });

// ============ Slide 4: 3단계 학습법 ============
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "진행 방식 — 강의 → 실습 → 보충", "추천 학습법");
const m = [
  { n: "1", t: "공식 강의로 개념 잡기", d: "Anthropic 공식 영상으로\n전체 그림 + 핵심 개념", tag: "영상 · 약 1.5시간", c: TEAL },
  { n: "2", t: "직접 실습", d: "저장소 examples를\n손으로 작성·실행", tag: "실습 · 본인 페이스", c: TEAL2 },
  { n: "3", t: "한국어 자료로 보충", d: "막히는 개념만\n한국어 자료로 확인", tag: "텍스트 · 필요 시", c: NAVY },
];
let mx = 0.7;
m.forEach((b) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mx, y: 2.3, w: 3.9, h: 3.9, rectRadius: 0.1,
    fill: { color: LIGHT }, shadow: shadow() });
  numCircle(s, b.n, mx + 0.4, 2.7, 0.85, b.c, WHITE);
  s.addText(b.t, { x: mx + 0.4, y: 3.7, w: 3.2, h: 0.8, fontFace: F, fontSize: 18, bold: true, color: INK, margin: 0 });
  s.addText(b.d, { x: mx + 0.4, y: 4.5, w: 3.2, h: 1.0, fontFace: F, fontSize: 14, color: MUTE, margin: 0, lineSpacingMultiple: 1.1 });
  s.addText(b.tag, { x: mx + 0.4, y: 5.62, w: 3.2, h: 0.4, fontFace: F, fontSize: 12.5, bold: true, color: TEAL, margin: 0 });
  mx += 3.9 + 0.31;
});

// ============ Slide 5: 1단계 공식 강의 ============
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "1단계 — 공식 강의 (입문 → 정석)", "STEP 1 · 강의");
// tier 1
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.7, w: 6.0, h: 4.95, rectRadius: 0.1,
  fill: { color: LIGHT }, shadow: shadow() });
s.addText("① 먼저 — 입문", { x: 0.95, y: 2.0, w: 5.3, h: 0.45, fontFace: F, fontSize: 16, bold: true, color: TEAL, margin: 0 });
s.addText("Anthropic Academy: Intro to MCP", { x: 0.95, y: 2.45, w: 5.4, h: 0.55, fontFace: F, fontSize: 18, bold: true, color: INK, margin: 0 });
s.addText([
  { text: "Anthropic 직접 제작 · 가볍고 짧음", options: { bullet: true, breakLine: true } },
  { text: "3대 프리미티브(Tools·Resources·Prompts) 중심", options: { bullet: true, breakLine: true } },
  { text: "자동 번역 자막 활용 가능 → 부담 적음", options: { bullet: true } },
], { x: 1.0, y: 3.15, w: 5.3, h: 2.0, fontFace: F, fontSize: 14, color: INK, paraSpaceAfter: 10, margin: 0 });
s.addText("부담 없이 전체 그림 잡기 (워밍업)", { x: 1.0, y: 5.9, w: 5.3, h: 0.5, fontFace: F, fontSize: 13.5, italic: true, color: MUTE, margin: 0 });
// tier 2
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.95, y: 1.7, w: 5.78, h: 4.95, rectRadius: 0.1,
  fill: { color: NAVY }, shadow: shadow() });
s.addText("② 그다음 — 정석", { x: 7.3, y: 2.0, w: 5.1, h: 0.45, fontFace: F, fontSize: 16, bold: true, color: MINT, margin: 0 });
s.addText("DeepLearning.AI × Anthropic", { x: 7.3, y: 2.45, w: 5.1, h: 0.55, fontFace: F, fontSize: 18, bold: true, color: WHITE, margin: 0 });
s.addText("MCP: Build Rich-Context AI Apps · 12강 약 1.5시간 · 영어", { x: 7.3, y: 3.0, w: 5.1, h: 0.5, fontFace: F, fontSize: 13, color: "94D3CA", margin: 0 });
s.addText([
  { text: "서버·클라이언트 직접 제작", options: { bullet: true, breakLine: true } },
  { text: "레퍼런스 서버 연결 · 프리미티브 확장", options: { bullet: true, breakLine: true } },
  { text: "Claude Desktop 등록 · 원격 배포까지", options: { bullet: true } },
], { x: 7.45, y: 3.6, w: 5.0, h: 2.0, fontFace: F, fontSize: 14, color: "E2E8F0", paraSpaceAfter: 10, margin: 0 });
s.addText("\"정석\"은 DeepLearning.AI, 입문은 Academy로 먼저", { x: 7.45, y: 5.95, w: 5.0, h: 0.5, fontFace: F, fontSize: 13.5, italic: true, color: "94D3CA", margin: 0 });

// ============ Slide 6: 2단계 직접 실습 ============
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "2단계 — 직접 실습 (저장소 examples)", "STEP 2 · 실습");
const prac = [
  { n: "1", t: "REST API / FastAPI", items: "Hello FastAPI · Todo CRUD API · httpx 클라이언트", note: "MCP 서버의 기반" },
  { n: "2", t: "LLM Tool Calling", items: "수동 agentic loop · LangGraph 재구성 · prebuilt 비교", note: "도구 호출 원리" },
  { n: "3", t: "MCP 서버 제작·연결", items: "날씨 서버 · Inspector · Claude 연결 · Todo→MCP · LangGraph+MCP", note: "MCP 본체" },
];
let py = 1.85;
prac.forEach((b) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: py, w: 12.13, h: 1.4, rectRadius: 0.08,
    fill: { color: LIGHT }, shadow: shadow() });
  numCircle(s, b.n, 0.9, py + 0.38, 0.65, TEAL, WHITE);
  s.addText(b.t, { x: 1.75, y: py + 0.22, w: 3.7, h: 0.5, fontFace: F, fontSize: 18, bold: true, color: INK, valign: "middle", margin: 0 });
  s.addText(b.note, { x: 1.75, y: py + 0.72, w: 3.7, h: 0.45, fontFace: F, fontSize: 12.5, italic: true, color: TEAL, margin: 0 });
  s.addText(b.items, { x: 5.6, y: py, w: 7.0, h: 1.4, fontFace: F, fontSize: 14.5, color: INK, valign: "middle", margin: 0, lineSpacingMultiple: 1.1 });
  py += 1.55;
});
s.addText("각 단계 결과물을 다음 단계에서 재사용 — 1단계 Todo API가 3단계에서 MCP 서버가 된다", {
  x: 0.6, y: 6.65, w: 12.1, h: 0.45, fontFace: F, fontSize: 13.5, bold: true, color: MUTE, align: "center", margin: 0 });

// ============ Slide 7: 3단계 한국어 보충 + 산출물 ============
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "3단계 보충 자료 & GitHub 산출물", "STEP 3 · 자료 / 산출물");
// left: korean resources
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.7, w: 5.9, h: 4.9, rectRadius: 0.1, fill: { color: LIGHT }, shadow: shadow() });
s.addText("한국어 보충 (필요 시)", { x: 0.95, y: 2.0, w: 5.2, h: 0.5, fontFace: F, fontSize: 18, bold: true, color: TEAL, margin: 0 });
s.addText([
  { text: "공식 문서 = 정답지", options: { bold: true, breakLine: true } },
  { text: "modelcontextprotocol.io (크롬 자동번역)", options: { breakLine: true } },
], { x: 0.95, y: 2.6, w: 5.2, h: 0.95, fontFace: F, fontSize: 14, color: INK, lineSpacingMultiple: 1.15, margin: 0 });
s.addText([
  { text: "테디노트 MCP 가이드 (WikiDocs)", options: { bullet: true, breakLine: true } },
  { text: "클로드 코드 입문/가이드 (WikiDocs)", options: { bullet: true, breakLine: true } },
  { text: "조코딩 유튜브 (입문)", options: { bullet: true } },
], { x: 1.0, y: 3.75, w: 5.1, h: 2.0, fontFace: F, fontSize: 14, color: INK, paraSpaceAfter: 9, margin: 0 });
s.addText("명령어·설정은 공식 문서로 교차 확인", { x: 1.0, y: 6.0, w: 5.1, h: 0.45, fontFace: F, fontSize: 12.5, italic: true, color: MUTE, margin: 0 });
// right: repo tree
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.85, y: 1.7, w: 5.88, h: 4.9, rectRadius: 0.1, fill: { color: NAVY }, shadow: shadow() });
s.addText("저장소 구조 (작성 완료)", { x: 7.2, y: 2.0, w: 5.2, h: 0.5, fontFace: F, fontSize: 18, bold: true, color: MINT, margin: 0 });
s.addText([
  "MCP/",
  "├─ CURRICULUM.md      3단계 통합 커리큘럼",
  "├─ STUDY-PLAN.md      진행 계획(공유용)",
  "└─ examples/          실행 가능한 코드",
  "    ├─ 01-fastapi/",
  "    ├─ 02-tool-calling/",
  "    └─ 03-mcp/",
].join("\n"), { x: 7.2, y: 2.65, w: 5.3, h: 3.0, fontFace: FM, fontSize: 12.5, color: "E2E8F0", margin: 0, lineSpacingMultiple: 1.25 });
s.addText("README → 첫 화면에서 바로 진입 가능", { x: 7.2, y: 5.95, w: 5.3, h: 0.5, fontFace: F, fontSize: 12.5, italic: true, color: "94D3CA", margin: 0 });

// ============ Slide 8: 강의 실습 프로젝트 ============
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "강의 실습 프로젝트 — MCP Chat (cli_project)", "보유 자료");
s.addText("DeepLearning.AI 강의의 공식 실습 코드. starter의 빈칸을 채우며 서버·클라이언트를 직접 구현한다.", {
  x: 0.6, y: 1.62, w: 12.1, h: 0.5, fontFace: F, fontSize: 14.5, color: MUTE, margin: 0 });
// starter
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 2.35, w: 6.0, h: 4.2, rectRadius: 0.1, fill: { color: LIGHT }, shadow: shadow() });
s.addText("cli_project  (starter)", { x: 0.95, y: 2.6, w: 5.4, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: INK, margin: 0 });
s.addText("직접 채우는 실습장", { x: 0.95, y: 3.1, w: 5.4, h: 0.4, fontFace: F, fontSize: 13, italic: true, color: TEAL, margin: 0 });
s.addText([
  { text: "mcp_server.py — 도구·리소스·프롬프트 (TODO)", options: { bullet: true, breakLine: true } },
  { text: "mcp_client.py — list_tools / call_tool (TODO)", options: { bullet: true, breakLine: true } },
  { text: "먼저 mcp dev 로 Inspector 검증", options: { bullet: true } },
], { x: 1.0, y: 3.65, w: 5.3, h: 2.4, fontFace: F, fontSize: 13.5, color: INK, paraSpaceAfter: 10, margin: 0 });
// complete
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.95, y: 2.35, w: 5.78, h: 4.2, rectRadius: 0.1, fill: { color: NAVY }, shadow: shadow() });
s.addText("cli_project_COMPLETE", { x: 7.3, y: 2.6, w: 5.1, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: WHITE, margin: 0 });
s.addText("정답 비교용", { x: 7.3, y: 3.1, w: 5.1, h: 0.4, fontFace: F, fontSize: 13, italic: true, color: MINT, margin: 0 });
s.addText([
  { text: "TODO 6개 모두 구현된 완성본", options: { bullet: true, breakLine: true } },
  { text: "Inspector에 도구·리소스·프롬프트 표시", options: { bullet: true, breakLine: true } },
  { text: "막히면 같은 파일로 정답 확인", options: { bullet: true } },
], { x: 7.45, y: 3.65, w: 5.0, h: 2.4, fontFace: F, fontSize: 13.5, color: "E2E8F0", paraSpaceAfter: 10, margin: 0 });

// ============ Slide 9: 일정 & 다음 단계 ============
s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: -1.5, y: 5.0, w: 4.2, h: 4.2, fill: { color: NAVY2 } });
s.addText("일정 & 다음 단계", { x: 0.8, y: 0.7, w: 11, h: 0.8, fontFace: F, fontSize: 30, bold: true, color: WHITE, margin: 0 });
s.addText("예상 소요", { x: 0.8, y: 1.7, w: 11, h: 0.45, fontFace: F, fontSize: 15, bold: true, color: MINT, charSpacing: 2, margin: 0 });
// two stat cards
function stat(x, big, label) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.2, w: 3.5, h: 1.9, rectRadius: 0.1, fill: { color: NAVY2 } });
  s.addText(big, { x, y: 2.42, w: 3.5, h: 0.95, align: "center", fontFace: F, fontSize: 40, bold: true, color: MINT, margin: 0 });
  s.addText(label, { x, y: 3.45, w: 3.5, h: 0.5, align: "center", fontFace: F, fontSize: 14, color: "E2E8F0", margin: 0 });
}
stat(0.8, "약 3주", "하루 1시간 기준");
stat(4.6, "약 1.5주", "하루 2시간 기준");
s.addText("환경 설정(Python·Node·API 키)은 첫 세션 전 각자 준비 → 일정 단축", {
  x: 0.8, y: 4.25, w: 7.4, h: 0.5, fontFace: F, fontSize: 13, italic: true, color: "94A3B8", margin: 0 });
// next steps
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.6, y: 2.2, w: 4.1, h: 4.4, rectRadius: 0.1, fill: { color: NAVY2 } });
s.addText("다음 단계", { x: 8.9, y: 2.45, w: 3.5, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: WHITE, margin: 0 });
s.addText([
  { text: "API 키 발급 + 소액 충전", options: { bullet: true, breakLine: true } },
  { text: "1단계 강의 수강 시작", options: { bullet: true, breakLine: true } },
  { text: "cli_project 서버 TODO 채우기", options: { bullet: true, breakLine: true } },
  { text: "Inspector로 검증 → Claude 연결", options: { bullet: true } },
], { x: 8.95, y: 3.05, w: 3.5, h: 3.3, fontFace: F, fontSize: 14, color: "E2E8F0", paraSpaceAfter: 13, margin: 0 });

pres.writeFile({ fileName: "MCP/MCP-스터디-진행현황.pptx" }).then((f) => console.log("created:", f));
