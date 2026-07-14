const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";
p.author = "AI Study";
p.title = "MCP 핵심 정리";

const F = "Malgun Gothic";
const INK = "1F2933", BODY = "3E4C59", MUTE = "7B8794", ACCENT = "0B7285";
const LINE = "D9E2EC", HEADBG = "F0F4F8", SOFTBG = "F5F7FA", WHITE = "FFFFFF";

function header(s, kicker, title) {
  s.addText(kicker, { x: 0.7, y: 0.55, w: 12, h: 0.35, fontFace: F, fontSize: 12, bold: true, color: ACCENT, charSpacing: 2, margin: 0 });
  s.addText(title, { x: 0.7, y: 0.92, w: 12, h: 0.7, fontFace: F, fontSize: 28, bold: true, color: INK, margin: 0 });
}
function bullets(s, items, y, opts) {
  opts = opts || {};
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: { code: "2013", indent: 16 }, breakLine: i < items.length - 1, color: opts.color || BODY, bold: !!opts.bold } })),
    { x: opts.x || 0.9, y: y, w: opts.w || 11.7, h: opts.h || 3.5, fontFace: F, fontSize: opts.fontSize || 16, paraSpaceAfter: opts.gap || 10, margin: 0, lineSpacingMultiple: 1.05 });
}
function tbl(s, rows, x, y, w, colW, rowH) {
  s.addTable(rows, { x: x, y: y, w: w, colW: colW, rowH: rowH, fontFace: F, fontSize: 14, color: BODY, valign: "middle",
    border: { type: "solid", pt: 1, color: LINE }, margin: [6, 10, 6, 10] });
}

// ===== 1. Title =====
let s = p.addSlide();
s.background = { color: WHITE };
s.addText("MODEL CONTEXT PROTOCOL", { x: 0.9, y: 2.5, w: 11.5, h: 0.5, fontFace: F, fontSize: 15, bold: true, color: ACCENT, charSpacing: 3, margin: 0 });
s.addText("MCP 핵심 정리", { x: 0.9, y: 3.05, w: 11.5, h: 1.0, fontFace: F, fontSize: 46, bold: true, color: INK, margin: 0 });
s.addText("공식 문서 기준으로 정리한 개념·구조·활용·보안", { x: 0.9, y: 4.2, w: 11.5, h: 0.5, fontFace: F, fontSize: 18, color: BODY, margin: 0 });
s.addText("출처: modelcontextprotocol.io/docs/getting-started/intro", { x: 0.9, y: 6.6, w: 11.5, h: 0.4, fontFace: F, fontSize: 12, color: MUTE, margin: 0 });

// ===== 2. Part1 / 왜 MCP =====
s = p.addSlide(); s.background = { color: SOFTBG };
header(s, "PART 1 · MCP의 탄생과 이해", "왜 MCP가 필요한가?");
bullets(s, [
  "지금까지: LLM에 프롬프트로 질문하거나, 파일·이미지를 직접 업로드하는 것이 전부였다.",
  "한계: 매번 사람이 자료를 넣어줘야 하고, 외부 도구·데이터와는 연결되지 않는다.",
  "질문: AI가 내 캘린더·Notion·DB에 직접 연결될 수는 없을까?",
], 2.1, { gap: 16 });
s.addText("→ 이 연결을 표준화한 것이 MCP.", { x: 0.9, y: 4.9, w: 11.7, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: ACCENT, margin: 0 });

// ===== 3. MCP란 =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "정의", "MCP란 무엇인가?");
bullets(s, [
  "MCP(Model Context Protocol) = AI 애플리케이션을 외부 시스템에 연결하는 오픈소스 표준.",
  "연결 대상: 데이터 소스(파일·DB) · 도구(검색·계산) · 워크플로(특화 프롬프트).",
  "비유: \"AI 애플리케이션을 위한 USB-C 포트\" — 표준 하나로 어디에나 연결한다.",
], 2.1, { gap: 16 });

// ===== 4. Model/Context/Protocol =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "이름 뜯어보기", "Model · Context · Protocol");
tbl(s, [
  [{ text: "Model", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "AI 언어 모델(LLM) — 예: Claude, GPT, Gemini", options: {} }],
  [{ text: "Context", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "모델이 작업에 필요한 배경정보·환경 (데이터, 도구, 작업 상태, 리소스)", options: {} }],
  [{ text: "Protocol", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "표준화된 통신 규칙과 절차", options: {} }],
], 0.9, 2.2, 11.5, [2.4, 9.1], [1.0, 1.0, 1.0]);

