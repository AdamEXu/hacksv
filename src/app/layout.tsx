import type { Metadata } from "next";
import { Barlow_Condensed, VT323 } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
    variable: "--font-barlow-condensed",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const vt323 = VT323({
    variable: "--font-vt323",
    subsets: ["latin"],
    weight: ["400"],
});

export const metadata: Metadata = {
    title: "HackSV",
    description: "HackSV Countdown",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta name="apple-mobile-web-app-title" content="hack.sv" />
            </head>
            <body
                className={`${barlowCondensed.variable} ${vt323.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
