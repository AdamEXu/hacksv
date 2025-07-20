"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Lenis from "lenis";

// Animation speed constants (pixels per second)
const CAROUSEL_SPEED = 50;
const QUOTES_SPEED = 50; // Sync with carousel speed

// Consistent cyan color
const CYAN_COLOR = "#00CCFF";

// Virtualized Image Component for memory optimization
interface VirtualizedImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    onLoad?: () => void;
}

function VirtualizedImage({
    src,
    alt,
    width,
    height,
    className,
    onLoad,
}: VirtualizedImageProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Create intersection observer with moderate margins for preloading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoad(true);
                        setIsVisible(true);
                    }
                    // Removed unloading logic completely to prevent vertical scroll issues
                    // Images will stay loaded once they're loaded for better UX
                });
            },
            {
                // Larger horizontal margins, smaller vertical margins
                // Focus on horizontal scrolling, not vertical
                rootMargin: "50% 150%",
                threshold: 0,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    // Disable aggressive unloading - let initial loading observer handle virtualization
    // The initial observer with large horizontal margins is sufficient for memory management
    // Aggressive unloading causes issues with vertical scrolling

    return (
        <div
            ref={elementRef}
            className="flex-shrink-0 h-full relative"
            style={{
                backgroundColor: CYAN_COLOR,
                width: `${width}px`,
                height: `${height}px`,
            }}
        >
            {shouldLoad && (
                // Use regular img tag to bypass Vercel image optimization for CDN images
                <img
                    ref={imageRef}
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                        isVisible ? "opacity-100" : "opacity-0"
                    } ${className || ""}`}
                    onLoad={() => {
                        setHasLoaded(true);
                        onLoad?.();
                    }}
                    loading="lazy"
                    decoding="async"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            )}
        </div>
    );
}

// API functions - simple, no error handling
async function fetchEventList(): Promise<string[]> {
    const response = await fetch("https://cdn.hack.sv/ls.json");
    return await response.json();
}

async function fetchEventImages(eventName: string): Promise<string[]> {
    const response = await fetch(`https://cdn.hack.sv/${eventName}.json`);
    const images = await response.json();
    return images.map((img: string) => `https://cdn.hack.sv${img}`);
}

async function fetchAllImages(): Promise<string[]> {
    const events = await fetchEventList();
    const allImagePromises = events.map((event) => fetchEventImages(event));
    const allImageArrays = await Promise.all(allImagePromises);

    // Flatten all image arrays into one list
    const allImages = allImageArrays.flat();

    // Shuffle the images for randomness
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);

    return shuffled;
}

// Header Component
interface HeaderProps {
    logoY: any;
    logoScale: any;
}

function Header({ logoY, logoScale }: HeaderProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Check for mobile screen size (720px breakpoint)
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 720);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleLogoClick = () => {
        const currentScrollY = window.scrollY;

        // Get the global Lenis instance
        const lenis = (window as any).lenis;

        if (currentScrollY <= 600) {
            // Scroll down past the quote section with Lenis for smooth animation
            if (lenis) {
                lenis.scrollTo(700, {
                    duration: 2,
                    easing: (t: number) => 1 - Math.pow(1 - t, 3),
                });
            } else {
                window.scrollTo({ top: 700, behavior: "smooth" });
            }
        } else {
            // Scroll to top with Lenis
            if (lenis) {
                lenis.scrollTo(0, {
                    duration: 1.5,
                    easing: (t: number) => 1 - Math.pow(1 - t, 3),
                });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Hamburger Icon Component
    const HamburgerIcon = () => (
        <button
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center w-12 h-12 space-y-2 focus:outline-none"
            aria-label="Toggle menu"
        >
            <motion.div
                className="w-8 h-1 bg-white rounded-full"
                animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 12 : 0,
                }}
                transition={{ duration: 0.3 }}
            />
            <motion.div
                className="w-8 h-1 bg-white rounded-full"
                animate={{
                    opacity: isMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
            />
            <motion.div
                className="w-8 h-1 bg-white rounded-full"
                animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? -12 : 0,
                }}
                transition={{ duration: 0.3 }}
            />
        </button>
    );

    return (
        <>
            <header
                style={{ backgroundColor: CYAN_COLOR }}
                className={`sticky top-0 z-50 ${
                    isMobile
                        ? "flex flex-col"
                        : "h-[132px] flex items-center justify-between px-8"
                }`}
            >
                {isMobile ? (
                    <>
                        {/* Mobile Header - Top Row */}
                        <div className="flex items-center justify-between w-full h-[132px] px-6">
                            <HamburgerIcon />
                            {/* Empty div for spacing - logo is positioned absolutely */}
                            <div></div>
                        </div>

                        {/* Mobile Menu - Expanded */}
                        <motion.div
                            initial={false}
                            animate={{
                                height: isMenuOpen ? 240 : 0,
                                opacity: isMenuOpen ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden w-full"
                            style={{ backgroundColor: CYAN_COLOR }}
                        >
                            {isMenuOpen && (
                                <div className="py-4 px-4 flex flex-col space-y-3">
                                    <a
                                        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                        className="text-white text-lg font-bold no-underline transition-all duration-200 py-3 px-4 text-center bg-white/10 rounded-lg border border-white/20 active:bg-white/20"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </a>
                                    <a
                                        href="https://discord.com/invite/32BsffvEf4"
                                        className="text-white text-lg font-bold no-underline transition-all duration-200 py-3 px-4 text-center bg-white/10 rounded-lg border border-white/20 active:bg-white/20"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Discord
                                    </a>
                                    <a
                                        href="https://app.hack.sv/"
                                        className="text-white text-lg font-bold no-underline transition-all duration-200 py-3 px-4 text-center bg-white/10 rounded-lg border border-white/20 active:bg-white/20"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </>
                ) : (
                    <>
                        {/* Desktop Layout - Left side */}
                        <div className="flex items-center space-x-6">
                            <a
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                className="text-white text-xl font-bold no-underline hover:underline transition-all duration-200 px-4 py-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Sign Up
                            </a>
                            <a
                                href="https://discord.com/invite/32BsffvEf4"
                                className="text-white text-xl font-bold no-underline hover:underline transition-all duration-200 px-4 py-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Discord
                            </a>
                        </div>

                        {/* Desktop Layout - Right side */}
                        <div>
                            <a
                                href="https://app.hack.sv/"
                                className="text-white text-xl font-bold no-underline hover:underline transition-all duration-200 px-4 py-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Dashboard
                            </a>
                        </div>
                    </>
                )}
            </header>

            {/* Logo - Always centered and animated */}
            <motion.div
                className="fixed left-1/2 top-0 z-[100]"
                style={{
                    x: "-50%",
                    y: isMobile && isMenuOpen ? 14 : logoY,
                    scale: isMobile && isMenuOpen ? 1 : logoScale,
                    transformOrigin: "center center",
                }}
            >
                <button
                    onClick={handleLogoClick}
                    className="cursor-pointer transition-transform hover:scale-105"
                    aria-label="Scroll to top"
                >
                    <Image
                        src="/logo.svg"
                        alt="hack.sv logo"
                        width={455}
                        height={294}
                        className="w-[160px] h-[103px] object-contain"
                    />
                </button>
            </motion.div>
        </>
    );
}
// Image Grid Component - This represents the main visual area from the Figma
interface ImageGridProps {
    images: string[];
}

function ImageGrid({ images }: ImageGridProps) {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [visibleImagesLoaded, setVisibleImagesLoaded] = useState(0);

    // Calculate how many images should be initially visible based on screen width
    const getInitialVisibleCount = () => {
        if (typeof window === "undefined") return 8; // SSR fallback
        const screenWidth = window.innerWidth;
        const imageWidth = 400;
        const imagesPerRow = Math.ceil(screenWidth / imageWidth);
        // Load 1 row worth + small buffer for smooth scrolling
        return Math.min(imagesPerRow + 2, 8);
    };

    const [targetLoadCount] = useState(() => getInitialVisibleCount());

    useEffect(() => {
        if (images.length === 0) return;

        // Reset when images change
        setVisibleImagesLoaded(0);
        setImagesLoaded(false);

        // Much faster fade in - only wait for visible images
        const timeout = setTimeout(() => {
            setImagesLoaded(true);
        }, 1000); // Reduced to 1 second

        return () => clearTimeout(timeout);
    }, [images]);

    useEffect(() => {
        // Check if enough visible images are loaded (much lower threshold)
        if (
            images.length > 0 &&
            visibleImagesLoaded >= Math.min(targetLoadCount, 4)
        ) {
            setImagesLoaded(true);
        }
    }, [visibleImagesLoaded, targetLoadCount, images.length]);

    const handleImageLoad = useCallback(() => {
        setVisibleImagesLoaded((prev) => prev + 1);
    }, []);

    if (images.length === 0) {
        // Show cyan background placeholder with exact carousel heights
        return (
            <div className="w-full" style={{ backgroundColor: CYAN_COLOR }}>
                <div>
                    <div className="h-[300px]"></div>
                    <div className="h-[300px]"></div>
                </div>
            </div>
        );
    }

    // Split shuffled images into two lists (no repeats between carousels)
    const midpoint = Math.floor(images.length / 2);
    const topCarouselImages = images.slice(0, midpoint);
    const bottomCarouselImages = images.slice(midpoint);

    // Image dimensions (4:3 aspect ratio)
    const imageWidth = 400;
    const imageHeight = 300;

    // Create a single carousel
    const createCarousel = (
        carouselImages: string[],
        direction: "left" | "right",
        isTop: boolean
    ) => {
        if (carouselImages.length === 0) return null;

        // Duplicate images for seamless infinite scroll
        const duplicatedImages = [
            ...carouselImages,
            ...carouselImages,
            ...carouselImages,
        ];

        return (
            <div
                className="overflow-hidden relative"
                style={{ height: `${imageHeight}px` }}
            >
                <motion.div
                    className="flex h-full"
                    animate={{
                        x:
                            direction === "left"
                                ? [-imageWidth * carouselImages.length, 0]
                                : [0, -imageWidth * carouselImages.length],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration:
                                (carouselImages.length * imageWidth) /
                                CAROUSEL_SPEED,
                            ease: "linear",
                        },
                    }}
                    style={{
                        width: `${duplicatedImages.length * imageWidth}px`,
                    }}
                >
                    {duplicatedImages.map((imageUrl, index) => (
                        <VirtualizedImage
                            key={`${imageUrl}-${index}-${
                                isTop ? "top" : "bottom"
                            }`}
                            src={imageUrl}
                            alt={`Event photo ${index + 1}`}
                            width={imageWidth}
                            height={imageHeight}
                            className="object-cover object-center"
                            onLoad={handleImageLoad}
                        />
                    ))}
                </motion.div>
            </div>
        );
    };

    return (
        <div className="w-full" style={{ backgroundColor: CYAN_COLOR }}>
            <motion.div
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: imagesLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Top carousel - scrolling right */}
                {createCarousel(topCarouselImages, "right", true)}

                {/* Bottom carousel - scrolling left */}
                {createCarousel(bottomCarouselImages, "left", false)}
            </motion.div>
        </div>
    );
}

// Quotes Carousel Component
function QuotesCarousel() {
    const [quotes, setQuotes] = useState<string[]>([]);

    useEffect(() => {
        // Load quotes from JSON file
        fetch("/quotes.json")
            .then((response) => response.json())
            .then((data) => setQuotes(data))
            .catch((error) => console.error("Error loading quotes:", error));
    }, []);

    if (quotes.length === 0) {
        // Show cyan placeholder while loading
        return (
            <div className="h-16" style={{ backgroundColor: CYAN_COLOR }}></div>
        );
    }

    // Calculate dynamic widths for each quote (no line wrapping)
    const getQuoteWidth = (quote: string) => {
        // More accurate width calculation - use canvas to measure text
        if (typeof window !== "undefined") {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (context) {
                context.font = "bold 18px system-ui"; // Match the actual font
                const textWidth = context.measureText(`"${quote}"`).width;
                return Math.max(textWidth + 32, 120); // Add padding, minimum 120px
            }
        }
        // Fallback for server-side
        return Math.max(quote.length * 11, 120);
    };

    // Duplicate quotes for seamless loop
    const duplicatedQuotes = [...quotes, ...quotes, ...quotes];

    // Calculate total width for animation
    const totalWidth = duplicatedQuotes.reduce(
        (sum, quote) => sum + getQuoteWidth(quote),
        0
    );

    return (
        <div
            className="h-16 overflow-hidden relative"
            style={{ backgroundColor: CYAN_COLOR }}
        >
            <motion.div
                className="flex items-center h-full"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    x: [-totalWidth / 3, 0], // Move by one set of quotes
                }}
                transition={{
                    opacity: { duration: 0.5 },
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: totalWidth / QUOTES_SPEED,
                        ease: "linear",
                    },
                }}
                style={{
                    width: `${totalWidth}px`,
                }}
            >
                {duplicatedQuotes.map((quote, index) => {
                    const width = getQuoteWidth(quote);
                    return (
                        <div
                            key={`${quote}-${index}`}
                            className="flex-shrink-0 h-full flex items-center justify-center"
                            style={{ width: `${width}px` }}
                        >
                            <span className="text-white text-lg font-bold whitespace-nowrap">
                                "{quote}"
                            </span>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}

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
        </div>
    );
}
