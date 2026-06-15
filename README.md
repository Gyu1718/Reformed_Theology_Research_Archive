# Reformed Theology Research Archive

개혁신학 연구 자료를 책, 학자, 주제, 성경 본문, 연구 메모 단위로 연결해 정리하는 정적 HTML 아카이브입니다.

이 저장소의 목표는 저작권 있는 원문 전체를 공개하는 것이 아니라, 연구와 인용을 돕기 위한 **서지정보, 목차, 요약, 주제 색인, 성경 본문 색인, 짧은 인용 위치, 연구 메모**를 체계적으로 관리하는 것입니다.

## 핵심 기능

- 책별 보기: 주요 개혁신학 문헌의 목차와 장별 요약
- 학자별 보기: 칼빈, 바빙크, 벌코프 등 학자 중심 색인
- 주제별 보기: 계시론, 신론, 예정론, 언약신학, 교회론 등 교리 주제 정리
- 성경 본문별 보기: 특정 본문이 어느 책과 주제에서 다루어지는지 추적
- 통합 검색: 책, 학자, 주제, 본문, 메모를 한 번에 검색
- 연구 메모: 설교, 논문, 글쓰기용 아이디어와 인용 위치 관리

## 공개 저장소 원칙

이 저장소는 public repository입니다. 따라서 다음 자료는 올리지 않습니다.

- 저작권 있는 PDF 원문
- EPUB 원문
- OCR TXT 전문
- 번역서 본문 전체
- 긴 인용문

원문 파일은 개인 로컬 저장소 또는 private repository에서 별도로 관리합니다.

## 폴더 구조

```txt
.
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ app.js
│  └─ search.js
├─ data/
│  ├─ books.json
│  ├─ authors.json
│  ├─ topics.json
│  ├─ passages.json
│  └─ notes.json
└─ docs/
   ├─ project-plan.md
   ├─ data-schema.md
   └─ copyright-policy.md
```

## 업데이트 방식

1. 새 책을 추가할 때 `data/books.json`에 기본 정보를 입력합니다.
2. 학자 정보가 필요하면 `data/authors.json`에 추가합니다.
3. 주제 연결은 `data/topics.json`에 추가합니다.
4. 성경 본문 연결은 `data/passages.json`에 추가합니다.
5. 연구 메모는 `data/notes.json`에 추가합니다.

## 1차 개발 범위

현재 버전은 정적 HTML, CSS, JavaScript만 사용합니다. 별도 빌드 도구 없이 GitHub Pages에서 바로 배포할 수 있도록 구성합니다.
