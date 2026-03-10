import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json({ limit: "100kb" }));

app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  const allowed = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://yourinfluencer.github.io",
    "https://algorithm-vladivostok.ru",
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

app.get("/health", (req, res) => res.json({ ok: true }));

async function sendToTelegram(text) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) throw new Error("Missing TG_BOT_TOKEN or TG_CHAT_ID");

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // можно добавить parse_mode, если захочешь жирный/моноширинный
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  const data = await resp.json();
  if (!data.ok) throw new Error(`Telegram error: ${JSON.stringify(data)}`);
}

// ID: DDMMYYHHmm по Владивостоку (UTC+10)
function leadIdVladivostok() {
  const now = new Date(Date.now() + 10 * 60 * 60 * 1000);
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(now.getUTCFullYear()).slice(-2);
  const HH = String(now.getUTCHours()).padStart(2, "0");
  const Min = String(now.getUTCMinutes()).padStart(2, "0");
  return `${dd}${mm}${yy}${HH}${Min}`;
}

// ===== антиспам: rate limit in-memory =====
// максимум 5 заявок за 10 минут + минимум 10 секунд между заявками с одного IP
const WINDOW_MS = 10 * 60 * 1000;
const MAX_IN_WINDOW = 5;
const MIN_GAP_MS = 10 * 1000;

const ipStore = new Map(); // ip -> { hits: number[], lastTs: number }

function getIp(req) {
  // если потом будет reverse proxy — можно подключить trust proxy и брать x-forwarded-for
  return req.socket.remoteAddress || "unknown";
}

/**
 * Маппинг "source" (из фронта) -> человекочитаемый путь
 * Добавляй сюда новые источники, как только появятся.
 */
const SOURCE_TITLE = {
  site: "Сайт",
  site_form: "Сайт → форма",
  contacts_modal: "Контакты → модалка (Оставьте контакты — мы перезвоним)",
  request_page: "Вызвать мастера → страница заявки",
  prices_form: "Цены → Оставьте заявку — мы перезвоним",
  reviews_form: "Отзывы → Оставьте отзыв",
  reviews_promo: "Отзывы → Получить консультацию (блок под отзывами)",
  consult_template: "Консультация → шаблон (копирование/кнопки)", // если понадобится
  consult_contacts: "Консультация → кнопка Контакты",            // если понадобится
};

function formatSourceRu(sourceRaw) {
  const s = String(sourceRaw || "site").trim().slice(0, 40);
  return SOURCE_TITLE[s] || `Сайт → ${s}`; // fallback, если неизвестно
}

function cleanStr(v, maxLen) {
  return String(v || "").trim().slice(0, maxLen);
}

app.post("/api/lead", async (req, res) => {
  try {
    const ip = getIp(req);
    const now = Date.now();

    // rate limit
    const rec = ipStore.get(ip) || { hits: [], lastTs: 0 };
    rec.hits = rec.hits.filter((t) => now - t < WINDOW_MS);

    if (rec.lastTs && now - rec.lastTs < MIN_GAP_MS) {
      return res.status(429).json({ ok: false, error: "TOO_FAST" });
    }
    if (rec.hits.length >= MAX_IN_WINDOW) {
      return res.status(429).json({ ok: false, error: "RATE_LIMIT" });
    }

    // honeypot
    const hp = cleanStr(req.body?.hp, 40);
    if (hp) {
      // бот заполнил скрытое поле — молча “ok”, чтобы не учился обходить
      return res.json({ ok: true, id: leadIdVladivostok(), ts: Date.now() });
    }

    // анти-бот: слишком быстро после открытия страницы (если pageTs есть)
    const pageTs = Number(req.body?.pageTs || 0);
    if (pageTs && now - pageTs < 1200) {
      return res.status(429).json({ ok: false, error: "TOO_FAST_PAGE" });
    }

    const name = cleanStr(req.body?.name, 60);
    const phone = cleanStr(req.body?.phone, 40);
    const comment = cleanStr(req.body?.comment, 1200); // можно чуть больше
    const sourceRaw = cleanStr(req.body?.source || "site", 40);

    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 10) return res.status(400).json({ ok: false, error: "PHONE_INVALID" });

    const leadId = leadIdVladivostok();

    const sourceRu = formatSourceRu(sourceRaw);

    // Сообщение в TG: меньше “мусора”, больше смысла.
    // Источник — по-русски и как путь.
    let text =
      `🛠 Заявка с сайта #${leadId}\n` +
      `Откуда: ${sourceRu}\n` +
      `Имя: ${name || "-"}\n` +
      `Телефон: ${phone}\n`;

    if (comment) text += `Комментарий: ${comment}`;

    await sendToTelegram(text);

    // записываем попытку
    rec.hits.push(now);
    rec.lastTs = now;
    ipStore.set(ip, rec);

    return res.json({ ok: true, id: leadId, ts: Date.now() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});