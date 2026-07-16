"use client";

import { FormEvent, useEffect, useState } from "react";

type Item = {
  id: number;
  name: string;
  category: string;
  description: string;
  createdAt: string;
};

const emptyForm = { name: "", category: "", description: "" };

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadItems(search = "") {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/items?q=${encodeURIComponent(search)}`);
      if (!response.ok) throw new Error("Could not load items.");
      const data = await response.json();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => loadItems(query), 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Could not create item.");
      setForm(emptyForm);
      setQuery("");
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <nav>
          <div className="brand"><span>TD</span> Team Dos</div>
          <a href="#create">Create item</a>
        </nav>
        <div className="hero-copy">
          <p className="eyebrow">SMART TEAM DIRECTORY</p>
          <h1>Keep useful resources easy to find.</h1>
          <p className="subtitle">Search your team directory instantly or add a new resource through a clean, lightweight API.</p>
          <div className="search-wrap">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, category, or description" aria-label="Search items" />
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div>
          <div className="section-heading">
            <div><p className="eyebrow">DIRECTORY</p><h2>{query ? "Search results" : "Latest resources"}</h2></div>
            <span className="count">{items.length} items</span>
          </div>

          {error && <p className="alert">{error}</p>}
          {loading ? (
            <div className="state-card">Loading resources…</div>
          ) : items.length === 0 ? (
            <div className="state-card"><strong>No results found.</strong><span>Try another search term or create a new item.</span></div>
          ) : (
            <div className="cards">
              {items.map((item) => (
                <article className="card" key={item.id}>
                  <div className="card-top"><span className="tag">{item.category}</span><span className="arrow">↗</span></div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <small>Added {new Date(item.createdAt).toLocaleDateString()}</small>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside id="create">
          <p className="eyebrow">NEW RESOURCE</p>
          <h2>Create an item</h2>
          <p className="aside-copy">Add something useful to the shared directory.</p>
          <form onSubmit={handleSubmit}>
            <label>Name<input required maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Project brief" /></label>
            <label>Category<input required maxLength={40} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="e.g. Strategy" /></label>
            <label>Description<textarea required maxLength={240} rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What is this resource for?" /></label>
            <button disabled={saving}>{saving ? "Creating…" : "Create item"}<span>→</span></button>
          </form>
          <div className="api-note"><strong>API ready</strong><code>GET /api/items?q=search</code><code>POST /api/items</code></div>
        </aside>
      </section>
    </main>
  );
}
