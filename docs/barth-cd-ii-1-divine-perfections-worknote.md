# Barth CD II/1 §29–§31 신속성론 비교 작업 노트

## 작업 범위

- 대상: CD II/1 §29–§31
- 주제: 하나님의 완전성, 하나님의 사랑의 완전성, 하나님의 자유의 완전성
- 비교 대상: 고전적 개혁파 신론, 바빙크, 벌코프
- 공개 저장소 원칙: 원문 전문, OCR 전문, 긴 인용문은 포함하지 않고 한국어 요약, 비교축, 연구 질문만 관리한다.

## 추가 파일

1. `docs/barth-cd-ii-1-sections-29-31-divine-perfections-comparison.md`
   - §29–§31을 고전적 신속성론과 비교하는 장문 해설 문서다.
   - 바르트의 사랑과 자유 배열이 고전적 속성론을 폐기하는지, 계시론적으로 재배열하는지 묻는다.
   - 은혜와 거룩, 자비와 의, 인내와 지혜, 통일성과 무소부재, 불변성과 전능, 영원성과 영광을 비교축으로 정리한다.

2. `data/barth-cd-ii-1-divine-perfections-comparison.json`
   - §29–§31 비교 프레임을 데이터로 분리했다.
   - 각 단락별 `classicReformed`, `barth`, `pairs`, `researchQuestions`, `linkedTopics`를 포함한다.

3. `js/barth-ii1-featured-guides-preload.js`
   - 기존 §28 featured guide preloader를 확장했다.
   - 사이트 로딩 시 §29, §30, §31 항목에 `divinePerfectionsComparison`을 붙인다.
   - 각 항목의 `detail`, `keyPoints`, `concepts`에도 비교축과 linkedTopics를 자동 병합한다.

## 해석 프레임

§29–§31은 §28의 핵심 공식, 곧 “하나님은 사랑 안에서 자유로우시고, 자유 안에서 사랑하신다”를 신속성론으로 펼친다.

- §29는 하나님의 완전성 자체를 다룬다.
- §30은 사랑의 완전성을 은혜와 거룩, 자비와 의, 인내와 지혜로 전개한다.
- §31은 자유의 완전성을 통일성과 무소부재, 불변성과 전능, 영원성과 영광으로 전개한다.

## 핵심 비교 질문

바르트는 고전적 개혁파 신속성론을 폐기하는가, 아니면 계시론적으로 재배열하는가?

## 다음 정리 후보

- 주제 색인과 책 상세페이지 사이의 상호 링크 UI 보강
- §28 해설을 카드형 요약 또는 강의안 형식으로 재가공
- `js/barth-ii1-divine-perfections-preload.js`는 현재 직접 로드되지 않으므로 후속 정리에서 제거하거나 명시적으로 연결할 수 있다.
