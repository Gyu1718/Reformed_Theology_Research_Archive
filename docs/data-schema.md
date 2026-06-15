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

## 3. topics.json

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

## 4. passages.json

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

## 5. notes.json

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

## 6. 태그 관리 원칙

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

## 7. 입력 원칙

- 원문 전문을 붙여 넣지 않습니다.
- 요약은 직접 작성합니다.
- 인용은 짧게 제한하고, 가능하면 페이지 또는 장절 위치만 기록합니다.
- `id`는 나중에 링크와 검색에 사용되므로 한 번 정하면 가급적 바꾸지 않습니다.
