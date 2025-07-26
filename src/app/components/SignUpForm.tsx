"use client";

import { CYAN_COLOR } from "../constants";

// Sign Up Form Component
export function SignUpForm() {
    return (
        <div
            id="sign-up"
            className="w-full"
            style={{ backgroundColor: CYAN_COLOR }}
        >
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex justify-center">
                    <a
                        href="https://forms.hack.sv/forms/interest"
                        target="_blank"
                        className="bg-white rounded-lg px-8 py-6 transition-transform hover:scale-105 active:scale-95"
                        style={{ border: "4px solid black" }}
                    >
                        <h2
                            className="text-center text-black"
                            style={{
                                fontFamily: "VT323, monospace",
                                fontSize: "48px",
                                lineHeight: "1.2",
                                color: CYAN_COLOR,
                            }}
                        >
                            Register interest
                        </h2>
                    </a>
                </div>
            </div>
        </div>
    );
}
