import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/request.css";

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

  useEffect(() => {
    // при заходе со страницы услуг — подставляем текст
    if (typeof state.prefill === "string") setComment(state.prefill);
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
      });

      setResult(`Заявка отправлена ✅`);
      setName("");
      setPhone("");
      setComment("");
    } catch (err) {
      console.error(err);
      setResult("Не удалось отправить. Проверьте интернет соединение.");
    } finally {
      setSending(false);
    }
  }

  return (
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

          {/* ✅ НОВОЕ: правильные переходы */}
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
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />

            <input
              className="input requestPhone"
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
  );
}