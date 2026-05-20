# 📘 AI Study 계획 (Curriculum)

> **목표**: 2026년 시점 "AI 교양 → AI 에이전트 엔지니어링"까지의 표준 풀코스
> **기간**: 16주 (2026-05-20 ~ 2026-09-09)
> **주당 시간**: 약 15시간 (평일 1.5h × 5 + 주말 7.5h)
> **전제**: AI/ML 경험자 — ML 기초·신경망 원리는 생략

---

## Part 1. LLM 기초 갱신 (W1–W2)

- Transformer 아키텍처 (Self-Attention · Positional Encoding · FFN)
- 토큰화와 임베딩
- 학습 파이프라인 (Pretrain → SFT → RLHF / DPO)
- 디코딩 전략 (Temperature · Top-p · Beam · Speculative)
- 2026 LLM 지형도 (Frontier · 오픈소스 · 소형 · Reasoning)
- 토큰 경제학 (가격 · 컨텍스트 윈도우 · 캐싱)

## Part 2. 프롬프트·컨텍스트 엔지니어링 (W3–W5)

- 프롬프트 구조 (System / User / Assistant)
- Few-shot · Chain-of-Thought · Self-Consistency
- ReAct · Reflexion · Self-Critique
- 구조화 출력 (JSON · XML · 스키마 강제)
- Long Context · Lost in the Middle
- Prompt Caching · Compaction
- Function Calling / Tool Use 기초

## Part 3. RAG (W6–W7)

- 임베딩 모델과 벡터 DB
- 기본 파이프라인 (Chunk → Embed → Retrieve → Generate)
- 하이브리드 검색 (BM25 + Dense)
- 리랭킹
- 고급 RAG (Contextual · RAPTOR · GraphRAG · HyDE)
- Agentic RAG · Self-RAG
- RAG 평가 (Recall · Faithfulness)

## Part 4. AI 에이전트 ⭐ (W8–W11)

- 에이전트 정의와 분류 (Workflow vs Agent)
- ReAct 루프 직접 구현
- Planning (Plan-Execute · ToT · LATS)
- Reflection · Self-Correction
- Memory 시스템 (Working · Episodic · Long-term)
- Tool Use 심화 (병렬 · 에러 · 권한)
- 프레임워크 비교 (맨손 SDK · 그래프형 · 역할형)
- MCP (Model Context Protocol)
- 멀티에이전트 (Orchestrator-Worker · Hierarchical · Swarm)
- Human-in-the-loop

## Part 5. 코딩 에이전트 도구 (W12)

- CLI 코딩 에이전트
- IDE 통합 에이전트
- 오픈소스 경량 에이전트
- 클라우드 비동기 에이전트
- 작업 유형별 도구 선택 매트릭스

## Part 6. Eval-Driven Development (W13)

- LLM 평가의 어려움
- 평가셋 설계 (Golden Set · Edge Case)
- 자동 vs 휴먼 평가
- LLM-as-a-Judge (편향과 보정)
- 회귀 테스트 자동화
- 평가 도구 분류

## Part 7. 운영 (W14)

- 관측성 · 트레이싱
- 비용 최적화 (라우팅 · 캐싱 · 배치)
- 지연 관리 (스트리밍 · TTFT)
- 보안 (Prompt Injection · PII · 권한)
- 책임 있는 배포 (Red Team · 안전 정책)

## Part 8. 멀티모달 (선택, 주말 보충)

- 비전-언어 모델
- Diffusion 이미지 생성
- 음성 (STT · TTS · Realtime)
- 비디오 생성

## Part 9. 캡스톤 프로젝트 (W15–W16)

- 문제 정의 · 성공 지표
- 아키텍처 설계
- 평가셋 구축
- MVP → 강화
- 운영 · 모니터링 적용
- 회고와 공개

---

## 📐 학습 모델

**Agent = Model + Harness**
- 모델은 직접 못 만든다 (프론티어 랩이 만든다)
- 우리는 모델을 둘러싼 시스템(=하네스)을 만든다
- Part 2~7은 사실상 *하네스를 짜는 법* 전체

**주간 운영 루틴**
- 월–목: 1.5h × 4 = 이론 학습 + 정리
- 금: 1.5h = 핸즈온 1차 시도
- 토: 4h = 핸즈온 본 작업
- 일: 3.5h = 정리 + 회고 + 예습

**핵심 원칙**
1. 페이퍼는 강제 X — Phase당 1편만 핵심 정독, 나머지는 abstract만
2. 매주 산출물 1개 강제 — 산출물 없는 주는 그 주를 안 한 걸로 침
3. 도구 1종에 매몰 X — Part 5에서 의식적으로 여러 도구 사용
4. Eval 없는 에이전트는 6주 뒤 부서짐 — Part 6 절대 스킵 금지
