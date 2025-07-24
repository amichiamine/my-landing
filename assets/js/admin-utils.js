// assets/js/admin-utils.js
export function toggleBgFields(prefix) {
  const sel = document.getElementById(prefix + "BgType").value;
  ["Color","Gradient","Image"].forEach(suf => {
    const el = document.getElementById(prefix + "Bg" + suf);
    el.style.display = (suf.toLowerCase() === sel ? "" : "none");
  });
}

export function handleImageUpload(event, targetFieldId) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById(targetFieldId).value = reader.result;
  };
  reader.readAsDataURL(file);
}

export function ensureAuth(withRedirect = false) {
  if (localStorage.getItem("stagate_admin_logged") !== "1") {
    const redirect = withRedirect
      ? "?redirect=" + encodeURIComponent(location.pathname)
      : "";
    window.location.href = "admin-login.html" + redirect;
  }
}

