/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { MixinAlert } from "@/lib/alert";
import { Loader } from "lucide-react";

const ChatMessage = memo(({ part, isLast, divRef, wait }: any) => {
    const copy = async (text: any) => {
        const nav = navigator.clipboard;
        const filtered = text.props.node.children.map((child: any) => child.children.map((c: any) => c.value));
        if (nav) {
            try {
                await nav.writeText(filtered.join(""));
                MixinAlert("success", "Copy berhasil!");
            } catch (err) {
                MixinAlert("error", "Copy gagal, mohon izinkan clipboard!");
            }
        } else {
            MixinAlert("error", "Copy gagal, browser anda tidak mendukung!");
        }
    }

    if (part.role === "user") {
        return (
            <div className="flex items-center self-end max-w-11/12 lg:max-w-2/3 gap-5">
                {wait && isLast && <Loader className="animate-spin" />}
                <div ref={isLast ? divRef : null} className="bg-slate-900 p-3 rounded-md">
                    <p className="text-sm text-slate-50">{part.parts[0].text}</p>
                </div>
            </div>
        );
    } else {
        return (
            <div ref={isLast ? divRef : null} className="!all-[revert] p-3 self-start w-full lg:max-w-10/12 non-format">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}
                    components={{
                        pre({ children }) {
                            return (
                                <pre className="!bg-gray-900 !relative !text-gray-100 !p-3 !rounded-md !overflow-x-auto">
                                    {children}
                                </pre>
                            )
                        },
                        code({ inline, className, children, ...props }: any) {
                            return !inline ? (
                                <code className={`${className} !font-semibold !overflow-x-auto`} {...props}>
                                    {children}
                                </code>
                            ) : (
                                <code className="bg-gray-800 px-1 rounded font-mono">{children}</code>
                            )
                        },
                        table({ children }) {
                            return (
                                <table className="!p-3 !overflow-x-auto !table-auto !border-collapse !w-full">
                                    {children}
                                </table>
                            )
                        },
                        tr({ children }) {
                            return (
                                <tr className="!border-b-2 odd:!bg-slate-100 even:!bg-slate-200 !border-slate-400">
                                    {children}
                                </tr>
                            )
                        },
                        th({ children }) {
                            return (
                                <th className="!border-b-2 !border-slate-400 !p-3 !bg-slate-400">
                                    {children}
                                </th>
                            )
                        },
                        td({ children }) {
                            return (
                                <td className="!border-b-2 !border-slate-400 !px-4 !p-2">
                                    {children}
                                </td>
                            )
                        },
                        ul({children}) {
                            return (
                                <ul className="!list-disc !list-inside !p-3">
                                    {children}
                                </ul>
                            )
                        },
                        ol({ children }) {
                            return (
                                <ol className="!list-decimal !list-inside !p-2">
                                    {children}
                                </ol>
                            )
                        },
                        
                    }}>
                    {part.parts[0].text}
                </ReactMarkdown>
            </div>
        );
    }
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;