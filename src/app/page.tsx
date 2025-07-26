"use client";

import { useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { Header } from "./components/Header";
import { ImageGrid } from "./components/ImageGrid";
import { QuotesCarousel } from "./components/QuotesCarousel";
import { fetchAllImages } from "./api/imageApi";
import { SignUpForm } from "./components/SignUpForm";

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
    const [isClient, setIsClient] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Ensure client-side rendering to avoid hydration mismatch
    useEffect(() => {
        setIsClient(true);
        // Check if mobile device (720px breakpoint)
        setIsMobile(window.innerWidth < 720);

        const handleResize = () => {
            setIsMobile(window.innerWidth < 720);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Transform scroll progress to logo position and scale
    const startY = isClient ? window.innerHeight / 2 - 96 : 366; // Use consistent fallback
    const maxScale = isMobile ? 2 : 3; // 2x on mobile, 3x on desktop

    // Safari-compatible transforms
    const logoY = useTransform(scrollY, [0, 600], [startY, 14]);
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
            <Header logoY={logoY} logoScale={logoScale} />

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
                The theme of hack.sv is to build real-world AI applications on hardware devices, using only local inference and no reliance on cloud services. Attendees will need to optimize their projects to run completely offline on limited hardware, mimicking real-world constraints. We are the first real AI inference hackathon for high schoolers.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                We aim to teach real world skills that are important in the AI era, empowering attendees to build something they're truly proud of and would share with their friends and family.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Our Mission
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to allow attendees to walk out of hack.sv knowing they've built something meaningful, not just another fragile ChatGPT wrapper with a fancy UI.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                At many hackathons, recorded demos, mock ups, and slideshows overshadow technical achievement. At hack.sv, we would like to reward innovative concepts that actually work.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Previous Events
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    We've run multiple hackathons in the past, including a game jam called Counterspell and another hardware hackathon called Scrapyard.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Get Involved
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    We are not accepting new organizers for hack.sv at the moment, but we welcome and appreciate day-of volenteers and parents who are interested in helping out.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    
                </p>
                <div className="h-32"></div> {/* Extra space at bottom */}
            </div>
            <SignUpForm />
        </div>
    );
}
