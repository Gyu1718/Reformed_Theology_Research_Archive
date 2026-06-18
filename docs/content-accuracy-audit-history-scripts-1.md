# 역사 보조 스크립트 내용 정확도 1차 검수

검수일: 2026-06-18  
범위: 역사 페이지 보조 스크립트  
검수 기준: 바르트 신정통주의 우선

## 검수 대상

- `js/history-question-explanations.js`
- `js/history-overview-enhance.js`
- `js/history-topic-link-enhance.js`
- `js/history-detail-compact.js`

## 요약 판정

| 파일 | 판정 | 핵심 문제 | 우선순위 |
|---|---|---|---|
| `history-question-explanations.js` | 일부 문장 보정 필요 | 신정통주의를 “비교 대상”으로만 두고 개혁파 정통 기준을 유지한다는 문장이 남아 있음 | 높음 |
| `history-overview-enhance.js` | 안내 순서 보정 필요 | “처음 읽는다면 개혁전통 기본 흐름을 먼저”라는 안내가 바르트 우선 방향과 어긋남 | 중간 |
| `history-topic-link-enhance.js` | 명확한 연결 오류 수정 필요 | `성례론`이 `ecclesiology`로, `언약신학`이 `creation-covenant`로, `죄론/인간론`이 존재하지 않는 id로 연결됨 | 높음 |
| `history-detail-compact.js` | 유지 가능 | 내용 문구가 아니라 레이아웃 압축 스크립트이므로 신학 내용 오류 없음 | 낮음 |

## 세부 검수표

| 위치 | 현재 구조 | 문제 유형 | 검수 판단 | 수정 방향 |
|---|---|---|---|---|
| `history-question-explanations.js / barth-and-neo-orthodoxy[3]` | “신정통주의를 개혁신학 연구 아카이브 안에 넣을 때 어떤 비교 기준이 필요한가?” | 바르트 우선순위 보정 | 신정통주의가 단순히 개혁신학 아카이브 안에 들어온 비교 대상처럼 보임 | “바르트 신정통주의를 우선순위로 둘 때 개혁파 정통은 어떤 비교 배경이 되는가?”로 보정 |
| `history-question-explanations.js / reformed-orthodoxy-and-neo-orthodoxy[3]` | “아카이브는 개혁파 정통의 기준을 분명히 유지하면서…” | 바르트 우선순위 보정 | 개혁파 정통이 최종 해석 기준처럼 보이며 현재 방향과 충돌 | 바르트의 계시 중심 문제의식을 먼저 세우고 개혁파 정통을 비교 배경으로 두는 문장으로 보정 |
| `history-overview-enhance.js` | “처음 읽는다면 개혁전통 기본 흐름을 먼저 보고…” | 학습 동선 보정 | 사이트 우선순위가 바르트 신정통주의라면 신정통주의 기본 흐름이 먼저 나와야 함 | 안내 문구와 흐름 순서를 신정통주의 → 주요 논쟁 → 개혁전통 순으로 보정 |
| `history-topic-link-enhance.js / ALIASES` | `성례론: ecclesiology` | 연결 오류 | 성례론은 별도 topic id `sacraments`가 있으므로 교회론으로 보내면 잘못된 연결 | `성례론`, `성례`, `세례`, `성찬`을 `sacraments`로 연결 |
| `history-topic-link-enhance.js / ALIASES` | `언약신학: creation-covenant` | 연결 오류 | `covenant-theology` 주제가 따로 있으므로 언약신학은 그쪽으로 연결해야 함 | `언약`, `언약신학`, `언약론`, `행위언약`, `은혜언약`을 `covenant-theology`로 연결 |
| `history-topic-link-enhance.js / ALIASES` | `죄론: sin`, `인간론: humanity` | 연결 오류 | 현재 주제 id에는 `sin`, `humanity`가 없고 `anthropology-and-sin`이 사용됨 | `죄론`, `죄`, `타락`, `원죄`, `인간론`, `하나님의 형상`을 `anthropology-and-sin`으로 연결 |
| `history-detail-compact.js` | CSS 압축 | 유지 가능 | 내용 데이터나 신학 문장을 바꾸지 않음 | 유지 |

## 반영한 수정

### 1. 연결 alias 직접 수정

`js/history-topic-link-enhance.js`를 수정해 역사 항목의 관련 주제가 올바른 교리 상세 페이지로 이동하도록 했다.

수정된 핵심 매핑:

```js
"언약신학": "covenant-theology"
"성례론": "sacraments"
"죄론": "anthropology-and-sin"
"인간론": "anthropology-and-sin"
```

### 2. 질문 해설 및 역사 안내 패치 추가

`js/history-script-accuracy-patch.js`를 추가했다.

역할:

- `window.__HISTORY_QUESTION_EXPLANATIONS__` 안의 바르트/신정통주의 관련 질문과 답변을 바르트 우선 방향으로 보정
- 역사 개요 안내 문구를 “신정통주의 기본 흐름 우선”으로 보정
- 역사 흐름 카드를 신정통주의 → 주요 논쟁·교리 비교 → 개혁전통 순서로 재배열

### 3. 로드 순서 반영

`index.html`에서 `history-topic-link-enhance.js` 이후, `history-detail-compact.js` 이전에 새 패치를 로드하도록 했다.

```html
<script src="./js/history-topic-link-enhance.js"></script>
<script src="./js/history-script-accuracy-patch.js?v=20260618"></script>
<script src="./js/history-detail-compact.js?v=20260618-fix-mini-cols"></script>
```

## 전체 판단

이번 검수는 단순 문장 보정보다 연결 정확도에서 의미가 크다. `성례론`, `언약신학`, `죄론`, `인간론`이 잘못된 페이지 또는 존재하지 않는 topic id로 연결되면 사용자는 역사 페이지에서 교리 페이지로 넘어갈 때 엉뚱한 학습 경로를 밟게 된다. 이 문제는 내용상 오류이면서 동시에 사용자 경험 오류다.

질문 해설과 역사 개요는 사실 오류라기보다 사이트의 해석 방향성 문제였다. 바르트 신정통주의 우선이라는 기준을 적용하면, 역사 학습도 개혁전통을 먼저 읽고 신정통주의로 넘어가는 구조보다는 바르트의 문제의식을 먼저 세운 뒤 개혁파 전통을 비교 배경으로 읽는 구조가 더 적절하다.

## 다음 검수 범위

다음 단계는 책/학자 데이터의 내용 정확도 검수다.

- `data/authors.json`
- `data/books-barth.json`
- `data/books.json`
- 바르트·칼빈·바빙크·벌코프 보강 preload 데이터
