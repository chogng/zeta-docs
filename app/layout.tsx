import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const isLoopback = /^(localhost|127\.0\.0\.1|\[::1\])(?::|$)/.test(host);
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (isLoopback ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "Zeta 文档",
      template: "%s · Zeta 文档",
    },
    description: "学习如何使用、配置和扩展 Zeta。",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "Zeta 文档",
      description: "使用 · 配置 · 扩展",
      images: [{ url: "/og.png", width: 1731, height: 909, alt: "Zeta 文档" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Zeta 文档",
      description: "使用 · 配置 · 扩展",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
