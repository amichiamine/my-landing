// assets/js/admin-footer.js
/**
 * Gère la personnalisation du pied de page :
 * - Authentification
 * - Chargement/sauvegarde settings.json en localStorage
 * - Contrôles color picker, gradient, file input, visible checkbox
 * - Aperçu live dans l’iframe
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

// Charge la configuration complète
function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch {
    return {};
  }
}

// Sauvegarde la configuration
function saveConfig(cfg) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(cfg));
}

// Vérifie l’authentification
function ensureAuth() {
  if (localStorage.getItem("stagate_admin_logged") !== "1") {
    alert("Accès restreint.");
    window.location.href = "admin-header.html";
  }
}

// Remplit le formulaire selon la config
function populateForm() {
  const cfg = loadConfig().footer || {};
  document.getElementById("footerVisible").checked = cfg.visible || false;
  document.getElementById("footerBgType").value = cfg.bgType || "solid";
  document.getElementById("footerBgColor").value = cfg.bgType === "solid" ? cfg.bgValue : "#ffffff";
  document.getElementById("footerBgGradient").value = cfg.bgType === "gradient" ? cfg.bgValue : "";
  document.getElementById("footerHeight").value = cfg.height || 60;
  document.getElementById("footerText").value = cfg.text?.html || "";
  document.getElementById("footerFont").value = cfg.text?.font || "";
  document.getElementById("footerFontSize").value = cfg.text?.size || 14;
  document.getElementById("footerColor").value = cfg.text?.color || "#ffffff";
  document.getElementById("footerAlign").value = cfg.text?.align || "center";
  toggleBgFields();
}

// Affiche/masque les champs de fond selon le type
function toggleBgFields() {
  const type = document.getElementById("footerBgType").value;
  document.getElementById("footerBgColor").style.display    = type === "solid"    ? "" : "none";
  document.getElementById("footerBgGradient").style.display = type === "gradient" ? "" : "none";
  document.getElementById("footerBgImage").style.display    = type === "image"    ? "" : "none";
}

// Gère la sélection d’image et convertit en DataURL
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    // Réutilisation du champ gradient pour stocker le DataURL
    document.getElementById("footerBgGradient").value = reader.result;
  };
  reader.readAsDataURL(file);
}

// Enregistre les données du formulaire dans la config
function saveFooter() {
  const cfgAll = loadConfig();
  cfgAll.footer = {};
  const f = cfgAll.footer;
  f.visible = document.getElementById("footerVisible").checked;
  f.bgType  = document.getElementById("footerBgType").value;
  if (f.bgType==="solid") {
  cfg.footer.bgValue = document.getElementById("footerBgColor").value;
} else if (f.bgType==="gradient") {
  cfg.footer.bgValue = document.getElementById("footerBgGradient").value;
} else {  // image
  cfg.footer.bgImage = document.getElementById("bgImageData").value;
}
  f.height = parseInt(document.getElementById("footerHeight").value, 10);
  f.text = {
    html:  document.getElementById("footerText").value,
    font:  document.getElementById("footerFont").value,
    size:  parseInt(document.getElementById("footerFontSize").value, 10),
    color: document.getElementById("footerColor").value,
    align: document.getElementById("footerAlign").value,
    visible: true
  };
  saveConfig(cfgAll);
  document.querySelector("iframe.preview-frame").contentWindow.location.reload();
  alert("Pied de page enregistré !");
}

window.addEventListener("DOMContentLoaded", () => {
  ensureAuth();
  populateForm();
  document.getElementById("footerBgType").addEventListener("change", toggleBgFields);
  document.getElementById("footerBgImage").addEventListener("change", handleImageUpload);
  document.getElementById("saveFooter").addEventListener("click", saveFooter);

  // Burger menu et déconnexion
  document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("burger-toggle").checked = false;
    });
  });
  document.getElementById("logoutBtn").addEventListener("click", e => {
  e.preventDefault();
  localStorage.removeItem("stagate_admin_logged");
  const redirectTo = new URLSearchParams(window.location.search).get("redirect");
  window.location.href = "admin-login.html" + (redirectTo ? `?redirect=${redirectTo}` : "");
});

});
