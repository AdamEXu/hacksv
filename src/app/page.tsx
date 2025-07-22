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
                    About hack.sv
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum. Sed
                    ut perspiciatis unde omnis iste natus error sit voluptatem
                    accusantium doloremque laudantium, totam rem aperiam, eaque
                    ipsa quae ab illo inventore veritatis et quasi architecto
                    beatae vitae dicta sunt explicabo.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Our Mission
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                    odit aut fugit, sed quia consequuntur magni dolores eos qui
                    ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                    qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                    velit, sed quia non numquam eius modi tempora incidunt ut
                    labore et dolore magnam aliquam quaerat voluptatem.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Ut enim ad minima veniam, quis nostrum exercitationem ullam
                    corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                    consequatur? Quis autem vel eum iure reprehenderit qui in ea
                    voluptate velit esse quam nihil molestiae consequatur, vel
                    illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Community
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    At vero eos et accusamus et iusto odio dignissimos ducimus
                    qui blanditiis praesentium voluptatum deleniti atque
                    corrupti quos dolores et quas molestias excepturi sint
                    occaecati cupiditate non provident, similique sunt in culpa
                    qui officia deserunt mollitia animi, id est laborum et
                    dolorum fuga.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Et harum quidem rerum facilis est et expedita distinctio.
                    Nam libero tempore, cum soluta nobis est eligendi optio
                    cumque nihil impedit quo minus id quod maxime placeat facere
                    possimus, omnis voluptas assumenda est, omnis dolor
                    repellendus.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Events
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Temporibus autem quibusdam et aut officiis debitis aut rerum
                    necessitatibus saepe eveniet ut et voluptates repudiandae
                    sint et molestiae non recusandae. Itaque earum rerum hic
                    tenetur a sapiente delectus, ut aut reiciendis voluptatibus
                    maiores alias consequatur aut perferendis doloribus
                    asperiores repellat.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
                    Get Involved
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum. Sed
                    ut perspiciatis unde omnis iste natus error sit voluptatem
                    accusantium doloremque laudantium, totam rem aperiam, eaque
                    ipsa quae ab illo inventore veritatis et quasi architecto
                    beatae vitae dicta sunt explicabo.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                    odit aut fugit, sed quia consequuntur magni dolores eos qui
                    ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                    qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                    velit, sed quia non numquam eius modi tempora incidunt ut
                    labore et dolore magnam aliquam quaerat voluptatem.
                </p>
                <div className="h-32"></div> {/* Extra space at bottom */}
            </div>
            <SignUpForm />
        </div>
    );
}
