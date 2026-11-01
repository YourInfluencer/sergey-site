import "dotenv/config";
import express from "express";
import { appendFile } from "node:fs/promises";

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));

app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  const allowed = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://www.algorithm-vladivostok.ru",
    "https://algorithm-vladivostok.ru",
  ];

  if (allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/health", (req, res) => res.json({ ok: true }));

async function sendToTelegram(text) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) throw new Error("Missing TG_BOT_TOKEN or TG_CHAT_ID");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: controller.signal,
    });

    const data = await resp.json();
    if (!data.ok) throw new Error(`Telegram error: ${JSON.stringify(data)}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function sendToVk(text) {
  const token = process.env.VK_GROUP_TOKEN;
  const peerId = process.env.VK_PEER_ID;
  if (!token || !peerId) throw new Error("Missing VK_GROUP_TOKEN or VK_PEER_ID");

  const params = new URLSearchParams();
  params.set("access_token", token);
  params.set("v", "5.199");
  params.set("peer_id", peerId);
  params.set("random_id", String(Date.now()));
  params.set("message", text);

  const resp = await fetch("https://api.vk.com/method/messages.send", {
    method: "POST",
    body: params,
  });

  const data = await resp.json();
  if (data.error) throw new Error(`VK error: ${JSON.stringify(data.error)}`);
  return data;
}

async function saveLeadToFile(lead) {
  await appendFile("./leads.jsonl", JSON.stringify(lead, null, 0) + "\n", "utf8");
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
const WINDOW_MS = 10 * 60 * 1000;
const MAX_IN_WINDOW = 5;
const MIN_GAP_MS = 10 * 1000;

const ipStore = new Map();

function getIp(req) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

const SOURCE_TITLE = {
  site: "Сайт",
  site_form: "Сайт → форма",
  contacts_modal: "Контакты → модалка (Оставьте контакты — мы перезвоним)",
  request_page: "Вызвать мастера → страница заявки",
  prices_form: "Цены → Оставьте заявку — мы перезвоним",
  reviews_form: "Отзывы → Оставьте отзыв",
  reviews_promo: "Отзывы → Получить консультацию (блок под отзывами)",
  consult_template: "Консультация → шаблон (копирование/кнопки)",
  consult_contacts: "Консультация → кнопка Контакты",
};

function formatSourceRu(sourceRaw) {
  const s = String(sourceRaw || "site").trim().slice(0, 40);
  return SOURCE_TITLE[s] || `Сайт → ${s}`;
}

function cleanStr(v, maxLen) {
  return String(v || "").trim().slice(0, maxLen);
}

app.post("/api/lead", async (req, res) => {
  try {
    const ip = getIp(req);
    const now = Date.now();

    const rec = ipStore.get(ip) || { hits: [], lastTs: 0 };
    rec.hits = rec.hits.filter((t) => now - t < WINDOW_MS);

    if (rec.lastTs && now - rec.lastTs < MIN_GAP_MS) {
      return res.status(429).json({ ok: false, error: "TOO_FAST" });
    }
    if (rec.hits.length >= MAX_IN_WINDOW) {
      return res.status(429).json({ ok: false, error: "RATE_LIMIT" });
    }

    const hp = cleanStr(req.body?.hp, 40);
    if (hp) {
      return res.json({ ok: true, id: leadIdVladivostok(), ts: Date.now() });
    }

    const pageTs = Number(req.body?.pageTs || 0);
    if (pageTs && now - pageTs < 1200) {
      return res.status(429).json({ ok: false, error: "TOO_FAST_PAGE" });
    }

    const name = cleanStr(req.body?.name, 60);
    const phone = cleanStr(req.body?.phone, 40);
    const comment = cleanStr(req.body?.comment, 1200);
    const sourceRaw = cleanStr(req.body?.source || "site", 40);

    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 10) {
      return res.status(400).json({ ok: false, error: "PHONE_INVALID" });
    }

    const leadId = leadIdVladivostok();
    const sourceRu = formatSourceRu(sourceRaw);

    let text =
      `🛠 Заявка с сайта #${leadId}\n` +
      `Откуда: ${sourceRu}\n` +
      `Имя: ${name || "-"}\n` +
      `Телефон: ${phone}\n`;

    if (comment) text += `Комментарий: ${comment}`;

    const leadData = {
      id: leadId,
      createdAt: new Date().toISOString(),
      createdAtVladivostok: leadId,
      ip,
      source: sourceRu,
      sourceRaw,
      name,
      phone,
      comment,
      userAgent: req.headers["user-agent"] || "",
    };

    await saveLeadToFile(leadData);

    try {
      await sendToVk(text);
      console.log("VK lead sent:", leadId);
    } catch (vkErr) {
      console.error("VK send error:", vkErr);
    }

    // Telegram с Timeweb сейчас недоступен, поэтому не блокируем заявку.
    // Если позже заработает, можно включить обратно через try/catch:
    // try { await sendToTelegram(text); } catch (tgErr) { console.error("Telegram send error:", tgErr); }

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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on port ${PORT}`);
});