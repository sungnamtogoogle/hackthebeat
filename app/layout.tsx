import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "네모네모 맵",
  description:
    "행사장 도면을 블록으로 그리고, 참가자는 QR 하나로 주문하는 파티 지도",
};

// Camera Plain Variable(design.md)은 배포되지 않는 폰트라 같은 인상의
// Pretendard Variable로 대체한다. 크기·굵기·자간 규칙은 design.md를 따른다.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
