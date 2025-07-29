import { CYAN_COLOR } from "../constants";

// Footer Component
export function Footer() {
    return (
        <footer
            className="w-full py-8 px-6"
            style={{ backgroundColor: CYAN_COLOR }}
        >
            <div className="max-w-4xl mx-auto text-center">
                {/* Copyright */}
                <p
                    className="text-white mb-4"
                    style={{
                        fontFamily: "Barlow Condensed, sans-serif",
                        fontSize: "16px",
                        fontWeight: "600",
                    }}
                >
                    © 2025 hack.sv
                </p>

                {/* Privacy, Conduct, and Security Links */}
                <div className="mb-6 flex justify-center items-center space-x-4">
                    <a
                        href="/privacy"
                        className="text-white"
                        style={{
                            fontFamily: "Barlow Condensed, sans-serif",
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                        data-text="Privacy"
                    >
                        Privacy
                    </a>
                    <span
                        className="text-white"
                        style={{
                            fontFamily: "Barlow Condensed, sans-serif",
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                    >
                        •
                    </span>
                    <a
                        href="/conduct"
                        className="text-white"
                        style={{
                            fontFamily: "Barlow Condensed, sans-serif",
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                        data-text="Conduct"
                    >
                        Conduct
                    </a>
                    <span
                        className="text-white"
                        style={{
                            fontFamily: "Barlow Condensed, sans-serif",
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                    >
                        •
                    </span>
                    <a
                        href="/security"
                        className="text-white"
                        style={{
                            fontFamily: "Barlow Condensed, sans-serif",
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                        data-text="Security"
                    >
                        Security
                    </a>
                </div>

                {/* Fiscal Sponsorship Notice */}
                <p
                    className="text-white text-sm leading-relaxed"
                    style={{
                        fontFamily: "Barlow Condensed, sans-serif",
                        fontSize: "14px",
                        lineHeight: "1.5",
                    }}
                >
                    hack.sv is fiscally sponsored by The Hack Foundation (d.b.a.
                    Hack Club), a 501(c)(3) nonprofit (EIN: 81-2908499).
                </p>
            </div>
        </footer>
    );
}
