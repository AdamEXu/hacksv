"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { Header } from "./components/Header";
import { ImageGrid } from "./components/ImageGrid";
import { QuotesCarousel } from "./components/QuotesCarousel";
import { fetchAllImages } from "./api/imageApi";
import { SignUpForm } from "./components/SignUpForm";
import { Footer } from "./components/Footer";

export default function Home() {
    const [allImages, setAllImages] = useState<string[]>([]);

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

            {/* Lorem Ipsum Content for Testing Scroll */}
            <div className="max-w-4xl mx-auto px-8 py-16 space-y-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                    What is hack.sv
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    The theme of hack.sv is to build real-world AI applications
                    on hardware devices, using only local inference and no
                    reliance on cloud services. Attendees will need to optimize
                    their projects to run completely offline on limited
                    hardware, mimicking real-world constraints. We are the first
                    real AI inference hackathon for high schoolers.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    We aim to teach real world skills that are important in the
                    AI era, empowering attendees to build something they're
                    truly proud of and would share with their friends and
                    family.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Our Mission
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Our mission is to allow attendees to walk out of hack.sv
                    knowing they've built something meaningful, not just another
                    fragile ChatGPT wrapper with a fancy UI.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    At many hackathons, recorded demos, mock ups, and slideshows
                    overshadow technical achievement. At hack.sv, we would like
                    to reward innovative concepts that actually work.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Previous Events
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    We've run multiple hackathons in the past, including a game
                    jam called Counterspell and another hardware hackathon
                    called Scrapyard.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Sponsors
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    <a
                        href="https://www.jukeboxprint.com/custom-stickers"
                        target="_blank"
                        data-text="Big shoutout to Jukebox for sponsoring custom stickers at hack.sv! Check them out by clicking here!"
                    >
                        Big shoutout to Jukebox for sponsoring custom stickers
                        at hack.sv! Check them out by clicking here!
                    </a>
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Sign Up Now!
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    We haven't opened sign ups quite yet. But fill out our
                    interest form to be the first to know when sign ups do open
                    and more information about hack.sv is available. You can
                    also join our Discord server to stay up to date.
                </p>
                {/* <p className="text-lg text-gray-700 leading-relaxed"></p> */}
                {/* <div className="h-32"></div> Extra space at bottom */}
            </div>
            <SignUpForm />
            <Footer />
        </div>
    );
}
