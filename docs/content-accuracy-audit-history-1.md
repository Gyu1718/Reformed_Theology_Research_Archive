# 역사 페이지 내용 정확도 1차 검수

검수일: 2026-06-18  
범위: `data/tradition-history.json`, `data/neo-orthodoxy-history.json`, `data/neo-orthodoxy-doctrine-history.json`  
검수 기준: 바르트 신정통주의 우선

## 요약 판정

| 파일 | 판정 | 핵심 문제 | 우선순위 |
|---|---|---|---|
| `data/tradition-history.json` | 대체로 유지, 잔여 연결 정리 필요 | 개혁파 역사 설명은 안정적이나 일부 `relatedPassages`가 남아 있음 | 중간 |
| `data/neo-orthodoxy-history.json` | 대체로 유지, 바르트 우선 표현 일부 조정 | 바르트 중심 설명은 좋으나 성경 본문 연결 잔여 데이터와 비교 기준 문구 일부가 현재 방향과 충돌 | 높음 |
| `data/neo-orthodoxy-doctrine-history.json` | 대체로 유지, 잔여 연결 정리 필요 | 자연신학 논쟁과 예정론 항목은 잘 잡혀 있으나 `relatedPassages`가 남아 있음 | 중간 |

## 전체 판단

역사 데이터의 내용 자체는 전반적으로 안정적이다. 개혁파 전통 항목은 종교개혁, 도르트, 웨스트민스터, 정통주의를 사실상 무리 없이 설명하고 있다. 신정통주의 역사 항목도 자유주의 신학 배경, 변증법적 신학, 바르트와 신정통주의, 개혁파 정통과 신정통주의의 긴장을 비교축으로 잘 구성하고 있다.

이번 검수에서 실제 수정이 필요한 지점은 세 가지다.

1. 공개 저장소에서 성경 본문 데이터가 빠진 상태이므로, 역사 데이터의 `relatedPassages` 잔여 연결을 제거해야 한다.
2. 바르트 우선 방향에 맞게 “신정통주의를 비교 대상으로 둘 때”라는 표현을 “바르트 신정통주의를 해석 우선순위로 둘 때”로 바꾸는 것이 좋다.
3. 개혁파 정통의 기준으로 바르트를 재단한다는 인상을 주는 문장을, 바르트 우선 비교 구조에 맞게 조정해야 한다.

## 세부 검수표

| 위치 | 현재 문장/구조 | 문제 유형 | 검수 판단 | 수정 방향 |
|---|---|---|---|---|
| `tradition-history.synod-of-dort.relatedPassages` | 로마서 9장, 에베소서 1:4-5 등 | 잔여 연결 | 공개 데이터 구조상 `data/passages.json`이 없으므로 상세 페이지 연결값으로 남기면 불필요한 잔여 데이터가 됨 | 모든 history 항목의 `relatedPassages`를 런타임에서 빈 배열로 정리 |
| `neo-orthodoxy-history.dialectical-theology.relatedPassages` | 로마서 1장, 로마서 3장, 로마서 9장 | 잔여 연결 | 바르트의 『로마서』 주석 배경 설명으로는 유용하지만, 현재 사이트 구조에서는 성경 본문 연결 데이터가 없으므로 제거 필요 | `relatedPassages: []` 처리 |
| `neo-orthodoxy-history.barth-and-neo-orthodoxy.relatedPassages` | 요한복음 1:14, 에베소서 1:4-5 등 | 잔여 연결 | 계시·예정·화해 주제와 관련은 있지만, 화면 연결 데이터로 남기기에는 현재 공개 구조와 맞지 않음 | `relatedPassages: []` 처리 |
| `neo-orthodoxy-history.reformed-orthodoxy-and-neo-orthodoxy.keyQuestions[3]` | “개혁신학 연구 아카이브에서 신정통주의를 비교 대상으로 둘 때 어떤 균형이 필요한가?” | 바르트 우선순위 보정 | 사용자의 현재 방향은 바르트 신정통주의 우선이다. 신정통주의가 단순 비교 대상처럼 보이면 방향성이 약해짐 | “바르트 신정통주의를 해석 우선순위로 둘 때 개혁파 정통은 어떤 비교 배경이 되는가?” |
| `neo-orthodoxy-history.reformed-orthodoxy-and-neo-orthodoxy.misunderstandings[2]` | “개혁파 정통의 기준 없이 바르트를 읽으면…” | 바르트 우선순위 보정 | 개혁파 정통이 최종 판정 기준처럼 읽힐 수 있음. 바르트 우선 사이트에서는 비교는 필요하지만, 개혁파 기준으로 바르트를 종속시키는 문장은 피하는 것이 좋음 | “바르트를 개혁파 정통의 기준으로만 재단하면 신정통주의의 계시 중심 문제의식이 사라지고, 비교 없이 수용하면 두 전통의 차이가 흐려진다.” |
| `neo-orthodoxy-doctrine-history.natural-theology-debate` | 자연신학 논쟁 설명 | 유지 가능 | 바르트와 브루너 차이, 개혁파 일반계시와 브루너 접촉점의 비동일성을 잘 잡고 있음 | 유지 |
| `neo-orthodoxy-doctrine-history.barth-election-doctrine` | 바르트 예정론 설명 | 유지 가능 | 바르트를 단순 보편구원론으로 환원하지 말라는 주의가 적절함 | 유지 |

## 1차 수정 권장안

### 1. 모든 역사 항목의 `relatedPassages` 제거

수정 방식:

```js
arr(window.__DATA__.history).forEach(function (item) {
  if (item && Array.isArray(item.relatedPassages)) item.relatedPassages = [];
});
```

이 방식은 원본 JSON을 즉시 흔들지 않고, 화면 렌더링 전 잔여 연결만 제거한다.

### 2. 비교사 항목의 질문 보정

기존:
> 개혁신학 연구 아카이브에서 신정통주의를 비교 대상으로 둘 때 어떤 균형이 필요한가?

수정:
> 바르트 신정통주의를 해석 우선순위로 둘 때 개혁파 정통은 어떤 비교 배경이 되는가?

### 3. 비교사 항목의 오해 방지 문장 보정

기존:
> 개혁파 정통의 기준 없이 바르트를 읽으면 신정통주의의 매력만 보이고, 바르트를 배제만 하면 20세기 신학의 문제의식을 놓치게 된다.

수정:
> 바르트를 개혁파 정통의 기준으로만 재단하면 신정통주의의 계시 중심 문제의식이 사라지고, 비교 없이 수용하면 두 전통의 차이가 흐려진다.

## 다음 검수 범위

다음 단계는 역사 페이지 렌더링·질문 해설·상세 페이지 보조 스크립트의 내용 정확도를 검수한다.

- `js/history-question-explanations.js`
- `js/history-overview-enhance.js`
- `js/history-topic-link-enhance.js`
- `js/history-detail-compact.js`
