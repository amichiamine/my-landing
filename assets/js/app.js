/**
 * app.js
 * Chargement et rendu dynamique de la landing page
 * Lecture de settings.json via fetch, injection du DOM
 */

const SETTINGS_PATH = "assets/data/settings.json";

document.addEventListener("DOMContentLoaded", () => {
  loadSettings().then(config => {
    applySettings(config);
    /*initBurger();*/
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
    console.error("err");
    return {}; // fallback minimal
  }
}

/**
 * Applique toute la configuration à la page
 * @param {Object} cfg
 */
function applySettings(cfg) {
  // 1. Header
  if (cfg.header?.visible) renderHeader(cfg.header);

  // 2. Body
  if (cfg.body?.visible) renderBody(cfg.body);

  // 3. Footer
  if (cfg.footer?.visible) renderFooter(cfg.footer);
}

/* ========= RENDER HEADER ========= */
function renderHeader(h) {
  const el = document.getElementById("main-header");
  // Fond et taille
 el.style.background = bgCSS(h.bgType, h.bgValue); // bgType/bgValue au lieu de bg.type
  el.style.height = h.height + "px";
  // Logo & titre
  const logoDiv = document.createElement("div");
  logoDiv.className = "logo";
  if (h.logo) {
    logoDiv.innerHTML = `<img src="${h.logo}" alt="logo" style="height:44px">
    <span class="site-name" style="font-family:${h.siteName.font};
    font-size:${h.siteName.size}px;
    color:${h.siteName.color}">;
    ${h.siteName.text}</span>`;
  }
  el.innerHTML = ""; 
  el.appendChild(logoDiv);
  // Burger
  el.insertAdjacentHTML("beforeend", `
    <input type="checkbox" id="burger-toggle">
    <label for="burger-toggle" class="burger"><span></span><span></span><span></span></label>
  `);
  // Menu
  if (h.menu.visible) {
    const nav = document.createElement("nav");
    nav.className = "menu";
    h.menu.items.forEach(item => {
      nav.innerHTML += `<a href="${item.link}"${item.active?" class=\"active\"":""} style="
        color:${h.menu.style.color};
        font-family:${h.menu.style.font};
        font-size:${h.menu.style.size}px;
        border-radius:${h.menu.style.borderRadius}px;
        background:${h.menu.style.background};
      ">${item.label}</a>`;
    });
    el.appendChild(nav);
  }
  // Blocs dynamiques
  renderDynamicBlocks(h.dynamicBlocks, el);
}

/* ========= RENDER BODY ========= */
function renderBody(b) {
  const el = document.getElementById("main-content");
  el.style.background = bgCSS(b.bgType, b.bgValue);
  el.style.minHeight = b.height + "px";
  el.innerHTML = "";

  // Trier sections par order
  const sections = b.sections
    .filter(s => s.visible && s.enabled)
    .sort((a, c) => a.order - c.order);

  sections.forEach(sec => {
    switch (sec.key) {
      case "carousel": renderCarousel(sec.data, el); break;
      case "welcomeBanner": renderWelcome(sec.data, el); break;
      case "dynamicBlocks": renderDynamicBlocks(sec.data, el); break;
      // ajouter d’autres sections si besoin
    }
  });
}

// Carrousel simple
function renderCarousel(cfg, container) {
  const wrapper = document.createElement("div");
  wrapper.className = "carousel";
  // Flèches
  const prev = document.createElement("button");
  prev.className = "prev";
  prev.innerHTML = "❮";
  const next = document.createElement("button");
  next.className = "next";
  next.innerHTML = "❯";
 if (cfg.style?.bgType && cfg.style?.bgValue) {
    slidesEl.style.background = bgCSS(cfg.style.bgType, cfg.style.bgValue);
  }
  // Contenu slides
  const slidesEl = document.createElement("div");
  slidesEl.className = "carousel-content";
  if (cfg.style.bg) {
    slidesEl.style.background = bgCSS(cfg.style.bg.type, cfg.style.bg.value);
  }
  slidesEl.style.maxWidth = cfg.style.width + "px";
  slidesEl.style.height   = cfg.style.height + "px";
  cfg.slides.forEach((s, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.display = i===0 ? "flex" : "none";
    slide.innerHTML = `
      <img src="${s.img}" class="carousel-img" alt="">
      <div class="carousel-text">
        <h2 style="font-family:${s.title.font};font-size:${s.title.size}px;color:${s.title.color}">${s.title.text}</h2>
        <p style="font-family:${s.desc.font};font-size:${s.desc.size}px;color:${s.desc.color}">${s.desc.text}</p>
        <a href="${s.button.link}" class="cta-btn" style="
          background:${bgCSS(s.button.style.bgType, s.button.style.bgValue)};
          font-family:${s.button.style.font};
          font-size:${s.button.style.size}px;
          color:${s.button.style.color};
          border-radius:${s.button.style.borderRadius}px;
          padding:${s.button.style.padding.vertical}px ${s.button.style.padding.horizontal}px;
        ">${s.button.label}</a>
      </div>`;
    slidesEl.appendChild(slide);
  });

  wrapper.appendChild(prev);
  wrapper.appendChild(slidesEl);
  wrapper.appendChild(next);
  container.appendChild(wrapper);

  // Contrôle autoplay + speed
  let idx = 0, autoplay;
  function showSlide(n) {
    const slides = slidesEl.children;
    slides[idx].style.display = "none";
    idx = (n + slides.length) % slides.length;
    slides[idx].style.display = "flex";
  }
  autoplay = setInterval(()=>showSlide(idx+1), cfg.speed);

  // Flèches click
  prev.onclick = ()=>{ showSlide(idx-1); };
  next.onclick = ()=>{ showSlide(idx+1); };

  // Pause on hover
  if (cfg.pauseOnHover) {
    wrapper.onmouseenter = ()=> clearInterval(autoplay);
    wrapper.onmouseleave = ()=> autoplay = setInterval(()=>showSlide(idx+1), cfg.speed);
  }
}

/* ========= RENDER WELCOME ========= */
function renderWelcome(cfg, container) {
  const sec = document.createElement("section");
  sec.className = "welcome-banner";
  sec.innerHTML = cfg.html;
  // Styles
  const s = cfg.style;
  sec.style.background = bgCSS(s.bgType, s.bgValue);
  sec.style.color = s.color;
  sec.style.fontFamily = s.font;
  sec.style.fontSize = s.size + "px";
  sec.style.borderRadius = s.borderRadius + "px";
  container.appendChild(sec);
}

/* ========= RENDER DYNAMIC BLOCKS ========= */
function renderDynamicBlocks(cfg, container) {
  if (!cfg?.visible || !cfg?.items?.length) return; // Ajout de vérifications
  const wrap = document.createElement("section");
  wrap.className = container.id==="main-content" ? "dynamic-blocks" : "";
  cfg.items
    .filter(b=>b.visible)
    .sort((a,b)=>a.layout.order - b.layout.order)
    .forEach(b => {
       if (!b?.style) return; // Vérification ajoutée
      const el = document.createElement("div");
      el.className = container.id==="main-content" ? "dynamic-block" : "";
      el.innerHTML = b.html;
      // Styles
      const st = b.style;
    el.style.background = bgCSS(st.bgType, st.bgValue || "#ffffff"); // Valeur par défaut
      el.style.color      = st.color;
      el.style.fontFamily = st.font;
      el.style.fontSize   = st.size + "px";
      el.style.borderRadius = st.borderRadius + "px";
      // Spacing
      // Nouveau code
        const layout = b.layout;
        // margin: [top, right, bottom, left]
        const m = layout.margin || [0,0,0,0];
        // padding: either [all] or [top, right, bottom, left]
        const pArr = layout.padding || [0];
        let padding;
        if (pArr.length === 1) {
          padding = `${pArr[0]}px`;
        } else {
          padding = `${pArr[0]}px ${pArr[1]}px ${pArr[2]}px ${pArr[3]}px`;
        }

        el.style.margin  = `${m[0]}px ${m[1]}px ${m[2]}px ${m[3]}px`;
        el.style.padding = padding;

      // Position
      const pos = b.layout.position;
      el.style.position = layout.position.type;
if (layout.position.type === "absolute") {
  if (layout.position.top  != null) el.style.top  = layout.position.top + "px";
  if (layout.position.left != null) el.style.left = layout.position.left + "px";
}
      wrap.appendChild(el);
    });
  container.appendChild(wrap);
}

/* ========= RENDER FOOTER ========= */
function renderFooter(f) {
  const el = document.getElementById("main-footer");
  // Fond et dimensions
  el.style.background = bgCSS(f.bgType, f.bgValue);
  el.style.height = f.height + "px";
  // Texte
  if (f.text.visible) {
    el.innerHTML = `<div style="font-family:${f.text.font};font-size:${f.text.size}px;color:${f.text.color};text-align:${f.text.align};">${f.text.html}</div>`;
  }
  // Blocs dynamiques
  renderDynamicBlocks(f.dynamicBlocks, el);
}

/* ========= UTILITAIRES ========= */
function bgCSS(type, val) {
  if (type === "image") return `url('${val}') center/cover no-repeat`;
  return val;
}

function bgCSS(type, val) {
  if (!val) return ""; // Valeur vide si undefined
  if (type === "image") return `url('${val}') center/cover no-repeat`;
  return val;
}
