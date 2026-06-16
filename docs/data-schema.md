# Data Schema

이 문서는 `data/*.json` 파일을 업데이트할 때 사용하는 입력 규칙입니다.

## 1. books.json

책 단위 데이터입니다.

```json
{
  "id": "berkhof-systematic-theology",
  "title": "조직신학",
  "author": "루이스 벌코프",
  "originalAuthor": "Louis Berkhof",
  "tradition": "Reformed",
  "category": "Systematic Theology",
  "language": "Korean",
  "summary": "책 전체 요약",
  "topics": ["신론", "구원론", "교회론"],
  "chapters": [
    {
      "chapterId": "berkhof-decrees",
      "title": "하나님의 작정",
      "summary": "장 요약",
      "topics": ["작정", "예정론"],
      "bibleReferences": ["에베소서 1:11", "로마서 9장"]
    }
  ]
}
```

### 필수 필드

- `id`: 영문 소문자와 하이픈 사용
- `title`: 책 제목
- `author`: 한국어 저자명
- `originalAuthor`: 원어 또는 영어 저자명
- `tradition`: 신학 전통
- `category`: 문헌 분류
- `summary`: 책 요약
- `topics`: 주제 태그
- `chapters`: 장별 데이터

## 2. authors.json

학자 단위 데이터입니다.

```json
{
  "id": "john-calvin",
  "name": "John Calvin",
  "koreanName": "존 칼빈",
  "period": "16세기 종교개혁",
  "tradition": "Reformed",
  "summary": "학자 요약",
  "keyTopics": ["성경론", "예정론", "교회론"],
  "majorWorks": ["기독교 강요"]
}
```

## 3. author-history-links.json

학자와 역사 항목을 연결하는 데이터입니다. `authors.json`의 학자 ID와 세 역사 데이터 파일의 역사 항목 ID를 연결합니다.

```json
{
  "authorId": "karl-barth",
  "authorName": "칼 바르트",
  "historyIds": [
    "modern-liberal-theology-background",
    "dialectical-theology",
    "barth-and-neo-orthodoxy",
    "natural-theology-debate",
    "barth-election-doctrine"
  ],
  "note": "바르트는 신정통주의의 중심 인물이며 계시론, 자연신학, 예정론, 개혁파 정통과의 비교에서 핵심 허브가 된다."
}
```

### 연결 원칙

- `authorId`: 반드시 `data/authors.json`에 존재하는 학자 id를 사용합니다.
- `historyIds`: `tradition-history.json`, `neo-orthodoxy-history.json`, `neo-orthodoxy-doctrine-history.json` 중 하나에 존재하는 id를 사용합니다.
- 직접 관련이 약한 경우에는 억지로 연결하지 않습니다.
- 아직 세부 역사 항목이 없는 학자는 임시로 `history-index`에 연결할 수 있으나, 추후 별도 항목을 만들면 교체합니다.

## 4. topics.json

교리와 연구 주제 단위 데이터입니다.

```json
{
  "id": "predestination",
  "name": "예정론",
  "category": "신론 / 구원론",
  "summary": "주제 요약",
  "relatedTopics": ["작정", "선택", "섭리"],
  "references": [
    {
      "bookId": "calvin-institutes",
      "location": "제3권",
      "note": "칼빈의 예정론 핵심 논의"
    }
  ]
}
```

## 5. topic-history-links.json

주제와 역사 항목을 연결하는 데이터입니다. `topics.json`의 주제 ID와 세 역사 데이터 파일의 역사 항목 ID를 연결합니다.

```json
{
  "topicId": "predestination",
  "topicName": "예정론",
  "historyIds": [
    "synod-of-dort",
    "westminster-assembly",
    "reformed-orthodoxy",
    "barth-election-doctrine"
  ],
  "note": "예정론은 도르트·웨스트민스터·개혁파 정통주의와 바르트의 그리스도 중심 예정론을 반드시 비교해야 한다."
}
```

### 연결 원칙

- `topicId`: 반드시 `data/topics.json`에 존재하는 주제 id를 사용합니다.
- `historyIds`: `tradition-history.json`, `neo-orthodoxy-history.json`, `neo-orthodoxy-doctrine-history.json` 중 하나에 존재하는 id를 사용합니다.
- 연결은 주제를 설명하는 데 실제 역사적 배경을 제공할 때만 추가합니다.
- 한 주제에 너무 많은 역사 항목을 붙이지 않고, 핵심 허브 중심으로 연결합니다.

## 6. passages.json

성경 본문 단위 데이터입니다.

```json
{
  "id": "romans-9",
  "reference": "로마서 9장",
  "book": "로마서",
  "testament": "New Testament",
  "summary": "본문의 신학적 연결 요약",
  "topics": ["예정론", "선택"],
  "relatedBooks": ["calvin-institutes"]
}
```

## 7. passage-theology-links.json

성경 본문과 주제·역사 항목을 연결하는 데이터입니다. `passages.json`의 본문 ID를 기준으로 `topics.json`의 주제 ID와 역사 항목 ID를 함께 연결합니다.

