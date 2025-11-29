import { cookies } from "next/headers";

// Extend global type
declare global {
    var sessionStore: Map<string, { user: any; expires: number }> | undefined;
    var sessionCleanupStarted: boolean | undefined;
}

// Session store - in production, use Redis or database
let sessionStore: Map<string, { user: any; expires: number }>;

if (typeof global !== "undefined") {
    if (!global.sessionStore) {
        global.sessionStore = new Map();
    }
    sessionStore = global.sessionStore;
} else {
    sessionStore = new Map();
}

// Clean up expired sessions periodically
if (typeof global !== "undefined" && !global.sessionCleanupStarted) {
    global.sessionCleanupStarted = true;
    setInterval(() => {
        const now = Date.now();
        for (const [sessionId, session] of sessionStore.entries()) {
            if (session.expires < now) {
                sessionStore.delete(sessionId);
            }
        }
    }, 60000); // Clean up every minute
}

export interface User {
    email: string;
    legal_name: string;
    preferred_name: string;
    pronouns?: string;
    date_of_birth?: string;
    is_admin: boolean;
}

export interface Session {
    user: User;
    expires: number;
}

/**
 * Exchange OAuth 2.0 authorization code for access token and user info
 */
export async function exchangeCodeForUser(code: string, redirectUri: string): Promise<User> {
    const hackIdBaseUrl =
        process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:3000"
            : "https://id.hack.sv";

    const clientId = process.env.HACKID_CLIENT_ID;
    const clientSecret = process.env.HACKID_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("HACKID_CLIENT_ID and HACKID_CLIENT_SECRET must be configured");
    }

    try {
        // Step 1: Exchange authorization code for access token
        const tokenUrl = `${hackIdBaseUrl}/oauth/token`;
        console.log('Exchanging code for token at:', tokenUrl);

        const tokenResponse = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        console.log('Token response status:', tokenResponse.status);
        const responseText = await tokenResponse.text();
        console.log('Token response body:', responseText.substring(0, 200));

        if (!tokenResponse.ok) {
            let error;
            try {
                error = JSON.parse(responseText);
            } catch {
                throw new Error(`Failed to exchange code for token: ${tokenResponse.status} - ${responseText.substring(0, 100)}`);
            }
            throw new Error(error.error_description || "Failed to exchange code for token");
        }

        const tokenData = JSON.parse(responseText);
        const accessToken = tokenData.access_token;

        // Step 2: Use access token to get user info
        const userResponse = await fetch(`${hackIdBaseUrl}/api/oauth/user-info`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userResponse.ok) {
            const error = await userResponse.json();
            throw new Error(error.error_description || "Failed to get user info");
        }

        const userData = await userResponse.json();

        // Map OAuth 2.0 response to User interface
        return {
            email: userData.email,
            legal_name: userData.legal_name,
            preferred_name: userData.preferred_name,
            pronouns: userData.pronouns,
            date_of_birth: userData.dob,
            is_admin: userData.is_admin || false, // OAuth 2.0 endpoint now returns is_admin
        };
    } catch (error) {
        console.error("OAuth 2.0 code exchange error:", error);
        throw error;
    }
}

/**
 * LEGACY: Exchange OAuth token for user info (deprecated, use exchangeCodeForUser)
 */
export async function exchangeTokenForUser(token: string): Promise<User> {
    const hackIdBaseUrl =
        process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:3000"
            : "https://id.hack.sv";

    const hackIdApiKey = process.env.HACKID_API_KEY;

    if (!hackIdApiKey) {
        throw new Error("HACKID_API_KEY not configured");
    }

    try {
        const response = await fetch(`${hackIdBaseUrl}/api/oauth/user-info`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${hackIdApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            throw new Error("Failed to exchange token");
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || "Token exchange failed");
        }

        return data.user;
    } catch (error) {
        console.error("Token exchange error:", error);
        throw error;
    }
}

export function createSession(user: User): string {
    const sessionId = crypto.randomUUID();
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    sessionStore.set(sessionId, { user, expires });
    return sessionId;
}

export function getSession(sessionId: string): Session | null {
    if (!sessionId || !sessionStore.has(sessionId)) {
        return null;
    }

    const session = sessionStore.get(sessionId)!;
    if (session.expires <= Date.now()) {
        sessionStore.delete(sessionId);
        return null;
    }

    return session;
}

export function deleteSession(sessionId: string): void {
    sessionStore.delete(sessionId);
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (!sessionId) {
        return null;
    }

    const session = getSession(sessionId);
    return session?.user || null;
}

export async function requireAdmin(): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    if (!user.is_admin) {
        throw new Error("Admin privileges required");
    }

    return user;
}
