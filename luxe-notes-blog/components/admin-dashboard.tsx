"use client";

import { useEffect, useMemo, useState } from "react";

type PostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
};

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  featured: false,
  published: true
};

export function AdminDashboard() {
  const [secret, setSecret] = useState("");
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const stored = window.localStorage.getItem("blog-admin-secret");
    if (stored) {
      setSecret(stored);
    }
  }, []);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bTime - aTime;
      }),
    [posts]
  );

  async function fetchPosts(currentSecret: string) {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/posts", {
        headers: {
          "x-admin-secret": currentSecret
        },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Unable to load posts. Check your admin secret.");
      }

      const data = (await response.json()) as PostRecord[];
      setPosts(data);
      window.localStorage.setItem("blog-admin-secret", currentSecret);
      setSuccess("Studio connected.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(editingSlug ? `/api/posts/${editingSlug}` : "/api/posts", {
        method: editingSlug ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save the post.");
      }

      setSuccess(editingSlug ? "Post updated." : "Post created.");
      setForm(emptyForm);
      setEditingSlug(null);
      await fetchPosts(secret);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unexpected error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": secret
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Unable to delete the post.");
      }

      if (editingSlug === slug) {
        setEditingSlug(null);
        setForm(emptyForm);
      }

      setSuccess("Post deleted.");
      await fetchPosts(secret);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unexpected error.");
    }
  }

  function populateForEdit(post: PostRecord) {
    setEditingSlug(post.slug);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage ?? "",
      featured: post.featured,
      published: post.published
    });
  }

  return (
    <div className="studio-grid">
      <section className="studio-panel">
        <div className="panel-header">
          <p className="panel-kicker">Admin Access</p>
          <h2>Editorial Studio</h2>
        </div>
        <p className="muted-copy">
          Use the same `ADMIN_SECRET` you configured on the server. The API accepts create, update, publish, feature, and delete operations.
        </p>
        <label className="field">
          <span>Admin secret</span>
          <input
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            placeholder="Enter server admin secret"
          />
        </label>
        <button className="primary-button" onClick={() => fetchPosts(secret)} disabled={!secret || loading}>
          {loading ? "Connecting..." : "Connect studio"}
        </button>
        {error ? <p className="feedback error">{error}</p> : null}
        {success ? <p className="feedback success">{success}</p> : null}
      </section>

      <section className="studio-panel">
        <div className="panel-header">
          <p className="panel-kicker">{editingSlug ? "Edit post" : "New post"}</p>
          <h2>{editingSlug ? "Refine your draft" : "Publish a new story"}</h2>
        </div>
        <div className="field-grid">
          <label className="field">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="A strong editorial headline"
            />
          </label>
          <label className="field">
            <span>Slug</span>
            <input
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value.toLowerCase().replace(/\s+/g, "-") }))}
              placeholder="my-new-post"
            />
          </label>
        </div>
        <label className="field">
          <span>Excerpt</span>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
            placeholder="A concise summary that appears on the homepage."
          />
        </label>
        <label className="field">
          <span>Cover image URL</span>
          <input
            value={form.coverImage}
            onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.value }))}
            placeholder="https://..."
          />
        </label>
        <label className="field">
          <span>Content</span>
          <textarea
            rows={12}
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            placeholder="Write in paragraphs. Separate paragraphs with a blank line."
          />
        </label>
        <div className="toggle-row">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
            />
            Feature on homepage
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))}
            />
            Published
          </label>
        </div>
        <div className="action-row">
          <button className="primary-button" onClick={handleSubmit} disabled={!secret || saving}>
            {saving ? "Saving..." : editingSlug ? "Update post" : "Create post"}
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              setEditingSlug(null);
              setForm(emptyForm);
            }}
          >
            Reset form
          </button>
        </div>
      </section>

      <section className="studio-panel studio-panel-wide">
        <div className="panel-header">
          <p className="panel-kicker">Content library</p>
          <h2>Published and draft entries</h2>
        </div>
        <div className="post-list">
          {sortedPosts.length === 0 ? (
            <p className="muted-copy">Connect the studio to load your content.</p>
          ) : (
            sortedPosts.map((post) => (
              <article className="post-list-item" key={post.id}>
                <div>
                  <p className="list-eyebrow">
                    {post.published ? "Published" : "Draft"} · {post.featured ? "Featured" : "Standard"}
                  </p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
                <div className="list-actions">
                  <button className="secondary-button" onClick={() => populateForEdit(post)}>
                    Edit
                  </button>
                  <button className="ghost-button" onClick={() => handleDelete(post.slug)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
