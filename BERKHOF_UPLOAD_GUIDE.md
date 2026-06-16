# 벌코프 보완 업로드 패키지 v2

이 패키지는 기존 v1에서 부족했던 **소주제 설명**을 강화한 버전입니다.

## 업로드할 파일

```txt
js/berkhof-preload.js
data/books/berkhof-chapter-profiles.json
data/quotes/berkhof-systematic-theology-quotes-explained-v2.json
```

## 핵심 개선

- 39개 장 전체에 `subtopicOverview` 추가
- 각 소주제마다 2–4문장 설명으로 확장
- 각 소주제마다 학습 질문 `subtopicQuestions` 추가
- 인용 60개 전체의 `subtopicExplanation`, `quoteExplanation`, `teachingUse`, `compareNote` 보강
- `berkhof-preload.js`가 `data/books/berkhof-chapter-profiles.json` 경로를 정확히 읽도록 수정
- 화면에서 소주제 개요, 소주제 설명, 질문, 인용 설명이 보이도록 렌더러 보강

## 주의

기존 v1–v6 인용팩은 삭제하지 않아도 됩니다. 새 preload는 설명 포함 v2 인용팩을 우선 읽고, 실패하면 기존 설명 포함 v1 또는 v1–v6으로 fallback합니다.
