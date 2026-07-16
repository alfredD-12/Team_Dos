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
        <h1>Image Upload</h1>
        <p className="intro">Choose an image and upload it to Gyazo.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload image"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {result && (
          <section className="result">
            <h2>Uploaded image</h2>
            <img src={result.url} alt="Uploaded to Gyazo" />
            <a href={result.permalink_url} target="_blank" rel="noreferrer">
              View on Gyazo
            </a>
          </section>
        )}
      </section>
    </main>
  );
}
