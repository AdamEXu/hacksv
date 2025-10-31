"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { Header } from "./components/Header";
import { ImageGrid } from "./components/ImageGrid";
import { QuotesCarousel } from "./components/QuotesCarousel";
import { fetchAllImages } from "./api/imageApi";
import Countdown from "./components/Countdown";
import { Sponsors } from "./components/Sponsors";
import { Footer } from "./components/Footer";

export default function Home() {
    const [allImages, setAllImages] = useState<string[]>([]);

    // Initialize Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.5,
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

    // Framer Motion scroll animation for logo
    const { scrollY } = useScroll();
    const [logoReady, setLogoReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [startY, setStartY] = useState(366); // Default fallback
    const [maxScale, setMaxScale] = useState(3); // Default fallback

    // Use layoutEffect for synchronous DOM measurements to prevent flash
    useLayoutEffect(() => {
        // Calculate initial position immediately
        const viewportHeight = window.innerHeight;
        const calculatedStartY = viewportHeight / 2 - 96;
        const isMobileDevice = window.innerWidth < 720;

        // Set CSS custom properties for immediate positioning
        document.documentElement.style.setProperty(
            "--logo-start-y",
            `${calculatedStartY}px`
        );
        document.documentElement.style.setProperty(
            "--logo-max-scale",
            isMobileDevice ? "2" : "3"
        );

        setStartY(calculatedStartY);
        setIsMobile(isMobileDevice);
        setMaxScale(isMobileDevice ? 2 : 3);
        setLogoReady(true);

        const handleResize = () => {
            const newIsMobile = window.innerWidth < 720;
            const newStartY = window.innerHeight / 2 - 96;

            // Update CSS custom properties
            document.documentElement.style.setProperty(
                "--logo-start-y",
                `${newStartY}px`
            );
            document.documentElement.style.setProperty(
                "--logo-max-scale",
                newIsMobile ? "2" : "3"
            );

            setIsMobile(newIsMobile);
            setMaxScale(newIsMobile ? 2 : 3);
            setStartY(newStartY);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Safari-compatible transforms
    const logoY = useTransform(scrollY, [0, 600], [startY, 15]);
    const logoScale = useTransform(scrollY, [0, 600], [maxScale, 1]);

    useEffect(() => {
        async function loadImages() {
            try {
                const images = await fetchAllImages();
                setAllImages(images);
            } catch (error) {
                // If error, just don't show images (empty array)
                console.error("Failed to load images:", error);
                setAllImages([]);
            }
        }

        loadImages();
    }, []);

    // Handle hash navigation to sign-up form
    useEffect(() => {
        if (window.location.hash === "#sign-up") {
            // Wait a bit for the page to fully load and Lenis to initialize
            setTimeout(() => {
                const signUpElement = document.getElementById("sign-up");
                if (signUpElement) {
                    const lenis = (window as any).lenis;
                    if (lenis) {
                        lenis.scrollTo(signUpElement, {
                            duration: 1.5,
                            easing: (t: number) => 1 - Math.pow(1 - t, 3),
                        });
                    } else {
                        signUpElement.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }, 500); // 500ms delay to ensure everything is loaded
        }
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header
                logoY={logoY}
                logoScale={logoScale}
                logoReady={logoReady}
                isMobile={isMobile}
            />

            {/* Main Image Grid - Cyan background while loading, then images fade in */}
            <ImageGrid images={allImages} />

            {/* Quotes Carousel */}
            <QuotesCarousel />

            <div className="max-w-4xl mx-auto px-8 py-16 space-y-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                    hack.sv
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    More info coming soon! I wonder if the countdown below has anything to do with it...
                </p>
                <Countdown />
                <p>Any questions? Email us at <a href="mailto:team@hack.sv" data-text="team@hack.sv">team@hack.sv</a> and we'll get back to you as soon as possible.
                </p>
            </div>
            <Sponsors />
            <div className="max-w-4xl mx-auto px-8 py-16 space-y-8">
                <p>Don't forget to join our Discord! <a href="https://discord.com/invite/32BsffvEf4" target="_blank" rel="noopener noreferrer" data-text="Invite Link">Invite Link</a></p>
            </div>
            <Footer />
        </div>
    );
}
