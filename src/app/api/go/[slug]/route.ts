import { NextRequest, NextResponse } from "next/server";

// Types for URL data
interface UrlData {
    url: string;
    isAffiliate: boolean;
}

// Redis operations using Upstash REST API
async function getRedisValue(key: string): Promise<UrlData | null> {
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
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const result = data.result;
        
        if (!result) {
            return null;
        }

        // Handle backward compatibility: if it's a plain string, convert to new format
        if (typeof result === 'string') {
            // Check if it's a JSON string
            try {
                const parsed = JSON.parse(result);
                if (parsed.url) {
                    return parsed as UrlData;
                }
            } catch {
                // It's a plain URL string (old format), convert to new format
                return { url: result, isAffiliate: false };
            }
        }

        return result as UrlData;
    } catch (error) {
        console.error("Redis GET error:", error);
        return null;
    }
}

// GET /api/go/[slug] - Get URL for affiliate redirect
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { error: "Slug is required" },
                { status: 400 }
            );
        }

        const urlData = await getRedisValue(slug);

        if (!urlData) {
            return NextResponse.json(
                { error: "URL not found" },
                { status: 404 }
            );
        }

        // Only return URL if it's an affiliate link
        if (!urlData.isAffiliate) {
            return NextResponse.json(
                { error: "Not an affiliate link" },
                { status: 400 }
            );
        }

        return NextResponse.json({ url: urlData.url });
    } catch (error) {
        console.error("Failed to get URL:", error);
        return NextResponse.json(
            { error: "Failed to retrieve URL" },
            { status: 500 }
        );
    }
}

