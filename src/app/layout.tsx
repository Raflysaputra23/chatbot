import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hook/useAuth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PIKO - Pusat Informasi Konseling dan Obrolan",
  description: "PIKO adalah AI asisten cerdas yang ramah, siap membantu konseling dan obrolan sehari-hari.",
  keywords: [
    "PIKO",
    "AI",
    "Chatbot",
    "Konseling",
    "Pusat Informasi",
    "Obrolan",
    "Gemini",
    "Asisten Pintar",
  ],
  authors: [{ name: "Raynard Almer Fabrizio", url: "https://instagram.com/raynardalmer" }],
  creator: "Raynard Almer Fabrizio",
  publisher: "PIKO AI",
  openGraph: {
    title: "PIKO - Pusat Informasi Konseling dan Obrolan",
    description: "PIKO adalah AI asisten cerdas yang ramah, siap membantu konseling dan obrolan sehari-hari.",
    siteName: "PIKO AI",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${poppins.variable} antialiased h-screen w-screen overflow-x-hidden`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
