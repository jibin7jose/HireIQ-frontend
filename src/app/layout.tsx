import type { Metadata } from "next";
import "./globals.css";
import GlobalNavigation from "@/components/shared/GlobalNavigation";
import GlobalFooter from "@/components/shared/GlobalFooter";

export const metadata: Metadata = {
  title: "CareerConnect AI – Find Jobs Matched by AI",
  description:
    "AI-powered job matching platform connecting talent with top employers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <GlobalNavigation />
        <main style={{ flex: 1 }}>{children}</main>
        <GlobalFooter />
      </body>
    </html>
  );
}
