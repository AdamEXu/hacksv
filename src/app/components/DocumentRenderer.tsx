"use client";

import { JSX } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { CYAN_COLOR } from "../constants";

// Types for our parsed content
interface ParsedDocument {
    title: string;
    dates: {
        effectiveDate: string;
        lastUpdated: string;
    } | null;
    sections: DocumentSection[];
    footnotes: DocumentFootnote[];
}

interface DocumentFootnote {
    id: string;
    content: string;
}

interface DocumentSection {
    title: string;
    content: MarkdownNode[];
}

interface MarkdownNode {
    type: string;
    children?: MarkdownNode[];
    value?: string;
    url?: string;
    alt?: string;
    depth?: number;
    ordered?: boolean;
}

interface DocumentRendererProps {
    markdown: string;
}

export function DocumentRenderer({ markdown }: DocumentRendererProps) {
    const parsedDoc = parseMarkdown(markdown);

    return (
        <div className="w-full" style={{ backgroundColor: CYAN_COLOR }}>
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Title */}
                <h1
                    className="text-center text-white mb-12"
                    style={{
                        fontFamily: "VT323, monospace",
                        fontSize: "48px",
                        lineHeight: "1.2",
                    }}
                >
                    {parsedDoc.title}
                </h1>

                {/* Dates Section */}
                {parsedDoc.dates && (
                    <div className="text-center mb-8">
                        {parsedDoc.dates.effectiveDate && (
                            <p
                                className="text-white mb-2"
                                style={{
                                    fontFamily: "Nunito Sans, sans-serif",
                                    fontSize: "18px",
                                    fontWeight: "500",
                                }}
                            >
                                <span className="font-medium">
                                    Effective Date:
                                </span>{" "}
                                {parsedDoc.dates.effectiveDate}
                            </p>
                        )}
                        {parsedDoc.dates.lastUpdated && (
                            <p
                                className="text-white"
                                style={{
                                    fontFamily: "Nunito Sans, sans-serif",
                                    fontSize: "18px",
                                    fontWeight: "500",
                                }}
                            >
                                <span className="font-medium">
                                    Last Updated:
                                </span>{" "}
                                {parsedDoc.dates.lastUpdated}
                            </p>
                        )}
                    </div>
                )}

                {/* Divider */}
                <div className="border-t-2 border-white mb-12"></div>

                {/* Sections */}
                {parsedDoc.sections.map((section, index) => (
                    <div
                        key={index}
                        className="rounded-lg p-8 mb-8"
                        style={{
                            border: "4px solid black",
                            backgroundColor: "white",
                        }}
                    >
                        <h2
                            className="text-black mb-6"
                            style={{
                                fontFamily: "Nunito Sans, sans-serif",
                                fontSize: "32px",
                                fontWeight: "500",
                            }}
                        >
                            {section.title}
                        </h2>
                        {section.content.map((node, nodeIndex) => (
                            <div key={nodeIndex}>{renderNode(node)}</div>
                        ))}
                    </div>
                ))}

                {/* Footnotes */}
                {parsedDoc.footnotes.length > 0 && (
                    <div
                        className="rounded-lg p-8"
                        style={{
                            border: "4px solid black",
                            backgroundColor: "white",
                        }}
                    >
                        <div className="pt-6 text-sm">
                            {parsedDoc.footnotes.map((footnote, index) => (
                                <p
                                    key={index}
                                    id={`footnote-${footnote.id}`}
                                    className="text-gray-600 mb-2"
                                    style={{
                                        fontFamily:
                                            "Nunito Sans, sans-serif",
                                        fontSize: "14px",
                                    }}
                                >
                                    <sup>{footnote.id}</sup> {footnote.content}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function parseMarkdown(markdown: string): ParsedDocument {
    const processor = unified().use(remarkParse).use(remarkGfm);
    const tree = processor.parse(markdown);

    let title = "";
    let dates = null;
    const sections: DocumentSection[] = [];
    const footnotes: DocumentFootnote[] = [];
    let currentSection: DocumentSection | null = null;

    // Extract title and parse sections
    let foundDatesSection = false;

    for (const node of tree.children as MarkdownNode[]) {
        if (node.type === "heading" && node.depth === 1) {
            title = extractTextFromNode(node);
        } else if (node.type === "paragraph" && !title) {
            // Skip paragraphs before title
            continue;
        } else if (node.type === "paragraph" && title && !foundDatesSection) {
            // Check if this is a dates paragraph
            const text = extractTextFromNode(node);

            // Look for effective date
            if (text.includes("Effective Date:")) {
                if (!dates) {
                    dates = { effectiveDate: "", lastUpdated: "" };
                }
                const match = text.match(/Effective Date:\s*(.+?)$/);
                if (match) {
                    dates.effectiveDate = match[1].trim();
                }
                continue;
            }

            // Look for last updated
            if (text.includes("Last Updated:")) {
                if (!dates) {
                    dates = { effectiveDate: "", lastUpdated: "" };
                }
                const match = text.match(/Last Updated:\s*(.+?)$/);
                if (match) {
                    dates.lastUpdated = match[1].trim();
                }
                continue;
            }

            // If we have dates and this paragraph doesn't contain date info, we're done
            if (dates && (dates.effectiveDate || dates.lastUpdated)) {
                foundDatesSection = true;
            }
        } else if (node.type === "thematicBreak") {
            // Skip the --- divider and mark dates section as complete
            foundDatesSection = true;
            continue;
        } else if (node.type === "heading" && node.depth === 2) {
            // Start new section
            foundDatesSection = true;
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                title: extractTextFromNode(node),
                content: [],
            };
        } else if (currentSection) {
            // Add content to current section
            currentSection.content.push(node);
        }
    }

    // Add the last section
    if (currentSection) {
        sections.push(currentSection);
    }

    // Parse footnotes from the markdown
    parseFootnotes(markdown, footnotes);

    return { title, dates, sections, footnotes };
}

function parseFootnotes(markdown: string, footnotes: DocumentFootnote[]): void {
    // Parse footnote definitions like [^1]: footnote text
    const footnoteRegex = /\[\^(\d+)\]:\s*(.+?)(?=\n\[\^|\n\n|\n$|$)/g;
    let match;

    while ((match = footnoteRegex.exec(markdown)) !== null) {
        footnotes.push({
            id: match[1],
            content: match[2].trim(),
        });
    }
}

function extractTextFromNode(node: MarkdownNode): string {
    if (node.value) return node.value;
    if (node.children) {
        return node.children.map(extractTextFromNode).join("");
    }
    return "";
}

function renderListItem(node: MarkdownNode): JSX.Element {
    // Special handling for list items to avoid wrapping in paragraphs
    if (node.type === "listItem") {
        return (
            <>
                {node.children?.map((child, i) => {
                    // If the child is a paragraph, render its children directly
                    if (child.type === "paragraph") {
                        return (
                            <span key={i}>
                                {child.children?.map((grandchild, j) => (
                                    <span key={j}>
                                        {renderNode(grandchild)}
                                    </span>
                                ))}
                            </span>
                        );
                    }
                    return <span key={i}>{renderNode(child)}</span>;
                })}
            </>
        );
    }
    return renderNode(node);
}

function renderNode(node: MarkdownNode): JSX.Element {
    const baseTextStyle = {
        fontFamily: "Nunito Sans, sans-serif",
        fontSize: "16px",
    };

    switch (node.type) {
        case "heading":
            if (node.depth === 3) {
                return (
                    <h3
                        className="text-black mb-4 mt-8"
                        style={{
                            fontFamily: "Nunito Sans, sans-serif",
                            fontSize: "24px",
                            fontWeight: "500",
                        }}
                    >
                        {node.children?.map((child, i) => (
                            <span key={i}>{renderNode(child)}</span>
                        ))}
                    </h3>
                );
            } else if (node.depth === 4) {
                return (
                    <h4
                        className="text-black mb-4 mt-6"
                        style={{
                            fontFamily: "Nunito Sans, sans-serif",
                            fontSize: "20px",
                            fontWeight: "500",
                        }}
                    >
                        {node.children?.map((child, i) => (
                            <span key={i}>{renderNode(child)}</span>
                        ))}
                    </h4>
                );
            }
            break;

        case "paragraph":
            return (
                <p
                    className="text-gray-800 mb-4 leading-relaxed"
                    style={baseTextStyle}
                >
                    {node.children?.map((child, i) => (
                        <span key={i}>{renderNode(child)}</span>
                    ))}
                </p>
            );

        case "list":
            const ListComponent = node.ordered ? "ol" : "ul";
            return (
                <ListComponent
                    className="list-disc list-inside text-gray-800 mb-4 space-y-1 ml-4"
                    style={baseTextStyle}
                >
                    {node.children?.map((child, i) => (
                        <li key={i}>{renderListItem(child)}</li>
                    ))}
                </ListComponent>
            );

        case "listItem":
            // This should not be called directly, use renderListItem instead
            return (
                <>
                    {node.children?.map((child, i) => (
                        <span key={i}>{renderNode(child)}</span>
                    ))}
                </>
            );

        case "table":
            return (
                <div className="mb-6 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <tbody>
                            {node.children?.map((child, i) => (
                                <tr
                                    key={i}
                                    className={
                                        i === 0 ? "bg-gray-50 font-medium" : ""
                                    }
                                >
                                    {renderNode(child)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case "tableRow":
            return (
                <>
                    {node.children?.map((child, i) => (
                        <td
                            key={i}
                            className="border border-gray-300 px-3 py-2 text-left"
                            style={baseTextStyle}
                        >
                            {renderNode(child)}
                        </td>
                    ))}
                </>
            );

        case "tableCell":
            return (
                <>
                    {node.children?.map((child, i) => (
                        <span key={i}>{renderNode(child)}</span>
                    ))}
                </>
            );

        case "strong":
            return (
                <span className="font-medium text-black">
                    {node.children?.map((child, i) => (
                        <span key={i}>{renderNode(child)}</span>
                    ))}
                </span>
            );

        case "emphasis":
            return (
                <em className="italic text-gray-700">
                    {node.children?.map((child, i) => (
                        <span key={i}>{renderNode(child)}</span>
                    ))}
                </em>
            );

        case "link":
            const linkText =
                node.children
                    ?.map((child) => (child.type === "text" ? child.value : ""))
                    .join("") || "";
            return (
                <a href={node.url} data-text={linkText}>
                    {node.children?.map((child, i) => (
                        <span key={i}>{renderNode(child)}</span>
                    ))}
                </a>
            );

        case "image":
            return (
                <img
                    src={node.url}
                    alt={node.alt || ""}
                    className="max-w-full h-auto rounded-lg my-6"
                    style={{
                        border: "2px solid #e5e7eb",
                    }}
                />
            );

        case "text":
            // Handle footnote references like [^1]
            if (node.value) {
                const footnoteRefRegex = /\[\^(\d+)\]/g;
                const parts = node.value.split(footnoteRefRegex);

                return (
                    <>
                        {parts.map((part, i) => {
                            // If this part is a number (footnote ID), render as clickable link
                            if (i % 2 === 1) {
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const element =
                                                document.getElementById(
                                                    `footnote-${part}`
                                                );
                                            if (element) {
                                                element.scrollIntoView({
                                                    behavior: "smooth",
                                                });
                                            }
                                        }}
                                        className="text-black hover:opacity-70 underline cursor-pointer"
                                        style={{
                                            fontFamily:
                                                "Nunito Sans, sans-serif",
                                            textDecorationColor: "#00CCFF",
                                        }}
                                    >
                                        <sup>{part}</sup>
                                    </button>
                                );
                            }
                            // Regular text
                            return part;
                        })}
                    </>
                );
            }
            return <>{node.value}</>;

        case "break":
            return <br />;

        default:
            return <></>;
    }

    return <></>;
}
