"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HeaderProps } from "../types";
import { CYAN_COLOR } from "../constants";

// Header Component
export function Header({ logoY, logoScale }: HeaderProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

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
        if (pathname !== "/") {
            // If not on home page, navigate to home page
            window.location.href = "/";
            return;
        }

        // If on home page, handle scroll behavior
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

    const handleSignUpClick = () => {
        if (pathname === "/") {
            // If on home page, smooth scroll to sign-up form
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
        } else {
            // If on other pages, redirect to home page with hash
            window.location.href = "/#sign-up";
        }

        // Close mobile menu if open
        setIsMenuOpen(false);
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
                                    <button
                                        onClick={handleSignUpClick}
                                        className="text-white text-lg font-bold no-underline transition-all duration-200 py-3 px-4 text-center bg-white/10 rounded-lg border border-white/20 active:bg-white/20"
                                    >
                                        Sign Up
                                    </button>
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
                            <button
                                onClick={handleSignUpClick}
                                className="text-white text-xl font-bold no-underline hover:underline transition-all duration-200 px-4 py-2"
                            >
                                Sign Up
                            </button>
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
