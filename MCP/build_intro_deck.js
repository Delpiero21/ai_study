const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "AI Study";
pres.title = "MCP 공식 소개";

const NAVY = "0F2A3F", NAVY2 = "163B57", TEAL = "0D9488", MINT = "5EEAD4";
const TEALTINT = "E1F5EE", INK = "1E293B", MUTE = "64748B", LIGHT = "F1F5F9", WHITE = "FFFFFF";
const F = "Malgun Gothic";
const sh = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 90, opacity: 0.12 });

function header(s, kicker, title) {
  s.addText(kicker, { x: 0.6, y: 0.42, w: 12, h: 0.35, fontFace: F, fontSize: 12.5, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
  s.addText(title, { x: 0.6, y: 0.76, w: 12.1, h: 0.62, fontFace: F, fontSize: 27, bold: true, color: INK, margin: 0 });
}

// ---------- title ----------
let s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: 10.3, y: -1.5, w: 4.6, h: 4.6, fill: { color: NAVY2 } });
s.addText("modelcontextprotocol.io · 공식 소개", { x: 0.9, y: 1.95, w: 11, h: 0.5, fontFace: F, fontSize: 15, bold: true, color: MINT, charSpacing: 2, margin: 0 });
s.addText("Model Context Protocol", { x: 0.9, y: 2.55, w: 11.5, h: 1.0, fontFace: F, fontSize: 46, bold: true, color: WHITE, margin: 0 });
s.addText("AI 애플리케이션을 외부 시스템에 연결하는 오픈소스 표준 (한글 정리)", { x: 0.9, y: 3.75, w: 11.5, h: 0.6, fontFace: F, fontSize: 18, color: "CBD5E1", margin: 0 });
s.addText('"AI 애플리케이션을 위한 USB-C 포트"', { x: 0.9, y: 4.5, w: 11, h: 0.5, fontFace: F, fontSize: 16, bold: true, italic: true, color: WHITE, margin: 0 });

// ---------- what is MCP ----------
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "WHAT IS MCP", "MCP란 무엇인가?");
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.6, w: 12.13, h: 1.15, rectRadius: 0.08, fill: { color: TEALTINT } });
s.addText([{ text: "정의   ", options: { bold: true, color: "0F6E56" } }, { text: "AI 애플리케이션(Claude·ChatGPT 등)을 외부 시스템에 연결하는 오픈소스 표준.", options: { color: "04342C" } }],
  { x: 0.95, y: 1.6, w: 11.5, h: 1.15, fontFace: F, fontSize: 16, valign: "middle", margin: 0 });
const conns = [
  { t: "데이터 소스", d: "로컬 파일 · 데이터베이스" },
  { t: "도구", d: "검색 엔진 · 계산기" },
  { t: "워크플로", d: "특화된 프롬프트" },
];
let cx = 0.6;
conns.forEach((b) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: 3.0, w: 3.92, h: 1.7, rectRadius: 0.08, fill: { color: LIGHT }, shadow: sh() });
  s.addText(b.t, { x: cx + 0.3, y: 3.3, w: 3.3, h: 0.5, fontFace: F, fontSize: 18, bold: true, color: TEAL, margin: 0 });
  s.addText(b.d, { x: cx + 0.3, y: 3.85, w: 3.3, h: 0.7, fontFace: F, fontSize: 15, color: INK, margin: 0 });
  cx += 3.92 + 0.185;
});
s.addText("비유: USB-C가 기기를 잇는 표준이듯, MCP는 AI를 외부 시스템에 잇는 표준이다.", { x: 0.6, y: 5.0, w: 12.13, h: 0.5, fontFace: F, fontSize: 15, italic: true, color: MUTE, margin: 0 });

// ---------- what can it enable ----------
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "USE CASES", "MCP로 무엇을 할 수 있나?");
const uses = [
  { t: "개인화된 비서", d: "에이전트가 Google Calendar·Notion에 접근" },
  { t: "웹 앱 생성", d: "Claude Code가 Figma 디자인으로 웹앱 전체 생성" },
  { t: "기업 데이터 분석", d: "챗봇이 여러 DB에 연결 → 채팅으로 분석" },
  { t: "3D 제작·출력", d: "Blender로 3D 디자인 → 3D 프린터 출력" },
];
let ux = 0.6, uy = 1.7;
uses.forEach((b, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.6 + col * 6.26, y = 1.7 + row * 2.35;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.97, h: 2.05, rectRadius: 0.08, fill: { color: LIGHT }, shadow: sh() });
  s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: y + 0.35, w: 0.5, h: 0.5, fill: { color: TEAL } });
  s.addText(String(i + 1), { x: x + 0.35, y: y + 0.35, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: F, fontSize: 16, bold: true, color: WHITE, margin: 0 });
  s.addText(b.t, { x: x + 1.05, y: y + 0.32, w: 4.6, h: 0.55, fontFace: F, fontSize: 18, bold: true, color: INK, valign: "middle", margin: 0 });
  s.addText(b.d, { x: x + 0.4, y: y + 1.0, w: 5.2, h: 0.85, fontFace: F, fontSize: 15, color: MUTE, margin: 0, lineSpacingMultiple: 1.1 });
});

