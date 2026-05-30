import { addData } from "@/lib/database";
import { adminAuth } from "@/lib/firebase-admin";
import Gemini from "@/lib/gemini";
import { headers } from "next/headers";


interface History {
    role: string;
    parts: { text: string }[];
}

interface ChatType {
   history: History[],
   token: string
}

export const POST = async (req: Request) => {
  try {
    const header = await headers();
    const authorization = header.get("Authorization");
    if (!authorization || !authorization.startsWith("Bearer "))
      return new Response("Unauthorized", { status: 401 });
    const token = authorization.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const { oldHistory, newHistory, message, tokenChat, history } = await req.json();

    // Panggil Gemini
    const result = await Gemini(message, oldHistory);

    if (result.error) {
      return new Response(
        JSON.stringify({ message: result.error, status: false }),
        { status: 200 }
      );
    }

    const part = { role: "model", parts: [{ text: result.text }] };
    newHistory.push(part);

    if (history.length > 0) {
        const nowData = history.filter((data: ChatType) => data.token === tokenChat);
        if(nowData.length > 0) {
          nowData[0].history = newHistory;
          await addData("chats", { chats: history }, decoded.uid);
        } else {
          const newData: ChatType = { history: newHistory, token: tokenChat };
          history.push(newData);
          await addData("chats", { chats: history }, decoded.uid);
        }
    } else {
        const newData: ChatType = { history: newHistory, token: tokenChat };
        await addData("chats", { chats: [newData] }, decoded.uid);
    }

    return new Response(JSON.stringify({ message: "success", status: true }), { status: 200 });
  } catch (error) {
    console.error("[API Chat Error]", error);
    return new Response(
      JSON.stringify({ message: "Terjadi kesalahan pada server. Coba lagi.", status: false }),
      { status: 200 }
    );
  }
};
