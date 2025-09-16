/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Loader, Send } from "lucide-react";

const ChatInput = memo(({ input, setInput, send, wait }: any) => (
    <footer className="rounded-md flex justify-between items-center gap-2 pt-2 w-full">
        <Input value={input} type="text" className="bg-slate-200 focus-visible:ring-slate-950/30" placeholder="Masukan text..." onChange={(e) => setInput(e.target.value)} />
        <Button disabled={input.length == 0 || wait} className="cursor-pointer" onClick={send}>{wait ? <Loader className="animate-spin" /> : <Send />}</Button>
    </footer>
));

ChatInput.displayName = "ChatInput";

export default ChatInput;
