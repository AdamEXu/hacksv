"use client";

import { useEffect, useState } from "react";
import { useMotionValue } from "framer-motion";
import Lenis from "lenis";
import { Header } from "../components/Header";
import { DocumentRenderer } from "../components/DocumentRenderer";

export default function PrivacyPolicy() {
    const [markdownContent, setMarkdownContent] = useState<string>("");

    // Initialize Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Light easing
            infinite: false,
        });

        // Make Lenis globally available
        (window as any).lenis = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            delete (window as any).lenis;
        };
    }, []);

    // Load markdown content
    useEffect(() => {
        fetch("/PRIVACY.md")
            .then((response) => response.text())
            .then((text) => setMarkdownContent(text))
            .catch((error) => console.error("Error loading markdown:", error));
    }, []);

    // Fixed logo position at top (no scroll animation)
    const logoY = useMotionValue(15); // Fixed at top position
    const logoScale = useMotionValue(1); // Fixed at normal scale

    if (!markdownContent) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header with fixed logo position */}
            <Header
                logoY={logoY}
                logoScale={logoScale}
                logoReady={true}
                isMobile={false}
            />

            {/* Document Renderer */}
            <DocumentRenderer markdown={markdownContent} />
        </div>
    );
}
