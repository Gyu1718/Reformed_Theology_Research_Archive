const CALVIN_DATA_URL = "data/books/calvin-institutes.json";
const CALVIN_SOURCE_FILES = {
  1: { part: "상", file: "기독교 강요(상) (존 칼빈).txt", contains: "제1권·제2권" },
  2: { part: "상", file: "기독교 강요(상) (존 칼빈).txt", contains: "제1권·제2권" },
  3: { part: "중", file: "기독교 강요(중) (존 칼빈).txt", contains: "제3권" },
  4: { part: "하", file: "기독교 강요 (하) (존 칼빈).txt", contains: "제4권" },
};

const CALVIN_TOPIC_SLUGS = {
  "신학서론": "prolegomena",
  "성경론": "scripture",
  "삼위일체": "trinity",
  "섭리": "providence",
  "원죄와 인간론": "anthropology-sin",
  "율법과 복음": "law-gospel",
  "기독론": "christology",
  "그리스도와의 연합": "union-with-christ",
  "칭의": "justification",
  "그리스도인의 삶": "christian-life",
  "예정론": "predestination",
  "교회론": "ecclesiology",
  "성례론": "sacraments",
  "정치신학": "political-theology",
};

const calvinState = {
  data: null,
  query: "",
};

document.addEventListener("DOMContentLoaded", async () => {
  calvinState.data = await loadCalvinData();
  bindCalvinSearch();
  renderCalvinPage();
});

async function loadCalvinData() {
  const response = await fetch(CALVIN_DATA_URL);
  if (!response.ok) throw new Error(`Failed to load ${CALVIN_DATA_URL}`);
  return response.json();
}

function bindCalvinSearch() {
  const input = document.querySelector("#calvin-search");
  if (!input) return;
  input.addEventListener("input", (event) => {
    calvinState.query = event.target.value.trim().toLowerCase();
    renderCalvinPage();
  });
}

function renderCalvinPage() {
  const page = document.body.dataset.calvinPage || "overview";
  if (page === "book") return renderCalvinBookPage();
  if (page === "chapter") return renderCalvinChapterPage();
  if (page === "topic") return renderCalvinTopicPage();
  return renderCalvinOverviewPage();
}

function getParams() {
  return new URLSearchParams(window.location.search);
}

function flattenChapters() {
  return calvinState.data.books.flatMap((book, index) => {
    const bookNumber = index + 1;
    const source = sourceInfo(bookNumber);
    return book.chapters.map((chapter) => ({
      ...chapter,
      bookNumber,
      bookTitle: book.title,
      bookRange: book.range,
      sourcePart: chapter.sourcePart || book.sourcePart || source.part,
      sourceFile: chapter.sourceFile || book.sourceFile || source.file,
      sourceTitle: chapter.sourceTitle || chapter.title,
      sourceSubtitle: chapter.sourceSubtitle || "",
    }));
  });
}

function sourceInfo(bookNumber) {
  return CALVIN_SOURCE_FILES[Number(bookNumber)] || { part: "확인 필요", file: "확인 필요", contains: "확인 필요" };
}

function topicSlug(topic) {
  return CALVIN_TOPIC_SLUGS[topic] || String(topic).toLowerCase().replace(/\s+/g, "-");
}

function matchesQuery(item) {
  if (!calvinState.query) return true;
  return JSON.stringify(item).toLowerCase().includes(calvinState.query);
}