// ===== 5. 등장 배경 N×M =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "등장 배경", "왜 표준이 필요했나 — N×M 문제");
bullets(s, [
  "표준 전: M개 LLM × N개 도구 = M×N개의 개별 연동을 각각 구현해야 했다.",
  "서비스마다 도구 스키마·함수를 직접 작성·유지 → 유지보수 부담이 폭발.",
  "MCP 이후: 한 번 만들면 어디서나 재사용 (N+M).",
], 2.1, { gap: 16 });
s.addText("\"build once, integrate everywhere\" — 한 번 만들면 어디서나 통합.", { x: 0.9, y: 4.9, w: 11.7, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: ACCENT, margin: 0 });

// ===== 6. 타임라인 =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "타임라인", "MCP의 등장과 확산");
tbl(s, [
  [{ text: "2024.11", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "Anthropic이 MCP를 오픈소스로 공개 (개발자 커뮤니티의 실제 니즈 반영)", options: {} }],
  [{ text: "2025", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "OpenAI · Google · Microsoft 등 주요 AI 기업이 잇따라 채택", options: {} }],
  [{ text: "현재", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "Claude · ChatGPT · VS Code · Cursor 등 폭넓게 지원", options: {} }],
], 0.9, 2.2, 11.5, [1.8, 9.7], [1.0, 1.0, 1.0]);
s.addText("→ 특정 회사의 기술이 아니라 업계 공통 표준으로 자리잡음.", { x: 0.9, y: 5.6, w: 11.7, h: 0.5, fontFace: F, fontSize: 16, bold: true, color: ACCENT, margin: 0 });

// ===== 7. Before/After =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "무엇이 달라졌나", "MCP 이전 vs 이후");
tbl(s, [
  [{ text: "MCP 이전 (복잡)", options: { bold: true, color: INK, fill: { color: HEADBG }, align: "center" } }, { text: "MCP 이후 (단순)", options: { bold: true, color: INK, fill: { color: HEADBG }, align: "center" } }],
  [{ text: "① DB 연결 함수 작성\n② 쿼리 생성 함수 작성\n③ 결과 포맷 함수 작성\n④ 에러 핸들링 구현\n⑤ AI 도구별로 각각 설정", options: {} },
   { text: "MCP 서버 연결 한 번으로 끝\n\n\"지난 주 가장 많이 팔린\n상품 10개 보여줘\"", options: {} }],
], 0.9, 2.2, 11.5, [5.75, 5.75], [0.6, 2.7]);

// ===== 8. Part2 아키텍처 개요 =====
s = p.addSlide(); s.background = { color: SOFTBG };
header(s, "PART 2 · 아키텍처", "MCP의 3요소");
tbl(s, [
  [{ text: "MCP Host", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "사용자와 LLM을 담은 앱 본체 (지휘관)", options: {} }],
  [{ text: "MCP Client", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "Host 안에서 서버와 1:1로 통신하는 중개자", options: {} }],
  [{ text: "MCP Server", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "도구·데이터를 제공하는 쪽", options: {} }],
], 0.9, 2.2, 11.5, [2.6, 8.9], [0.95, 0.95, 0.95]);
s.addText("관계:  Host ⊃ Client  →(통신)→  Server", { x: 0.9, y: 5.5, w: 11.7, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: ACCENT, margin: 0 });

// ===== 8b. Architecture diagram (official) =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "PART 2 · 아키텍처", "MCP 아키텍처 — 공식 다이어그램");
s.addImage({ path: "MCP/mcp-architecture.png", x: 2.42, y: 1.95, w: 8.5, h: 4.79 });
s.addText("Host(Claude 등) 안의 Client가, USB-C 허브처럼 여러 MCP Server(Slack·Gmail·로컬 등)에 표준 하나로 연결된다.",
  { x: 0.7, y: 6.85, w: 12, h: 0.5, fontFace: F, fontSize: 14, italic: true, color: MUTE, align: "center", margin: 0 });

// ===== 9. Host =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "① MCP HOST", "MCP Host — 지휘관");
bullets(s, [
  "모든 것을 결정하는 앱 본체. LLM을 품고 있다.",
  "사용자 요청 이해·분석 → 필요한 도구 결정 → 작업 계획 수립 → 최종 응답 생성.",
  "예: Claude Desktop, Cursor.",
], 2.1, { gap: 16 });

// ===== 10. Client =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "② MCP CLIENT", "MCP Client — 중개자");
bullets(s, [
  "Host와 Server 사이를 잇는 커넥터.",
  "각 MCP 서버와 1:1 연결을 유지한다.",
  "Host 애플리케이션 안에서 실행 — 별도 앱이 아니라 Host의 부품.",
  "도구를 직접 실행하지 않고 통신만 중개한다.",
], 2.1, { gap: 13 });

