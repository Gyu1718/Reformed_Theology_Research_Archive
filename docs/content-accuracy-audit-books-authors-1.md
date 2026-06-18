# 책·학자 데이터 내용 정확도 1차 검수

검수일: 2026-06-18  
범위: `data/authors.json`, `data/books-barth.json`, `data/books.json`, `js/bavinck-preload.js`, `js/berkhof-preload.js`  
검수 기준: 바르트 신정통주의 우선

## 요약 판정

| 대상 | 판정 | 핵심 문제 | 우선순위 |
|---|---|---|---|
| `authors.json / karl-barth` | 보정 필요 | 바르트 설명이 “개혁파 정통과 갈라진다”로 너무 짧게 압축됨 | 높음 |
| `authors.json / john-calvin` | 보정 권장 | 칼빈을 고전적 개혁파 비교 배경으로 읽는 역할이 드러나지 않음 | 중간 |
| `authors.json / herman-bavinck` | 보정 권장 | 바르트와 비교할 때 계시 중심 문제의식과 자연·은혜·문화 차이가 드러나지 않음 | 중간 |
| `authors.json / louis-berkhof` | 보정 권장 | 벌코프가 바르트와 비교되는 개혁파 표준 배열의 기준점이라는 역할이 약함 | 중간 |
| `authors.json / emil-brunner` | 보정 권장 | 바르트의 자연신학 비판을 이해하기 위한 핵심 비교 대상이라는 기능을 강화할 필요 | 중간 |
| `authors.json / rudolf-bultmann` | 보정 권장 | “신정통주의 주변 흐름”은 불트만을 신정통주의 안에 넣는 듯한 오해 가능성 | 중간 |
| `books-barth.json / barth-church-dogmatics` | 보정 필요 | 내용은 좋지만 “아카이브의 해석 우선축”이라는 현재 방향이 명시되어 있지 않음 | 높음 |
| `books.json / calvin-institutes` | 기존 패치와 연결 | 일부 칼빈 챕터 표현 오류는 이미 `content-accuracy-patch.js`에서 보정 중 | 유지 |
| `js/bavinck-preload.js` | 보정 권장 | 바빙크 설명이 “바르트와 비교하면”으로 뒤에 붙는 구조 | 중간 |
| `js/berkhof-preload.js` | 보정 권장 | 벌코프 설명이 “바르트와 비교하면”으로 뒤에 붙는 구조 | 중간 |

## 세부 검수표

