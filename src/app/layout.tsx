import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hook/useAuth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300"],
});

export const metadata: Metadata = {
  title: "Chatbot AI",
  description: "Chatbot AI adalah platform sistem informasi digital yang pintar",
  keywords: [
    "Chatbot AI",
    "Chatbot",
    "AI",
    "Platform",
    "Informasi",
    "Digital",
    "Sistem",
    "Intelligent",
  ],
  authors: [{ name: "Chatbot AI", url: "https://chatbot.ai" }],
  creator: "Chatbot AI",
  publisher: "Chatbot AI",
  openGraph: {
    title: "Chatbot AI",
    description: "Chatbot AI adalah platform sistem informasi digital yang pintar",
    url: "https://chatbot.ai",
    siteName: "Chatbot AI",
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
    <html lang="en">
      <body
        className={`${poppins.className} antialiased h-screen w-screen bg-[url('/background.jpg')] bg-cover bg-center overflow-x-hidden`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
