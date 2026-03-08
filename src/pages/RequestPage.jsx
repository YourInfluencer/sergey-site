// src/pages/RequestPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import "../styles/Request.css";

function digitsOnly(s) {
  return String(s || "").replace(/[^\d]/g, "");
}

export default function RequestPage({ onLeadSubmit }) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");

  const title = state.title || "Заявка";
  const hint = state.hint || "Совет: укажите модель и симптомы — так мы быстрее скажем варианты.";
  const icon = state.icon || "🛠️";
  const items = Array.isArray(state.items) ? state.items : null;

  // чтобы prefill не перетирал уже введённый текст
  const prefillAppliedRef = useRef(false);

  useEffect(() => {
    const prefill = state.prefill;
    if (typeof prefill !== "string") return;
    if (prefillAppliedRef.current) return;
    if (comment.trim().length > 0) return;

    setComment(prefill);
    prefillAppliedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.prefill]);

  const canSend = useMemo(() => digitsOnly(phone).length >= 10, [phone]);

  async function submit(e) {
    e.preventDefault();
    setResult("");

    if (!canSend) {
      setResult("Введите телефон (минимум 10 цифр).");
      return;
    }

    try {
      setSending(true);

      await onLeadSubmit({
        name,
        phone,
        comment,
        source: "request_page",
        page: "/request",
        pageTitle: title,
      });

      setResult("Заявка отправлена ✅");
      setName("");
      setPhone("");
      setComment("");
      prefillAppliedRef.current = false;
    } catch (err) {
      console.error(err);
      setResult("Не удалось отправить. Проверьте интернет соединение.");
    } finally {
      setSending(false);
    }
  }

  const canonical = "https://yourinfluencer.github.io/#/request";

  return (
    <>
    <Seo
        title="Заявка"
        description="Оставьте заявку на ремонт/настройку техники во Владивостоке — перезвоним, уточним симптомы и согласуем стоимость."
        path="/request"
      />
    <section className="section">
      

      <div className="wrap">
        <h1 className="pageTitle">{title}</h1>

        {/* Карточка выбранной темы */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 18 }}>{icon}</div>
            <div className="cardTitle" style={{ marginBottom: 0 }}>
              {title}
            </div>
          </div>

          {items && (
            <ul className="miniList">
              {items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )}

          {/* Переходы */}
          <div className="cta" style={{ marginTop: 12 }}>
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => navigate("/services", { state: { from: "request", title } })}
            >
              Оставить заявку по теме
            </button>

            <button
              className="btn btnGhost"
              type="button"
              onClick={() => navigate("/consult", { state: { from: "request", title, hint } })}
            >
              Нужна консультация
            </button>
          </div>
        </div>

        {/* Форма */}
        <div className="card" id="form">
          <div className="cardTitle">Оставьте контакты — мы перезвоним</div>
          <p className="muted" style={{ marginTop: 0 }}>
            Напишите модель и симптомы — так мы быстрее поймём ситуацию и скажем варианты.
          </p>

          <form className="leadForm requestForm" onSubmit={submit}>
            <input
              className="input requestName"
              name="name"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />

            <input
              className="input requestPhone"
              name="phone"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              inputMode="tel"
              required
            />

            <button className="btn btnPrimary requestBtn" type="submit" disabled={sending}>
              {sending ? "Отправляем..." : "Отправить"}
            </button>

            <textarea
              className="input requestComment"
              name="comment"
              placeholder="Модель и симптомы"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="muted small requestHint">{hint}</div>

            {result && <div className="sentOk requestResult">{result}</div>}
          </form>
        </div>
      </div>
    </section>
    </>
  );
}