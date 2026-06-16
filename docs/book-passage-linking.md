# Book ↔ Passage Linking

이 문서는 책 카드와 성경 본문 카드의 양방향 연결 규칙을 설명합니다.

## 1. 기본 원리

책과 본문 사이의 연결은 별도 데이터 파일을 만들지 않고 `data/passages.json`의 `relatedBooks` 값을 기준으로 자동 생성합니다.

```json
{
  "id": "romans-9",
  "reference": "로마서 9장",
  "relatedBooks": [
    "calvin-institutes",
    "berkhof-systematic-theology",
    "bavinck-reformed-dogmatics",
    "barth-church-dogmatics"
  ]
}
```

위와 같이 본문 카드에 관련 책 ID를 넣으면, 화면에서는 두 방향의 연결이 자동으로 생깁니다.

## 2. 화면 동작

`js/book-passage-linker.js`는 다음 기능을 수행합니다.

1. 책 카드에 관련 성경 본문 버튼을 추가합니다.
2. 책 상세 페이지 상단에 관련 성경 본문 버튼을 추가합니다.
3. 본문 카드에 관련 책 버튼을 추가합니다.
4. 본문 버튼을 누르면 본문 탭으로 이동하고 해당 본문명으로 검색합니다.
5. 책 버튼을 누르면 `#book=<book-id>` 형식의 책 상세 페이지로 이동합니다.

## 3. 입력 규칙

- `relatedBooks`에는 반드시 `data/books.json`에 존재하는 책 ID를 사용합니다.
- 본문과 책이 실제로 신학적으로 연결될 때만 추가합니다.
- 특정 책이 본문을 직접 다루지 않더라도, 해당 본문이 그 책의 주제 이해에 중요한 배경일 경우 연결할 수 있습니다.
- 너무 많은 책을 기계적으로 연결하지 말고, 연구와 설교에 실제 도움이 되는 연결을 우선합니다.

## 4. 사용 예시

### 예정론 본문

`로마서 9장`, `로마서 8:29-30`, `에베소서 1:4-5`는 다음 책들과 연결할 수 있습니다.

- `calvin-institutes`
- `berkhof-systematic-theology`
- `bavinck-reformed-dogmatics`
- `barth-church-dogmatics`

### 계시론·자연신학 본문

`시편 19편`, `로마서 1:18-23`, `사도행전 17장`은 다음 책들과 연결할 수 있습니다.

- `calvin-institutes`
- `bavinck-reformed-dogmatics`
- `berkhof-systematic-theology`
- `barth-church-dogmatics`

## 5. 관리 원칙

책-본문 연결은 단순 검색 편의를 넘어, 다음 작업을 돕기 위한 구조입니다.

- 설교 본문에서 관련 교리 문헌으로 이동
- 교리 문헌에서 관련 성경 본문으로 이동
- 개혁파 정통과 신정통주의의 본문 사용 차이 비교
- 논문과 글쓰기에서 본문-교리-문헌 연결 추적
