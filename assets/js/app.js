/**
 * app.js
 * Chargement et rendu dynamique de la landing page
 * Lecture de settings.json via fetch, injection du DOM
 */

const SETTINGS_PATH = "assets/data/settings.json";

document.addEventListener("DOMContentLoaded", () => {
  loadSettings()
    .then(config => {
      applySettings(config);
      /* initBurger(); */
    });
});

/**
 * Charge le fichier settings.json
 * @returns {Promise<Object>}
 */
async function loadSettings() {
  try {
    const resp = await fetch(SETTINGS_PATH);
    if (!resp.ok) throw new Error("Impossible de charger settings.json");
    return await resp.json();
  } catch (err) {
    console.error("Impossible de charger settings.json :", err);
    return {}; // fallback minimal
  }
}

/**
 * Applique toute la configuration à la page
 * @param {Object} cfg
 */
function applySettings(cfg) {
  if (cfg.header?.visible) renderHeader(cfg.header);
  if (cfg.body?.visible)   renderBody(cfg.body);
  if (cfg.footer?.visible) renderFooter(cfg.footer);
}

/* ========= RENDER HEADER ========= */
function renderHeader(h) {
  const el = document.getElementById("main-header");
  el.style.background = bgCSS(h.bgType, h.bgValue);
  el.style.height     = h.height + "px";

  const logoDiv = document.createElement("div");
  logoDiv.className = "logo";

  if (h.logo) {
    logoDiv.innerHTML = `
      <img src="${h.logo}" alt="logo" style="height:44px">
      <span class="site-name" style="
        font-family:${h.siteName.font};
        font-size:${h.siteName.size}px;
        color:${h.siteName.color};
      ">${h.siteName.text}</span>
    `;
  }
  el.innerHTML = "";
  el.appendChild(logoDiv);

  // Burger
  el.insertAdjacentHTML("beforeend", `
    <input type="checkbox" id="burger-toggle">
    <label for="burger-toggle" class="burger">
      <span></span><span></span><span></span>
    </label>
  `);

  // Menu
  if (h.menu.visible) {
    const nav = document.createElement("nav");
    nav.className = "menu";
    h.menu.items.forEach(item => {
      nav.innerHTML += `
        <a href="${item.link}"${item.active ? ' class="active"' : ''} style="
          color:${h.menu.style.color};
          font-family:${h.menu.style.font};
          font-size:${h.menu.style.size}px;
          border-radius:${h.menu.style.borderRadius}px;
          background:${h.menu.style.background};
        ">${item.label}</a>
      `;
    });
    el.appendChild(nav);
  }

  renderDynamicBlocks(h.dynamicBlocks, el);
}

/* ========= RENDER BODY ========= */
function renderBody(b) {
  const el = document.getElementById("main-content");
  el.style.background = bgCSS(b.bgType, b.bgValue);
  el.style.minHeight  = b.height + "px";
  el.innerHTML = "";

  const sections = b.sections
    .filter(s => s.visible && s.enabled)
    .sort((a, c) => a.order - c.order);

  sections.forEach(sec => {
    switch (sec.key) {
      case "carousel":      renderCarousel(sec.data, el); break;
      case "welcomeBanner": renderWelcome(sec.data, el); break;
      case "dynamicBlocks": renderDynamicBlocks(sec.data, el); break;
    }
  });
}

