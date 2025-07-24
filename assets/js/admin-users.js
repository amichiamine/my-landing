// assets/js/admin-users.js
/**
 * admin-users.js
 * Gère l’affichage et la modification des comptes utilisateurs
 * Lecture/écriture dans localStorage (settings.jsoné côté client)
 * Nécessite CryptoJS pour SHA-1 (inclus dans admin-users.html)
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

// Récupère la config users depuis localStorage ou settings.json simulé
function loadUsersConfig() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return { users: { roles: [], credentials: {}, pages: {} } };
  try {
    const cfg = JSON.parse(raw);
    return cfg.users || { roles: [], credentials: {}, pages: {} };
  } catch {
    return { roles: [], credentials: {}, pages: {} };
  }
}

// Sauvegarde la partie users dans localStorage
function saveUsersConfig(usersCfg) {
  const raw = localStorage.getItem(SETTINGS_KEY);
  let cfg = raw ? JSON.parse(raw) : {};
  cfg.users = usersCfg;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(cfg));
}

// Remplit le tableau des utilisateurs
function renderUsersTable() {
  const { credentials, pages } = loadUsersConfig();
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  Object.keys(credentials).forEach(login => {
    const tr = document.createElement("tr");
    const role = Object.entries(pages)
      .find(([, arr]) => arr.includes(login) || login in credentials && pages[login])
      ? Object.entries(pages).find(([,arr]) => arr.includes(login))[0]
      : "manager";

    tr.innerHTML = `
      <td style="border:1px solid #ddd;padding:8px;">${login}</td>
      <td style="border:1px solid #ddd;padding:8px;">${role}</td>
      <td style="border:1px solid #ddd;padding:8px;">
        <button class="editBtn" data-login="${login}">Modifier</button>
        <button class="delBtn"  data-login="${login}">Supprimer</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Liaison des boutons modifier/supprimer
  tbody.querySelectorAll(".editBtn").forEach(btn => {
    btn.onclick = () => startEditUser(btn.dataset.login);
  });
  tbody.querySelectorAll(".delBtn").forEach(btn => {
    btn.onclick = () => deleteUser(btn.dataset.login);
  });
}

// Démarre la modification : pré-remplit le formulaire
function startEditUser(login) {
  const usersCfg = loadUsersConfig();
  document.getElementById("userLogin").value    = login;
  document.getElementById("userRole").value     = Object.entries(usersCfg.pages)
    .find(([role, arr]) => arr.includes(login))?.[0] || "manager";
  document.getElementById("userPass").value     = "";
}

// Supprime un utilisateur
function deleteUser(login) {
  if (!confirm(`Supprimer l’utilisateur "${login}" ?`)) return;
  const usersCfg = loadUsersConfig();
  delete usersCfg.credentials[login];
  // retirer des pages
  Object.values(usersCfg.pages).forEach(arr => {
    const idx = arr.indexOf(login);
    if (idx !== -1) arr.splice(idx, 1);
  });
  saveUsersConfig(usersCfg);
  renderUsersTable();
  alert("Utilisateur supprimé");
}

// Enregistre ou crée un utilisateur
function saveUser() {
  const login = document.getElementById("userLogin").value.trim();
  const pass  = document.getElementById("userPass").value;
  const role  = document.getElementById("userRole").value;
  if (!login) {
    alert("Le nom d’utilisateur ne peut être vide");
    return;
  }
  const usersCfg = loadUsersConfig();
  // Hasher le mot de passe si saisi
  if (pass) {
    const hash = CryptoJS.SHA1(pass).toString();
    usersCfg.credentials[login] = hash;
  } else if (!(login in usersCfg.credentials)) {
    alert("Veuillez saisir un mot de passe pour un nouvel utilisateur");
    return;
  }
  // Mettre à jour pages
  // Retirer l’utilisateur de tous les rôles existants
  Object.values(usersCfg.pages).forEach(arr => {
    const idx = arr.indexOf(login);
    if (idx !== -1) arr.splice(idx, 1);
  });
  // Ajouter dans le rôle sélectionné
  if (!usersCfg.pages[role]) usersCfg.pages[role] = [];
  usersCfg.pages[role].push(login);

  saveUsersConfig(usersCfg);
  renderUsersTable();
  alert("Utilisateur enregistré");
  // Reset form
  document.getElementById("userForm").reset();
}

// Authentification et initialisation
window.addEventListener("DOMContentLoaded", () => {
  // Vérifier login
  if (localStorage.getItem("stagate_admin_logged") !== "1") {
    // rediriger vers login ou afficher modal
    alert("Accès non autorisé");
    return;
  }

  // Initialiser table & formulaire
  renderUsersTable();
  document.getElementById("saveUser").onclick = saveUser;
});
