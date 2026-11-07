// Google Analytics 4, switched on from the dashboard ("Google & SEO") and loaded only for visitors who allowed
// analytics cookies. Turning consent off later stops it sending anything.
let loaded = null;

export function googleAnalytics(id, allowed) {
  if (!/^G-[A-Z0-9]{4,20}$/.test(id || "")) return;
  window[`ga-disable-${id}`] = !allowed;
  if (!allowed || loaded === id) return;
  loaded = id;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag reads the arguments object itself, as Google's snippet does.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // No advertising features, and cookies kept 13 months at most, as the cookie notice says.
  window.gtag("config", id, { allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 13 * 30 * 86400 });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}
