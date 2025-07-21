"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CYAN_COLOR, QUOTES_SPEED } from "../constants";

// Quotes Carousel Component
export function QuotesCarousel() {
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
