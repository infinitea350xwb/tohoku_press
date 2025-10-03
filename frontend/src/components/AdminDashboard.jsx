import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { createArticle, fetchAllArticles } from "../lib/api";

const initialPost = {
  title: "",
  slug: "",
  contentHtml: "",
  excerpt: "",
  coverUrl: "",
  tags: "",
  status: "DRAFT",
  editor: "html",
  publishedAt: "",
};

export const AdminDashboard = () => {
  const [view, setView] = useState("list");
  const [post, setPost] = useState(initialPost);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadPosts = async (signal = undefined) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAllArticles({ status: "all", limit: 50, page: 1, signal });
      const items =
        Array.isArray(response)
          ? response
          : (response && Array.isArray(response.items))
            ? response.items
            : [];
      setPosts(items);
    } catch (err) {
      if (err && err.name === "AbortError") return;
      setError((err && err.message) || "記事の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadPosts(controller.signal);
    return () => controller.abort();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedTags = post.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      title: post.title.trim(),
      contentHtml: post.contentHtml,
      excerpt: post.excerpt || undefined,
      coverUrl: post.coverUrl || undefined,
      tags: normalizedTags,
      status: post.status || "DRAFT",
      editor: post.editor || "html",
    };

    const trimmedSlug = post.slug.trim();
    if (trimmedSlug) {
      // allowed: mutating properties on a const object
      payload.slug = trimmedSlug;
    }

    if (post.publishedAt) {
      payload.publishedAt = post.publishedAt;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const created = await createArticle(payload);
      setPosts((prev) => [created, ...prev]);
      setNotice("記事を保存しました。");
      setPost(initialPost);
      setView("list");
      await loadPosts(); // optional refresh
    } catch (err) {
      setError((err && err.message) || "記事の保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-6">
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage posts, review drafts, and publish updates
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition",
                view === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              )}
              onClick={() => {
                setView("list");
                setError(null);
                setNotice(null);
              }}
            >
              Post List
            </button>
            <button
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition",
                view === "create"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              )}
              onClick={() => {
                setView("create");
                setError(null);
                setNotice(null);
                setPost(initialPost);
              }}
            >
              New Post
            </button>
          </div>
        </div>
      </header>

      <main className="container flex-1 py-10">
        {view === "create" ? (
          <form
            onSubmit={handleSubmit}
            className="grid gap-6 rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="flex items-center justify-between text-sm font-medium">
                Title
                <span className="text-xs text-muted-foreground">required</span>
              </label>
              <input
                name="title"
                value={post.title}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Slug</label>
                <input
                  name="slug"
                  value={post.slug}
                  onChange={handleChange}
                  placeholder="auto-generated if empty"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cover URL</label>
                <input
                  name="coverUrl"
                  value={post.coverUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Excerpt</label>
              <textarea
                name="excerpt"
                value={post.excerpt}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Content (HTML)</label>
              <textarea
                name="contentHtml"
                value={post.contentHtml}
                onChange={handleChange}
                required
                rows={10}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Tags</label>
                <input
                  name="tags"
                  value={post.tags}
                  onChange={handleChange}
                  placeholder="comma separated"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={post.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Editor</label>
                <select
                  name="editor"
                  value={post.editor}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="plain">Plain</option>
                  <option value="html">HTML</option>
                  <option value="markdown">Markdown</option>
                  <option value="tiptap">TipTap</option>
                  <option value="quill">Quill</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Published At</label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  value={post.publishedAt}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPost(initialPost)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium text-primary-foreground transition",
                  saving ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
                )}
              >
                {saving ? "Saving..." : "Save Post"}
              </button>
            </div>
          </form>
        ) : (
          <section className="space-y-6">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Recent Posts</h2>
                <p className="text-sm text-muted-foreground">
                  Showing {posts.length} {posts.length === 1 ? "entry" : "entries"}
                </p>
              </div>
              <button
                onClick={() => {
                  setView("create");
                  setError(null);
                  setNotice(null);
                  setPost(initialPost);
                }}
                className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
              >
                Create Post
              </button>
            </header>

            {notice && (
              <div className="rounded-md border border-primary/50 bg-primary/10 p-3 text-sm text-primary">
                {notice}
              </div>
            )}
            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              {loading ? (
                <div className="rounded-md border border-border bg-card p-6 text-center text-muted-foreground">
                  Loading articles...
                </div>
              ) : posts.length === 0 ? (
                <div className="rounded-md border border-border bg-card p-6 text-center text-muted-foreground">
                  No posts yet. Create your first article!
                </div>
              ) : (
                posts.map((entry, index) => (
                  <article
                    key={entry.slug || index}
                    className="rounded-md border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          /post/{entry.slug || "(auto)"}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                            {entry.status}
                          </span>
                          <span className="rounded-full bg-muted px-3 py-1">
                            editor: {entry.editor}
                          </span>
                          {(Array.isArray(entry.tags) ? entry.tags : []).map((tag) => (
                            <span key={tag} className="rounded-full bg-muted px-3 py-1">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 text-right text-xs text-muted-foreground">
                        <p>Created: {new Date(entry.createdAt).toLocaleString()}</p>
                        <p>Updated: {new Date(entry.updatedAt).toLocaleString()}</p>
                        {entry.publishedAt && (
                          <p>Published: {new Date(entry.publishedAt).toLocaleString()}</p>
                        )}
                      </div>
                    </div>

                    {entry.excerpt && (
                      <p className="mt-4 text-sm text-white/80">{entry.excerpt}</p>
                    )}
                    {entry.coverUrl && (
                      <img
                        src={entry.coverUrl}
                        alt={entry.title}
                        className="mt-4 max-h-48 w-full rounded-md object-cover"
                      />
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};