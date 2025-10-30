"use client";

import { useState, useEffect } from "react";
import { CYAN_COLOR } from "../constants";

// Sponsors Component
export function Sponsors() {
    const [sponsors, setSponsors] = useState<any[]>([]);

    useEffect(() => {
        // Load sponsors from JSON file
        fetch("/sponsors.json")
            .then((response) => response.json())
            .then((data) => setSponsors(data))
            .catch((error) => console.error("Error loading sponsors:", error));
    }, []);

    return (
        <div className="w-full px-4 md:px-8 lg:px-16 py-12 md:py-16" style={{ backgroundColor: CYAN_COLOR, }}>
            <h2 className="text-4xl font-bold text-white mb-12" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                Sponsors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {sponsors.map((sponsor) => (
                    <div
                        key={sponsor.name}
                        className="relative group"
                        style={{ paddingBottom: "2.5rem" }}
                    >
                        {/* Stable hover container */}
                        <a
                            href={`${sponsor.website}?utm_source=hacksv&ref=hacksv`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-link-style block bg-white transition-all duration-300 p-8"
                            style={{
                                transform: "translateY(0)",
                            }}
                        >
                            <div className="w-full h-32 flex items-center justify-center">
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        </a>

                        {/* Sponsor name that appears below on hover */}
                        <p
                            className="absolute left-1/2 top-1/2 text-center transition-transform duration-300 pointer-events-none whitespace-nowrap"
                            style={{
                                fontSize: "28px",
                                fontWeight: "600",
                                color: "white",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            {sponsor.name}
                        </p>

                        {/* Hover state for card and text, but only when screen is large enough */}
                        <style jsx>{`
                            @media (min-width: 768px) {
                                .group:hover a {
                                    transform: translateY(calc(-8px)) !important;
                                }
                                .group:hover p {
                                    transform: translate(-50%, calc(50% + 48px)) !important;
                                }
                            }

                            @media (max-width: 767px) {
                                a {
                                    transform: translateY(calc(-8px)) !important;
                                }
                                p {
                                    transform: translate(-50%, calc(50% + 48px)) !important;
                                }
                            }
                        `}</style>
                    </div>
                ))}
            </div>
        </div>
    );
}
