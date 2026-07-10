const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function handle(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        const messages = data.detail.map(
          (err) => `${err.loc?.join(".") || "unknown"}: ${err.msg}`
        );
        throw new Error(messages.join("\n"));
      }

      throw new Error(data.detail);
    }

    throw new Error(`Request failed with status ${response.status}`);
  }

  return data;
}

export async function fetchChapters() {
  const res = await fetch(`${API_BASE}/api/chapters/all`);
  return handle(res);
}

export async function searchCMTA(query, filter = "all") {
  const params = new URLSearchParams({ q: query, filter });
  const res = await fetch(`${API_BASE}/api/search?${params.toString()}`);
  return handle(res);
}
