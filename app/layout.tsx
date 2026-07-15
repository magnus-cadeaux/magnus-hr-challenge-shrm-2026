import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/providers";
import { fontVariables } from "@/lib/fonts";
import { APP_NAME, APP_TAGLINE, EVENT_NAME } from "@/lib/constants";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} · ${EVENT_NAME}`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_TAGLINE,
  applicationName: APP_NAME,
  authors: [{ name: "Magnus" }],
  keywords: [
    "Magnus HR Challenge",
    "SHRM Hyderabad 2026",
    "HR leadership",
    "exhibition experience",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${fontVariables} min-h-dvh font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
