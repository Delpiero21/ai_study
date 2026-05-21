# 📘 AI Study 계획 (Curriculum, 통합 v2)

> **변경 사항 (v2)**: 사내 교육 9개 세션을 흡수해 *모델 학습·경량화·Vision* 영역을 보강. 10 Parts · 20주.
> **시작**: 2026-05-20 (수)
> **종료 목표**: 2026-10-07 (수)
> **주당**: 약 15시간 (회사 교육 주간은 자가학습 3~5h로 경감)
> **전제**: AI/ML 경험자 — ML 기초 생략, 엔지니어링·모델·배포 풀스택 목표

---

## 🗂️ 두 출처를 어떻게 합쳤는가

| 출처 | 강점 |
|---|---|
| 기존 자가 커리큘럼 | 하네스·에이전트·운영·Eval 등 *엔지니어링* |
| 사내 교육 9 세션 | SLM·PEFT·양자화·Vision 등 *모델/학습/배포* |

→ 두 관점이 합쳐져야 *"AI를 제대로 만든다"* 가 완성됨.

---

## Part 1. LLM 기초 (W1–W2) ✅ 작성 완료
- Transformer 아키텍처 (Self-Attention · Positional Encoding · FFN)
- 토큰화와 임베딩 · 한국어 토큰화 함정
- 학습 파이프라인 (Pretrain → SFT → RLHF / DPO)
- 디코딩 전략 (Temperature · Top-p · Beam · Speculative)
- 2026 LLM 지형도 (Frontier · 오픈소스 · 소형 · Reasoning)
- 토큰 경제학 (가격 · 컨텍스트 윈도우 · 캐싱)

## Part 2. 프롬프트·컨텍스트 엔지니어링 (W3)
- 프롬프트 구조 (System / User / Assistant)
- Few-shot · Chain-of-Thought · Self-Consistency
- ReAct · Reflexion · Self-Critique
- 구조화 출력 (JSON · XML · 스키마 강제)
- Long Context · Lost in the Middle
- Prompt Caching · Compaction
- Function Calling / Tool Use 기초
- **Prompt Engineering vs Prompt Tuning 구분** (Tuning은 Part 7에서)

## Part 3. RAG (W4–W5)
- 임베딩 모델과 벡터 DB
- 기본 파이프라인 (Chunk → Embed → Retrieve → Generate)
- 하이브리드 검색 (BM25 + Dense)
- 리랭킹 (Reranker 모델)
- 고급 RAG (Contextual · RAPTOR · GraphRAG · HyDE)
- Agentic RAG · Self-RAG
- **제품 문서 RAG 케이스 스터디** (사내 교육 Session 3 연동)
- RAG 평가 (Recall@K · Faithfulness · RAGAS)

## Part 4. AI 에이전트 + MCP/A2A (W6–W8) ⭐
- 에이전트 정의와 분류 (Workflow vs Agent)
- LLM 동작 흐름 → Agent 진화 경로
- ReAct 루프 직접 구현
- Planning (Plan-Execute · ToT · LATS)
- Reflection · Self-Correction
- Memory 시스템 (Working · Episodic · Long-term)
- Tool Use 심화 (병렬 · 에러 · 권한)
- 프레임워크 비교 (맨손 SDK · 그래프형 · 역할형)
- **MCP (Model Context Protocol)** — 도구·리소스 공급 프로토콜
- **A2A (Agent-to-Agent) 프로토콜** — 에이전트 간 통신 표준 ← 사내 교육 핵심
- Multi-Agent 패턴 (Orchestrator-Worker · Hierarchical · Swarm)
- Tool-calling 기반 Task Routing
- 사용자 요청 분해·라우팅 전략
- Human-in-the-loop

## Part 5. 코딩 에이전트 도구 (W9)
- CLI 코딩 에이전트
- IDE 통합 에이전트
- 오픈소스 경량 에이전트
- 클라우드 비동기 에이전트
- 작업 유형별 도구 선택 매트릭스

## Part 6. SLM & Domain Adaptation (W10–W11) 🆕
- SLM의 정의와 *왜 SLM이 필요한가* (LLM과의 trade-off)
- SLM 구조와 출력 원리 (Part 1의 LLM과 비교)
- SLM 주요 컴포넌트 (Tokenizer · Backbone · Head · Decoder Config)
- Domain Data Engineering — 데이터 수집·정제·라벨링
- 도메인 적합성 평가
- **Multi-Modal SLM** — VLM 구조와 동작
- Multi-Modal SLM Fine-tuning 개요
- Multi-Modal SLM Inference 실습

