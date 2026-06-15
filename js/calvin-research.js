const CALVIN_RESEARCH_URL = "data/books/calvin-chapter-research.json";

window.addEventListener("load", async () => {
  const target = document.querySelector("#calvin-research");
  if (!target) return;

  const ref = new URLSearchParams(window.location.search).get("ref");
  if (!ref) return;

  try {
    const response = await fetch(CALVIN_RESEARCH_URL);
    if (!response.ok) throw new Error(`Failed to load ${CALVIN_RESEARCH_URL}`);
    const research = await response.json();
    const detail = research.chapters?.[ref];
    renderResearchDetail(target, ref, detail);
  } catch (error) {
    console.warn("Calvin research detail was not loaded.", error);
  }
});

function renderResearchDetail(target, ref, detail) {
  if (!detail) {
    target.innerHTML = `
      <section class="results">
        <article class="result-card full-width">
          <h2>연구 보강 예정</h2>
          <p class="card-summary">${escapeHtml(ref)} 장은 아직 핵심 질문·핵심 주장·비교 문헌이 보강되지 않았습니다.</p>
        </article>
      </section>
    `;
    return;
  }

  target.innerHTML = `
    <section class="results">
      <article class="result-card full-width">
        <div class="card-meta">Research Layer · ${escapeHtml(ref)}</div>
        <h2>연구 보강</h2>
        <p class="card-summary">업로드 TXT의 장 구조를 바탕으로 만든 공개용 연구 메모입니다. 원문 전문은 포함하지 않습니다.</p>
      </article>
    </section>

    <section class="results">
      ${renderListCard("파일 기반 소제목", detail.sourceSectionHeadings)}
      ${renderListCard("핵심 질문", detail.keyQuestions)}
      ${renderListCard("핵심 주장", detail.keyClaims)}
      ${renderListCard("관련 성경 본문", detail.bibleReferences)}
    </section>

    <section class="results">
      <article class="result-card full-width">
        <h3>비교 문헌</h3>
        ${Array.isArray(detail.compareWith) && detail.compareWith.length ? `
          <div class="chapter-list">
            ${detail.compareWith.map((item) => `
              <section class="chapter-item">
                <div class="card-meta">${escapeHtml(item.bookId)} · ${escapeHtml(item.location)}</div>
                <p>${escapeHtml(item.note)}</p>
              </section>
            `).join("")}
          </div>
        ` : `<p class="card-summary">연결된 비교 문헌이 없습니다.</p>`}
      </article>
    </section>

    <section class="results">
      ${renderListCard("연구 메모", detail.researchNotes, true)}
    </section>
  `;
}

function renderListCard(title, items, fullWidth = false) {
  const safeItems = Array.isArray(items) ? items : [];
  return `
    <article class="result-card ${fullWidth ? "full-width" : ""}">
      <h3>${escapeHtml(title)}</h3>
      ${safeItems.length ? `
        <ul class="detail-list">
          ${safeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      ` : `<p class="card-summary">아직 입력된 항목이 없습니다.</p>`}
    </article>
  `;
}
