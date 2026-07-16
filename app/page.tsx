"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type UploadResult = {
  image_id: string;
  permalink_url: string;
  thumb_url?: string;
  url: string;
  created_at?: string;
};

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/images", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load images.");
      }

      setUploads(data.images ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load images.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Please choose an image first.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      setFile(null);
      await loadImages();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="page">
      <section className="workspace">
        <aside className="galleryPanel">
          <div className="galleryHeader">
            <div>
              <span className="eyebrow">SHARED GALLERY</span>
              <h2>All images</h2>
            </div>
            <span className="count">{uploads.length}</span>
          </div>

          {loading ? (
            <div className="emptyState"><p>Loading images...</p></div>
          ) : uploads.length === 0 ? (
            <div className="emptyState">
              <span>□</span>
              <p>Images uploaded through this app will appear here for everyone.</p>
            </div>
          ) : (
            <div className="galleryGrid">
              {uploads.map((upload) => (
                <a
                  className="galleryItem"
                  href={upload.permalink_url}
                  target="_blank"
                  rel="noreferrer"
                  key={upload.image_id}
                  title="View on Gyazo"
                >
                  <img src={upload.thumb_url || upload.url} alt="Uploaded image" />
                </a>
              ))}
            </div>
          )}
        </aside>

        <section className="panel">
          <header className="header">
            <div className="logo">↑</div>
            <div>
              <h1>Upload an image</h1>
              <p>Uploads are saved to the shared Gyazo account and appear for every visitor.</p>
            </div>
          </header>

          <form onSubmit={handleSubmit}>
            <label className="fileBox" htmlFor="image">
              <span className="fileIcon">＋</span>
              <strong>{file ? file.name : "Choose an image"}</strong>
              <small>{file ? "Ready to upload" : "PNG, JPG, GIF, or WebP"}</small>
            </label>

            <input
              id="image"
              className="fileInput"
              type="file"
              accept="image/*"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setError("");
              }}
            />

            <button type="submit" disabled={uploading || !file}>
              {uploading ? "Uploading..." : "Upload image"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          {uploads[0] && (
            <section className="result">
              <div className="resultHeader">
                <div>
                  <small>LATEST UPLOAD</small>
                  <h2>Newest image</h2>
                </div>
                <a href={uploads[0].permalink_url} target="_blank" rel="noreferrer">
                  View on Gyazo ↗
                </a>
              </div>
              <div className="imageFrame">
                <img src={uploads[0].url} alt="Latest uploaded image" />
              </div>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}