## Part 7. Efficient Fine-tuning (PEFT) (W12–W13) 🆕
- Full Fine-tuning vs PEFT
- **LoRA** — Low-Rank Adaptation 원리
- **QLoRA** — NF4 · Double Quantization · LoRA Rank 의미
- Adapter · Prefix Tuning · **Prompt Tuning** (soft prompts) — 세 PEFT 계열 비교
- Task-Specific 튜닝 전략 (요약·분류·제어)
- 학습 파이프라인 구성 (Hugging Face PEFT · TRL)
- Evaluation: 베이스 vs 튜닝 모델 비교

## Part 8. Quantization & On-device 최적화 (W14) 🆕
- 양자화 기본 원리 (FP32 → INT8/INT4)
- Post-Training Quantization vs Quantization-Aware Training
- **GGUF** — llama.cpp 생태계
- **GPT-Q** — Weight-only quantization
- **AWQ** — Activation-aware
- **Spin-Quant** — 회전 기반 신기법
- **ONNX** 변환 및 양자화 실습
- On-device 배포 시 trade-off (속도 · 메모리 · 정확도)

## Part 9. Vision & 멀티모달 (W15–W17) 🆕
### 9-A. Vision Backbone
- CNN (ResNet 등) 구조 복기
- ViT (Vision Transformer) 구조
- Patch Embedding 메커니즘
- Vision Self-Attention과 Language Self-Attention의 공통점
- 하이브리드 아키텍처

### 9-B. Document Intelligence (문서 이해)
- Traditional OCR 원리와 한계
- **Modern VDU** — Donut · Nougat · LayoutLM
- VLM 기반 문서 파싱 워크플로
- 손글씨·표·다이어그램 처리

### 9-C. Generative Vision
- Diffusion 기본 원리 (Forward / Reverse Process)
- DDPM · DDIM 수식 이해
- **Latent Diffusion (Stable Diffusion) 아키텍처 분석**
- ControlNet · LoRA · IP-Adapter
- Flow Matching · Consistency Model (차세대)

### 9-D. 음성·비디오 (간단히)
- Whisper STT
- TTS (Realtime · Voice cloning)
- 비디오 생성 모델 개요

## Part 10. Eval-Driven Development & 운영 (W18)
- LLM 평가의 어려움
- 평가셋 설계 (Golden Set · Edge Case)
- 자동 vs 휴먼 평가
- LLM-as-a-Judge (편향과 보정)
- 회귀 테스트 자동화 · 평가 도구
- 관측성 · 트레이싱
- 비용 최적화 (라우팅 · 캐싱 · 배치)
- 지연 관리 (스트리밍 · TTFT)
- 보안 (Prompt Injection · PII · 권한)
- 책임 있는 배포 (Red Team · 안전 정책)

## Part 11. 캡스톤 프로젝트 (W19–W20)
- 문제 정의 · 성공 지표
- 아키텍처 설계 (Agent? RAG? Fine-tuned SLM? 조합?)
- 평가셋 구축
- MVP → 강화 → 배포
- 운영 · 모니터링 적용
- 회고와 공개

---

## 📐 학습 모델

**기존 원칙 + 모델 엔지니어링 축 추가**

- 모델은 직접 만들지 않지만, **튜닝·양자화·배포는 직접 한다**
- 하네스(Part 2–5, 10)와 모델 엔지니어링(Part 6–9)을 *둘 다* 다룬다
- 캡스톤에서 *반드시 두 축이 만나는 시스템* 을 만든다 (예: 튜닝한 SLM을 에이전트의 도구로 활용)

**주간 운영 루틴**
- 월–목: 1.5h × 4 = 이론 + 정리
- 금: 1.5h = 핸즈온 1차
- 토: 4h = 핸즈온 본 작업
- 일: 3.5h = 정리 + 회고 + 예습

**🏢 사내 교육 기간 (6월 추정)**: 자가학습 부담을 3~5h로 낮추고 교육 내용을 흡수·확장하는 데 집중. 교육 노트 정리 + 추가 자료로 깊이 보강.

**핵심 원칙**
1. 페이퍼는 강제 X — Phase당 1편만 정독
2. 매주 산출물 1개 강제
3. 도구 1종에 매몰 X
4. Eval 없는 에이전트·모델은 6주 뒤 부서짐
5. **튜닝 전에 RAG·Prompt부터** — fine-tuning은 마지막 수단 원칙 (Stage 1: Prompt → Stage 2: RAG → Stage 3: Fine-tune)
