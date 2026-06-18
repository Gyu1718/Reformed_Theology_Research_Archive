# Barth CD II/1 작업 로그

## 범위

- 대상: Karl Barth, *Church Dogmatics* II/1, **The Doctrine of God**.
- 한국어 표기: 『교회교의학』 II/1, **하나님 교리 1부**.
- 공개 저장소 원칙: EPUB 원문, OCR 전문, 긴 인용문은 올리지 않고 목차, 위치 정보, 한국어 요약, 비교 축만 관리한다.

## 2026-06-18 시작 작업

1. `work/barth-cd-ii-1` 브랜치를 만들었다.
2. `data/books-barth-structure-map.json`의 II/1 부분을 상세화했다.
   - 제5장: §25–§27, 하나님 지식.
   - 제6장: §28–§31, 하나님의 현실성.
   - 각 §의 소절 제목을 한국어 연구용 문장으로 확장했다.
3. `data/barth-cd-ii-1-research-index.json`를 새로 추가했다.
   - EPUB 내부 위치, CD/KD 시작 페이지, 장/§/소절 구조, 핵심 개념, 비교 축을 따로 관리한다.

## 2026-06-18 문제 해결

1. 2.1권 연구 인덱스가 화면에 반영되지 않는 문제를 해결했다.
   - `js/preload-data.js`가 `data/barth-cd-ii-1-research-index.json`를 로드하도록 연결했다.
   - 연구 인덱스의 `summaryKo`, 소절 구조, 비교 축, CD/KD/EPUB 위치 정보를 바르트 책 화면의 `summary`, `detail`, `keyPoints`, `concepts`, `researchMeta`로 병합한다.
2. 1권 작업 방식과 맞지 않던 스키마 문제를 완화했다.
   - 연구용 `chapters → sections → subsections` 구조는 유지하되, 화면용 `parts → chapters` 구조에 자동 병합되도록 했다.
3. `data/books-barth-structure-map.json`가 한 줄 JSON으로 바뀐 문제를 해결했다.
   - 기존처럼 리뷰와 후속 수정이 가능한 pretty JSON 형식으로 복구했다.
4. II/1 핵심 단락의 특수 해설을 보강했다.
   - §25, §26, §27, §29, §30, §31을 `specialDetails`에 추가했다.

## 다음 작업

- §25–§27: 하나님 지식론의 흐름을 장문 요약으로 확장한다.
- §28: “자유 안에서 사랑하시는 하나님”을 II/1의 핵심 공식으로 별도 해설한다.
- §29–§31: 바르트의 신속성론을 고전적 신론, 개혁파 정통, 바빙크·벌코프와 비교하는 색인을 추가한다.
- 주제 연결 후보: 하나님 지식, 계시, 자연신학 비판, 신론, 신속성, 사랑, 자유, 은혜, 거룩, 자비, 의, 영원성, 영광.
