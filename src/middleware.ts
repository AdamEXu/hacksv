import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-optimized Redis client using Upstash REST API
async function getRedisValue(key: string): Promise<string | null> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        return null;
    }

    try {
        const response = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            // Edge runtime optimization
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.result || null;
    } catch (error) {
        // Fail silently to avoid breaking the site
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Handle OAuth callback for admin
    const token = searchParams.get("token");
    if (pathname === "/admin" && token) {
        // Redirect to admin auth API with token
        const url = request.nextUrl.clone();
        url.pathname = "/api/admin/auth";
        url.searchParams.set("token", token);
        return NextResponse.redirect(url);
    }

    // Skip middleware for excluded paths
    if (
        pathname === "/" ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/api/") ||
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/sitemap.xml") ||
        pathname.startsWith("/robots.txt") ||
        pathname.includes(".") // Skip files with extensions
    ) {
        return NextResponse.next();
    }

    // Extract the slug (remove leading slash)
    const slug = pathname.slice(1);

    // Skip empty slugs or very long ones (prevent abuse)
    if (!slug || slug.length > 100) {
        return NextResponse.next();
    }

    // Check Redis for the short URL
    const redirectUrl = await getRedisValue(slug);

    if (redirectUrl) {
        // Validate the redirect URL
        try {
            new URL(redirectUrl);
            return NextResponse.redirect(redirectUrl, 302); // Temporary redirect
        } catch (error) {
            // Invalid URL in Redis, continue to normal routing
            return NextResponse.next();
        }
    }

    // No redirect found, continue to normal Next.js routing
    // This will result in a 404 if no page exists for this route
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - admin (admin panel)
         * - / (root path)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|admin$).*)",
    ],
};
