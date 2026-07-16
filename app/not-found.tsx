export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ letterSpacing: ".18em", fontWeight: 800 }}>404</p>
        <h1 style={{ fontSize: 48, margin: "12px 0" }}>Page not found</h1>
        <a href="/" style={{ textDecoration: "underline" }}>Return to the directory</a>
      </div>
    </main>
  );
}
