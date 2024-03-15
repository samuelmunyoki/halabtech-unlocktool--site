import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import cn from "classnames";

const jost = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Unlock tool",
  description: "Unlock Tool - Ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          jost.className,
          "w-screen min-h-screen flex flex-col overflow-x-hidden"
        )}
      >
        <div className="absolute flex justify-end w-full top-40 -rotate-6 md:top-10 pr-6 blur-[150px] -z-30 overflow-hidden">
          <img
            src="/svgs/hero-bg.png"
            alt="BG"
            className="object-contain w-[590px] md:w-[55vw] "
          ></img>
        </div>

        {children}
      </body>
    </html>
  );
}