// ---------- why matter ----------
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "WHY IT MATTERS", "MCP가 왜 중요한가?");
const whys = [
  { t: "개발자", d: "AI 앱·에이전트를 만들거나 통합할 때 개발 시간과 복잡도를 줄여준다." },
  { t: "AI 앱 / 에이전트", d: "데이터·도구·앱 생태계에 접근해 능력을 강화하고 UX를 개선한다." },
  { t: "최종 사용자", d: "더 유능한 AI가 내 데이터에 접근하고 필요할 때 나를 대신해 작업한다." },
];
let wy = 1.75;
whys.forEach((b, i) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: wy, w: 12.13, h: 1.5, rectRadius: 0.08, fill: { color: i === 1 ? NAVY : LIGHT }, shadow: sh() });
  s.addText(b.t, { x: 0.95, y: wy, w: 3.4, h: 1.5, fontFace: F, fontSize: 19, bold: true, color: i === 1 ? MINT : TEAL, valign: "middle", margin: 0 });
  s.addText(b.d, { x: 4.4, y: wy, w: 8.1, h: 1.5, fontFace: F, fontSize: 16, color: i === 1 ? "E2E8F0" : INK, valign: "middle", margin: 0, lineSpacingMultiple: 1.1 });
  wy += 1.65;
});

// ---------- ecosystem ----------
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "ECOSYSTEM", "폭넓은 생태계 지원");
s.addText("MCP는 다양한 클라이언트·서버가 지원하는 오픈 프로토콜이다.", { x: 0.6, y: 1.65, w: 12, h: 0.5, fontFace: F, fontSize: 16, color: MUTE, margin: 0 });
const eco = ["Claude", "ChatGPT", "VS Code", "Cursor", "MCPJam"];
let ex = 0.6;
eco.forEach((n) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ex, y: 2.4, w: 2.28, h: 1.1, rectRadius: 0.08, fill: { color: TEALTINT }, shadow: sh() });
  s.addText(n, { x: ex, y: 2.4, w: 2.28, h: 1.1, align: "center", valign: "middle", fontFace: F, fontSize: 17, bold: true, color: "0F6E56", margin: 0 });
  ex += 2.28 + 0.135;
});
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.0, w: 12.13, h: 1.7, rectRadius: 0.1, fill: { color: NAVY }, shadow: sh() });
s.addText("build once, integrate everywhere", { x: 0.95, y: 4.25, w: 11.5, h: 0.6, fontFace: F, fontSize: 22, bold: true, color: MINT, margin: 0 });
s.addText("한 번 만들면 어디서나 통합 — 내 MCP 서버를 어느 클라이언트에든 그대로 붙일 수 있다.", { x: 0.95, y: 4.95, w: 11.5, h: 0.6, fontFace: F, fontSize: 16, color: "E2E8F0", margin: 0 });

// ---------- start building ----------
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "START BUILDING", "시작하기");
const build = [
  { t: "서버 만들기", d: "내 데이터·도구를 노출하는 MCP 서버 제작" },
  { t: "클라이언트 만들기", d: "MCP 서버에 연결하는 애플리케이션 개발" },
  { t: "MCP 앱 만들기", d: "AI 클라이언트 안에서 실행되는 앱 제작" },
];
let bx = 0.6;
build.forEach((b) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: 1.8, w: 3.92, h: 2.4, rectRadius: 0.08, fill: { color: LIGHT }, shadow: sh() });
  s.addText(b.t, { x: bx + 0.35, y: 2.15, w: 3.3, h: 0.6, fontFace: F, fontSize: 18, bold: true, color: TEAL, margin: 0 });
  s.addText(b.d, { x: bx + 0.35, y: 2.85, w: 3.3, h: 1.2, fontFace: F, fontSize: 15, color: INK, margin: 0, lineSpacingMultiple: 1.15 });
  bx += 3.92 + 0.185;
});
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.55, w: 12.13, h: 1.1, rectRadius: 0.08, fill: { color: TEALTINT } });
s.addText([{ text: "더 알아보기   ", options: { bold: true, color: "0F6E56" } }, { text: "핵심 개념·아키텍처 → modelcontextprotocol.io/docs/learn/architecture", options: { color: "04342C" } }],
  { x: 0.95, y: 4.55, w: 11.5, h: 1.1, fontFace: F, fontSize: 15.5, valign: "middle", margin: 0 });

// ---------- closing ----------
s = pres.addSlide();
s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: -1.4, y: 4.9, w: 4.2, h: 4.2, fill: { color: NAVY2 } });
s.addText("한 줄 정리", { x: 0.9, y: 2.0, w: 11, h: 0.5, fontFace: F, fontSize: 15, bold: true, color: MINT, charSpacing: 2, margin: 0 });
s.addText("MCP = AI를 외부 데이터·도구·워크플로에 잇는 개방형 표준.\n한 번 만들면 어디서나 쓴다.", { x: 0.9, y: 2.6, w: 11.5, h: 1.5, fontFace: F, fontSize: 26, bold: true, color: WHITE, margin: 0, lineSpacingMultiple: 1.15 });
s.addText("출처: https://modelcontextprotocol.io/docs/getting-started/intro", { x: 0.9, y: 6.4, w: 11.5, h: 0.5, fontFace: F, fontSize: 13, italic: true, color: "94A3B8", margin: 0 });

pres.writeFile({ fileName: "MCP/MCP-공식소개.pptx" }).then((f) => console.log("created:", f));
