import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NX Warden",
  description:
    "NX Warden builds calm infrastructure systems, media automation, monitoring, and resilient personal cloud operations.",
  metadataBase: new URL("https://nxwarden.com"),
  openGraph: {
    type: "website",
    title: "NX Warden",
    description:
      "A luminous company page for personal cloud systems, automation pipelines, monitoring, and AI workflows.",
    images: ["/assets/blackhole-hero.png"],
    url: "https://nxwarden.com/"
  },
  twitter: {
    card: "summary_large_image",
    title: "NX Warden",
    description:
      "A luminous company page for personal cloud systems, automation pipelines, monitoring, and AI workflows.",
    images: ["/assets/blackhole-hero.png"]
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/assets/nxwarden-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