| 위치 | 현재 문장/구조 | 문제 유형 | 검수 판단 | 수정 방향 |
|---|---|---|---|---|
| `authors.karl-barth.summary` | “변증법적·신정통주의 신학의 중심 인물. 자연신학 거부와 그리스도 중심 선택론으로 개혁파 정통과 갈라진다.” | 바르트 우선순위 보정 | 바르트를 차이점 두 개로만 요약해 사이트 중심 인물로서의 역할이 약함 | 『교회교의학』 전체 구조, 하나님의 말씀, 계시, 선택, 창조, 화해, 교회 증언을 그리스도 중심으로 재구성한 인물로 설명 |
| `authors.karl-barth.majorWorks` | `로마서 강해` | 명칭 통일 | 역사 데이터는 `로마서 주석`을 사용하므로 명칭 통일이 필요 | `로마서 주석`으로 보정 |
| `authors.john-calvin.summary` | “제네바 종교개혁을 이끌며…” | 역할 보정 | 틀리지는 않지만 바르트 우선 아카이브 안에서 칼빈이 비교 배경이라는 역할이 약함 | 바르트의 계시론·예정론·교회론 재구성을 비교하기 위한 고전적 개혁파 배경으로 설명 |
| `authors.herman-bavinck.summary` | “개혁파 교의학을 역사신학, 철학, 근대 사상과의 대화 속에서 종합…” | 역할 보정 | 맞는 설명이지만 바르트와의 핵심 차이가 드러나지 않음 | 계시 중심 문제의식은 접하지만 자연·은혜·창조·문화 관계에서 고전적 개혁파 종합을 보인다고 설명 |
| `authors.louis-berkhof.summary` | “개혁파 조직신학을 교육용 체계로…” | 역할 보정 | 사실상 맞지만 바르트와 비교할 기준점 역할이 약함 | 바르트의 재구성과 비교할 개혁파 정통의 교과서적 배열로 설명 |
| `authors.emil-brunner.summary` | “바르트와 함께 신정통주의를 대표하지만…” | 역할 보정 | 설명은 맞지만 바르트 우선 관점에서 브루너의 기능이 약함 | 바르트의 계시론과 자연신학 거부를 선명하게 하기 위한 핵심 비교 대상으로 보정 |
| `authors.rudolf-bultmann.tradition` | “신정통주의 주변 흐름” | 분류 오해 가능성 | 불트만을 신정통주의 내부 인물처럼 오해할 수 있음 | “현대신학 / 신정통주의 비교 대상”으로 보정 |
| `books.barth.summary` | “20세기 개신교 교의학의 대표 문헌” | 바르트 우선순위 보정 | 대표 문헌이라는 설명은 맞지만, 현재 아카이브의 우선 기준임이 드러나야 함 | “이 아카이브의 신학적 우선 기준”을 명시 |
| `books.barth.researchUse` | “칼빈·벌코프·바빙크와 비교할 때…” | 바르트 우선순위 보정 | 바르트가 비교 대상처럼 보일 수 있음 | 바르트를 해석 우선축으로 두고 칼빈·바빙크·벌코프를 비교 배경으로 읽는 구조로 보정 |
| `bavinck-preload.researchUse` | “바르트와 비교하면…” | 방향 보정 | 바르트가 뒤에 붙는 구조 | 바르트 우선 관점에서 바빙크의 역할을 설명 |
| `berkhof-preload.researchUse` | “바르트와 비교하면…” | 방향 보정 | 바르트가 뒤에 붙는 구조 | 바르트 우선 관점에서 벌코프의 역할을 설명 |

## 반영한 수정

### 1. 새 패치 파일 추가

`js/book-author-accuracy-patch.js`를 추가했다.

역할:

- 바르트, 칼빈, 바빙크, 벌코프, 브루너, 불트만의 학자 카드 설명을 바르트 우선 방향으로 보정
- 바르트의 주요 저작명을 `로마서 주석`으로 통일
- 『교회교의학』, 『기독교 강요』, 『개혁교의학』, 『조직신학』의 summary/researchUse를 바르트 우선 비교 구조로 보정

### 2. 로드 순서 반영

`index.html`에서 `book-author-accuracy-patch.js`를 `app.js` 렌더링 전에 로드하도록 했다.

```html
<script src="./js/content-accuracy-patch.js?v=20260618"></script>
<script src="./js/history-accuracy-patch.js?v=20260618"></script>
<script src="./js/book-author-accuracy-patch.js?v=20260618"></script>
<script src="./js/app.js"></script>
```

## 전체 판단

책·학자 데이터에서 심각한 사실 오류는 많지 않다. 가장 중요한 문제는 설명의 방향성이다. 바르트 우선 아카이브라면 바르트는 단순히 개혁파 정통과 비교되는 현대 신학자가 아니라, 이 사이트의 해석 우선축이다. 따라서 칼빈·바빙크·벌코프는 바르트를 판정하는 기준이라기보다, 바르트의 계시 중심·그리스도 중심 재구성이 어떤 점에서 전통 개혁파 질서와 만나고 갈라지는지를 보여 주는 비교 배경으로 배치해야 한다.

## 다음 검수 범위

다음 단계는 바르트 세부 preload 데이터 검수다.

- `js/barth-i1-subtopics-preload.js`
- `js/barth-i2-subtopics-preload.js`
- `js/barth-ii1-subtopics-preload.js`
- `js/barth-ii2-subtopics-preload.js`
- `js/barth-iii1-subtopics-preload.js` 등
