import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import { Header, Footer } from "@components/index";
import { constants } from "@lib/constants";
import FavIcon from "@app/favicon.ico";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: constants.app.name,
  description: constants.app.caption,
  icons: {
    icon: FavIcon.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen ">
          <Header />
          <main>{children}</main>
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  );
}
