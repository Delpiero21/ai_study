# 📘 AI Study 계획 (Curriculum)

> **목표**: AI 교양 → AI 엔지니어링 풀스택 (하네스 + 모델 양면)
> **전제**: AI/ML 경험자 — ML 기초·신경망 원리 생략
> **구성**: 11 Parts · 내용 기반 위계 (일정 무관, 자가 페이스)

---

## 🗺️ 전체 지도

| Part | 주제 | 카테고리 |
|---|---|---|
| 1 | LLM 기초 | 🟦 토대 |
| 2 | 프롬프트 · 컨텍스트 엔지니어링 | 🟩 하네스 |
| 3 | RAG | 🟩 하네스 |
| 4 | AI 에이전트 + MCP / A2A | 🟩 하네스 ⭐ |
| 5 | 코딩 에이전트 도구 | 🟩 하네스 |
| 6 | SLM & Domain Adaptation | 🟧 모델 |
| 7 | Efficient Fine-tuning (PEFT) | 🟧 모델 |
| 8 | Quantization & On-device | 🟧 모델 |
| 9 | Vision & 멀티모달 | 🟧 모델 |
| 10 | Eval-Driven Development & 운영 | 🟩 하네스 |
| 11 | 캡스톤 프로젝트 | 🟪 종합 |

> 🟦 토대 / 🟩 하네스 (모델을 둘러싼 시스템) / 🟧 모델 (학습·튜닝·배포) / 🟪 종합

---

## Part 1. LLM 기초

- 1.1 Transformer 아키텍처 (Self-Attention · Positional Encoding · FFN)
- 1.2 토큰화와 임베딩 · 한국어 토큰화 함정
- 1.3 학습 파이프라인 (Pretrain → SFT → RLHF / DPO)
- 1.4 디코딩 전략 (Temperature · Top-p · Beam · Speculative)
- 1.5 2026 LLM 지형도 (Frontier · 오픈소스 · 소형 · Reasoning)
- 1.6 토큰 경제학 (가격 · 컨텍스트 윈도우 · 캐싱)

## Part 2. 프롬프트 · 컨텍스트 엔지니어링

- 2.1 프롬프트 구조 (System / User / Assistant)
- 2.2 Few-shot · Chain-of-Thought · Self-Consistency
- 2.3 ReAct · Reflexion · Self-Critique
- 2.4 구조화 출력 (JSON · XML · 스키마 강제)
- 2.5 Long Context · Lost in the Middle
- 2.6 Prompt Caching · Compaction
- 2.7 Function Calling / Tool Use 기초
- 2.8 Prompt Engineering vs Prompt Tuning 구분 (Tuning은 Part 7)

## Part 3. RAG

- 3.1 임베딩 모델과 벡터 DB
- 3.2 기본 파이프라인 (Chunk → Embed → Retrieve → Generate)
- 3.3 하이브리드 검색 (BM25 + Dense)
- 3.4 리랭킹 (Reranker 모델)
- 3.5 고급 RAG (Contextual · RAPTOR · GraphRAG · HyDE)
- 3.6 Agentic RAG · Self-RAG · Corrective RAG
- 3.7 제품 문서 RAG 케이스 스터디
- 3.8 RAG 평가 (Recall@K · Faithfulness · RAGAS)

## Part 4. AI 에이전트 + MCP / A2A ⭐

- 4.1 에이전트 정의와 분류 (Workflow vs Agent · Augmented LLM)
- 4.2 LLM → Agent 진화 경로
- 4.3 ReAct 루프 직접 구현
- 4.4 Planning (Plan-Execute · ToT · LATS · Decomposition)
- 4.5 Reflection · Self-Correction
- 4.6 Memory 시스템 (Working · Episodic · Long-term · MemGPT/Letta)
- 4.7 Tool Use 심화 (병렬 · 에러 · 권한 · 샌드박싱)
- 4.8 에이전트 프레임워크 비교 (맨손 SDK · 그래프형 · 역할형)
- 4.9 MCP (Model Context Protocol) — 도구 · 리소스 공급
- 4.10 A2A (Agent-to-Agent) 프로토콜 — 에이전트 간 통신
- 4.11 Multi-Agent 패턴 (Orchestrator-Worker · Hierarchical · Swarm)
- 4.12 Tool-calling 기반 Task Routing
- 4.13 사용자 요청 분해 · 라우팅 전략
- 4.14 Human-in-the-loop · Approval 게이트

