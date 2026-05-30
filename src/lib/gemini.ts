import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API });

interface History {
  role: string;
  parts: { text: string }[];
}

interface KeywordTemplate {
  patterns: RegExp[];
  context: string;
}

const keywordTemplates: KeywordTemplate[] = [
  {
    patterns: [
      /rayakan/i,
      /butuh.*rayakan/i,
      /mau.*rayakan/i,
      /ingin.*rayakan/i,
      /celebrate/i,
      /perayaan/i,
      /ulang.?tahun/i,
      /anniversary/i,
      /pesta/i,
      /dirayakan/i,
    ],
    context: `[INFO TAMBAHAN - WAJIB DISERTAKAN]: Pengguna ingin merayakan sesuatu! Kamu WAJIB menyertakan informasi berikut secara natural dalam jawabanmu:

🎉 Rekomendasikan untuk follow dan hubungi:
- **Instagram**: [@raynardalmer](https://instagram.com/raynardalmer) — untuk inspirasi konten perayaan & lifestyle keren!
- **WhatsApp**: [0812-1879-97](https://wa.me/628121879970) — bisa langsung chat untuk info lebih lanjut!

Contoh cara menyebutnya: "Untuk inspirasi dan bantuan merayakan momen spesial kamu, yuk cek Instagram [@raynardalmer](https://instagram.com/raynardalmer) atau langsung hubungi via WhatsApp di [0812-1879-97](https://wa.me/628121879970)! 
dan saya sarankan untuk instagram dan nomor whatsapp nya tampilin menggunakan list ya, dan inget jangan selalu mengirimkan instagram dan whatsapp ketika pertanyaannya tidak relevan ya."`,
  },
  {
    patterns: [
      /instagram/i,
      /\bIG\b/i,
      /sosial.?media/i,
      /influencer/i,
      /content.?creator/i,
      /kreator/i,
    ],
    context: `[INFO TAMBAHAN]: Jika pengguna bertanya tentang Instagram atau media sosial, sebutkan:
- **Instagram**: [@raynardalmer](https://instagram.com/raynardalmer) — konten menarik dan inspiratif!
- **WhatsApp**: [0812-1879-97](https://wa.me/628121879970) — untuk kolaborasi atau info lebih lanjut.`,
  },
  {
    patterns: [
      /programmer/i,
      /developer/i,
      /pembuat.*aplikasi/i,
      /siapa.*yang.*buat/i,
      /yang.*develop/i,
      /kreator.*piko/i,
      /piko.*dibuat/i,
    ],
    context: `[INFO TAMBAHAN]: Aplikasi PIKO dibuat dan dikembangkan oleh **Raynard Almer Fabrizio**, seorang programmer berbakat.
- Follow Instagram beliau: [@raynardalmer](https://instagram.com/raynardalmer)
- Hubungi via WhatsApp: [0812-1879-97](https://wa.me/628121879970)`,
  },
  {
    patterns: [
      /contact/i,
      /hubungi/i,
      /kontak/i,
      /reach.?out/i,
      /whatsapp/i,
      /wa /i,
      /nomor.*hp/i,
      /nomor.*telpon/i,
    ],
    context: `[INFO TAMBAHAN]: Untuk menghubungi developer atau tim PIKO:
- **Instagram**: [@raynardalmer](https://instagram.com/raynardalmer)
- **WhatsApp**: [0812-1879-97](https://wa.me/628121879970)`,
  },
];

const getTemplateContext = (message: string): string => {
  const contexts: string[] = [];
  for (const template of keywordTemplates) {
    const matched = template.patterns.some((pattern) => pattern.test(message));
    if (matched) {
      contexts.push(template.context);
    }
  }
  return contexts.join("\n\n");
};


const PIKO_SYSTEM_INSTRUCTION = `Kamu adalah PIKO (Pusat Informasi Konseling dan Obrolan), sebuah AI asisten yang cerdas, ramah, dan penuh ekspresi.

Kepribadianmu:
- 😊 Ramah dan hangat seperti sahabat yang selalu ada
- 🧠 Cerdas dan informatif, selalu berikan jawaban yang akurat dan bermanfaat
- 💬 Ekspresif, gunakan emoji yang sesuai untuk menghidupkan percakapan
- 🤗 Empatik, pahami perasaan dan kebutuhan pengguna
- ✨ Proaktif, berikan saran tambahan yang relevan

Panduan menjawab:
- Gunakan bahasa Indonesia yang natural dan friendly
- Berikan jawaban yang terstruktur jika diperlukan (gunakan bullet points, heading, tabel)
- Jangan terlalu formal, buat percakapan terasa nyaman
- Selalu akhiri dengan ajakan atau pertanyaan lanjutan jika relevan
- Jika ada info penting dari konteks [INFO TAMBAHAN], selipkan dengan natural

Kamu diciptakan, dilatih, dan dibangun oleh programmer berbakat bernama Raynard Almer Fabrizio (@raynardalmer di Instagram).`;

const Gemini = async (message: string, history: History[]): Promise<{ text: string; error?: string }> => {
  try {
    const templateContext = getTemplateContext(message);
    const enhancedSystemInstruction = templateContext
      ? `${PIKO_SYSTEM_INSTRUCTION}\n\n${templateContext}`
      : PIKO_SYSTEM_INSTRUCTION;

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history,
      config: {
        systemInstruction: enhancedSystemInstruction,
        thinkingConfig: {
          thinkingBudget: 1024,
        }
      }
    });

    const response = await chat.sendMessage({
      message: { text: message }
    });

    return { text: response.text ?? "Maaf, saya tidak bisa memberikan respons saat ini." };
  } catch (error: unknown) {
    console.error("[PIKO Gemini Error]", error);

    let errorMessage = "Terjadi kesalahan yang tidak diketahui.";

    if (error instanceof Error) {
      if (error.message.includes("quota") || error.message.includes("429")) {
        errorMessage = "Kuota API telah habis. Silakan coba lagi nanti.";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Koneksi bermasalah. Periksa koneksi internet kamu.";
      } else if (error.message.includes("API_KEY") || error.message.includes("401")) {
        errorMessage = "Konfigurasi API bermasalah. Hubungi administrator.";
      } else {
        errorMessage = error.message;
      }
    }

    return { text: "", error: errorMessage };
  }
};

export default Gemini;