/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { Button } from "./button";
import { Loader, Send } from "lucide-react";
import { Textarea } from "./textarea"

const ChatInput = memo(({ input, setInput, send, wait }: any) => (
    <footer className="rounded-md flex justify-between items-center gap-2 pt-2 w-full">
        <div className="w-full relative">
            <Textarea value={input} className="bg-slate-200 max-h-[4rem] pe-16 overflow-y-auto resize-none focus-visible:ring-slate-950/70 border border-slate-400" placeholder="Masukan text..." onChange={(e) => setInput(e.target.value)} />
            <Button disabled={input.length == 0 || wait} className="cursor-pointer w-12 h-12 absolute right-3 bottom-2" onClick={() => send(input)}>{wait ? <Loader className="animate-spin" /> : <Send />}</Button>
        </div>
    </footer>
));

ChatInput.displayName = "ChatInput";

export default ChatInput;
