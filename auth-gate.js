/* auth-gate.js
 *
 * Client-side sign-in gate for tool pages on tools.esub.com. A page that
 * includes this script stays hidden (via an inline <style> the page declares)
 * until a Microsoft Entra session is present in browser storage; otherwise the
 * visitor is sent to /login/ with a ?return= pointer to the requested page.
 *
 * REQUIRED BOILERPLATE in each gated page's <head>:
 *   <style>html { visibility: hidden; }</style>
 *   <script src="/auth-gate.js" defer></script>
 *
 * Keep the MSAL config in sync with /login/index.html.
 *
 * CAVEAT: This is a convenience gate, NOT access control. This repo is public,
 * so GitHub Pages serves every file to anyone with the URL; the gate only hides
 * the page in-browser until sign-in. It does not restrict who can fetch the file.
 */
(function () {
  "use strict";

  const MSAL_CDN = "https://cdn.jsdelivr.net/npm/@azure/msal-browser@3.30.0/lib/msal-browser.min.js";

  const MSAL_CONFIG = {
    auth: {
      clientId: "09ed6bee-b6a7-41e4-ad61-1baa08511f58",
      authority: "https://login.microsoftonline.com/9f90601e-35f6-4142-aacf-53f1218356e2",
    },
    cache: { cacheLocation: "localStorage", storeAuthStateInCookie: false },
  };

  const LOGIN_PAGE = "/login/"; // served from the domain root

  function loadMsal() {
    return new Promise(function (resolve, reject) {
      if (typeof window.msal !== "undefined" && window.msal.PublicClientApplication) { resolve(); return; }
      const s = document.createElement("script");
      s.src = MSAL_CDN;
      s.crossOrigin = "anonymous";
      s.referrerPolicy = "no-referrer";
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("Failed to load MSAL from " + MSAL_CDN)); };
      document.head.appendChild(s);
    });
  }

  function redirectToLogin() {
    const ret = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
    window.location.replace(LOGIN_PAGE + "?return=" + ret);
  }

  function reveal() { document.documentElement.style.visibility = "visible"; }

  async function gate() {
    try {
      await loadMsal();
      if (typeof window.msal === "undefined" || !window.msal.PublicClientApplication) {
        throw new Error("MSAL global missing after script load");
      }
      const pca = new window.msal.PublicClientApplication(MSAL_CONFIG);
      await pca.initialize();
      if (pca.getAllAccounts().length > 0) { reveal(); } else { redirectToLogin(); }
    } catch (err) {
      console.error("auth-gate:", err);
      redirectToLogin(); // fail closed
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", gate);
  } else {
    gate();
  }
})();
