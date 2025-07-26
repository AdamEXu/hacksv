"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HeaderProps } from "../types";
import { CYAN_COLOR } from "../constants";

// Sign Up Form Component
export function SignUpForm() {
    return (
        <a href="https://forms.hack.sv/forms/interest" target="_blank">
            <div
                id="sign-up"
                className="w-full"
                style={{ backgroundColor: CYAN_COLOR }}
            >
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <h2
                        className="text-center text-white mb-4"
                        style={{
                            fontFamily: "VT323, monospace",
                            fontSize: "48px",
                            lineHeight: "1.2",
                        }}
                    >
                        Register interest
                    </h2>
                </div>
            </div>
        </a>
    );
}
