"use client";

import { useState, useEffect } from "react";

interface ShortUrl {
    slug: string;
    url: string;
    created_at?: string;
}

interface User {
    email: string;
    legal_name: string;
    preferred_name: string;
    is_admin: boolean;
}

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
    const [newSlug, setNewSlug] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Check authentication and load data
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Check if there's a token in the URL (OAuth callback)
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");

            if (token) {
                // Exchange token for user info
                const response = await fetch(`/api/admin/auth?token=${token}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.user && data.user.is_admin) {
                        setUser(data.user);
                        // Clean up URL
                        window.history.replaceState(
                            {},
                            document.title,
                            "/admin"
                        );
                        loadShortUrls();
                    } else {
                        // User is not admin, redirect to 404
                        window.location.href = "/404";
                        return;
                    }
                } else {
                    // Any auth failure, redirect to 404
                    window.location.href = "/404";
                    return;
                }
            } else {
                // Check existing session
                const response = await fetch("/api/admin/auth");
                if (response.ok) {
                    const data = await response.json();
                    if (data.user && data.user.is_admin) {
                        setUser(data.user);
                        loadShortUrls();
                    } else {
                        // User is not admin, redirect to 404
                        window.location.href = "/404";
                        return;
                    }
                } else if (response.status === 403) {
                    // Access denied, redirect to 404
                    window.location.href = "/404";
                    return;
                } else {
                    // Redirect to hack-id OAuth
                    const callbackUrl = encodeURIComponent(
                        window.location.href
                    );
                    const hackIdBaseUrl =
                        process.env.NODE_ENV === "development"
                            ? "http://127.0.0.1:3000"
                            : "https://id.hack.sv";
                    window.location.href = `${hackIdBaseUrl}/oauth?redirect=${callbackUrl}`;
                }
            }
        } catch (err) {
            console.error("Auth check error:", err);
            setError("Failed to check authentication");
        } finally {
            setLoading(false);
        }
    };

    const loadShortUrls = async () => {
        try {
            const response = await fetch("/api/admin/urls");
            if (response.ok) {
                const data = await response.json();
                setShortUrls(data.urls || []);
            }
        } catch (err) {
            setError("Failed to load short URLs");
        }
    };

    const handleAddUrl = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!newSlug || !newUrl) {
            setError("Both slug and URL are required");
            return;
        }

        // Validate URL
        try {
            new URL(newUrl);
        } catch {
            setError("Please enter a valid URL");
            return;
        }

        // Validate slug (alphanumeric, hyphens, underscores only)
        if (!/^[a-zA-Z0-9_-]+$/.test(newSlug)) {
            setError(
                "Slug can only contain letters, numbers, hyphens, and underscores"
            );
            return;
        }

        try {
            const response = await fetch("/api/admin/urls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: newSlug, url: newUrl }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess(`Short URL created: /${newSlug} → ${newUrl}`);
                setNewSlug("");
                setNewUrl("");
                loadShortUrls();
            } else {
                setError(data.error || "Failed to create short URL");
            }
        } catch (err) {
            setError("Failed to create short URL");
        }
    };

    const handleDeleteUrl = async (slug: string) => {
        if (!confirm(`Are you sure you want to delete /${slug}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/urls/${slug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setSuccess(`Short URL /${slug} deleted`);
                loadShortUrls();
            } else {
                const data = await response.json();
                setError(data.error || "Failed to delete short URL");
            }
        } catch (err) {
            setError("Failed to delete short URL");
        }
    };

    const handleLogout = () => {
        // Clear session and redirect
        fetch("/api/admin/logout", { method: "POST" }).finally(() => {
            window.location.href = "/";
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Only show interface if user is authenticated and is admin
    if (!user || !user.is_admin) {
        // This should not happen as notFound() should have been called
        // But just in case, show loading to prevent flash of admin interface
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Short URL Admin
                            </h1>
                            <p className="text-gray-600">
                                Welcome,{" "}
                                {user?.preferred_name || user?.legal_name}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Add New URL Form */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Add New Short URL
                            </h3>

                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleAddUrl} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="slug"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Slug
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                hack.sv/
                                            </span>
                                            <input
                                                type="text"
                                                id="slug"
                                                value={newSlug}
                                                onChange={(e) =>
                                                    setNewSlug(e.target.value)
                                                }
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="gh"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="url"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Destination URL
                                        </label>
                                        <input
                                            type="url"
                                            id="url"
                                            value={newUrl}
                                            onChange={(e) =>
                                                setNewUrl(e.target.value)
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="https://github.com/hack-sv"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add Short URL
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Existing URLs List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Existing Short URLs ({shortUrls.length})
                            </h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {shortUrls.length === 0 ? (
                                <li className="px-4 py-4 text-gray-500 text-center">
                                    No short URLs created yet
                                </li>
                            ) : (
                                shortUrls.map((shortUrl) => (
                                    <li
                                        key={shortUrl.slug}
                                        className="px-4 py-4 flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-blue-600">
                                                    hack.sv/{shortUrl.slug}
                                                </p>
                                                <span className="mx-2 text-gray-400">
                                                    →
                                                </span>
                                                <p className="text-sm text-gray-900 truncate max-w-md">
                                                    {shortUrl.url}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <a
                                                href={`/${shortUrl.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-900 text-sm"
                                            >
                                                Test
                                            </a>
                                            <button
                                                onClick={() =>
                                                    handleDeleteUrl(
                                                        shortUrl.slug
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-900 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
