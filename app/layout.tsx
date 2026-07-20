import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const xVF = Inter({
  variable: "--font-xvf",
  subsets: ["latin"],
});

const xVFDisplay = Inter_Tight({
  variable: "--font-xvf-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Weave",
    template: "%s — Weave",
  },
  description:
    "Follow repositories, share what you ship, and discover open-source projects through the people building them.",
  icons: {
    icon: "/weave-logo-mark.svg",
    shortcut: "/weave-logo-mark.svg",
  },
  openGraph: {
    title: "Weave",
    description: "GitHub has repositories. Weave gives them a pulse.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Weave — Open source, in motion.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weave",
    description: "GitHub has repositories. Weave gives them a pulse.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${xVF.variable} ${xVFDisplay.variable}`}>
        {children}
      </body>
    </html>
  );
}
