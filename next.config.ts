import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.hack.sv",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