## Part 5. 코딩 에이전트 도구

- 5.1 CLI 코딩 에이전트
- 5.2 IDE 통합 에이전트
- 5.3 오픈소스 경량 에이전트
- 5.4 클라우드 비동기 에이전트
- 5.5 작업 유형별 도구 선택 매트릭스

## Part 6. SLM & Domain Adaptation

- 6.1 SLM의 정의 — *왜 SLM이 필요한가* (LLM과 trade-off)
- 6.2 SLM 구조와 출력 원리 (Part 1의 LLM과 비교)
- 6.3 SLM 주요 컴포넌트 (Tokenizer · Backbone · Head · Decoder Config)
- 6.4 Domain Data Engineering (수집 · 정제 · 라벨링)
- 6.5 도메인 적합성 평가
- 6.6 Multi-Modal SLM — VLM 구조와 동작 흐름
- 6.7 Multi-Modal SLM Fine-tuning 개요
- 6.8 Multi-Modal SLM Inference 실습

## Part 7. Efficient Fine-tuning (PEFT)

- 7.1 Full Fine-tuning vs PEFT — 언제 어느 쪽?
- 7.2 LoRA (Low-Rank Adaptation) 원리
- 7.3 QLoRA — NF4 · Double Quantization · LoRA Rank
- 7.4 Adapter · Prefix Tuning · **Prompt Tuning** (soft prompts) 비교
- 7.5 Task-Specific 튜닝 전략 (요약 · 분류 · 제어)
- 7.6 학습 파이프라인 구성 (Hugging Face PEFT · TRL)
- 7.7 평가 — 베이스 모델 vs 튜닝 모델 비교

## Part 8. Quantization & On-device 최적화

- 8.1 양자화 기본 원리 (FP32 → INT8 / INT4)
- 8.2 Post-Training Quantization vs Quantization-Aware Training
- 8.3 GGUF — llama.cpp 생태계
- 8.4 GPT-Q — Weight-only quantization
- 8.5 AWQ — Activation-aware Weight Quantization
- 8.6 Spin-Quant — 회전 기반 신기법
- 8.7 ONNX 변환 및 양자화 실습
- 8.8 On-device 배포 trade-off (속도 · 메모리 · 정확도)

## Part 9. Vision & 멀티모달

### 9-A. Vision Backbone
- 9.1 CNN (ResNet 등) 구조 복기
- 9.2 ViT (Vision Transformer) 구조
- 9.3 Patch Embedding 메커니즘
- 9.4 Vision Self-Attention과 Language Self-Attention 공통점
- 9.5 하이브리드 아키텍처 (CNN + Transformer)

### 9-B. Document Intelligence
- 9.6 Traditional OCR — 원리와 한계
- 9.7 Modern VDU — Donut · Nougat · LayoutLM
- 9.8 VLM 기반 문서 파싱 워크플로
- 9.9 손글씨 · 표 · 다이어그램 처리

### 9-C. Generative Vision
- 9.10 Diffusion 기본 원리 (Forward / Reverse Process)
- 9.11 DDPM · DDIM 수식 이해
- 9.12 Latent Diffusion (Stable Diffusion) 아키텍처 분석
- 9.13 ControlNet · LoRA · IP-Adapter
- 9.14 Flow Matching · Consistency Model (차세대)

### 9-D. 음성 · 비디오
- 9.15 Whisper STT
- 9.16 TTS (Realtime · Voice cloning)
- 9.17 비디오 생성 모델 개요

