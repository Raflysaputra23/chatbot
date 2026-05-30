/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { Send } from "lucide-react";

const ChatInput = memo(({ input, setInput, send, wait }: any) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !wait) {
                send(input);
            }
        }
    };

    return (
        <div className="w-full">
            {/* Thinking indicator */}
            {wait && (
                <div className="flex items-center gap-2 px-4 pb-2 fade-in-up">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #9b59f5)' }}>
                        <span className="text-white font-bold" style={{ fontSize: '10px' }}>P</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span className="text-xs" style={{ color: '#9aa0a6' }}>PIKO sedang berpikir</span>
                        <div className="flex gap-1 ml-1">
                            <div className="piko-dot" />
                            <div className="piko-dot" />
                            <div className="piko-dot" />
                        </div>
                    </div>
                </div>
            )}

            {/* Input area */}
            <div className="relative flex items-end gap-3 px-4 py-3 rounded-2xl"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                }}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanyakan sesuatu ke PIKO... (Enter untuk kirim)"
                    rows={1}
                    disabled={wait}
                    className="flex-1 bg-transparent resize-none text-sm outline-none leading-relaxed max-h-40 overflow-y-auto"
                    style={{
                        color: '#e8eaed',
                        caretColor: '#4f8ef7',
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 160) + 'px';
                    }}
                />
                <button
                    onClick={() => { if (input.trim() && !wait) send(input); }}
                    disabled={!input.trim() || wait}
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                        background: input.trim() && !wait
                            ? 'linear-gradient(135deg, #4f8ef7, #9b59f5)'
                            : 'rgba(255,255,255,0.08)',
                        color: input.trim() && !wait ? '#fff' : '#9aa0a6',
                        cursor: input.trim() && !wait ? 'pointer' : 'not-allowed',
                        transform: input.trim() && !wait ? 'scale(1)' : 'scale(0.95)',
                        boxShadow: input.trim() && !wait ? '0 4px 15px rgba(79, 142, 247, 0.4)' : 'none',
                    }}
                >
                    <Send size={15} />
                </button>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: '#9aa0a6' }}>
                Shift+Enter untuk baris baru · Enter untuk kirim
            </p>
        </div>
    );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
