/* Reformed ⇄ Neo-Orthodox Theology Archive — data-driven app
   data/*.json 을 직접 읽어 화면에 뿌린다. GitHub Pages 정적 호스팅에 그대로 동작. */

const TRAD = {
  "개혁파 정통": { key: "ref", short: "개혁파" },
  "신정통주의": { key: "neo", short: "신정통주의" }
};
const REF = "개혁파 정통", NEO = "신정통주의";

const DATA = { books: [], authors: [], topics: [], passages: [], notes: [], taxonomy: {} };
let state = { view: "compare", trad: "all", q: "", concept: null };

const el = s => document.querySelector(s);
const view = el("#view");
const tradClass = t => (TRAD[t] ? TRAD[t].key : "");
const tradTag = t => `<span class="trad-tag ${tradClass(t)}">${t}</span>`;
const matchTrad = t => state.trad === "all" || t === state.trad;
const matchQ = h => !state.q || h.toLowerCase().includes(state.q.toLowerCase());
const bookTitle = id => { const b = DATA.books.find(x => x.id === id); return b ? b.title : id; };

/* ---------------- data load ---------------- */
function afterLoad() {
  const both = DATA.topics.find(hasBoth);
  state.concept = (both || DATA.topics[0] || {}).id || null;
  renderCounts();
  render();
}
async function boot() {
  if (window.__DATA__) { Object.assign(DATA, window.__DATA__); afterLoad(); return; }
  view.innerHTML = `<div class="loading">데이터를 불러오는 중…</div>`;
  const files = ["books", "authors", "topics", "passages", "notes", "taxonomy"];
  try {
    const results = await Promise.all(
      files.map(f => fetch(`./data/${f}.json`, { cache: "no-cache" }).then(r => {
        if (!r.ok) throw new Error(`${f}.json (${r.status})`);
        return r.json();
      }))
    );
    files.forEach((f, i) => { DATA[f] = results[i]; });
    afterLoad();
  } catch (e) {
    view.innerHTML = `<div class="empty"><b>데이터를 불러오지 못했습니다.</b><br>
      ${e.message}<br><br>이 사이트는 <code>data/*.json</code>을 fetch로 읽습니다.
      로컬에서 볼 때는 파일을 직접 열지 말고 간단한 서버를 띄우세요:<br>
      <code style="font-family:var(--font-mono)">python3 -m http.server</code> → http://localhost:8000</div>`;
  }
}

const chapterText = b => {
  let s = "";
  if (b.parts) b.parts.forEach(p => { s += p.title + p.summary; (p.chapters || []).forEach(c => s += c.ref + c.title + c.summary + (c.concepts || []).join(" ")); });
  if (b.chapters) b.chapters.forEach(c => s += (c.title || "") + (c.summary || ""));
  return s;
};
const hasRefPos = t => (t.positions || []).some(p => p.tradition === REF);
const hasNeoPos = t => (t.positions || []).some(p => p.tradition === NEO);
const hasBoth = t => hasRefPos(t) && hasNeoPos(t);

/* ---------------- compare (개념 비교) ---------------- */
function renderCompare() {
  const concepts = DATA.topics;
  if (!concepts.length) return emptyState("개념");
  const switcher = concepts.map(c => {
    const dot = hasBoth(c) ? "has-both" : (hasRefPos(c) || hasNeoPos(c)) ? "ref-only" : "none";
    return `<button class="concept-btn ${c.id === state.concept ? "is-active" : ""}" data-concept="${c.id}"><span class="dot ${dot}"></span>${c.name}</button>`;
  }).join("");
  const c = concepts.find(x => x.id === state.concept) || concepts[0];

  const side = trad => {
    let pos = (c.positions || []).filter(p => p.tradition === trad);
    if (state.trad !== "all") pos = pos.filter(p => matchTrad(p.tradition));
    if (state.q) pos = pos.filter(p => matchQ(p.holder + p.claim + c.name));
    if (!pos.length) return `<p class="pole-empty">${state.trad !== "all" || state.q
      ? "조건에 맞는 입장이 없습니다."
      : `아직 입력된 입장이 없습니다.<span class="invite">data/topics.json 의 positions[]에 한 줄 추가하면 채워집니다.</span>`}</p>`;
    return pos.map(p => `<div class="position"><span class="holder">${p.holder}</span><p class="claim">${p.claim}</p><span class="loc">${p.loc || ""}</span></div>`).join("");
  };

  const refs = (c.references || []).map(r =>
    `<div class="ref-item"><b>${bookTitle(r.bookId)}</b> <span class="loc">${r.location || ""}</span><br>${r.note || ""}</div>`
  ).join("");

  view.innerHTML = `
    <div class="concept-switch">${switcher}</div>
    <article class="compare">
      <div class="compare-head">
        <span class="loci-label">LOCUS · 교리</span>
        <h3>${c.name}<span class="lat">${c.latin || ""}</span></h3>
        ${c.summary ? `<p class="topic-sum">${c.summary}</p>` : ""}
        ${c.diverge ? `<p class="diverge"><b>갈라지는 지점</b>${c.diverge}</p>` : ""}
      </div>
      <div class="poles">
        <div class="pole pole-ref"><span class="pole-tag">${REF}</span>${side(REF)}</div>
        <div class="axis" aria-hidden="true"></div>
        <div class="pole pole-neo"><span class="pole-tag">${NEO}</span>${side(NEO)}</div>
      </div>
      ${refs ? `<div class="refs"><p class="refs-label">관련 문헌</p>${refs}</div>` : ""}
    </article>`;

  view.querySelectorAll(".concept-btn").forEach(b => b.onclick = () => { state.concept = b.dataset.concept; render(); });
}

