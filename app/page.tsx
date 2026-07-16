"use client";

import { FormEvent, useState } from "react";

type UploadResult = {
  image_id: string;
  permalink_url: string;
  url: string;
};

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Please choose an image first.");
      return;
    }

    setUploading(true);
    setError("");
    setResult(null);

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

      setResult(data);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <header className="header">
          <div className="logo">↑</div>
          <div>
            <h1>Upload an image</h1>
            <p>Choose one image, upload it to Gyazo, and view the result.</p>
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

        {result && (
          <section className="result">
            <div className="resultHeader">
              <div>
                <small>UPLOAD COMPLETE</small>
                <h2>Your image</h2>
              </div>
              <a href={result.permalink_url} target="_blank" rel="noreferrer">
                View on Gyazo ↗
              </a>
            </div>
            <div className="imageFrame">
              <img src={result.url} alt="Uploaded to Gyazo" />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
