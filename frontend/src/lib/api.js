// Calls to the site's own server (/api). Errors carry the server's message, ready to show to the visitor.
// The X-Cube-Admin header is the admin API's CSRF guard; public routes ignore it.
export async function api(path, { method = "GET", body } = {}) {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    headers: { "X-Cube-Admin": "1", ...(body !== undefined && !isForm ? { "Content-Type": "application/json" } : {}) },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty or non-JSON response */
  }
  // No JSON means the API server isn't behind this address (e.g. a dev server without the proxy).
  if (!res.ok || !data || typeof data !== "object") {
    const err = new Error(data?.error || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}
