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
                        fontFamily: "Nunito Sans, sans-serif",
                        fontSize: "16px",
                    }}
                >
                    © 2025 Hack SV
                </p>

                {/* Privacy, Conduct, and Security Links */}
                <div className="mb-6 flex justify-center items-center space-x-4">
                    <a
                        href="/privacy"
                        className="text-white"
                        style={{
                            fontFamily: "Nunito Sans, sans-serif",
                            fontSize: "16px",
                            fontWeight: "700",
                        }}
                        data-text="Privacy"
                    >
                        Privacy
                    </a>
                    <span
                        className="text-white"
                        style={{
                            fontFamily: "Nunito Sans, sans-serif",
                            fontSize: "16px",
                            fontWeight: "700",
                        }}
                    >
                        •
                    </span>
                    <a
                        href="/conduct"
                        className="text-white"
                        style={{
                            fontFamily: "Nunito Sans, sans-serif",
                            fontSize: "16px",
                            fontWeight: "700",
                        }}
                        data-text="Conduct"
                    >
                        Conduct
                    </a>
                    <span
                        className="text-white"
                        style={{
                            fontFamily: "Nunito Sans, sans-serif",
                            fontSize: "16px",
                            fontWeight: "700",
                        }}
                    >
                        •
                    </span>
                    <a
                        href="/security"
                        className="text-white"
                        style={{
                            fontFamily: "Nunito Sans, sans-serif",
                            fontSize: "16px",
                            fontWeight: "700",
                        }}
                        data-text="Security"
                    >
                        Security
                    </a>
                </div>

                <p
                    className="text-white text-sm leading-relaxed"
                    style={{
                        fontFamily: "Nunito Sans, sans-serif",
                        fontSize: "14px",
                        lineHeight: "1.5",
                    }}
                >
                    <a href="https://hacksv.org" data-text="Hack SV" style={{
                        fontFamily: "Nunito Sans, sans-serif",
                        fontWeight: "700",
                    }}>
                        Hack SV
                    </a>{" "}
                    is a 501(c)(3) nonprofit organization (EIN: 39-3466775).
                </p>
            </div>
        </footer>
    );
}