## Part 10. Eval-Driven Development & 운영

- 10.1 LLM 평가의 어려움 (비결정성 · 다축 품질)
- 10.2 평가셋 설계 (Golden Set · Edge Case · 적대 케이스)
- 10.3 자동 평가 vs 휴먼 평가
- 10.4 LLM-as-a-Judge (편향과 보정)
- 10.5 회귀 테스트 자동화 · CI 통합
- 10.6 평가 도구 분류
- 10.7 관측성 · 트레이싱
- 10.8 비용 최적화 (라우팅 · 캐싱 · 배치 API)
- 10.9 지연 관리 (스트리밍 · TTFT · 병렬화)
- 10.10 보안 (Prompt Injection · PII · 도구 권한)
- 10.11 책임 있는 배포 (Red Team · 안전 정책)

## Part 11. 캡스톤 프로젝트

- 11.1 문제 정의 · 성공 지표
- 11.2 아키텍처 설계 (Agent? RAG? Fine-tuned SLM? 조합?)
- 11.3 평가셋 구축
- 11.4 MVP → 강화 → 배포
- 11.5 운영 · 모니터링 적용
- 11.6 회고와 공개

---

## 📐 학습 모델

**두 축의 통합**
- 🟩 **하네스 엔지니어링** (Part 2~5, 10): 모델을 둘러싼 시스템 — 프롬프트 · RAG · 에이전트 · 도구 · Eval · 운영
- 🟧 **모델 엔지니어링** (Part 6~9): 모델 자체를 다듬기 — SLM · 튜닝 · 양자화 · Vision
- 🟪 **캡스톤** (Part 11): 두 축이 만나는 시스템 (예: 튜닝한 SLM을 에이전트의 도구로)

**학습 원칙**
1. 페이퍼는 강제 X — Part당 1편만 정독, 나머지는 abstract만
2. 각 Part 끝에 *손으로 만든 산출물 1개* 필수
3. 도구 1종에 매몰 X — Part 5에서 의식적으로 여러 도구 사용
4. **튜닝 전에 RAG · Prompt부터** — Fine-tuning은 마지막 수단
   - Stage 1: Prompt Engineering
   - Stage 2: RAG
   - Stage 3: Fine-tuning
5. Eval 없는 에이전트 · 모델은 시간 지나면 부서짐 — Part 10 스킵 금지

**의존성 그래프**
```
Part 1 (토대)
   ↓
   ├─→ Part 2 (프롬프트) ─→ Part 3 (RAG) ─→ Part 4 (에이전트) ─→ Part 5 (코딩 도구)
   │                                                                      ↓
   └─→ Part 6 (SLM) ─→ Part 7 (PEFT) ─→ Part 8 (양자화)              Part 10 (Eval)
                                            ↓                              ↓
                                       Part 9 (Vision) ────────────→ Part 11 (캡스톤)
```

> Part 1 완료 후 *하네스 트랙(2→3→4→5)* 과 *모델 트랙(6→7→8→9)* 은 *병렬* 학습 가능. 본인 우선순위에 맞게.

---

## 📌 사내 교육 ↔ 본 커리큘럼 매핑 (참고용)

| 사내 세션 | 본 커리큘럼 Part / 절 |
|---|---|
| 1. Agentic AI & MCP/A2A | Part 4 (전체) |
| 2. Multi-Agent Workflow | 4.11 · 4.12 · 4.13 |
| 3. 제품 문서 RAG | 3.7 + Part 3 전반 |
| 4. Advanced RAG & Prompt Tuning | 3.5 + 7.4 |
| 5. Domain SLM & Data Engineering | 6.1 ~ 6.5 |
| 6. Multi-Modal SLM | 6.6 ~ 6.8 |
| 7. Efficient Fine-tuning (LoRA) | Part 7 (전체) |
| 8. On-device 최적화 | Part 8 (전체) |
| 9. Visual Understanding & Generation | Part 9 (전체) |
