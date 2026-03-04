import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function digitsOnly(s) {
  return String(s || "").replace(/[^\d]/g, "");
}

export default function RequestPage({ onLeadSubmit }) {
  const location = useLocation();

  const [sending, setSending] = useState(false);
  const [resultText, setResultText] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");

  // Подхват текста из /services → navigate("/request", { state: { prefill } })
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (typeof prefill === "string") {
      setComment((prev) => (prev ? prev : prefill));
      // очищаем state, чтобы при обновлении страницы не “залипало”
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  async function submit(e) {
    e.preventDefault();
    setResultText("");

    const payload = {
      name,
      phone,
      comment,
      source: "request_page",
    };

    if (digitsOnly(payload.phone).length < 10) {
      setResultText("Введите телефон (минимум 10 цифр).");
      return;
    }

    try {
      setSending(true);
      const data = await onLeadSubmit(payload);
      if (data?.ok) {
        setResultText(`Спасибо! Заявка отправлена ✅ №${data.id}`);
        setName("");
        setPhone("");
        setComment("");
      }
    } catch (err) {
      console.error(err);
      setResultText("Не удалось отправить. Попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section">
      <div className="wrap">
        <h1 className="pageTitle">Заявка</h1>

        <div className="card">
          <div className="cardTitle">Оставьте контакты — мы перезвоним</div>
          <p className="muted">
            Напишите модель и симптомы — так мы быстрее поймём ситуацию и скажем варианты.
          </p>

          <form className="leadForm" onSubmit={submit}>
            <input
              className="input"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />

            <input
              className="input"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              inputMode="tel"
              required
            />

            <textarea
              className="input"
              placeholder="Модель и симптомы (можно коротко)"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button className="btn btnPrimary" type="submit" disabled={sending}>
              {sending ? "Отправляем..." : "Отправить"}
            </button>

            {resultText && <div className="sentOk">{resultText}</div>}
          </form>

          <div className="muted small" style={{ marginTop: 10 }}>
            Совет: если ТВ — напишите, есть ли звук и как ведёт себя индикатор.  
            Если ноут/ПК — включается ли и появляется ли изображение.
          </div>
        </div>
      </div>
    </section>
  );
}