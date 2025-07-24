// assets/js/admin-header.js
/**
 * Gère la personnalisation de l’en-tête :
 * - Authentification
 * - Chargement / sauvegarde du JSON (local)
 * - Controls color picker, gradient, file input, visible checkbox
 * - Aperçu live dans l’iframe
 * Requiert CryptoJS pour SHA-1 (inclus dans admin-header.html)
 */
// assets/js/admin-header.js
import { ensureAuth, toggleBgFields, handleImageUpload } from "./admin-utils.js";

ensureAuth(true); // redirige vers login avec ?redirect=pageCourante

const SETTINGS_KEY = "stagateSettingsAdv";

function loadConfig() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
  catch { return {}; }
}

function saveConfig(cfg) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(cfg));
}

function populateForm() {
  const cfg = loadConfig().header || {};
  document.getElementById("headerVisible").checked = cfg.visible ?? true;
  document.getElementById("bgType").value         = cfg.bgType || "solid";
  document.getElementById("bgColor").value        = cfg.bgType === "solid"    ? cfg.bgValue : "#ffffff";
  document.getElementById("bgGradient").value     = cfg.bgType === "gradient" ? cfg.bgValue : "";
  document.getElementById("bgImageData").value    = cfg.bgType === "image"    ? cfg.bgImage : "";
  document.getElementById("height").value         = cfg.height || 70;
  // autres champs ...
  toggleBgFields("bg");
}

function saveHeader() {
  const allCfg = loadConfig();
  allCfg.header = {};
  const h = allCfg.header;
  h.visible = document.getElementById("headerVisible").checked;
  h.bgType  = document.getElementById("bgType").value;
  if (h.bgType === "solid") {
    h.bgValue = document.getElementById("bgColor").value;
  } else if (h.bgType === "gradient") {
    h.bgValue = document.getElementById("bgGradient").value;
  } else {
    h.bgImage = document.getElementById("bgImageData").value;
  }
  h.height = parseInt(document.getElementById("height").value, 10);
  // autres champs ...
  saveConfig(allCfg);
  document.querySelector("iframe.preview-frame").contentWindow.location.reload();
  alert("En-tête enregistré !");
}

window.addEventListener("DOMContentLoaded", () => {
  populateForm();
  document.getElementById("bgType").addEventListener("change", () => toggleBgFields("bg"));
  document.getElementById("bgImage").addEventListener("change", e => handleImageUpload(e, "bgImageData"));
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
