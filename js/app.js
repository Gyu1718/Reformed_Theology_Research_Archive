const DATA_PATHS = {
  books: "data/books.json",
  authors: "data/authors.json",
  topics: "data/topics.json",
  passages: "data/passages.json",
  notes: "data/notes.json",
};

const state = {
  view: "books",
  query: "",
  data: {
    books: [],
    authors: [],
    topics: [],
    passages: [],
    notes: [],
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadAllData();
  bindEvents();
  updateMetrics();
  render();
});

async function loadAllData() {
  const entries = await Promise.all(
    Object.entries(DATA_PATHS).map(async ([key, path]) => {
      try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`${path} ${response.status}`);
        const json = await response.json();
        return [key, Array.isArray(json) ? json : []];
      } catch (error) {
        console.warn(`Failed to load ${path}`, error);
        return [key, []];
      }
    })
  );

  for (const [key, value] of entries) {
    state.data[key] = value;
  }
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("is-active"));
      button.classList.add("is-active");
      render();
    });
  });

  const searchInput = document.querySelector("#global-search");
  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });
}

function updateMetrics() {
  document.querySelector("#book-count").textContent = state.data.books.length;
  document.querySelector("#author-count").textContent = state.data.authors.length;
  document.querySelector("#topic-count").textContent = state.data.topics.length;
  document.querySelector("#passage-count").textContent = state.data.passages.length;
}

function render() {
  const results = document.querySelector("#results");
  const items = filterItems(state.data[state.view], state.query);

  if (!items.length) {
    results.innerHTML = `<div class="empty-state">검색 결과가 없습니다. 데이터 JSON에 책, 학자, 주제, 본문, 메모를 추가해 주세요.</div>`;
    return;
  }

  const renderer = {
    books: renderBook,
    authors: renderAuthor,
    topics: renderTopic,
    passages: renderPassage,
    notes: renderNote,
  }[state.view];

  results.innerHTML = items.map(renderer).join("");
}

function renderBook(book) {
  const chapters = Array.isArray(book.chapters)
    ? `<ul class="detail-list">${book.chapters.slice(0, 5).map((chapter) => `<li>${escapeHtml(chapter.title)} — ${escapeHtml(chapter.summary)}</li>`).join("")}</ul>`
    : "";

  return `
    <article class="result-card">
      <div class="card-meta">${escapeHtml(book.category)} · ${escapeHtml(book.tradition)} · ${escapeHtml(book.language)}</div>
      <h3>${escapeHtml(book.title)}</h3>
      <p class="card-summary">${escapeHtml(book.author)} · ${escapeHtml(book.originalAuthor || "")}</p>
      <p>${escapeHtml(book.summary)}</p>
      ${renderTags(book.topics)}
      ${chapters}
    </article>
  `;
}

function renderAuthor(author) {
  return `
    <article class="result-card">
      <div class="card-meta">${escapeHtml(author.period)} · ${escapeHtml(author.tradition)}</div>
      <h3>${escapeHtml(author.name)}</h3>
      <p class="card-summary">${escapeHtml(author.koreanName || "")}</p>
      <p>${escapeHtml(author.summary)}</p>
      ${renderTags(author.keyTopics)}
    </article>
  `;
}

function renderTopic(topic) {
  const refs = Array.isArray(topic.references)
    ? `<ul class="detail-list">${topic.references.map((ref) => `<li>${escapeHtml(ref.bookId)} · ${escapeHtml(ref.location)} — ${escapeHtml(ref.note)}</li>`).join("")}</ul>`
    : "";

  return `
    <article class="result-card">
      <div class="card-meta">${escapeHtml(topic.category)}</div>
      <h3>${escapeHtml(topic.name)}</h3>
      <p>${escapeHtml(topic.summary)}</p>
      ${renderTags(topic.relatedTopics)}
      ${refs}
    </article>
  `;
}

function renderPassage(passage) {
  return `
    <article class="result-card">
      <div class="card-meta">${escapeHtml(passage.testament)} · ${escapeHtml(passage.book)}</div>
      <h3>${escapeHtml(passage.reference)}</h3>
      <p>${escapeHtml(passage.summary)}</p>
      ${renderTags(passage.topics)}
    </article>
  `;
}

function renderNote(note) {
  return `
    <article class="result-card full-width">
      <div class="card-meta">${escapeHtml(note.type)} · ${escapeHtml(note.status)} · ${escapeHtml(note.createdAt)}</div>
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.body)}</p>
      ${renderTags(note.tags)}
    </article>
  `;
}
