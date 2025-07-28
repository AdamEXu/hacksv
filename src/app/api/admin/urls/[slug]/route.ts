import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

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

// Function removed - using requireAdmin from @/lib/auth instead

// DELETE /api/admin/urls/[slug] - Delete a short URL
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await requireAdmin();
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { error: "Slug is required" },
                { status: 400 }
            );
        }

        // Delete the short URL
        const success = await deleteRedisValue(slug);
        if (!success) {
            return NextResponse.json(
                { error: "Failed to delete short URL" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Short URL /${slug} deleted successfully`,
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
        console.error("Failed to delete URL:", error);
        return NextResponse.json(
            { error: "Failed to delete short URL" },
            { status: 500 }
        );
    }
}
