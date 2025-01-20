import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QuizProvider } from "@/useContext/useContext";
import "./globals.css";


export const metadata: Metadata = {
  title: "Quiz App",
  description: "Made with Next.js for quiz app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}
