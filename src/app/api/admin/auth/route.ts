import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    exchangeTokenForUser,
    createSession,
    getSession,
    deleteSession,
} from "@/lib/auth";

// Functions are now imported from @/lib/auth

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    // Check for existing session
    if (sessionId) {
        const session = getSession(sessionId);
        if (session) {
            return NextResponse.json({ user: session.user });
        }
    }

    // Check for OAuth token in URL params (callback from hack-id)
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (token) {
        try {
            // Exchange token for user info
            const user = await exchangeTokenForUser(token);

            // Check if user is admin (now included in OAuth response)
            if (!user.is_admin) {
                return NextResponse.json(
                    { error: "Access denied. Admin privileges required." },
                    { status: 403 }
                );
            }

            // Create session
            const newSessionId = createSession(user);

            // Set cookie and return user info
            const response = NextResponse.json({ user });
            response.cookies.set("admin_session", newSessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60, // 24 hours
            });

            return response;
        } catch (error) {
            return NextResponse.json(
                { error: "Authentication failed" },
                { status: 401 }
            );
        }
    }

    // No valid session or token
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
}

export async function POST(request: NextRequest) {
    // Handle logout
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (sessionId) {
        deleteSession(sessionId);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin_session");
    return response;
}
