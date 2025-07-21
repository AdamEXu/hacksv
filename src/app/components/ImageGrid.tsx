"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { VirtualizedImage } from "./VirtualizedImage";
import { ImageGridProps } from "../types";
import { CYAN_COLOR, CAROUSEL_SPEED } from "../constants";

// Image Grid Component - This represents the main visual area from the Figma
export function ImageGrid({ images }: ImageGridProps) {
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
