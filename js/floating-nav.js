/* Floating quick navigation: top / toc / bottom */
(function(){
  const NAV_ID = "floating-page-nav";
  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
  const SCROLL_MARGIN = 12;

  function getBehavior(){
    return REDUCE_MOTION.matches ? "auto" : "smooth";
  }

  function getStickyOffset(){
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--sticky-offset");
    const parsed = parseInt(raw,10);
    return Number.isFinite(parsed) ? parsed : 96;
  }

  function maxScrollTop(){
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      doc.clientHeight,
      doc.scrollHeight,
      doc.offsetHeight
    ) - window.innerHeight;
  }

  function isVisible(node){
    if(!node) return false;
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  }

  function getTocTarget(){
    const detailToc = Array.from(document.querySelectorAll(".detail-toc")).find(isVisible);
    if(detailToc) return detailToc;
    return document.querySelector(".tabs") || document.querySelector(".controls") || document.querySelector("#view") || document.body;
  }

  function scrollToElement(node){
    if(!node) return;
    const top = Math.max(0, window.scrollY + node.getBoundingClientRect().top - getStickyOffset());
    window.scrollTo({ top, behavior:getBehavior() });
  }

  function createButton(action, icon, text, label){
    const button = document.createElement("button");
    button.type = "button";
    button.className = "floating-page-nav__button";
    button.dataset.floatingAction = action;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `<span class="floating-page-nav__icon" aria-hidden="true">${icon}</span><span class="floating-page-nav__text">${text}</span>`;
    return button;
  }

  function mount(){
    if(document.getElementById(NAV_ID)) return;

    const nav = document.createElement("nav");
    nav.id = NAV_ID;
    nav.className = "floating-page-nav";
    nav.setAttribute("aria-label", "빠른 화면 이동");

    nav.append(
      createButton("top", "↑", "위", "맨 위로 이동"),
      createButton("toc", "≡", "목차", "목차 또는 보기 탭으로 이동"),
      createButton("bottom", "↓", "아래", "맨 아래로 이동")
    );

    nav.addEventListener("click", function(event){
      const button = event.target.closest("button[data-floating-action]");
      if(!button || button.disabled) return;
      const action = button.dataset.floatingAction;

      if(action === "top"){
        window.scrollTo({ top:0, behavior:getBehavior() });
        return;
      }

      if(action === "toc"){
        scrollToElement(getTocTarget());
        return;
      }

      if(action === "bottom"){
        window.scrollTo({ top:maxScrollTop(), behavior:getBehavior() });
      }
    });

    document.body.appendChild(nav);
    updateState();

    let ticking = false;
    const requestUpdate = function(){
      if(ticking) return;
      ticking = true;
      window.requestAnimationFrame(function(){
        updateState();
        ticking = false;
      });
    };

    window.addEventListener("scroll", requestUpdate, { passive:true });
    window.addEventListener("resize", requestUpdate);

    const view = document.querySelector("#view");
    if(view){
      const observer = new MutationObserver(requestUpdate);
      observer.observe(view, { childList:true, subtree:true });
    }
  }

  function updateState(){
    const nav = document.getElementById(NAV_ID);
    if(!nav) return;

    const maxTop = maxScrollTop();
    nav.hidden = maxTop < 160;
    if(nav.hidden) return;

    const topButton = nav.querySelector('[data-floating-action="top"]');
    const bottomButton = nav.querySelector('[data-floating-action="bottom"]');
    const tocButton = nav.querySelector('[data-floating-action="toc"]');

    if(topButton) topButton.disabled = window.scrollY <= SCROLL_MARGIN;
    if(bottomButton) bottomButton.disabled = window.scrollY >= maxTop - SCROLL_MARGIN;
    if(tocButton) tocButton.disabled = !getTocTarget();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", mount, { once:true });
  }else{
    mount();
  }
})();
