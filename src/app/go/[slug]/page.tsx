"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CYAN_COLOR } from "@/app/constants";

export default function AffiliateRedirectPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(0.5);

    useEffect(() => {
        // Fetch the URL from the API
        async function fetchUrl() {
            try {
                const response = await fetch(`/api/go/${slug}`);
                if (!response.ok) {
                    setError("Link not found");
                    return;
                }
                const data = await response.json();
                setRedirectUrl(data.url);
            } catch (err) {
                setError("Failed to load redirect");
            }
        }

        fetchUrl();
    }, [slug]);

    useEffect(() => {
        if (!redirectUrl) return;

        // Start countdown
        const interval = setInterval(() => {
            setCountdown((prev) => {
                const next = prev - 0.1;
                if (next <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return next;
            });
        }, 100);

        // Redirect after 500ms
        const timeout = setTimeout(() => {
            window.location.href = redirectUrl;
        }, 500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [redirectUrl]);

    if (error) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: CYAN_COLOR }}
            >
                <div className="text-center">
                    <h1
                        className="text-white text-4xl mb-4"
                        style={{ fontFamily: "VT323, monospace" }}
                    >
                        Error
                    </h1>
                    <p
                        className="text-white text-xl"
                        style={{ fontFamily: "Nunito Sans, sans-serif" }}
                    >
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center"
        >
            <div className="text-center max-w-2xl px-6">
                <h1
                    className="text-black text-5xl mb-8"
                >
                    Affiliate Link Disclosure
                </h1>
                <div
                    className="p-8 mb-6"
                >
                    <p
                        className="text-gray-800 text-lg mb-4"
                        style={{ fontFamily: "Nunito Sans, sans-serif" }}
                    >
                        This is an affiliate link. We may earn a small
                        commission if you make a purchase through this link.
                    </p>
                    <p
                        className="text-gray-800 text-lg mb-4"
                        style={{ fontFamily: "Nunito Sans, sans-serif" }}
                    >
                        This doesn't affect your price at all. You'll pay the
                        same amount whether you use our link or go directly to
                        the site.
                    </p>
                    <p
                        className="text-gray-600 text-base"
                        style={{ fontFamily: "Nunito Sans, sans-serif" }}
                    >
                        As an Amazon Associate I earn from qualifying purchases.
                    </p>
                    <p className="text-gray-800 text-lg mt-8">
                        Thank you for your support!
                    </p>
                </div>
                <p
                    className="text-white text-xl"
                    style={{ fontFamily: "Nunito Sans, sans-serif" }}
                >
                    Redirecting in {countdown.toFixed(1)}s...
                </p>
                {redirectUrl && (
                    <a
                        href={redirectUrl}
                        className="text-white underline mt-4 inline-block"
                        style={{ fontFamily: "Nunito Sans, sans-serif" }}
                    >
                        Click here if you're not redirected automatically
                    </a>
                )}
            </div>
        </div>
    );
}

