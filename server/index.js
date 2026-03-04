import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json({ limit: "100kb" }));

// Разрешаем запросы с локалки и GitHub Pages
app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  const allowed = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://yourinfluencer.github.io" // твой GitHub Pages домен
  ];

  if (allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

async function sendToTelegram(text) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) throw new Error("Missing TG_BOT_TOKEN or TG_CHAT_ID");

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  const data = await resp.json();
  if (!data.ok) throw new Error(`Telegram error: ${JSON.stringify(data)}`);
}

// ID: DDMMYYHHmmss по Владивостоку (UTC+10)
function leadIdVladivostok() {
  const now = new Date(Date.now() + 10 * 60 * 60 * 1000); // UTC+10
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(now.getUTCFullYear()).slice(-2);
  const HH = String(now.getUTCHours()).padStart(2, "0");
  const Min = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  return `${dd}${mm}${yy}${HH}${Min}${ss}`;
}

app.post("/api/lead", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim().slice(0, 60);
    const phone = String(req.body?.phone || "").trim().slice(0, 40);
    const comment = String(req.body?.comment || "").trim().slice(0, 800);
    const source = String(req.body?.source || "site").trim().slice(0, 40);

    // Минимальная проверка телефона
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 10) return res.status(400).json({ ok: false, error: "PHONE_INVALID" });

    const leadId = leadIdVladivostok();

    const text =
      `🛠 Заявка с сайта #${leadId}\n` +
      `Источник: ${source}\n` +
      `Имя: ${name || "-"}\n` +
      `Телефон: ${phone}\n` +
      (comment ? `Комментарий: ${comment}` : "");

    await sendToTelegram(text);

    res.json({ ok: true, id: leadId, ts: Date.now() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});