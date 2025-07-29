"use client";

import { useEffect, useState } from "react";
import { useMotionValue } from "framer-motion";
import Lenis from "lenis";
import { Header } from "./Header";
import { DocumentRenderer } from "./DocumentRenderer";
import { Footer } from "./Footer";
import { CYAN_COLOR } from "../constants";

interface DocumentPageProps {
    markdownFile: string; // e.g., "/PRIVACY.md" or "/CONDUCT.md"
    scrollPaddingTop?: string; // Optional custom scroll padding
}

export function DocumentPage({ markdownFile, scrollPaddingTop }: DocumentPageProps) {
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
        fetch(markdownFile)
            .then((response) => response.text())
            .then((text) => setMarkdownContent(text))
            .catch((error) => console.error(`Error loading ${markdownFile}:`, error));
    }, [markdownFile]);

    // Fixed logo position at top (no scroll animation)
    const logoY = useMotionValue(15); // Fixed at top position
    const logoScale = useMotionValue(1); // Fixed at normal scale

    return (
        <div 
            className="min-h-screen" 
            style={{ 
                backgroundColor: CYAN_COLOR,
                scrollPaddingTop: scrollPaddingTop || "0px"
            }}
        >
            {/* Header with fixed logo position */}
            <Header
                logoY={logoY}
                logoScale={logoScale}
                logoReady={true}
                isMobile={false}
            />

            {/* Cyan placeholder - only shows when loading */}
            {!markdownContent && <div className="h-screen" />}

            {/* Document Renderer with fade-in */}
            <div
                className="transition-opacity duration-500"
                style={{ opacity: markdownContent ? 1 : 0 }}
            >
                <DocumentRenderer markdown={markdownContent} />
                
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
