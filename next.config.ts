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
            {
                protocol: "https",
                hostname: "files.slack.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/ingest/static/:path*",
                destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ingest/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
            {
                source: "/ingest/flags",
                destination: "https://us.i.posthog.com/flags",
            },
        ];
    },
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