function renderCalvinOverviewPage() {
  const root = document.querySelector("#calvin-root");
  const data = calvinState.data;
  const books = data.books.filter(matchesQuery);
  const topics = (data.strategicTopics || []).filter(matchesQuery);

  root.innerHTML = `
    <section class="results">
      <article class="result-card full-width">
        <div class="card-meta">${escapeHtml(data.category)} · ${escapeHtml(data.status)}</div>
        <h2>${escapeHtml(data.title)}</h2>
        <p class="card-summary">${escapeHtml(data.originalTitle)} · ${escapeHtml(data.originalAuthor)}</p>
        <p>${escapeHtml(data.summary)}</p>
        <p class="research-use"><strong>연구 활용:</strong> ${escapeHtml(data.researchUse)}</p>
        <p class="quote-pointer"><strong>공개 원칙:</strong> ${escapeHtml(data.publicNote)}</p>
      </article>
    </section>

    <section class="results">
      <article class="result-card full-width">
        <h2>TXT 분권 구조</h2>
        <div class="chapter-list">
          ${Object.values({
            upper: { part: "상", file: "기독교 강요(상) (존 칼빈).txt", contains: "제1권·제2권" },
            middle: { part: "중", file: "기독교 강요(중) (존 칼빈).txt", contains: "제3권" },
            lower: { part: "하", file: "기독교 강요 (하) (존 칼빈).txt", contains: "제4권" },
          }).map((item) => `
            <section class="chapter-item">
              <div class="card-meta">${escapeHtml(item.part)}권 TXT · ${escapeHtml(item.contains)}</div>
              <h4>${escapeHtml(item.file)}</h4>
              <p>원문 전문은 공개 저장소에 올리지 않고, 이 파일에서 확인한 권·장 위치와 공개용 연구 색인만 사용합니다.</p>
            </section>
          `).join("")}
        </div>
      </article>
    </section>

    <section class="results">
      ${books.map((book, index) => renderBookCard(book, index + 1)).join("")}
    </section>

    <section class="results">
      <article class="result-card full-width">
        <h2>전략 주제 색인</h2>
        <div class="chapter-list">
          ${topics.map(renderTopicCard).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderBookCard(book, bookNumber) {
  const source = sourceInfo(bookNumber);
  return `
    <article class="result-card">
      <div class="card-meta">${escapeHtml(book.range)} · ${escapeHtml(source.part)}권 TXT</div>
      <h3>${escapeHtml(book.title)}</h3>
      <p class="card-summary">원천 파일: ${escapeHtml(source.file)}</p>
      <p>${escapeHtml(book.summary)}</p>
      ${renderTags(book.majorTopics)}
      <div class="card-actions">
        <a href="calvin-book.html?book=${bookNumber}">제${bookNumber}권 보기</a>
      </div>
    </article>
  `;
}

function renderTopicCard(topic) {
  const slug = topic.slug || topicSlug(topic.topic);
  return `
    <section class="chapter-item">
      <div class="card-meta">${escapeHtml((topic.locations || []).join(" · "))}</div>
      <h4>${escapeHtml(topic.topic)}</h4>
      <p>${escapeHtml(topic.note)}</p>
      <div class="card-actions">
        <a href="calvin-topic.html?topic=${encodeURIComponent(slug)}">주제 보기</a>
      </div>
    </section>
  `;
}

function renderCalvinBookPage() {
  const root = document.querySelector("#calvin-root");
  const bookNumber = Number(getParams().get("book") || 1);
  const book = calvinState.data.books[bookNumber - 1];
  const source = sourceInfo(bookNumber);

  if (!book) {
    root.innerHTML = `<div class="empty-state">해당 권을 찾을 수 없습니다.</div>`;
    return;
  }

  const chapters = book.chapters
    .map((chapter) => ({ ...chapter, bookNumber, sourcePart: source.part, sourceFile: source.file }))
    .filter(matchesQuery);

  root.innerHTML = `
    <section class="results">
      <article class="result-card full-width">
        <div class="card-meta">${escapeHtml(book.range)} · ${escapeHtml(source.part)}권 TXT</div>
        <h2>${escapeHtml(book.title)}</h2>
        <p class="card-summary">원천 파일: ${escapeHtml(source.file)}</p>
        <p>${escapeHtml(book.summary)}</p>
        <p class="quote-pointer"><strong>원문 처리:</strong> ${escapeHtml(book.sourceHandling || "원문 전문은 공개하지 않고 위치와 요약만 표시합니다.")}</p>
        ${renderTags(book.majorTopics)}
      </article>
    </section>

    <section class="results">
      ${chapters.map((chapter) => renderChapterCard(chapter, bookNumber)).join("") || `<div class="empty-state">검색 결과가 없습니다.</div>`}
    </section>
  `;
}

function renderChapterCard(chapter, bookNumber) {
  const source = sourceInfo(bookNumber || chapter.bookNumber);
  return `
    <article class="result-card">
      <div class="card-meta">${escapeHtml(chapter.ref)} · ${escapeHtml(chapter.priority || "")}</div>
      <h3>${escapeHtml(chapter.sourceTitle || chapter.title)}</h3>
      ${chapter.sourceSubtitle ? `<p class="card-summary">${escapeHtml(chapter.sourceSubtitle)}</p>` : ""}
      <p>${escapeHtml(chapter.summary)}</p>
      <p class="quote-pointer"><strong>TXT:</strong> ${escapeHtml(chapter.sourceFile || source.file)}</p>
      ${renderTags(chapter.topics)}
      <div class="card-actions">
        <a href="calvin-chapter.html?ref=${encodeURIComponent(chapter.ref)}">상세 보기</a>
      </div>
    </article>
  `;
}

function renderCalvinChapterPage() {
  const root = document.querySelector("#calvin-root");
  const ref = getParams().get("ref");
  const chapter = flattenChapters().find((item) => item.ref === ref);

  if (!chapter) {
    root.innerHTML = `<div class="empty-state">해당 장을 찾을 수 없습니다.</div>`;
    return;
  }

  const relatedTopics = (calvinState.data.strategicTopics || []).filter((topic) =>
    (topic.locations || []).some((location) => chapter.ref.startsWith(location.split("-")[0]) || location.includes(chapter.ref)) ||
    (chapter.topics || []).includes(topic.topic)
  );

  root.innerHTML = `
    <section class="results">
      <article class="result-card full-width">
        <div class="card-meta">${escapeHtml(chapter.bookTitle)} · ${escapeHtml(chapter.ref)} · ${escapeHtml(chapter.sourcePart)}권 TXT</div>
        <h2>${escapeHtml(chapter.sourceTitle || chapter.title)}</h2>
        ${chapter.sourceSubtitle ? `<p class="card-summary">${escapeHtml(chapter.sourceSubtitle)}</p>` : ""}
        <p>${escapeHtml(chapter.summary)}</p>
        <p class="research-use"><strong>원천 파일:</strong> ${escapeHtml(chapter.sourceFile)}</p>
        ${renderTags(chapter.topics)}
      </article>
    </section>

    <section class="results">
      <article class="result-card full-width">
        <h2>파일 기반 소제목</h2>
        ${Array.isArray(chapter.sourceSectionHeadings) && chapter.sourceSectionHeadings.length ? `
          <p class="card-summary">TXT에서 확인한 소제목 일부입니다. 원문 전문은 표시하지 않습니다.</p>
          <ul class="detail-list">
            ${chapter.sourceSectionHeadings.map((heading) => `<li>${escapeHtml(heading)}</li>`).join("")}
          </ul>
        ` : `<p class="card-summary">아직 이 장의 소제목 추출 정보가 연결되지 않았습니다.</p>`}
      </article>
    </section>

    <section class="results">
      <article class="result-card">
        <h3>같은 권에서 보기</h3>
        <p>${escapeHtml(chapter.bookRange)}</p>
        <div class="card-actions">
          <a href="calvin-book.html?book=${chapter.bookNumber}">제${chapter.bookNumber}권으로 이동</a>
        </div>
      </article>
      <article class="result-card">
        <h3>연결 주제</h3>
        ${renderTags(chapter.topics)}
      </article>
    </section>

    ${relatedTopics.length ? `
      <section class="results">
        <article class="result-card full-width">
          <h2>관련 전략 주제</h2>
          <div class="chapter-list">
            ${relatedTopics.map(renderTopicCard).join("")}
          </div>
        </article>
      </section>
    ` : ""}
  `;
}

function renderCalvinTopicPage() {
  const root = document.querySelector("#calvin-root");
  const topicParam = decodeURIComponent(getParams().get("topic") || "");
  const strategicTopic = (calvinState.data.strategicTopics || []).find((topic) =>
    topic.slug === topicParam || topicSlug(topic.topic) === topicParam || topic.topic === topicParam
  );
  const topicName = strategicTopic ? strategicTopic.topic : topicParam;
  const chapters = flattenChapters().filter((chapter) =>
    (chapter.topics || []).includes(topicName) ||
    (strategicTopic && JSON.stringify(chapter).includes(topicName)) ||
    (strategicTopic && (strategicTopic.locations || []).some((location) => locationRangeContains(location, chapter.ref)))
  ).filter(matchesQuery);

  root.innerHTML = `
    <section class="results">
      <article class="result-card full-width">
        <div class="card-meta">전략 주제</div>
        <h2>${escapeHtml(topicName || "주제")}</h2>
        <p>${escapeHtml(strategicTopic ? strategicTopic.note : "이 주제와 연결된 장을 표시합니다.")}</p>
        ${strategicTopic ? renderTags(strategicTopic.locations) : ""}
      </article>
    </section>

    <section class="results">
      ${chapters.map((chapter) => renderChapterCard(chapter, chapter.bookNumber)).join("") || `<div class="empty-state">연결된 장을 찾지 못했습니다.</div>`}
    </section>
  `;
}

function locationRangeContains(location, ref) {
  if (!location || !ref) return false;
  if (location === ref) return true;
  if (!location.includes("-")) return location.includes(ref);

  const [start, end] = location.split("-").map((value) => value.trim());
  const parsedRef = parseRef(ref);
  const parsedStart = parseRef(start);
  const parsedEnd = parseRef(end.includes(".") ? end : `${parsedStart.roman}.${end.replace(/^[IVX]+\./, "")}`);
  if (!parsedRef || !parsedStart || !parsedEnd) return false;
  if (parsedRef.roman !== parsedStart.roman || parsedRef.roman !== parsedEnd.roman) return false;
  return parsedRef.num >= parsedStart.num && parsedRef.num <= parsedEnd.num;
}

function parseRef(ref) {
  const match = String(ref).match(/^([IVX]+)\.(\d+)/);
  if (!match) return null;
  return { roman: match[1], num: Number(match[2]) };
}
