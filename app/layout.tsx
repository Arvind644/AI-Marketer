import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI Marketer",
  description: "Create stunning marketing visuals and social media content with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col"
      >
        <Header />
        <main className="flex-grow bg-gadient-to-b from-gray-50 to-gray-100">
         {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
