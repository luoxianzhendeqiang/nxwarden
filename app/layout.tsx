import type { Metadata } from "next";
import "./globals.css";
import "./visual-system.css";

export const metadata: Metadata = {
  title: "NX Warden — Cloud Automation & Operations Studio",
  description:
    "Practical operations services and local-first software for independent developers, solo founders, founder-led micro-SaaS operators, and small technical teams.",
  applicationName: "NX Warden",
  metadataBase: new URL("https://nxwarden.com"),
  openGraph: {
    type: "website",
    siteName: "NX Warden",
    title: "NX Warden — Cloud Automation & Operations Studio",
    description:
      "Practical operations services and local-first software for independent developers, solo founders, founder-led micro-SaaS operators, and small technical teams.",
    images: ["/assets/nxwarden-orbit-field.png"],
    url: "https://nxwarden.com/"
  },
  twitter: {
    card: "summary_large_image",
    title: "NX Warden — Cloud Automation & Operations Studio",
    description:
      "Practical operations services and local-first software for independent developers, solo founders, founder-led micro-SaaS operators, and small technical teams.",
    images: ["/assets/nxwarden-orbit-field.png"]
  },
  icons: {
    icon: [
      {
        url: "/assets/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png"
      },
      {
        url: "/assets/nxwarden-icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    apple: "/assets/apple-touch-icon.png"
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NX Warden",
  legalName: "NexusWarden Technology LLC",
  url: "https://nxwarden.com/",
  logo: "https://nxwarden.com/assets/nxwarden-icon-512.png",
  email: "ceo@nxwarden.com",
  description:
    "Practical operations services and local-first software for independent developers, solo founders, founder-led micro-SaaS operators, and small technical teams."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