/* ---------------- books ---------------- */
function quotesHTML(arr) {
  if (!arr || !arr.length) return "";
  const items = arr.filter(q => q.text && q.source).map(q =>
    `<blockquote class="chap-quote">${q.text}<cite>— ${q.source}${q.ref ? ` · ${q.ref}` : ""}</cite></blockquote>`).join("");
  return items ? `<div class="quotes">${items}</div>` : "";
}
function chapterHTML(ch) {
  const ref = `<span class="cref">${ch.ref || "·"}</span>`;
  const head = `${ref}<div class="chap-head"><b>${ch.title}</b>${ch.summary ? `<p>${ch.summary}</p>` : ""}</div>`;
  const tags = (ch.concepts && ch.concepts.length) ? `<div class="tags">${ch.concepts.map(x => `<span class="tag">${x}</span>`).join("")}</div>` : "";
  const quotes = quotesHTML(ch.quotes);
  const hasDetail = ch.detail || (ch.keyPoints && ch.keyPoints.length) || quotes;
  if (!hasDetail) return `<div class="chap">${head}</div>${tags ? `<div class="chap-tagrow">${tags}</div>` : ""}`;
  const kp = (ch.keyPoints && ch.keyPoints.length) ? `<ul class="keypoints">${ch.keyPoints.map(k => `<li>${k}</li>`).join("")}</ul>` : "";
  return `<details class="chap-x"><summary class="chap chap-sum">${head}</summary><div class="chap-detail">${ch.detail ? `<p class="chap-body">${ch.detail}</p>` : ""}${kp}${quotes}${tags}</div></details>`;
}
function bookStructure(b) {
  if (b.parts && b.parts.length) {
    const total = b.parts.reduce((n, p) => n + (p.chapters ? p.chapters.length : 0), 0);
    const parts = b.parts.map(p => `
      <div class="part">
        <h4 class="part-h">${p.title}</h4>
        ${p.summary ? `<p class="part-sum">${p.summary}</p>` : ""}
        ${quotesHTML(p.quotes)}
        ${(p.chapters || []).map(chapterHTML).join("")}
      </div>`).join("");
    return `<details class="structure"><summary>전체 구조 — ${b.parts.length}권 ${total}장 펼치기</summary>${parts}</details>`;
  }
  if (b.chapters && b.chapters.length) {
    return `<details class="structure"><summary>장별 상세 ${b.chapters.length}개 펼치기</summary><div class="part">${b.chapters.map(chapterHTML).join("")}</div></details>`;
  }
  return "";
}
function renderBooks() {
  const items = DATA.books.filter(b => matchTrad(b.tradition) && matchQ(b.title + b.author + (b.summary || "") + (b.topics || []).join(" ") + chapterText(b)));
  if (!items.length) return emptyState("책");
  view.innerHTML = `<div class="grid one">` + items.map(b => `
    <article class="card t-${tradClass(b.tradition)}">
      <div class="meta-row">${tradTag(b.tradition)}<span class="cat-tag">${b.category || ""}</span>${b.edition ? `<span class="cat-tag">· ${b.edition}</span>` : ""}</div>
      <h3>${b.title}</h3>
      <p class="by">${b.author}${b.originalAuthor ? " · " + b.originalAuthor : ""}</p>
      <p class="sum">${b.summary || ""}</p>
      <div class="tags">${(b.topics || []).map(t => `<span class="tag">${t}</span>`).join("")}</div>
      ${bookStructure(b)}
    </article>`).join("") + `</div>`;
}

