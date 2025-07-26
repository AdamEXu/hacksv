"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";
import Lenis from "lenis";
import { Header } from "../components/Header";
import { CYAN_COLOR } from "../constants";

export default function PrivacyPage() {
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

    // Fixed logo position at top (no scroll animation)
    const logoY = useMotionValue(14); // Fixed at top position
    const logoScale = useMotionValue(1); // Fixed at normal scale

    return (
        <div className="min-h-screen bg-white">
            {/* Header with fixed logo position */}
            <Header
                logoY={logoY}
                logoScale={logoScale}
                logoReady={true}
                isMobile={false}
            />

            {/* Main Content - Styled like main page */}
            <div className="w-full" style={{ backgroundColor: CYAN_COLOR }}>
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Privacy Policy Content */}
                    <h1
                        className="text-center text-white mb-12"
                        style={{
                            fontFamily: "VT323, monospace",
                            fontSize: "48px",
                            lineHeight: "1.2",
                        }}
                    >
                        Privacy Policy
                    </h1>

                    <div
                        className="bg-white rounded-lg p-8 mb-8"
                        style={{ border: "4px solid black" }}
                    >
                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <strong className="font-semibold text-black">
                                Effective Date:
                            </strong>{" "}
                            July 17, 2025{" "}
                            <strong className="font-semibold text-black">
                                Last Updated:
                            </strong>{" "}
                            July 17, 2025
                        </p>

                        {/* Overview Section */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Overview
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            hack.sv ("we," "our," or "us") is a nonprofit
                            organization dedicated to running educational
                            hackathons and programs for students under 18. We
                            respect your privacy and give you control over your
                            personal information. This Privacy Policy applies to
                            all hack.sv services and platforms, including:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-2 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li className="ml-2">
                                Our website (
                                <a
                                    href="https://hack.sv"
                                    className="text-black hover:opacity-70 underline font-semibold"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontFamily:
                                            "Barlow Condensed, sans-serif",
                                        textDecorationColor: "#00CCFF",
                                    }}
                                >
                                    https://hack.sv
                                </a>
                                ) and all its subdomains (e.g.,
                                dashboard.hack.sv, id.hack.sv)
                            </li>
                            <li className="ml-2">
                                Event registration and participation
                            </li>
                            <li className="ml-2">
                                Communications (emails, newsletters,
                                announcements)
                            </li>
                            <li className="ml-2">
                                Social and community platforms (e.g., Discord)
                            </li>
                        </ul>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            hack.sv is an ongoing program that hosts recurring
                            hackathons and related events. Your account can be
                            used across multiple events and remains active
                            unless deleted.
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            By creating an account, registering for an event, or
                            participating in our programs, you agree to the
                            terms of this Privacy Policy.
                        </p>

                        {/* Data Controller Section */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Data Controller
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <strong className="font-semibold text-black">
                                hack.sv
                            </strong>{" "}
                            is fiscally sponsored by{" "}
                            <strong className="font-semibold text-black">
                                The Hack Foundation (d.b.a. Hack Club)
                            </strong>
                            , a 501(c)(3) nonprofit organization (EIN:
                            81-2908499).
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <strong className="font-semibold text-black">
                                Contact:
                            </strong>{" "}
                            contact@hack.sv{" "}
                            <strong className="font-semibold text-black">
                                Website:
                            </strong>{" "}
                            <a
                                href="https://hack.sv"
                                className="text-black hover:opacity-70 underline font-semibold"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    textDecorationColor: "#00CCFF",
                                }}
                            >
                                https://hack.sv
                            </a>
                        </p>

                        {/* Information We Collect Section */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Information We Collect
                        </h2>

                        <h3
                            className="text-black mt-8 mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "22px",
                                fontWeight: "600",
                            }}
                        >
                            1. Website Visitors
                        </h3>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            When you visit our website, we may collect:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-2 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li className="ml-2">IP address</li>
                            <li className="ml-2">
                                Browser & device information
                            </li>
                            <li className="ml-2">
                                Pages visited & actions taken (for security &
                                performance)
                            </li>
                        </ul>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            We do not use tracking or advertising cookies, but
                            some embedded third-party content (e.g., YouTube
                            videos, maps) may set their own cookies and collect
                            data when you interact with them.
                        </p>

                        {/* Contact Section */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Contact Us
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            For privacy-related questions or requests:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-2 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li className="ml-2">
                                <strong className="font-semibold text-black">
                                    Email:
                                </strong>{" "}
                                contact@hack.sv
                            </li>
                            <li className="ml-2">
                                <strong className="font-semibold text-black">
                                    Subject:
                                </strong>{" "}
                                <em className="italic text-gray-700">
                                    Privacy Request - [Your Request Type]
                                </em>
                            </li>
                            <li className="ml-2">
                                <strong className="font-semibold text-black">
                                    Response time:
                                </strong>{" "}
                                within 30 days (or sooner for deletions)
                            </li>
                        </ul>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <strong className="font-semibold text-black">
                                hack.sv is fiscally sponsored by The Hack
                                Foundation (d.b.a. Hack Club), a 501(c)(3)
                                nonprofit (EIN: 81-2908499).
                            </strong>
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <strong className="font-semibold text-black">
                                Your privacy is a priority at hack.sv — and
                                always will be.
                            </strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