```json
{
  "passageId": "romans-9",
  "reference": "로마서 9장",
  "topicIds": [
    "predestination",
    "doctrine-of-god"
  ],
  "historyIds": [
    "synod-of-dort",
    "reformed-orthodoxy",
    "barth-election-doctrine"
  ],
  "note": "로마서 9장은 예정론, 선택과 유기, 하나님의 주권, 이스라엘 문제를 다루는 핵심 본문으로 도르트와 바르트 비교에서 반드시 함께 보아야 한다."
}
```

### 연결 원칙

- `passageId`: 가능하면 `data/passages.json`에 존재하는 본문 id를 사용합니다.
- `reference`: 화면 카드의 본문 표기와 일치시킵니다. 예: `로마서 9장`.
- `topicIds`: 반드시 `data/topics.json`에 존재하는 주제 id를 사용합니다.
- `historyIds`: 세 역사 데이터 파일 중 하나에 존재하는 id를 사용합니다.
- 아직 `passages.json`에 없는 본문도 확장 후보로 기록할 수 있지만, 화면에는 본문 카드가 생긴 뒤 표시됩니다.

## 8. notes.json

연구 메모 데이터입니다.

```json
{
  "id": "note-predestination-comparison",
  "title": "예정론 비교 연구 방향",
  "type": "research-note",
  "status": "draft",
  "createdAt": "2026-06-15",
  "body": "메모 본문",
  "tags": ["예정론", "칼빈", "벌코프"]
}
```

## 9. tradition-history.json / neo-orthodoxy-history.json / neo-orthodoxy-doctrine-history.json

역사 항목 데이터입니다. `tradition-history.json`은 개혁전통의 역사 항목을, `neo-orthodoxy-history.json`은 근대 자유주의 신학·변증법적 신학·칼 바르트와 신정통주의 항목을, `neo-orthodoxy-doctrine-history.json`은 자연신학 논쟁과 바르트 예정론 같은 세부 교리사 항목을 관리합니다. 전체 교회사 서술이 아니라, 개혁신학과 신정통주의의 주요 교리 주제와 문헌을 이해하는 데 필요한 역사적 맥락을 정리합니다.

```json
{
  "id": "reformed-orthodoxy",
  "title": "개혁파 정통주의란 무엇인가",
  "period": "16세기 후반-17세기",
  "category": "개혁전통의 역사",
  "summary": "개혁파 정통주의는 종교개혁 이후 개혁파 신학이 신앙고백, 논쟁, 교육, 조직신학의 형태로 체계화된 시기다.",
  "definition": "핵심 용어 정의",
  "historicalBackground": "역사적 배경 요약",
  "keyQuestions": [
    "이 항목이 답하려는 핵심 질문"
  ],
  "keyFigures": [
    {
      "name": "Francis Turretin",
      "role": "개혁파 정통주의 조직신학의 대표적 체계화"
    }
  ],
  "keyDocuments": [
    {
      "title": "웨스트민스터 신앙고백",
      "year": "1646",
      "note": "장로교 신앙고백 전통의 대표 문서"
    }
  ],
  "theologicalIssues": [
    "신학방법론",
    "예정론",
    "언약신학"
  ],
  "relatedTopics": [
    "신학방법론",
    "예정론",
    "언약신학"
  ],
  "relatedBooks": [
    "calvin-institutes"
  ],
  "relatedAuthors": [
    "john-calvin",
    "herman-bavinck"
  ],
  "relatedPassages": [],
  "misunderstandings": [
    "자주 생기는 오해를 직접 요약합니다."
  ],
  "researchUses": [
    "설교, 논문, 교리교육, 글쓰기에서 활용할 수 있는 방향"
  ],
  "quotePointers": [
    {
      "source": "책 또는 문헌명",
      "location": "권/장/절 또는 페이지",
      "note": "긴 원문을 붙이지 않고 인용 위치와 활용 메모만 적습니다."
    }
  ],
  "personalNote": "내 연구와의 연결 메모",
  "status": "draft"
}
```

### 필수 필드

- `id`: 영문 소문자와 하이픈 사용
- `title`: 역사 항목 제목
- `period`: 시대 또는 연도 범위
- `summary`: 항목 요약
- `relatedTopics`: 주제 태그 연결
- `status`: `draft`, `review`, `published` 중 하나로 관리

## 10. 태그 관리 원칙

태그는 너무 세분화하지 않고, 먼저 대주제를 고정합니다.

- 신학서론
- 계시론
- 성경론
- 신론
- 삼위일체
- 작정
- 예정론
- 섭리
- 창조
- 인간론
- 죄론
- 기독론
- 속죄론
- 구원론
- 칭의
- 성화
- 교회론
- 성례론
- 언약신학
- 종말론
- 성경신학
- 신학방법론
- 자연신학
- 현대신학
- 신정통주의
- 변증법적 신학

## 11. 입력 원칙

- 원문 전문을 붙여 넣지 않습니다.
- 요약은 직접 작성합니다.
- 인용은 짧게 제한하고, 가능하면 페이지 또는 장절 위치만 기록합니다.
- `id`는 나중에 링크와 검색에 사용되므로 한 번 정하면 가급적 바꾸지 않습니다.
- 역사 항목은 교리 주제, 책, 학자, 본문, 연구 메모와 연결되도록 입력합니다.
- 신정통주의 항목은 개혁파 정통과의 동일화가 아니라 비교를 위한 역사적 맥락으로 입력합니다.
