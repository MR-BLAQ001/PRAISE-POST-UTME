import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PRAISE POST UTME — Nigerian CBT Practice & Exam Platform",
    template: "%s · PRAISE POST UTME"
  },
  description:
    "Prepare for Nigerian POST-UTME examinations with realistic CBT simulations, 800+ explained practice questions across 16 subjects, performance analytics, leaderboards and university guidance.",
  keywords: [
    "POST UTME",
    "JAMB",
    "Nigerian universities",
    "CBT practice",
    "POST UTME past questions",
    "PRAISE POST UTME",
    "UTME preparation",
    "Nigerian education"
  ],
  authors: [{ name: "PRAISE POST UTME" }],
  creator: "PRAISE POST UTME",
  applicationName: "PRAISE POST UTME",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PRAISE POST UTME"
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "PRAISE POST UTME",
    title: "PRAISE POST UTME — Nigerian CBT Practice & Exam Platform",
    description:
      "Realistic POST-UTME CBT simulations, 800+ explained practice questions and performance tracking for Nigerian students.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PRAISE POST UTME" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "PRAISE POST UTME",
    description:
      "Realistic POST-UTME CBT practice for Nigerian students. 800+ questions. 16 subjects. Track your progress.",
    images: ["/og-image.png"]
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05081a" },
    { media: "(prefers-color-scheme: light)", color: "#f4f7fd" }
  ]
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('ppu.v1.theme');
    var theme = stored === '"light"' ? 'light' : 'dark';
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <ServiceWorkerRegistration />
          {children}
        </Providers>
      </body>
    </html>
  );
}
