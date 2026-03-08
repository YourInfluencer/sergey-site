import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
/*import "./App.css";*/

import Home from "./pages/Home.jsx";
import Prices from "./pages/Prices.jsx";
import Services from "./pages/Services.jsx";
import Consult from "./pages/Consult.jsx";
import RequestPage from "./pages/RequestPage.jsx";
import Reviews from "./pages/Reviews.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

const PHONE = "+7 (914) 774-24-68";
const TG = "https://t.me/SergejVladimirovichVDK";
const WA = "https://wa.me/89147742468"; // заглушка

function getTheme() {
  const saved = localStorage.getItem("theme");
  return saved === "dark" ? "dark" : "light";
}
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}
function digitsOnly(s) {
  return String(s || "").replace(/[^\d]/g, "");
}

export default function App() {
  const [theme, setThemeState] = useState(getTheme());

  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [sentText, setSentText] = useState("");
  const [sending, setSending] = useState(false);

  const [toast, setToast] = useState(null); // {type:"ok"|"err", text}
  const [toastKey, setToastKey] = useState(0);

  const location = useLocation();

  useEffect(() => setTheme(theme), [theme]);

  // скролл наверх при смене страницы
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Esc закрывает модалку
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setIsContactsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function showToast(type, text) {
    setToast({ type, text });
    setToastKey((k) => k + 1);
  }
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toastKey, toast]);

  function openContacts() {
    setSentText("");
    setForm({ name: "", phone: "" });
    setIsContactsOpen(true);
  }
  function closeContacts() {
    setIsContactsOpen(false);
  }

  async function sendLead(payload) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const resp = await fetch(`${API}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // устойчиво читаем тело
  const raw = await resp.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }

  // если сервер вернул ошибку по HTTP — это ошибка
  if (!resp.ok) {
    const msg = data?.error || raw || `HTTP_${resp.status}`;
    throw new Error(msg);
  }

  // ✅ если HTTP ok, но JSON пустой/без ok — считаем успехом
  // (потому что у тебя факт отправки подтверждается TG)
  if (data && data.ok === false) {
    const msg = data?.error || "UNKNOWN_SERVER_ERROR";
    throw new Error(msg);
  }

  // нормализуем
  return {
    ok: true,
    id: data?.id ?? null,
    ts: data?.ts ?? null,
  };
}

  async function onSubmitModal(e) {
    e.preventDefault();
    setSentText("");

    if (digitsOnly(form.phone).length < 10) {
      showToast("err", "Введите телефон (минимум 10 цифр)");
      return;
    }

    try {
      setSending(true);
      const data = await sendLead({
        name: form.name,
        phone: form.phone,
        comment: "",
        source: "contacts_modal",
      });

      setSentText(`Заявка отправлена ✅ №${data.id}`);
      showToast("ok", `Заявка отправлена ✅ №${data.id}`);
      setTimeout(() => setIsContactsOpen(false), 1200);
    } catch (err) {
      console.error(err);
      showToast("err", "Не удалось отправить. Проверь сервер.");
    } finally {
      setSending(false);
    }
  }

  async function onLeadSubmit(payload) {
    if (digitsOnly(payload.phone).length < 10) {
      showToast("err", "Введите телефон (минимум 10 цифр)");
      throw new Error("PHONE_INVALID_FRONT");
    }
    const data = await sendLead({ ...payload, source: payload.source || "site_form" });
    showToast("ok", `Заявка отправлена ✅ №${data.id}`);
    return data;
  }

  return (
    <div className="appShell">
      {/* toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}

      <Header
        theme={theme}
        onToggleTheme={() => setThemeState(theme === "light" ? "dark" : "light")}
        onOpenContacts={openContacts}
      />

      <div className="appMain">
        <div className="pageFrame">
          <div className="sideDecor sideDecorLeft" aria-hidden="true" />
          <div className="sideDecor sideDecorRight" aria-hidden="true" />

          <div className="pageContent">
            <Routes>
              <Route path="/" element={<main><Home phone={PHONE} tg={TG} wa={WA} onOpenContacts={openContacts} /></main>} />
              <Route path="/services" element={<main><Services /></main>} />
              <Route path="/prices" element={<Prices />} />
              <Route path="/reviews" element={<main><Reviews onLeadSubmit={onLeadSubmit} /></main>} />
              <Route path="/consult" element={<main><Consult tg={TG} wa={WA} onOpenContacts={openContacts} /></main>} />
              <Route path="/request" element={<main><RequestPage onLeadSubmit={onLeadSubmit} /></main>} />
            </Routes>
          </div>
        </div>
      </div>

      {/* footer (бордер снизу) */}
      <Footer phone={PHONE} tg={TG} wa={WA} />

      {/* Модалка контактов */}
      {isContactsOpen && (
        <div className="modalOverlay" role="dialog" aria-modal="true" onMouseDown={closeContacts}>
          <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <div className="modalTitle">Контакты</div>
              <button className="btnIcon" type="button" onClick={closeContacts} aria-label="Закрыть">✕</button>
            </div>

            <div className="contactLinks">
              <a className="contactLink" href={`tel:${digitsOnly(PHONE)}`}>{PHONE}</a>
              <a className="contactLink" href={TG} target="_blank" rel="noreferrer">Telegram</a>
              <a className="contactLink" href={WA} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>

            <div className="orDivider">
              <span className="orLine" />
              <span className="orText">или</span>
              <span className="orLine" />
            </div>

            <div className="formTitle">Оставьте контакты — мы перезвоним</div>

            <form className="leadForm" onSubmit={onSubmitModal}>
              <input
                className="input"
                placeholder="Имя"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                autoComplete="name"
              />
              <input
                className="input"
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                autoComplete="tel"
                inputMode="tel"
                required
              />
              <button className="btn btnPrimary" type="submit" disabled={sending}>
                {sending ? "Отправляем..." : "Отправить"}
              </button>

              {sentText && <div className="sentOk">{sentText}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}