/* ========= RENDER CAROUSEL ========= */
function renderCarousel(cfg, container) {
  const wrapper = document.createElement("div");
  wrapper.className = "carousel";

  // Flèches
  const prev = document.createElement("button");
  prev.className = "prev"; prev.innerText = "❮";
  const next = document.createElement("button");
  next.className = "next"; next.innerText = "❯";

  // Conteneur de slides
  const slidesEl = document.createElement("div");
  slidesEl.className = "carousel-content";
  slidesEl.style.maxWidth     = cfg.style.width + "px";
  slidesEl.style.height       = cfg.style.height + "px";
  slidesEl.style.borderRadius = cfg.style.borderRadius + "px";
  slidesEl.style.boxShadow    = cfg.style.boxShadow;
  if (cfg.style.bgType && cfg.style.bgValue) {
    slidesEl.style.background = bgCSS(cfg.style.bgType, cfg.style.bgValue);
  }

  // Création des slides
  cfg.slides.forEach((s, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.display = i === 0 ? "flex" : "none";
    slide.innerHTML = `
      <img src="${s.img}" class="carousel-img" alt="">
      <div class="carousel-text">
        <h2 style="
          font-family:${s.title.font};
          font-size:${s.title.size}px;
          color:${s.title.color};
        ">${s.title.text}</h2>
        <p style="
          font-family:${s.desc.font};
          font-size:${s.desc.size}px;
          color:${s.desc.color};
        ">${s.desc.text}</p>
        <a href="${s.button.link}" class="cta-btn" style="
          background:${bgCSS(s.button.style.bgType, s.button.style.bgValue)};
          font-family:${s.button.style.font};
          font-size:${s.button.style.size}px;
          color:${s.button.style.color};
          border-radius:${s.button.style.borderRadius}px;
          padding:${s.button.style.padding[0]}px ${s.button.style.padding[1]}px;
        ">${s.button.label}</a>
      </div>
    `;
    slidesEl.appendChild(slide);
  });

  // Assemblage
  wrapper.appendChild(prev);
  wrapper.appendChild(slidesEl);
  wrapper.appendChild(next);
  container.appendChild(wrapper);

  // Autoplay & navigation
  let idx = 0;
  function showSlide(n) {
    const slides = slidesEl.children;
    slides[idx].style.display = "none";
    idx = (n + slides.length) % slides.length;
    slides[idx].style.display = "flex";
  }
  let autoplay = setInterval(() => showSlide(idx + 1), cfg.speed);

  prev.onclick = () => showSlide(idx - 1);
  next.onclick = () => showSlide(idx + 1);

  if (cfg.pauseOnHover) {
    wrapper.onmouseenter = () => clearInterval(autoplay);
    wrapper.onmouseleave = () => {
      autoplay = setInterval(() => showSlide(idx + 1), cfg.speed);
    };
  }
}

/* ========= RENDER WELCOME ========= */
function renderWelcome(cfg, container) {
  const sec = document.createElement("section");
  sec.className = "welcome-banner";
  sec.innerHTML = cfg.html;
  const s = cfg.style;
  sec.style.background   = bgCSS(s.bgType, s.bgValue);
  sec.style.color        = s.color;
  sec.style.fontFamily   = s.font;
  sec.style.fontSize     = s.size + "px";
  sec.style.borderRadius = s.borderRadius + "px";
  container.appendChild(sec);
}

/* ========= RENDER DYNAMIC BLOCKS ========= */
function renderDynamicBlocks(cfg, container) {
  if (!cfg?.visible || !cfg?.items?.length) return;
  const wrap = document.createElement("section");
  wrap.className = container.id === "main-content" ? "dynamic-blocks" : "";
  cfg.items
    .filter(b => b.visible)
    .sort((a, b) => a.layout.order - b.layout.order)
    .forEach(b => {
      if (!b?.style) return;
      const el = document.createElement("div");
      el.className = container.id === "main-content" ? "dynamic-block" : "";
      el.innerHTML = b.html;
      const st = b.style;
      el.style.background   = bgCSS(st.bgType, st.bgValue || "#ffffff");
      el.style.color        = st.color;
      el.style.fontFamily   = st.font;
      el.style.fontSize     = st.size + "px";
      el.style.borderRadius = st.borderRadius + "px";

      const mArr = b.layout.margin || [0,0,0,0];
      const pArr = b.layout.padding || [0];
      el.style.margin  = `${mArr[0]}px ${mArr[1]}px ${mArr[2]}px ${mArr[3]}px`;
      el.style.padding = pArr.length === 1
        ? `${pArr[0]}px`
        : `${pArr[0]}px ${pArr[1]}px ${pArr[2]}px ${pArr[3]}px`;

      el.style.position = b.layout.position.type;
      if (b.layout.position.type === "absolute") {
        if (b.layout.position.top  != null) el.style.top  = b.layout.position.top + "px";
        if (b.layout.position.left != null) el.style.left = b.layout.position.left + "px";
      }
      wrap.appendChild(el);
    });
  container.appendChild(wrap);
}

/* ========= RENDER FOOTER ========= */
function renderFooter(f) {
  const el = document.getElementById("main-footer");
  el.style.background = bgCSS(f.bgType, f.bgValue);
  el.style.height     = f.height + "px";

  if (f.text.visible) {
    el.innerHTML = `
      <div style="
        font-family:${f.text.font};
        font-size:${f.text.size}px;
        color:${f.text.color};
        text-align:${f.text.align};
      ">${f.text.html}</div>
    `;
  }
  renderDynamicBlocks(f.dynamicBlocks, el);
}

/* ========= UTILITAIRES ========= */
function bgCSS(type, val) {
  if (!val) return "";
  if (type === "image") return `url('${val}') center/cover no-repeat`;
  return val;
}
