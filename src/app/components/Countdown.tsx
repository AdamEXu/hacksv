"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// March 21, 2026 at 9:00 AM PST (UTC-8)
// Convert to UTC: 9:00 AM PST = 5:00 PM UTC
const TARGET_DATE = new Date("2026-03-21T17:00:00.000Z").getTime();

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
                    className="countdown-container"
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
                        <div className="countdown-number" suppressHydrationWarning>
                            {formatNumber(timeLeft.days)}
                        </div>
                        <div className="countdown-label">
                            Days
                        </div>
                    </div>

                    {/* Colon */}
                    <div className="countdown-colon">
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
                        <div className="countdown-number" suppressHydrationWarning>
                            {formatNumber(timeLeft.hours)}
                        </div>
                        <div className="countdown-label">
                            Hours
                        </div>
                    </div>

                    {/* Colon */}
                    <div className="countdown-colon">
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
                        <div className="countdown-number" suppressHydrationWarning>
                            {formatNumber(timeLeft.minutes)}
                        </div>
                        <div className="countdown-label">
                            Minutes
                        </div>
                    </div>

                    {/* Colon */}
                    <div className="countdown-colon">
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
                        <div className="countdown-number" suppressHydrationWarning>
                            {formatNumber(timeLeft.seconds)}
                        </div>
                        <div className="countdown-label">
                            Seconds
                        </div>
                    </div>
                </div>
            </div>
    );
}
