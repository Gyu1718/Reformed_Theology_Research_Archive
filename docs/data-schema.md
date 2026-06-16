# Data Schema

이 문서는 공개 아카이브의 JSON 데이터 입력 규칙입니다.

## 현재 관리 파일

- `data/books.json`: 책 정보
- `data/authors.json`: 학자 정보
- `data/topics.json`: 교리 주제 정보
- `data/passages.json`: 성경 본문 정보
- `data/tradition-history.json`: 개혁전통 역사 정보
- `data/neo-orthodoxy-history.json`: 신정통주의 역사 정보
- `data/neo-orthodoxy-doctrine-history.json`: 신정통주의 세부 교리사 정보
- `data/author-history-links.json`: 학자와 역사 항목 연결
- `data/topic-history-links.json`: 주제와 역사 항목 연결
- `data/passage-theology-links.json`: 본문과 주제·역사 항목 연결
- `data/taxonomy.json`: 표준 주제 분류

## 입력 원칙

- 책 데이터는 서지정보, 목차, 장별 요약, 주제 태그를 중심으로 입력합니다.
- 학자 데이터는 이름, 시대, 전통, 핵심 주제, 주요 저작을 중심으로 입력합니다.
- 주제 데이터는 개념 요약, 관련 주제, 문헌 위치, 전통별 입장을 중심으로 입력합니다.
- 본문 데이터는 성경 본문 표기, 요약, 관련 주제, 관련 문헌을 중심으로 입력합니다.
- 역사 데이터는 시대, 정의, 배경, 주요 인물, 주요 문헌, 신학 쟁점, 연결 색인을 중심으로 입력합니다.
- 긴 원문은 넣지 않고, 필요한 경우 위치 정보만 짧게 기록합니다.
- `id`는 링크와 검색에 사용되므로 한 번 정하면 가급적 바꾸지 않습니다.

## 역사 항목 필드

역사 항목은 다음 필드를 사용합니다.

- `id`
- `title`
- `period`
- `category`
- `summary`
- `definition`
- `historicalBackground`
- `keyQuestions`
- `keyFigures`
- `keyDocuments`
- `theologicalIssues`
- `relatedTopics`
- `relatedBooks`
- `relatedAuthors`
- `relatedPassages`
- `misunderstandings`
- `researchUses`
- `quotePointers`
- `status`

## 태그 관리 원칙

태그는 너무 세분화하지 않고, 먼저 대주제를 고정합니다.

대표 태그: 신학서론, 계시론, 성경론, 신론, 삼위일체, 작정, 예정론, 섭리, 창조, 인간론, 죄론, 기독론, 속죄론, 구원론, 칭의, 성화, 교회론, 성례론, 언약신학, 종말론, 성경신학, 신학방법론, 자연신학, 현대신학, 신정통주의, 변증법적 신학.
