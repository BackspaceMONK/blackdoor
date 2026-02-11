import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlackDoor - Home of Fraud",
  description: "Premium cryptocurrency accounts and services marketplace",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
