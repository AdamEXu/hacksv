// Virtualized Image Component Props
export interface VirtualizedImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    onLoad?: () => void;
}

// Header Component Props
export interface HeaderProps {
    logoY: any;
    logoScale: any;
}

// Image Grid Component Props
export interface ImageGridProps {
    images: string[];
}