// ===== 11. Server + primitives =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "③ MCP SERVER", "MCP Server — 실제 도구 제공");
s.addText("외부 데이터·도구를 MCP 표준에 맞게 노출한다. 예: GitHub MCP, Notion MCP", { x: 0.9, y: 1.95, w: 11.7, h: 0.5, fontFace: F, fontSize: 15, color: BODY, margin: 0 });
s.addText("서버가 제공하는 3대 프리미티브", { x: 0.9, y: 2.6, w: 11.7, h: 0.4, fontFace: F, fontSize: 16, bold: true, color: INK, margin: 0 });
tbl(s, [
  [{ text: "Tools", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "실행 (도구)", options: { bold: true } }, { text: "API 호출·데이터 변환 — 모델(LLM)이 호출", options: {} }],
  [{ text: "Resources", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "읽기 (자료)", options: { bold: true } }, { text: "파일·DB·웹 내용 — 앱이 가져와 컨텍스트로", options: {} }],
  [{ text: "Prompts", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "템플릿", options: { bold: true } }, { text: "미리 정의된 명령·워크플로 — 사용자가 호출", options: {} }],
], 0.9, 3.1, 11.5, [2.2, 2.2, 7.1], [0.95, 0.95, 0.95]);

// ===== 12. Transport (CORRECTED) =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "통신 방식 (TRANSPORT)", "MCP 전송 방식 — 2가지");
tbl(s, [
  [{ text: "stdio", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "표준 입출력. 같은 PC의 로컬 서버와 1:1 직접 통신, 가장 단순.\n예) Claude Desktop이 로컬 파일 시스템에 접근", options: {} }],
  [{ text: "Streamable\nHTTP", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "원격 서버와 HTTP로 통신. 필요 시 SSE로 응답을 스트리밍.\n예) 인터넷 너머의 원격 MCP 서버", options: {} }],
], 0.9, 2.2, 11.5, [2.3, 9.2], [1.35, 1.35]);
s.addText("참고: 예전의 'HTTP+SSE 단독' 방식은 구버전(deprecated)으로, 지금은 Streamable HTTP로 통합됨. WebSocket은 공식 표준 전송 방식이 아니다.",
  { x: 0.9, y: 5.5, w: 11.7, h: 0.8, fontFace: F, fontSize: 14, italic: true, color: MUTE, margin: 0, lineSpacingMultiple: 1.1 });

// ===== 12b. REST API vs MCP =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "짚고 넘어가기", "REST API와 MCP — 같은 점 / 다른 점");
s.addText("MCP 원격 통신은 HTTP 위에서 동작한다. 하지만 REST API는 아니다 — 메시지 규약은 JSON-RPC.",
  { x: 0.9, y: 1.95, w: 11.7, h: 0.5, fontFace: F, fontSize: 15, color: BODY, margin: 0 });
tbl(s, [
  [{ text: "", options: { fill: { color: HEADBG } } },
   { text: "REST API", options: { bold: true, color: INK, fill: { color: HEADBG }, align: "center" } },
   { text: "MCP", options: { bold: true, color: INK, fill: { color: HEADBG }, align: "center" } }],
  [{ text: "운반 (전송)", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "HTTP", options: {} }, { text: "HTTP(원격) · stdio(로컬)", options: {} }],
  [{ text: "메시지 방식", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "URL + GET/POST/PUT/DELETE", options: {} }, { text: "단일 엔드포인트 + JSON-RPC method", options: {} }],
  [{ text: "예시", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "GET /todos/5", options: {} }, { text: "{ \"method\": \"tools/call\" }", options: {} }],
  [{ text: "인증", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "Bearer · OAuth2", options: {} }, { text: "Bearer · OAuth2 (동일)", options: {} }],
], 0.9, 2.55, 11.5, [2.3, 4.4, 4.8], [0.55, 0.7, 0.85, 0.7, 0.7]);
s.addText("→ HTTP 토대(전송·인증)는 공유하되, 메시지 규약은 REST가 아니라 JSON-RPC.  (비유: 도로=HTTP · REST=택시 · MCP=버스)",
  { x: 0.9, y: 6.45, w: 11.7, h: 0.5, fontFace: F, fontSize: 15, bold: true, color: ACCENT, margin: 0 });

// ===== 13. Part3 =====
s = p.addSlide(); s.background = { color: SOFTBG };
header(s, "PART 3 · 활용과 한계", "MCP로 할 수 있는 일 vs 없는 일");
bullets(s, [
  "MCP는 만능이 아니다.",
  "하지만 적절한 영역에서는 정말 효율적이다.",
  "한계를 아는 것이 성공적 활용의 시작이다.",
], 2.3, { gap: 16, fontSize: 18 });

