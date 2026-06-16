# Barth improvement upload pack v4

생성일: 2026-06-16 07:54:18

## 목적

v3의 문제는 소주제 구조는 만들었지만 설명 문장이 여전히 반복적이고 일반적이었다는 점입니다. v4는 바르트 『교회교의학』 항목을 **소주제별 설명 단위**로 다시 보강합니다.

## 포함 파일

```txt
data/barth-subtopic-contexts-v4.json
js/barth-subtopic-context-normalize-v4.js
js/quote-context-enhance-v4.js
docs/index-script-order-snippet-v4.txt
docs/barth-subtopic-context-guide-v4.md
manifest.json
```

## 적용 방법

ZIP을 풀어 저장소 루트에 업로드합니다. 그 다음 `index.html`에서 기존 v1/v2/v3 관련 스크립트가 있다면 제거하고 다음 순서를 사용합니다.

```html
<script src="./js/barth-subtopic-context-normalize-v4.js"></script>
<script src="./js/app.js"></script>
<script src="./js/quote-context-enhance-v4.js"></script>
```

이미 `app.js`가 들어가 있는 위치가 있다면, `barth-subtopic-context-normalize-v4.js`는 그 앞에, `quote-context-enhance-v4.js`는 그 뒤에 둡니다.

## 데이터 규모

- section: 75개
- subtopic: 214개
- 설명 단위: `subtopicContexts[]`

## v4 보완 포인트

- `coreThesis` 추가
- `focusQuestion` 추가
- `argumentRole` 추가
- `misuseWarning` 추가
- `quoteContext` 전면 재작성
- 소주제별 개혁파 비교 설명 보강
- 화면에서 소주제별 설명 카드가 보이도록 렌더러 보강
