"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// July 23, 2025 at 10:00 AM PST (UTC-8)
// Convert to UTC: 10:00 AM PST = 6:00 PM UTC
const TARGET_DATE = new Date("2025-07-23T18:00:00.000Z").getTime();

const calculateTimeLeft = (): TimeLeft => {
    const currentTime = Date.now();
    const difference = TARGET_DATE - currentTime;

    if (difference > 0) {
        // Add 999ms to round up to the next second for display
        // This ensures we show the ceiling of the time remaining
        const adjustedDifference = difference + 999;

        const days = Math.floor(adjustedDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (adjustedDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (adjustedDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((adjustedDifference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
};

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const updateCountdown = () => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            // Auto refresh when countdown hits zero
            if (
                newTimeLeft.days === 0 &&
                newTimeLeft.hours === 0 &&
                newTimeLeft.minutes === 0 &&
                newTimeLeft.seconds === 0
            ) {
                window.location.reload();
            }
        };

        // Initial update
        updateCountdown();

        // Sync to the exact second boundary for precise timing
        const now = Date.now();
        const msUntilNextSecond = 1000 - (now % 1000);

        const syncTimeout = setTimeout(() => {
            // Update immediately when we hit the second boundary
            updateCountdown();

            // Then set up interval that runs exactly every second
            const timer = setInterval(updateCountdown, 1000);

            return () => clearInterval(timer);
        }, msUntilNextSecond);

        return () => clearTimeout(syncTimeout);
    }, []);

    const formatNumber = (num: number): string => {
        return num.toString().padStart(2, "0");
    };

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#00CCFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "4px solid black",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    padding: "16px",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                }}
            >
                {/* Container for numbers and labels with perfect alignment */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    {/* Days */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "VT323, monospace",
                                fontSize: "64px",
                                lineHeight: "64px",
                                color: "black",
                                width: "64px",
                                textAlign: "center",
                            }}
                        >
                            {formatNumber(timeLeft.days)}
                        </div>
                        <div
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "18px",
                                color: "black",
                                marginTop: "4px",
                            }}
                        >
                            Days
                        </div>
                    </div>

                    {/* Colon */}
                    <div
                        style={{
                            fontFamily: "VT323, monospace",
                            fontSize: "64px",
                            lineHeight: "64px",
                            color: "black",
                            marginBottom: "22px", // Offset to align with numbers
                        }}
                    >
                        :
                    </div>

                    {/* Hours */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "VT323, monospace",
                                fontSize: "64px",
                                lineHeight: "64px",
                                color: "black",
                                width: "64px",
                                textAlign: "center",
                            }}
                        >
                            {formatNumber(timeLeft.hours)}
                        </div>
                        <div
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "18px",
                                color: "black",
                                marginTop: "4px",
                            }}
                        >
                            Hours
                        </div>
                    </div>

                    {/* Colon */}
                    <div
                        style={{
                            fontFamily: "VT323, monospace",
                            fontSize: "64px",
                            lineHeight: "64px",
                            color: "black",
                            marginBottom: "22px", // Offset to align with numbers
                        }}
                    >
                        :
                    </div>

                    {/* Minutes */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "VT323, monospace",
                                fontSize: "64px",
                                lineHeight: "64px",
                                color: "black",
                                width: "64px",
                                textAlign: "center",
                            }}
                        >
                            {formatNumber(timeLeft.minutes)}
                        </div>
                        <div
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "18px",
                                color: "black",
                                marginTop: "4px",
                            }}
                        >
                            Minutes
                        </div>
                    </div>

                    {/* Colon */}
                    <div
                        style={{
                            fontFamily: "VT323, monospace",
                            fontSize: "64px",
                            lineHeight: "64px",
                            color: "black",
                            marginBottom: "22px", // Offset to align with numbers
                        }}
                    >
                        :
                    </div>

                    {/* Seconds */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "VT323, monospace",
                                fontSize: "64px",
                                lineHeight: "64px",
                                color: "black",
                                width: "64px",
                                textAlign: "center",
                            }}
                        >
                            {formatNumber(timeLeft.seconds)}
                        </div>
                        <div
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "18px",
                                color: "black",
                                marginTop: "4px",
                            }}
                        >
                            Seconds
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
