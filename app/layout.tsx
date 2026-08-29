import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Hack the Beat",
  description: "A party-first alumni gathering service backed by Supabase Postgres.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

