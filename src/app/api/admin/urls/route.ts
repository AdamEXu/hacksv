import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

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
        throw new Error("Redis configuration missing");
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

async function setRedisValue(key: string, urlData: UrlData): Promise<boolean> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error("Redis configuration missing");
    }

    try {
        // Store as JSON string
        const jsonValue = JSON.stringify(urlData);
        const response = await fetch(
            `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(
                jsonValue
            )}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.ok;
    } catch (error) {
        console.error("Redis SET error:", error);
        return false;
    }
}

async function deleteRedisValue(key: string): Promise<boolean> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error("Redis configuration missing");
    }

    try {
        const response = await fetch(`${url}/del/${encodeURIComponent(key)}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.ok;
    } catch (error) {
        console.error("Redis DEL error:", error);
        return false;
    }
}

async function getAllShortUrls(): Promise<
    Array<{ slug: string; url: string; isAffiliate: boolean }>
> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error("Redis configuration missing");
    }

    try {
        // Get all keys (this is not ideal for large datasets, but works for small scale)
        const keysResponse = await fetch(`${url}/keys/*`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!keysResponse.ok) {
            return [];
        }

        const keysData = await keysResponse.json();
        const keys = keysData.result || [];

        // Get values for all keys
        const urls = [];
        for (const key of keys) {
            const urlData = await getRedisValue(key);
            if (urlData) {
                urls.push({
                    slug: key,
                    url: urlData.url,
                    isAffiliate: urlData.isAffiliate
                });
            }
        }

        return urls;
    } catch (error) {
        console.error("Redis KEYS error:", error);
        return [];
    }
}

// Function removed - using requireAdmin from @/lib/auth instead

// GET /api/admin/urls - List all short URLs
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();
        const urls = await getAllShortUrls();
        return NextResponse.json({ urls });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Not authenticated") {
                return NextResponse.json(
                    { error: "Authentication required" },
                    { status: 401 }
                );
            }
            if (error.message === "Admin privileges required") {
                return NextResponse.json(
                    { error: "Access denied. Admin privileges required." },
                    { status: 403 }
                );
            }
        }
        console.error("Failed to get URLs:", error);
        return NextResponse.json(
            { error: "Failed to retrieve URLs" },
            { status: 500 }
        );
    }
}

// POST /api/admin/urls - Create new short URL
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const { slug, url, isAffiliate } = await request.json();

        if (!slug || !url) {
            return NextResponse.json(
                { error: "Slug and URL are required" },
                { status: 400 }
            );
        }

        // Validate slug format
        if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
            return NextResponse.json(
                {
                    error: "Slug can only contain letters, numbers, hyphens, and underscores",
                },
                { status: 400 }
            );
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL format" },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existing = await getRedisValue(slug);
        if (existing) {
            return NextResponse.json(
                { error: "Slug already exists" },
                { status: 409 }
            );
        }

        // Prevent overwriting system routes
        const systemRoutes = [
            "admin",
            "api",
            "_next",
            "privacy",
            "favicon.ico",
            "sitemap.xml",
            "robots.txt",
            "go",
        ];
        if (systemRoutes.includes(slug)) {
            return NextResponse.json(
                { error: "Cannot use system route as slug" },
                { status: 400 }
            );
        }

        // Create the short URL with affiliate flag
        const urlData: UrlData = {
            url,
            isAffiliate: isAffiliate || false,
        };
        const success = await setRedisValue(slug, urlData);
        if (!success) {
            return NextResponse.json(
                { error: "Failed to create short URL" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            slug,
            url,
            isAffiliate: urlData.isAffiliate,
            message: `${urlData.isAffiliate ? 'Affiliate' : 'Short'} URL created: /${slug} → ${url}`,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Not authenticated") {
                return NextResponse.json(
                    { error: "Authentication required" },
                    { status: 401 }
                );
            }
            if (error.message === "Admin privileges required") {
                return NextResponse.json(
                    { error: "Access denied. Admin privileges required." },
                    { status: 403 }
                );
            }
        }
        console.error("Failed to create URL:", error);
        return NextResponse.json(
            { error: "Failed to create short URL" },
            { status: 500 }
        );
    }
}