// ===== 14. 가능/불가능 =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "가능 vs 불가능", "무엇이 되고, 무엇이 안 되나");
tbl(s, [
  [{ text: "할 수 있는 일", options: { bold: true, color: INK, fill: { color: HEADBG }, align: "center" } }, { text: "할 수 없는 일", options: { bold: true, color: INK, fill: { color: HEADBG }, align: "center" } }],
  [{ text: "· 데이터 접근·조회 (정형 API, 읽기 중심)\n· 자동화·워크플로 (모니터링·알림)\n· 정보 통합·분석 (다중 소스·크로스 플랫폼)", options: {} },
   { text: "· 실시간 스트리밍 (밀리초 응답)\n· 상태 의존적 긴 작업 (트랜잭션)\n· 고성능 대용량 계산 (네트워크 오버헤드)", options: {} }],
], 0.9, 2.2, 11.5, [5.75, 5.75], [0.6, 2.2]);
s.addText("이유: MCP는 요청–응답 패턴 + 네트워크를 거치는 구조이기 때문.", { x: 0.9, y: 5.4, w: 11.7, h: 0.5, fontFace: F, fontSize: 15, italic: true, color: MUTE, margin: 0 });

// ===== 15. 실전 사례 =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "실전 사례", "적합한 일 / 부적합한 일");
tbl(s, [
  [{ text: "적합 ✅", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "월간 보고서 자동화 — GitHub·Jira·Slack·Sheets MCP\n코드 리뷰 자동화 — GitHub·File System·Playwright MCP", options: {} }],
  [{ text: "부적합 ✕", options: { bold: true, color: INK, fill: { color: HEADBG } } }, { text: "실시간 주식 거래 — 지연·규제·책임 소재 문제\n대용량 비디오 처리 — 메모리·대역폭 한계", options: {} }],
], 0.9, 2.2, 11.5, [1.9, 9.6], [1.4, 1.4]);

// ===== 16. Part4 보안 위협 =====
s = p.addSlide(); s.background = { color: SOFTBG };
header(s, "PART 4 · 보안", "MCP 사용 시 보안 위협");
bullets(s, [
  "민감한 데이터 노출 — 고객 정보·내부 문서·운영 로그 유출 가능성.",
  "무단 명령 실행 — 인증되지 않은 사용자가 임의 명령을 실행하는 취약점.",
  "API 키·인증 토큰 탈취 — 키 유출로 비용 청구 또는 데이터 유실.",
  "운영 시스템 침해 — 백도어 설치·리소스 오용으로 시스템 전체 위협.",
], 2.1, { gap: 13 });

// ===== 17. 인증/키 관리 =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "인증 전략", "키·토큰 관리");
bullets(s, [
  "API 키·비밀키는 코드에 직접 쓰지 않고 .env 파일에 분리한다.",
  ".env는 .gitignore에 넣어 Git 등 버전 관리에 올라가지 않게 한다.",
  "환경 변수 로딩 실패 시 안전한 기본값 제공 또는 예외 처리로 서비스 중단을 막는다.",
], 2.1, { gap: 15 });
s.addText("★ 우리 실습에서도 cli_project의 .env를 .gitignore로 제외했다.", { x: 0.9, y: 5.0, w: 11.7, h: 0.5, fontFace: F, fontSize: 15, bold: true, color: ACCENT, margin: 0 });

// ===== 18. 권한 관리 =====
s = p.addSlide(); s.background = { color: WHITE };
header(s, "권한 관리 (AUTHORIZATION)", "최소 권한 원칙");
bullets(s, [
  "최소 권한: 파일시스템=읽기전용+특정 디렉토리, DB=SELECT 전용 계정, API=읽기 키 우선.",
  "실행 명령 필터링: 허용 명령만 화이트리스트로 등록, 입력값 검증(SQL·쉘 인젝션 방지).",
  "접근 제어: 사용자 유형별 기능 제한, JWT·OAuth2·세션 인증.",
  "인증 실패 처리: 일반화된 오류 메시지, 반복 실패 시 잠금·차단, 모든 실패 로그 기록.",
], 2.1, { gap: 12, fontSize: 15.5 });

// ===== 19. 요약 =====
s = p.addSlide(); s.background = { color: SOFTBG };
header(s, "정리", "한 장 요약");
bullets(s, [
  "MCP = AI를 외부 도구·데이터에 잇는 개방형 표준 (\"AI의 USB-C\").",
  "3요소: Host(지휘관) · Client(중개자) · Server(도구 제공).",
  "전송 방식: stdio(로컬) · Streamable HTTP(원격).",
  "서버 기능: Tools · Resources · Prompts.",
  "만능은 아님 — 요청/응답에 맞는 영역에서 강력하며, 키·권한 등 보안이 필수.",
], 2.0, { gap: 12, fontSize: 16 });

p.writeFile({ fileName: "MCP/mcp_스터디.pptx" }).then((f) => console.log("created:", f));
