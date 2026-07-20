import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const siteUrl = "https://weave.krishang.dev";
const socialTitle = "Weave — Follow, Share, and Discover GitHub Repositories";

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
    default: socialTitle,
    template: "%s — Weave",
  },
  description:
    "Follow repositories, share what you ship, and discover open-source projects through the people building them.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/weave-logo-mark.svg",
    shortcut: "/weave-logo-mark.svg",
  },
  openGraph: {
    title: socialTitle,
    description: "GitHub has repositories. Weave gives them a pulse.",
    type: "website",
    url: siteUrl,
    siteName: "Weave",
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "Weave — Instagram, but for GitHub repositories.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: "GitHub has repositories. Weave gives them a pulse.",
    images: [`${siteUrl}/og.png`],
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
