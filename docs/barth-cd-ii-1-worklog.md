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

## 2026-06-18 소주제별 해설 확장

1. `docs/barth-cd-ii-1-subtopic-explanations.md`를 추가했다.
2. II/1의 소주제별 해설을 다음 형식으로 정리했다.
   - 핵심 논지
   - 해설
   - 개혁파 비교축
   - 연구 질문
3. 포함 범위는 §25–§31 전체다.
   - §25: 하나님 앞의 인간 / 인간 앞의 하나님
   - §26: 하나님의 준비 / 인간의 준비
   - §27: 하나님의 숨겨짐 / 인간 하나님 지식의 진실성
   - §28: 행위 안의 하나님의 존재 / 사랑하시는 분으로서의 하나님의 존재 / 자유 안의 하나님의 존재
   - §29: 하나님의 완전성 전체 해설
   - §30: 은혜와 거룩 / 자비와 의 / 인내와 지혜
   - §31: 통일성과 무소부재 / 불변성과 전능 / 영원성과 영광

## 2026-06-18 주제 색인 연결

1. `data/barth-cd-ii-1-topic-index.json`를 추가했다.
   - 2.1권 전용 주제 색인 원자료다.
   - 공개 저장소용 주제명, 요약, 관련 주제, 비교축, 위치 정보, 개혁파/바르트 입장 비교를 담는다.
2. `js/barth-ii1-topic-index-preload.js`를 추가했다.
   - 사이트 로딩 시 2.1권 주제 색인을 `window.__DATA__.topics`와 `window.__TOPIC_GUIDES__`에 병합한다.
   - 기존 `topics.json`을 직접 크게 수정하지 않고도 화면의 개념 비교에 2.1권 색인을 반영한다.
3. `index.html`에 `barth-ii1-topic-index-preload.js`를 연결했다.
4. 새로 추가한 주요 주제는 다음과 같다.
   - 하나님 지식
   - 하나님의 인식 가능성
   - 하나님의 숨겨짐
   - 행위 안의 하나님의 존재
   - 하나님의 완전성 / 신속성
   - 하나님의 사랑의 완전성
   - 하나님의 자유의 완전성
5. 기존 주제도 보강했다.
   - 계시론
   - 자연신학
   - 신론

## 2026-06-18 §28 별도 해설

1. `docs/barth-cd-ii-1-section-28-love-in-freedom.md`를 추가했다.
   - §28을 II/1 전체 신론의 중심 공식으로 따로 해설한다.
   - 핵심 공식은 “하나님은 사랑 안에서 자유로우시고, 자유 안에서 사랑하신다”이다.
   - §28.1 행위 안의 하나님의 존재, §28.2 사랑하시는 분으로서의 하나님의 존재, §28.3 자유 안의 하나님의 존재를 각각 해설한다.
   - 고전적 개혁파 신론과의 비교, 설교·교육용 요약, 연구 질문을 포함한다.
2. `data/barth-cd-ii-1-featured-guides.json`를 추가했다.
   - §28 별도 해설 문서 경로, 핵심 공식, linkedTopics, 연구 질문을 데이터로 분리했다.
3. `js/barth-ii1-featured-guides-preload.js`를 추가했다.
   - 사이트 로딩 시 §28 항목에 `featuredGuide`를 붙인다.
   - §28의 `detail`, `keyPoints`, `concepts`에도 핵심 공식과 연결 주제를 보강한다.
4. `index.html`에 `barth-ii1-featured-guides-preload.js`를 연결했다.

## 다음 작업

- §29–§31: 바르트의 신속성론을 고전적 신론, 개혁파 정통, 바빙크·벌코프와 비교하는 색인을 더 세밀하게 추가한다.
- 주제 색인과 책 상세페이지 사이의 상호 링크 UI를 보강한다.
- §28 해설을 카드형 요약 또는 강의안 형식으로 재가공한다.
