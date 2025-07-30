import "./globals.css";
import type { Metadata } from "next";
import { Barlow_Condensed, VT323 } from "next/font/google";

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
    title: "hack.sv",
    description:
        "hack.sv is a hackathon in Silicon Valley happening soon! More information coming soon.",
    openGraph: {
        title: "hack.sv",
        description:
            "hack.sv is a hackathon in Silicon Valley happening soon! More information coming soon.",
        url: "https://hack.sv",
        siteName: "hack.sv",
        images: [
            {
                url: "https://hack.sv/DBA_Large.png",
                width: 1200,
                height: 630,
                alt: "hack.sv",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "hack.sv",
        description:
            "hack.sv is a hackathon in Silicon Valley happening soon! More information coming soon.",
        images: ["https://hack.sv/DBA_Large.png"],
    },
    metadataBase: new URL("https://hack.sv"),
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
                <meta name="theme-color" content="#00CCFF" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
            </head>
            <body
                className={`${barlowCondensed.variable} ${vt323.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
