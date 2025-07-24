// assets/js/admin-header.js
/**
 * Gère la personnalisation de l’en-tête :
 * - Authentification
 * - Chargement / sauvegarde du JSON (local)
 * - Controls color picker, gradient, file input, visible checkbox
 * - Aperçu live dans l’iframe
 * Requiert CryptoJS pour SHA-1 (inclus dans admin-header.html)
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

/** Charge configuration complète */
function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch {
    return {};
  }
}

/** Sauvegarde configuration */
function saveConfig(cfg) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(cfg));
}

/** Vérifie l'authentification */
function ensureAuth(withRedirect = false) {
  if (localStorage.getItem("stagate_admin_logged") !== "1") {
    const redirectParam = withRedirect
      ? `?redirect=${encodeURIComponent(window.location.pathname)}`
      : "";
    window.location.href = "admin-login.html" + redirectParam;
  }
}

/** Remplit le formulaire depuis la config */
function populateForm() {
  const cfg = loadConfig().header || {};
  document.getElementById("headerVisible").checked = cfg.visible !== false;
  document.getElementById("bgType").value         = cfg.bgType || "solid";
  document.getElementById("bgColor").value        = cfg.bgType === "solid"    ? cfg.bgValue : "#ffffff";
  document.getElementById("bgGradient").value     = cfg.bgType === "gradient" ? cfg.bgValue : "";
  document.getElementById("height").value         = cfg.height || 70;
  // logo preview handled on change
  document.getElementById("siteNameText").value   = cfg.siteName?.text || "";
  document.getElementById("siteNameColor").value  = cfg.siteName?.color || "#ffffff";
  document.getElementById("siteNameSize").value   = cfg.siteName?.size || 20;
  document.getElementById("menuVisible").checked  = cfg.menu?.visible !== false;
  document.getElementById("menuFont").value       = cfg.menu?.style?.font || "";
  document.getElementById("menuSize").value       = cfg.menu?.style?.size || 14;
  document.getElementById("menuColor").value      = cfg.menu?.style?.color || "#ffffff";
  document.getElementById("menuRadius").value     = cfg.menu?.style?.borderRadius || 20;
  toggleBgFields();
}

/** Affiche/masque inputs selon bgType */
function toggleBgFields() {
  const t = document.getElementById("bgType").value;
  document.getElementById("bgColor").style.display    = t === "solid"    ? "" : "none";
  document.getElementById("bgGradient").style.display = t === "gradient" ? "" : "none";
  document.getElementById("bgImage").style.display    = t === "image"    ? "" : "none";
}

/** Gère l’upload de l’image de fond ou logo */
function handleImageUpload(event, targetFieldId) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById(targetFieldId).value = reader.result;
  };
  reader.readAsDataURL(file);
}

/** Sauvegarde les paramètres de l’en-tête */
function saveHeader() {
  const allCfg = loadConfig();
  allCfg.header = {};
  const h = allCfg.header;
  h.visible = document.getElementById("headerVisible").checked;
  h.bgType  = document.getElementById("bgType").value;
  if (h.bgType==="solid") {
  cfg.header.bgValue = document.getElementById("bgColor").value;
} else if (h.bgType==="gradient") {
  cfg.header.bgValue = document.getElementById("bgGradient").value;
} else {  // image
  cfg.header.bgImage = document.getElementById("bgImageData").value;
}
  h.height = parseInt(document.getElementById("height").value, 10);

  // logo file
  h.logo = document.getElementById("logoFileData")?.value || loadConfig().header?.logo;

  h.siteName = {
    text:  document.getElementById("siteNameText").value,
    color: document.getElementById("siteNameColor").value,
    size:  parseInt(document.getElementById("siteNameSize").value, 10),
    font:  document.getElementById("siteNameFont")?.value || "Poppins",
    visible: true
  };

  h.menu = {
    visible: document.getElementById("menuVisible").checked,
    style: {
      font:         document.getElementById("menuFont").value,
      size:         parseInt(document.getElementById("menuSize").value, 10),
      color:        document.getElementById("menuColor").value,
      background:   loadConfig().header?.menu?.style?.background || "transparent",
      borderRadius: parseInt(document.getElementById("menuRadius").value, 10)
    },
    items: loadConfig().header?.menu?.items || []
  };

  saveConfig(allCfg);
  document.querySelector("iframe.preview-frame").contentWindow.location.reload();
  alert("En-tête enregistré !");
}

window.addEventListener("DOMContentLoaded", () => {
  ensureAuth();
  populateForm();

  document.getElementById("bgType").addEventListener("change", toggleBgFields);
  document.getElementById("bgImage").addEventListener("change", e => handleImageUpload(e, "bgGradient"));
  document.getElementById("logoFile").addEventListener("change", e => handleImageUpload(e, "logoFileData"));

  document.getElementById("saveHeader").addEventListener("click", saveHeader);

  // Burger menu & logout
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
