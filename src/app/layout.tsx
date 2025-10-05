import type { Metadata } from "next";
import { Overpass, Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";

const overpass = Overpass({
  subsets: ["latin"],
  variable: "--font-overpass",
  weight: ["300", "400", "600", "700"], // light/regular/semibold/bold
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  variable: "--font-fira-sans",
  weight: ["400", "700"],
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "BlooMap • Space Apps",
  description: "Mapa e Painéis seguindo a identidade Space Apps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${overpass.variable} ${firaSans.variable} ${firaCode.variable} font-sans brand-bg`}
      >
        {children}
      </body>
    </html>
  );
}
