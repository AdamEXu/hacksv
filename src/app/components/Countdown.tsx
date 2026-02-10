"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// March 21, 2026 at 9:00 AM Pacific time.
// Note: by late March, Pacific time is typically PDT (UTC-7), not PST (UTC-8).
// 9:00 AM PT = 16:00 UTC (if PDT).
const TARGET_DATE = Date.UTC(2026, 2, 21, 16, 0, 0, 0);

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
    // Avoid baking a "snapshot" into the initial server render; compute on mount instead.
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const updateCountdown = () => setTimeLeft(calculateTimeLeft());

        updateCountdown();

        const now = Date.now();
        const msUntilNextSecond = 1000 - (now % 1000);

        let intervalId: ReturnType<typeof setInterval> | undefined;
        const timeoutId = setTimeout(() => {
            updateCountdown();
            intervalId = setInterval(updateCountdown, 1000);
        }, msUntilNextSecond);

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
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
