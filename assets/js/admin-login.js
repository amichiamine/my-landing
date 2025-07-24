document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pass").value;
  // vérifiez contre settings.json ou vos user credentials
  // Supposons succès :
  const params = new URLSearchParams(window.location.search);
  const dest   = params.get("redirect") || "admin-header.html";
  localStorage.setItem("stagate_admin_logged", "1");
  window.location.href = dest;
});
