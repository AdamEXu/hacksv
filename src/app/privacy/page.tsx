"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";
import Lenis from "lenis";
import { Header } from "../components/Header";
import { CYAN_COLOR } from "../constants";

export default function PrivacyPage() {
    // Initialize Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Light easing
            infinite: false,
        });

        // Make Lenis globally available
        (window as any).lenis = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            delete (window as any).lenis;
        };
    }, []);

    // Fixed logo position at top (no scroll animation)
    const logoY = useMotionValue(14); // Fixed at top position
    const logoScale = useMotionValue(1); // Fixed at normal scale

    return (
        <div className="min-h-screen bg-white">
            {/* Header with fixed logo position */}
            <Header
                logoY={logoY}
                logoScale={logoScale}
                logoReady={true}
                isMobile={false}
            />

            {/* Main Content - Styled like main page */}
            <div className="w-full" style={{ backgroundColor: CYAN_COLOR }}>
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Privacy Policy Content */}
                    <h1
                        className="text-center text-white mb-12"
                        style={{
                            fontFamily: "VT323, monospace",
                            fontSize: "48px",
                            lineHeight: "1.2",
                        }}
                    >
                        Privacy Policy — hack.sv
                    </h1>

                    {/* Effective Date */}
                    <div className="text-center mb-8">
                        <p
                            className="text-white mb-2"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "18px",
                                fontWeight: "500",
                            }}
                        >
                            <span className="font-medium">Effective Date:</span>{" "}
                            July 17, 2025
                        </p>
                        <p
                            className="text-white"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "18px",
                                fontWeight: "500",
                            }}
                        >
                            <span className="font-medium">Last Updated:</span>{" "}
                            July 17, 2025
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-white mb-12"></div>

                    {/* Overview Section */}
                    <div
                        className="bg-white rounded-lg p-8 mb-8"
                        style={{ border: "4px solid black" }}
                    >
                        <h2
                            className="text-black mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "32px",
                                fontWeight: "600",
                            }}
                        >
                            Overview
                        </h2>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            hack.sv ("we," "our," or "us") is a nonprofit
                            organization dedicated to running educational
                            hackathons and programs for students under 18. We
                            respect your privacy and give you control over your
                            personal information. This Privacy Policy applies to
                            all hack.sv services and platforms, including:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>
                                Our website (
                                <a
                                    href="https://hack.sv"
                                    className="text-blue-600 hover:underline"
                                >
                                    https://hack.sv
                                </a>
                                ) and all its subdomains (e.g.,
                                dashboard.hack.sv, id.hack.sv)
                            </li>
                            <li>Event registration and participation</li>
                            <li>
                                Communications (emails, newsletters,
                                announcements)
                            </li>
                            <li>
                                Social and community platforms (e.g., Discord)
                            </li>
                        </ul>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            hack.sv is an ongoing program that hosts recurring
                            hackathons and related events. Your account can be
                            used across multiple events and remains active
                            unless deleted.
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            By creating an account, registering for an event, or
                            participating in our programs, you agree to the
                            terms of this Privacy Policy.
                        </p>
                    </div>

                    {/* Data Controller Section */}
                    <div
                        className="bg-white rounded-lg p-8 mb-8"
                        style={{ border: "4px solid black" }}
                    >
                        <h2
                            className="text-black mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "32px",
                                fontWeight: "600",
                            }}
                        >
                            Data Controller
                        </h2>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <span className="font-medium text-black">
                                hack.sv
                            </span>{" "}
                            is a California nonprofit organization (EIN:
                            [pending]).
                        </p>

                        <p
                            className="text-gray-800 mb-2 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <span className="font-medium text-black">
                                Contact:
                            </span>{" "}
                            contact@hack.sv
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <span className="font-medium text-black">
                                Website:
                            </span>{" "}
                            <a
                                href="https://hack.sv"
                                className="text-blue-600 hover:underline"
                            >
                                https://hack.sv
                            </a>
                        </p>
                    </div>

                    {/* Information We Collect Section */}
                    <div
                        className="bg-white rounded-lg p-8 mb-8"
                        style={{ border: "4px solid black" }}
                    >
                        <h2
                            className="text-black mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "32px",
                                fontWeight: "600",
                            }}
                        >
                            Information We Collect
                        </h2>

                        {/* 1. Website Visitors */}
                        <h3
                            className="text-black mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "24px",
                                fontWeight: "500",
                            }}
                        >
                            1. Website Visitors
                        </h3>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            When you visit our website, we may collect:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>IP address</li>
                            <li>Browser & device information</li>
                            <li>
                                Pages visited & actions taken (for security &
                                performance)
                            </li>
                        </ul>

                        <p
                            className="text-gray-800 mb-8 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            We do not use tracking or advertising cookies, but
                            some embedded third-party content (e.g., YouTube
                            videos, maps) may set their own cookies and collect
                            data when you interact with them.
                        </p>

                        {/* 2. Account & Event Registration */}
                        <h3
                            className="text-black mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "24px",
                                fontWeight: "500",
                            }}
                        >
                            2. Account & Event Registration
                        </h3>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            When you create an account or register for an event,
                            we collect:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>Legal name (required)</li>
                            <li>
                                Preferred name (required; you may use your first
                                name)
                            </li>
                            <li>
                                Pronouns (required; used only internally and on
                                badges/dashboards, not shared outside hack.sv)
                            </li>
                            <li>Date of birth (to verify you're under 18)</li>
                            <li>Email address</li>
                            <li>Discord ID & username (if linked)</li>
                            <li>
                                Phone number, emergency contact, dietary
                                restrictions, T-shirt size, and physical address
                                (for event logistics —{" "}
                                <span className="font-medium text-black">
                                    deleted no sooner than two weeks after the
                                    event concludes, or longer if required for
                                    shipping purposes
                                </span>
                                )
                            </li>
                        </ul>

                        {/* Authentication Methods */}
                        <h4
                            className="text-black mb-4 mt-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "20px",
                                fontWeight: "500",
                            }}
                        >
                            Authentication Methods
                        </h4>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            We offer two login options:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-8 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>
                                <span className="font-medium text-black">
                                    Google OAuth:
                                </span>{" "}
                                If you choose this option, we collect your email
                                & name from Google.
                            </li>
                            <li>
                                <span className="font-medium text-black">
                                    Email Verification:
                                </span>{" "}
                                If you choose this option, we send a
                                verification code to your email, and Google is
                                not involved at all.
                            </li>
                        </ul>

                        {/* 3. Communications */}
                        <h3
                            className="text-black mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "24px",
                                fontWeight: "500",
                            }}
                        >
                            3. Communications
                        </h3>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            When you communicate with us or subscribe to
                            updates:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>Name & email address</li>
                            <li>Content of your inquiry or feedback</li>
                        </ul>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            You are automatically subscribed to email updates
                            when you create an account.
                            <br />
                            You{" "}
                            <span className="font-medium text-black">
                                cannot opt out
                            </span>{" "}
                            of essential operational announcements (like venue
                            changes, meal sign-ups, or volunteer notices).
                            <br />
                            You{" "}
                            <span className="font-medium text-black">
                                can opt out
                            </span>{" "}
                            of promotional emails (such as sponsor offers or
                            referral programs) at any time via:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-8 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>Your ID dashboard</li>
                            <li>The unsubscribe link in any email</li>
                        </ul>

                        {/* 4. Photos & Videos */}
                        <h3
                            className="text-black mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "24px",
                                fontWeight: "500",
                            }}
                        >
                            4. Photos & Videos
                        </h3>

                        <p
                            className="text-gray-800 mb-8 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            We may photograph and record our events.
                            <br />
                            By attending an event, you consent to the use of
                            your likeness in photos, videos, or recordings for{" "}
                            <span className="font-medium text-black">
                                perpetual promotional purposes
                            </span>
                            , including but not limited to our website, social
                            media, slides, emails, flyers, and advertisements.
                            <br />
                            This applies to both participants and
                            volunteers/staff.
                            <br />
                            Detailed terms may also appear in the event-specific
                            waiver.
                        </p>
                    </div>

                    {/* How We Use Your Information Section */}
                    <div
                        className="bg-white rounded-lg p-8 mb-8"
                        style={{ border: "4px solid black" }}
                    >
                        <h2
                            className="text-black mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "32px",
                                fontWeight: "500",
                            }}
                        >
                            How We Use Your Information
                        </h2>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            We use your data to:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>Register you for and manage events</li>
                            <li>
                                Communicate with you about events, updates, or
                                issues
                            </li>
                            <li>
                                Operate and secure our platforms and ID system
                            </li>
                            <li>
                                Assign verified roles in Discord so you can
                                participate in chat
                            </li>
                            <li>Improve and safeguard our services</li>
                            <li>Comply with legal obligations</li>
                            <li>
                                Report anonymized, aggregated statistics to
                                sponsors and the public
                            </li>
                        </ul>
                    </div>

                    {/* How We Share Your Information Section */}
                    <div
                        className="bg-white rounded-lg p-8 mb-8"
                        style={{ border: "4px solid black" }}
                    >
                        <h2
                            className="text-black mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "32px",
                                fontWeight: "500",
                            }}
                        >
                            How We Share Your Information
                        </h2>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            We{" "}
                            <span className="font-medium text-black">
                                do not sell your data.
                            </span>
                        </p>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            We may share your data:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>
                                With trusted service providers (e.g., email
                                platforms, hosting providers, authentication
                                platforms)
                            </li>
                            <li>
                                With event organizers & venue staff for
                                emergency contact purposes
                            </li>
                            <li>
                                With event sponsors{" "}
                                <span className="font-medium text-black">
                                    only with your explicit, per-event consent
                                </span>
                            </li>
                            <li>
                                With shipping or fulfillment providers to
                                deliver prizes or swag
                            </li>
                            <li>With legal authorities if required by law</li>
                        </ul>
                    </div>

                    {/* Your Rights Section */}
                    <div
                        className="bg-white rounded-lg p-8 mb-8"
                        style={{ border: "4px solid black" }}
                    >
                        <h2
                            className="text-black mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "32px",
                                fontWeight: "500",
                            }}
                        >
                            Your Rights
                        </h2>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            You can exercise the following rights at any time:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-6 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>
                                <span className="font-medium text-black">
                                    Access:
                                </span>{" "}
                                View your data via your dashboard or by request
                            </li>
                            <li>
                                <span className="font-medium text-black">
                                    Correction:
                                </span>{" "}
                                Update your information via dashboard or by
                                contacting us
                            </li>
                            <li>
                                <span className="font-medium text-black">
                                    Deletion:
                                </span>{" "}
                                Request permanent deletion of your data through
                                your dashboard or by request
                            </li>
                            <li>
                                <span className="font-medium text-black">
                                    Portability:
                                </span>{" "}
                                Request your data in a machine-readable format
                            </li>
                            <li>
                                <span className="font-medium text-black">
                                    Restriction & Objection:
                                </span>{" "}
                                Limit or object to certain processing, as
                                applicable
                            </li>
                        </ul>

                        <h3
                            className="text-black mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "24px",
                                fontWeight: "500",
                            }}
                        >
                            How to Delete Your Data
                        </h3>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>
                                Log in & click <em>Delete My Data</em> on your
                                dashboard
                            </li>
                            <li>
                                Or email:{" "}
                                <span className="font-medium text-black">
                                    contact@hack.sv
                                </span>{" "}
                                with subject: <em>Delete My Account</em>
                            </li>
                        </ul>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            ⚠️ If you are{" "}
                            <span className="font-medium text-black">
                                registered for an upcoming or ongoing event
                            </span>
                            , you must first unregister from the event{" "}
                            <span className="font-medium text-black">
                                at least 48 hours before the event starts
                            </span>{" "}
                            before requesting deletion of your data.
                        </p>
                    </div>

                    {/* Contact Us Section */}
                    <div
                        className="bg-white rounded-lg p-8 mb-8"
                        style={{ border: "4px solid black" }}
                    >
                        <h2
                            className="text-black mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "32px",
                                fontWeight: "500",
                            }}
                        >
                            Contact Us
                        </h2>

                        <p
                            className="text-gray-800 mb-4 leading-relaxed"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            For privacy-related questions or requests:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-8 space-y-1 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li>
                                <span className="font-medium text-black">
                                    Email:
                                </span>{" "}
                                contact@hack.sv
                            </li>
                            <li>
                                <span className="font-medium text-black">
                                    Subject:
                                </span>{" "}
                                <em>Privacy Request - [Your Request Type]</em>
                            </li>
                            <li>
                                <span className="font-medium text-black">
                                    Response time:
                                </span>{" "}
                                within 30 days (or sooner for deletions)
                            </li>
                        </ul>

                        <div className="border-t-2 border-gray-200 pt-6">
                            <p
                                className="text-gray-800 mb-4 leading-relaxed"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    fontSize: "16px",
                                }}
                            >
                                <span className="font-medium text-black">
                                    hack.sv is a California nonprofit
                                    organization (EIN: [pending]).
                                </span>
                            </p>

                            <p
                                className="text-gray-800 leading-relaxed"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    fontSize: "16px",
                                }}
                            >
                                <span className="font-medium text-black">
                                    Your privacy is a priority at hack.sv — and
                                    always will be.
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Closing divs */}
                </div>
            </div>
        </div>
    );
}
