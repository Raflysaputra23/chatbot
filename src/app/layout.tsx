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
  children,
  aside
}: Readonly<{
  children: React.ReactNode;
  aside: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased h-screen bg-slate-50 overflow-hidden grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-3 p-3`}
      >
        <AuthProvider>
          {aside}
          <div className="h-full rounded-md bg-slate-300 shadow-md flex flex-col p-3 lg:px-20 overflow-hidden">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
