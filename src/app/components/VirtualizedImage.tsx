"use client";

import { useState, useEffect, useRef } from "react";
import { VirtualizedImageProps } from "../types";
import { CYAN_COLOR } from "../constants";

// Virtualized Image Component for memory optimization
export function VirtualizedImage({
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
