"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";
import Lenis from "lenis";
import { Header } from "../components/Header";
import { CYAN_COLOR } from "../constants";

export default function ConductPage() {
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

    // Handle smooth scrolling for internal links
    const handleInternalLink = (targetId: string) => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const lenis = (window as any).lenis;
            const headerHeight = 132; // Header height
            const additionalOffset = 20; // Additional spacing
            const totalOffset = headerHeight + additionalOffset;
            
            if (lenis) {
                // Calculate the scroll position accounting for the header
                const elementTop = targetElement.offsetTop;
                const scrollTo = elementTop - totalOffset;
                
                lenis.scrollTo(scrollTo, {
                    duration: 1.5,
                    easing: (t: number) => 1 - Math.pow(1 - t, 3),
                });
            } else {
                // Fallback for when Lenis isn't available
                const elementTop = targetElement.offsetTop;
                const scrollTo = elementTop - totalOffset;
                window.scrollTo({ top: scrollTo, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="min-h-screen bg-white" style={{ scrollPaddingTop: "152px" }}>
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
                    {/* Code of Conduct Content */}
                    <h1
                        className="text-center text-white mb-12"
                        style={{
                            fontFamily: "VT323, monospace",
                            fontSize: "48px",
                            lineHeight: "1.2",
                        }}
                    >
                        Code of Conduct
                    </h1>

                    <div
                        className="bg-white rounded-lg p-8 mb-8"
                        style={{ border: "4px solid black" }}
                    >
                        {/* TL;DR Section */}
                        <h2
                            className="text-black mt-0 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            TL;DR
                        </h2>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-8 space-y-2 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li className="ml-2">Treat everyone with respect and kindness.</li>
                            <li className="ml-2">Be thoughtful in how you communicate.</li>
                            <li className="ml-2">Don't be destructive or inflammatory.</li>
                            <li className="ml-2">If you encounter an issue, please mail.</li>
                        </ul>

                        {/* Why have a Code of Conduct? */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Why have a Code of Conduct?
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            hack.sv's community includes people from many different backgrounds. The hack.sv contributors are committed to providing a friendly, safe, and welcoming environment for all.
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            The first goal of the Code of Conduct is to specify a baseline standard of behavior so that people with different social values and communication styles can communicate effectively, productively, and respectfully.
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            The second goal is to provide a mechanism for resolving conflicts in the community when they arise.
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            With that said, a healthy community must allow for disagreement and debate. The Code of Conduct is not a mechanism for people to silence others with whom they disagree.
                        </p>

                        {/* Where does the Code of Conduct apply? */}
                        <h2
                            id="where-does-the-code-of-conduct-apply"
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Where does the Code of Conduct apply?
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            If you join in or contribute to the hack.sv ecosystem in any way, you are encouraged to follow the Code of Conduct while doing so.
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            Explicit enforcement of the Code of Conduct applies to all official online hack.sv groups, in-person meetings, and events including:
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-2 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li className="ml-2">
                                The{" "}
                                <a
                                    href="https://hack.sv/discord"
                                    className="text-black hover:opacity-70 underline font-semibold"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        textDecorationColor: "#00CCFF",
                                    }}
                                >
                                    Discord
                                </a>
                            </li>
                            <li className="ml-2">
                                The{" "}
                                <a
                                    href="https://hack.sv"
                                    className="text-black hover:opacity-70 underline font-semibold"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        textDecorationColor: "#00CCFF",
                                    }}
                                >
                                    Events
                                </a>{" "}
                                &amp; online meetings/voice calls.
                            </li>
                            <li className="ml-2">
                                The{" "}
                                <a
                                    href="https://hack.sv/gh"
                                    className="text-black hover:opacity-70 underline font-semibold"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        textDecorationColor: "#00CCFF",
                                    }}
                                >
                                    GitHub projects
                                </a>
                            </li>
                            <li className="ml-2">In-person Meetings</li>
                        </ul>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            Anyone associated with hack.sv as an organizer, volunteer, or other contributor at a high level than a participant is required to follow and model the Code of Conduct in all situations, including places with explicit enforcement and in other spaces too. There is a higher bar for anyone associated with hack.sv.
                        </p>

                        {/* Hacker Values */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Hacker Values
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            These are the values to which people in the hack.sv community should aspire, to a reasonable extent.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Be friendly and welcoming
                                </p>
                            </div>
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Be patient
                                </p>
                            </div>
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Be thoughtful
                                </p>
                                <ul
                                    className="list-disc list-inside text-gray-800 space-y-1 ml-4"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    <li className="ml-2">Productive communication requires effort. Think about how your words will be interpreted.</li>
                                    <li className="ml-2">Remember that sometimes it is best to refrain entirely from commenting.</li>
                                </ul>
                            </div>
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Be respectful
                                </p>
                                <ul
                                    className="list-disc list-inside text-gray-800 space-y-1 ml-4"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    <li className="ml-2">In particular, respect differences of opinion.</li>
                                </ul>
                            </div>
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Be charitable
                                </p>
                                <ul
                                    className="list-disc list-inside text-gray-800 space-y-1 ml-4"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    <li className="ml-2">Interpret the arguments of others in good faith, do not seek to disagree.</li>
                                    <li className="ml-2">When we do disagree, try to understand why.</li>
                                </ul>
                            </div>
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Avoid destructive behavior<button 
                                        onClick={() => handleInternalLink('footnote-1')}
                                        className="text-black hover:opacity-70 underline cursor-pointer"
                                        style={{
                                            fontFamily: "Barlow Condensed, sans-serif",
                                            textDecorationColor: "#00CCFF",
                                        }}
                                    >
                                        <sup>1</sup>
                                    </button>:
                                </p>
                                <ul
                                    className="list-disc list-inside text-gray-800 space-y-1 ml-4"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    <li className="ml-2">Derailing: stay on topic; if you want to talk about something else, start a new conversation.</li>
                                    <li className="ml-2">Unconstructive criticism: don't merely condemn the current state of affairs; offer—or at least solicit—suggestions as to how things may be improved.</li>
                                    <li className="ml-2">Snarking (pithy, unproductive, sniping comments)</li>
                                    <li className="ml-2">Microaggressions: brief and commonplace verbal, behavioral, and environmental indignities that communicate hostile, derogatory or negative slights and insults to a person or group.</li>
                                </ul>
                            </div>
                        </div>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            People are complicated. You should expect to be misunderstood and to misunderstand others; when this inevitably occurs, resist the urge to be defensive or assign blame. Try not to take offense where no offense was intended. Give people the benefit of the doubt. Even if the intent was to provoke, do not rise to it. It is the responsibility of <em>all parties</em> to de-escalate conflict when it arises.
                        </p>

                        {/* Unwelcome behavior */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Unwelcome behavior
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            These actions are explicitly forbidden in hack.sv spaces:
                        </p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Expressing or provoking:
                                </p>
                                <ul
                                    className="list-disc list-inside text-gray-800 space-y-1 ml-4"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    <li className="ml-2">insulting, demeaning, hateful, or threatening remarks;</li>
                                    <li className="ml-2">unwelcome sexual advances, including sexually explicit content.</li>
                                </ul>
                            </div>
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Advertising or recruiting for events, companies, organizations, Et cetera - unless specifically given permission by hack.sv.
                                </p>
                                <ul
                                    className="list-disc list-inside text-gray-800 space-y-1 ml-4"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    <li className="ml-2">Referral programs, affiliate links, and other "social"/privacy invading advertisements are specifically prohibited</li>
                                    <li className="ml-2">All advertisements other than those for school led programs such as summer camps, hackathons, etc. are prohibited unless otherwise specified</li>
                                    <li className="ml-2">To receive permission for advertisement, mail.</li>
                                </ul>
                            </div>
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Posting spam-like content that disrupts the environment of the community.
                                </p>
                            </div>
                            <div>
                                <p
                                    className="text-black font-semibold mb-2"
                                    style={{
                                        fontFamily: "Barlow Condensed, sans-serif",
                                        fontSize: "16px",
                                    }}
                                >
                                    • Defrauding hack.sv by collecting funds or resources under false information, identity, or pretenses. This is treated as a <strong>third offense</strong> and could result in a call to <strong>the appropriate authorities</strong>.
                                </p>
                            </div>
                        </div>

                        {/* Moderation & Enforcement */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Moderation &amp; Enforcement
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            Please understand that speech and actions have consequences, and unacceptable behavior will not be tolerated. When you participate in{" "}
                            <button
                                onClick={() => handleInternalLink('where-does-the-code-of-conduct-apply')}
                                className="text-black hover:opacity-70 underline font-semibold cursor-pointer"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    textDecorationColor: "#00CCFF",
                                }}
                            >
                                areas where the code of conduct applies
                            </button>
                            , you should act in the spirit of the "Hacker Values". If you conduct yourself in a way that is explicitly forbidden by the Code of Conduct, you will be warned and asked to stop, and your messages may be removed by community moderators. Repeated offenses may result in a temporary or permanent ban from the community.
                        </p>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-2 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li className="ml-2">On your first offense, you will receive a written notice from one of our community moderators. Depending on the degree of the reported behavior, you may be asked to apologize directly to the party that you have offended, public apologies are rare, but we may ask for them.</li>
                            <li className="ml-2">On a second offense, you will be temporarily removed from the community. The period of the temporary ban may vary from 3 days to a month, decided based on the seriousness of the reported behavior. Please note that this ban <strong>does not indicate that you are no longer welcomed in the community</strong> - it represents an official warning for your behavior.</li>
                            <li className="ml-2">On a third offense, you may be asked to leave the community. Your account may be suspended for an indefinite amount of time, and you may be publicly identified if the offense is illegal or causes/caused danger to others.</li>
                        </ul>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            This procedure only serves as a general guideline for moderation &amp; enforcement of our community conduct. Under all circumstances, the Working Group or hack.sv's staff members may take any action we deem appropriate, including immediate removal from the community. Being banned from the hack.sv community may also prevent you from participating in our community events, including but not restricted to: all meetings, hackathons, or challenges.
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            Please understand that we will not restrict your ability to contact the{" "}
                            <button
                                onClick={() => handleInternalLink('working-group')}
                                className="text-black hover:opacity-70 underline font-semibold cursor-pointer"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    textDecorationColor: "#00CCFF",
                                }}
                            >
                                Code of Conduct working group
                            </button>{" "}
                            under reasonable circumstances. If you have any questions or concerns about our decision, please reach out to us directly at.
                        </p>

                        {/* Working Group */}
                        <h2
                            id="working-group"
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Working Group
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            The Working Group is responsible for handling conduct-related issues. Their mission is to de-escalate conflicts and try to resolve issues to the satisfaction of all parties. For all{" "}
                            <button
                                onClick={() => handleInternalLink('where-does-the-code-of-conduct-apply')}
                                className="text-black hover:opacity-70 underline font-semibold cursor-pointer"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    textDecorationColor: "#00CCFF",
                                }}
                            >
                                projects related to and/or maintained by hack.sv
                            </button>
                            , the Working Group is made up of the hack.sv staff team. The specific team member(s) handling each violation depend on the location and nature of the issue.
                        </p>

                        {/* Reporting Issues */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Reporting Issues
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            If you encounter a conduct-related issue, you should report it to the Working Group using the process described below. <strong>Do not</strong> post about the issue publicly or try to rally sentiment against a particular individual or group.
                        </p>

                        <div className="mb-8">
                            <p
                                className="text-black font-semibold mb-2"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    fontSize: "16px",
                                }}
                            >
                                • Mail
                            </p>
                            <ul
                                className="list-disc list-inside text-gray-800 space-y-1 ml-4"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    fontSize: "16px",
                                }}
                            >
                                <li className="ml-2">Your message will reach the Working Group.</li>
                                <li className="ml-2">Reports are confidential within the Working Group.</li>
                                <li className="ml-2">Should you choose to remain anonymous then the Working Group cannot notify you of the outcome of your report.</li>
                                <li className="ml-2">You may contact a member of the group directly if you do not feel comfortable contacting the group as a whole. That member will then raise the issue with the Working Group as a whole, preserving the privacy of the reporter (if desired).</li>
                                <li className="ml-2">If your report concerns a member of the Working Group, they will be recused from Working Group discussions of the report to a reasonable extent.</li>
                                <li className="ml-2">The Working Group will strive to handle reports with discretion and sensitivity, to protect the privacy of the involved parties, and to avoid conflicts of interest to a reasonable extent.</li>
                            </ul>
                        </div>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-2 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li className="ml-2">You should receive a response within 2 business days (likely sooner). (Should you choose to contact a single Working Group member, it may take longer to receive a response.)</li>
                            <li className="ml-2">The Working Group will meet to review the incident and determine what happened.</li>
                        </ul>

                        <div className="mb-4">
                            <ul
                                className="list-disc list-inside text-gray-800 space-y-1 ml-8"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    fontSize: "16px",
                                }}
                            >
                                <li className="ml-2">With the permission of the person reporting the incident, the Working Group may reach out to other community members for more context.</li>
                                <li className="ml-2">The Working Group will reach a decision as to how to act. These may include:</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <ul
                                className="list-disc list-inside text-gray-800 space-y-1 ml-12"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    fontSize: "16px",
                                }}
                            >
                                <li className="ml-2">Nothing.</li>
                                <li className="ml-2">A request for a private or public apology.</li>
                                <li className="ml-2">A private or public warning.</li>
                                <li className="ml-2">A suspension (for instance, asking someone to abstain for a week from the Discord or a GitHub project).</li>
                                <li className="ml-2">A permanent or temporary ban from some or all hack.sv spaces.</li>
                            </ul>
                        </div>

                        <ul
                            className="list-disc list-inside text-gray-800 mb-4 space-y-2 ml-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            <li className="ml-2">The Working Group will reach out to the original reporter to let them know the decision.</li>
                            <li className="ml-2">Appeals to the decision may be made to the Working Group or to any of its members directly<button 
                                onClick={() => handleInternalLink('footnote-2')}
                                className="text-black hover:opacity-70 underline cursor-pointer"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    textDecorationColor: "#00CCFF",
                                }}
                            >
                                <sup>2</sup>
                            </button>.</li>
                        </ul>

                        <p
                            className="text-gray-800 leading-relaxed mb-4 font-semibold"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            Note that the goal of the Code of Conduct and the Working Group is to resolve conflicts in the most harmonious way possible.
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            We hope that in most cases issues may be resolved through polite discussion and mutual agreement. Bannings and other forceful measures are to be employed only as a last resort.
                        </p>

                        <p
                            className="text-gray-800 leading-relaxed mb-4"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            Changes to the Code of Conduct should be proposed by mailing.
                        </p>

                        {/* Acknowledgments */}
                        <h2
                            className="text-black mt-12 mb-6"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "28px",
                                fontWeight: "600",
                            }}
                        >
                            Acknowledgments
                        </h2>

                        <p
                            className="text-gray-800 leading-relaxed mb-8"
                            style={{
                                fontFamily: "Barlow Condensed, sans-serif",
                                fontSize: "16px",
                            }}
                        >
                            This was adapted from{" "}
                            <a
                                href="https://hackclub.com/conduct"
                                className="text-black hover:opacity-70 underline font-semibold"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    textDecorationColor: "#00CCFF",
                                }}
                            >
                                Hack Club's Code of Conduct
                            </a>
                            .
                        </p>

                        {/* Footnotes */}
                        <div className="border-t border-gray-300 pt-6 mt-8 text-sm">
                            <p
                                id="footnote-1"
                                className="text-gray-600 mb-2"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    fontSize: "14px",
                                }}
                            >
                                <sup>1</sup> This Hacker Value is in a grey area, and the hack.sv Working Group reserves the right to ignore, or give special attention to offenses in this category specifically.
                            </p>
                            <p
                                id="footnote-2"
                                className="text-gray-600"
                                style={{
                                    fontFamily: "Barlow Condensed, sans-serif",
                                    fontSize: "14px",
                                }}
                            >
                                <sup>2</sup> This is another gray area, this rule is followed to a reasonable extent, and the Working Group reserves the right to ignore unnecessary appeals or appeals that violate Hacker Values.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}