const configuredBase = import.meta.env.VITE_API_BASE;
const BASE = configuredBase?.replace(/\/+$/, "") || "http://localhost:2000/api";

export async function fetchArticles(options = {}) {
  const res = await fetch(`${BASE}/articles/latest`, {
    headers: { Accept: "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  return res.json();
}

export async function fetchArticle(id, options = {}) {
  const res = await fetch(`${BASE}/post/${id}`, {
    headers: { Accept: "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch article");
  }

  return res.json();
}

export async function fetchArticlesByTag(tag, options = {}) {
  const res = await fetch(`${BASE}/articles/by-tag`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tag }),
    ...options,
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tagged articles');
  }

  return res.json();
}

export async function fetchAllArticles({ status = 'published', limit = 12, page = 1, signal } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (limit) params.set('limit', String(limit));
  if (page) params.set('page', String(page));
  const res = await fetch(`${BASE}/articles?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }
  return res.json();
}

export async function createArticle(payload, options = {}) {
  const res = await fetch(`${BASE}/articles`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    ...options,
  });

  if (!res.ok) {
    let message = 'Failed to create article';
    try {
      const errorBody = await res.json();
      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch (error) {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json();
}
