export const dynamic = "force-static";

export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#171412"/><path d="M18 42h28v6H18z" fill="#f3ca69"/><path d="M21 15l17 17-17 17-4-4 13-13-13-13z" fill="#e23d28"/></svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

