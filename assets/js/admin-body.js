// assets/js/admin-body.js
/**
 * Gère la personnalisation du corps (body) :
 * - Authentification
 * - Chargement / sauvegarde du JSON (localStorage)
 * - TinyMCE pour Welcome Banner
 * - Controls: color picker, gradient, file input, visible checkbox
 * - Aperçu live
 */
import { toggleBgFields, handleImageUpload, ensureAuth } from "./admin-utils.js";
import { ensureAuth } from "./admin-utils.js";
ensureAuth(true);


window.addEventListener("DOMContentLoaded", () => {
  ensureAuth(true);
  document.getElementById("bgType").addEventListener("change", () => toggleBgFields("header"));
  document.getElementById("bgImage").addEventListener("change", e => handleImageUpload(e, "headerBgImageData"));
  // …
});

const SETTINGS_KEY = "stagateSettingsAdv";

/** Lit la config stockée */
function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch {
    return {};
  }
}

/** Sauvegarde la config entière */
function saveConfig(cfg) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(cfg));
}

/** Vérifie authentification */
function ensureAuth() {
  if (localStorage.getItem("stagate_admin_logged") !== "1") {
    alert("Accès non autorisé");
    window.location.href = "admin-header.html";
  }
}

/** Remplit le formulaire depuis la config */
function populateForm() {
  const cfg = loadConfig().body || {};
  document.getElementById("bodyVisible").checked     = cfg.visible !== false;
  document.getElementById("bodyBgType").value       = cfg.bgType   || "solid";
  document.getElementById("bodyBgColor").value      = cfg.bgType==="solid"?cfg.body.bgValue:"#ffffff";
  document.getElementById("bodyBgGradient").value   = cfg.bgType==="gradient"?cfg.body.bgValue:"";
  document.getElementById("bodyHeight").value       = cfg.height   || 600;

  // sections order
  cfg.sections?.forEach(sec => {
    if (sec.key === "carousel") document.getElementById("orderCarousel").value = sec.order;
    if (sec.key === "welcomeBanner") document.getElementById("orderWelcome").value = sec.order;
    if (sec.key === "dynamicBlocks") document.getElementById("orderBlocks").value = sec.order;
  });

  // carousel
  const car = cfg.sections.find(s=>s.key==="carousel")?.data;
  if (car) {
    document.getElementById("carouselSpeed").value   = car.speed;
    document.getElementById("carouselPause").checked = car.pauseOnHover;
    const s0 = car.slides[0] || {};
    document.getElementById("slideTitle").value   = s0.title?.text   || "";
    document.getElementById("slideDesc").value    = s0.desc?.text    || "";
    document.getElementById("slideBtnText").value = s0.button?.label || "";
    document.getElementById("slideBtnLink").value = s0.button?.link  || "";
  }

  // welcome
  document.getElementById("welcomeVisible").checked = cfg.sections.find(s=>s.key==="welcomeBanner")?.visible!==false;
  document.getElementById("welcomeHtml").value = cfg.sections.find(s=>s.key==="welcomeBanner")?.data.html || "";
  document.getElementById("welcomeColor").value = cfg.sections.find(s=>s.key==="welcomeBanner")?.data.style.color || "#ffffff";
  document.getElementById("welcomeSize").value  = cfg.sections.find(s=>s.key==="welcomeBanner")?.data.style.size  || 20;

  toggleBgFields("body");
  toggleBgFields("welcome");
}

/** Affiche/masque champs bg selon type */
function toggleBgFields(prefix) {
  const sel = document.getElementById(prefix + "BgType").value;
  ["Color","Gradient","Image"].forEach(t => {
    const el = document.getElementById(prefix + "Bg" + t);
    el && (el.style.display = (t.toLowerCase()===sel ? "" : "none"));
  });
}

/** Lit fichier image et stocke DataURL */
function handleImageUpload(event, targetFieldId) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => document.getElementById(targetFieldId).value = reader.result;
  reader.readAsDataURL(file);
}

/** Sauvegarde les paramètres du body */
function saveBody() {
  const allCfg = loadConfig();
  allCfg.body = {
    visible: document.getElementById("bodyVisible").checked,
    bgType:  document.getElementById("bodyBgType").value,
    bgValue : document.getElementById("bodyBgType").value==="solid"
               ? document.getElementById("bodyBgColor").value
               : document.getElementById("bodyBgGradient").value,
    height:  parseInt(document.getElementById("bodyHeight").value,10),
    sections: [
      {
        key: "carousel",
        visible: true,
        order: parseInt(document.getElementById("orderCarousel").value,10),
        enabled: true,
        data: {
          style: loadConfig().body.sections.find(s=>s.key==="carousel").data.style,
          slides: loadConfig().body.sections.find(s=>s.key==="carousel").data.slides,
          speed: parseInt(document.getElementById("carouselSpeed").value,10),
          pauseOnHover: document.getElementById("carouselPause").checked
        }
      },
      {
        key: "welcomeBanner",
        visible: document.getElementById("welcomeVisible").checked,
        order: parseInt(document.getElementById("orderWelcome").value,10),
        enabled: true,
        data: {
          html: document.getElementById("welcomeHtml").value,
          style: loadConfig().body.sections.find(s=>s.key==="welcomeBanner").data.style
        }
      },
      {
        key: "dynamicBlocks",
        visible: true,
        order: parseInt(document.getElementById("orderBlocks").value,10),
        enabled: true,
        data: loadConfig().body.sections.find(s=>s.key==="dynamicBlocks").data
      }
    ]
  };
  saveConfig(allCfg);
  document.querySelector("iframe.preview-frame").contentWindow.location.reload();
  alert("Corps enregistré !");
}

window.addEventListener("DOMContentLoaded", () => {
  ensureAuth();
  populateForm();

  ["body","welcome"].forEach(pref => {
    document.getElementById(pref + "BgType").addEventListener("change", () => toggleBgFields(pref));
    document.getElementById(pref + "BgImage").addEventListener("change", e => handleImageUpload(e, pref + "BgGradient"));
  });

  document.getElementById("saveBody").addEventListener("click", saveBody);

  // Init TinyMCE
  tinymce.init({ selector: "#welcomeHtml", height: 150 });

  // Burger & logout
  document.querySelectorAll(".menu a").forEach(a => {
    a.addEventListener("click", () => document.getElementById("burger-toggle").checked = false);
  });
  document.getElementById("logoutBtn").addEventListener("click", e => {
  e.preventDefault();
  localStorage.removeItem("stagate_admin_logged");
  const redirectTo = new URLSearchParams(window.location.search).get("redirect");
  window.location.href = "admin-login.html" + (redirectTo ? `?redirect=${redirectTo}` : "");
});

});
