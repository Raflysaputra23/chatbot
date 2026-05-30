/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { MixinAlert } from "@/lib/alert";
import { Copy, Check, ExternalLink } from "lucide-react";

// Code block with copy button
const CodeBlock = ({ children, language }: { children: React.ReactNode; language?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = extractText(children);
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            MixinAlert("success", "Kode berhasil dicopy!");
        }).catch(() => {
            MixinAlert("error", "Gagal copy, izinkan clipboard!");
        });
    };

    const extractText = (node: any): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractText).join("");
        if (node?.props?.children) return extractText(node.props.children);
        return "";
    };

    return (
        <div className="relative my-3 rounded-xl overflow-hidden"
            style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2"
                style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-xs font-mono" style={{ color: '#9aa0a6' }}>
                    {language || 'code'}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-all"
                    style={{
                        color: copied ? '#34d399' : '#9aa0a6',
                        background: 'rgba(255,255,255,0.05)',
                    }}
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
                {children}
            </pre>
        </div>
    );
};

const ChatMessage = memo(({ part, isLast, divRef }: any) => {
    const [msgCopied, setMsgCopied] = useState(false);

    const copyMessage = () => {
        navigator.clipboard.writeText(part.parts[0].text).then(() => {
            setMsgCopied(true);
            setTimeout(() => setMsgCopied(false), 2000);
            MixinAlert("success", "Pesan berhasil dicopy!");
        }).catch(() => {
            MixinAlert("error", "Gagal copy!");
        });
    };

    if (part.role === "user") {
        return (
            <div className="flex items-end justify-end gap-2 fade-in-up px-4">
                <div ref={isLast ? divRef : null}
                    className="max-w-[85%] lg:max-w-[65%] px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed"
                    style={{
                        background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)',
                        color: '#ffffff',
                        boxShadow: '0 4px 20px rgba(79, 142, 247, 0.3)',
                    }}>
                    <p>{part.parts[0].text}</p>
                </div>
                {/* User avatar */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: 'rgba(79, 142, 247, 0.2)', color: '#4f8ef7' }}>
                    U
                </div>
            </div>
        );
    } else {
        return (
            <div ref={isLast ? divRef : null}
                className="flex items-start gap-3 fade-in-up px-4 group">
                {/* PIKO Avatar */}
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1"
                    style={{ background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)' }}>
                    <span className="text-white">P</span>
                </div>

                <div className="flex-1 min-w-0">
                    {/* PIKO label */}
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold gradient-text">PIKO</span>
                        {/* Copy button */}
                        <button
                            onClick={copyMessage}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg"
                            style={{ color: msgCopied ? '#34d399' : '#9aa0a6', background: 'rgba(255,255,255,0.05)' }}
                        >
                            {msgCopied ? <Check size={11} /> : <Copy size={11} />}
                            {msgCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    {/* Markdown content */}
                    <div className="piko-markdown">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                pre({ children, ...props }) {
                                    // Extract language from className
                                    const codeEl = (children as any)?.props;
                                    const className = codeEl?.className || '';
                                    const lang = className.replace('language-', '') || '';
                                    return (
                                        <CodeBlock language={lang}>
                                            {children}
                                        </CodeBlock>
                                    );
                                },
                                code({ inline, className, children, ...props }: any) {
                                    return !inline ? (
                                        <code className={className} {...props}>{children}</code>
                                    ) : (
                                        <code {...props}>{children}</code>
                                    );
                                },
                                table({ children }) {
                                    return (
                                        <div className="overflow-x-auto my-3 rounded-xl"
                                            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                {children}
                                            </table>
                                        </div>
                                    );
                                },
                                thead({ children }) {
                                    return <thead>{children}</thead>;
                                },
                                th({ children }) {
                                    return (
                                        <th style={{
                                            background: 'rgba(79, 142, 247, 0.15)',
                                            color: '#c9d1e8',
                                            fontWeight: 600,
                                            padding: '10px 16px',
                                            textAlign: 'left',
                                            borderBottom: '1px solid rgba(79, 142, 247, 0.25)',
                                            fontSize: '0.875rem',
                                        }}>
                                            {children}
                                        </th>
                                    );
                                },
                                td({ children }) {
                                    return (
                                        <td style={{
                                            padding: '8px 16px',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            fontSize: '0.875rem',
                                            color: '#c8cdd6',
                                        }}>
                                            {children}
                                        </td>
                                    );
                                },
                                tr({ children }) {
                                    return (
                                        <tr style={{ transition: 'background 0.15s' }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLElement).style.background = 'rgba(79, 142, 247, 0.05)';
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                                            }}>
                                            {children}
                                        </tr>
                                    );
                                },
                                ul({ children }) {
                                    return <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>{children}</ul>;
                                },
                                ol({ children }) {
                                    return <ol style={{ listStyle: 'decimal', paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>{children}</ol>;
                                },
                                li({ children }) {
                                    return <li style={{ marginBottom: '0.25rem' }}>{children}</li>;
                                },
                                blockquote({ children }) {
                                    return (
                                        <blockquote style={{
                                            borderLeft: '3px solid #4f8ef7',
                                            paddingLeft: '1rem',
                                            marginLeft: 0,
                                            color: '#9aa0a6',
                                            fontStyle: 'italic',
                                            marginBottom: '0.75rem',
                                        }}>
                                            {children}
                                        </blockquote>
                                    );
                                },
                                h1({ children }) {
                                    return <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f1f3f4' }}>{children}</h1>;
                                },
                                h2({ children }) {
                                    return <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1rem', color: '#f1f3f4' }}>{children}</h2>;
                                },
                                h3({ children }) {
                                    return <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem', marginTop: '0.8rem', color: '#f1f3f4' }}>{children}</h3>;
                                },
                                a({ children, href }) {
                                    const isExternal = href?.startsWith('http') || href?.startsWith('https');
                                    return (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 transition-all"
                                            style={{
                                                color: '#4f8ef7',
                                                textDecoration: 'none',
                                                borderBottom: '1px solid rgba(79, 142, 247, 0.4)',
                                                paddingBottom: '1px',
                                                fontWeight: 500,
                                            }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLAnchorElement).style.color = '#89b8ff';
                                                (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#89b8ff';
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLAnchorElement).style.color = '#4f8ef7';
                                                (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'rgba(79, 142, 247, 0.4)';
                                            }}
                                        >
                                            {children}
                                            {isExternal && <ExternalLink size={11} style={{ flexShrink: 0, opacity: 0.7 }} />}
                                        </a>
                                    );
                                },
                                hr() {
                                    return <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }} />;
                                },
                                strong({ children }) {
                                    return <strong style={{ fontWeight: 600, color: '#c9d1e8' }}>{children}</strong>;
                                },
                                p({ children }) {
                                    return <p style={{ marginBottom: '0.6rem' }}>{children}</p>;
                                },
                            }}>
                            {part.parts[0].text}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        );
    }
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;