/* ---------------- authors ---------------- */
function renderAuthors() {
  const items = DATA.authors.filter(a => matchTrad(a.tradition) && matchQ((a.koreanName || "") + a.name + (a.summary || "") + (a.keyTopics || []).join(" ")));
  if (!items.length) return emptyState("학자");
  view.innerHTML = `<div class="grid">` + items.map(a => `
    <article class="card t-${tradClass(a.tradition)}">
      <div class="meta-row">${tradTag(a.tradition)}<span class="cat-tag">${a.period || ""}</span></div>
      <h3>${a.koreanName || a.name}</h3>
      <p class="by">${a.name}</p>
      <p class="sum">${a.summary || ""}</p>
      <div class="tags">${(a.keyTopics || []).map(t => `<span class="tag">${t}</span>`).join("")}${(a.majorWorks || []).map(w => `<span class="tag">📖 ${w}</span>`).join("")}</div>
    </article>`).join("") + `</div>`;
}

/* ---------------- passages ---------------- */
function renderPassages() {
  const items = DATA.passages.filter(p => matchQ(p.reference + (p.summary || "") + (p.topics || []).join(" ")));
  if (!items.length) return emptyState("본문");
  view.innerHTML = `<div class="grid">` + items.map(p => `
    <article class="card passage">
      <div class="meta-row"><span class="cat-tag">${p.testament || ""} · ${p.book || ""}</span></div>
      <h3>${p.reference}</h3>
      <p class="sum">${p.summary || ""}</p>
      <div class="tags">${(p.topics || []).map(t => `<span class="tag">${t}</span>`).join("")}</div>
    </article>`).join("") + `</div>`;
}

/* ---------------- notes ---------------- */
function renderNotes() {
  const items = DATA.notes.filter(n => matchQ(n.title + (n.body || "") + (n.tags || []).join(" ")));
  if (!items.length) return emptyState("메모");
  view.innerHTML = `<div class="grid">` + items.map(n => `
    <article class="note">
      <span class="ntype">${n.type || "note"}</span>${n.status ? `<span class="status ${n.status === "active" ? "active" : ""}">${n.status}</span>` : ""}
      <h3>${n.title}</h3>
      <p class="body">${n.body || ""}</p>
      <div class="tags" style="margin-top:12px">${(n.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}</div>
    </article>`).join("") + `</div>`;
}

function emptyState(label) {
  view.innerHTML = `<div class="grid"><div class="empty"><b>${label}</b>에서 조건에 맞는 항목을 찾지 못했습니다.<br>검색어를 지우거나 전통 필터를 '전체'로 바꿔 보세요.</div></div>`;
}

const VIEWS = { compare: renderCompare, books: renderBooks, authors: renderAuthors, passages: renderPassages, notes: renderNotes };
function render() { (VIEWS[state.view] || renderCompare)(); }

function renderCounts() {
  const ch = DATA.books.reduce((n, b) => n + (b.parts ? b.parts.reduce((m, p) => m + (p.chapters ? p.chapters.length : 0), 0) : (b.chapters ? b.chapters.length : 0)), 0);
  const pos = DATA.topics.reduce((n, t) => n + (t.positions ? t.positions.length : 0), 0);
  el("#countbar").innerHTML =
    `<b>${DATA.books.length}</b> 책 <span class="sep">·</span><b>${ch}</b> 장 색인 <span class="sep">·</span>` +
    `<b>${DATA.topics.length}</b> 개념 <span class="sep">·</span><b>${pos}</b> 입장 <span class="sep">·</span>` +
    `<b>${DATA.passages.length}</b> 본문 <span class="sep">·</span><b>${DATA.notes.length}</b> 메모`;
}

/* ---------------- wiring ---------------- */
document.querySelectorAll(".tab").forEach(t => t.onclick = () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("is-active"));
  t.classList.add("is-active"); state.view = t.dataset.view; render();
});
document.querySelectorAll(".chip").forEach(c => c.onclick = () => {
  document.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", "false"));
  c.setAttribute("aria-pressed", "true"); state.trad = c.dataset.trad; render();
});
el("#q").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });

boot();
