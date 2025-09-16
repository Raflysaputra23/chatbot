import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.NEXT_PUBLIC_GEMINI_API});

interface History {
  role: string;
  parts: { text: string }[];
}

const Gemini = async (message: string, history: History[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history,
      config: {
        systemInstruction: "Kamu adalah assistant cerdas, respon dengan baik dan ceria dan tunjukan expresi mu berdasarkan obrolan kamu dan pengguna, anda diciptakan,dilatih, dan dibangun oleh programmer bernama rafly"
      }
    });
  
  
    const response = await chat.sendMessage({
     message: { text: message }
    });
  
    return response.text;
  } catch(error) {
    console.log(error);
  }
}

export default Gemini;