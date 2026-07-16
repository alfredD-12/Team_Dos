import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Dos Directory",
  description: "A simple searchable directory with a lightweight API.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
