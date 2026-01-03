import type { Metadata } from "next";
import { Comic_Neue } from "next/font/google";
import "./globals.css";

const comicNeue = Comic_Neue({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: "--font-comic",
});

export const metadata: Metadata = {
  title: "Matemática para Cecília - Gerador de Exercícios",
  description: "Gerador personalizado de exercícios de matemática com IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="vibrant">
      <body className={`${comicNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
