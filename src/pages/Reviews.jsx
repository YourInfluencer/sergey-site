import { useMemo, useState } from "react";
import "../styles/Reviews.css";
import { REVIEWS } from "../data/reviews.data";

function digitsOnly(s) {
  return String(s || "").replace(/[^\d]/g, "");
}

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "2-digit" });
  } catch {
    return "";
  }
}

function initials(name) {
  const s = String(name || "").trim();
  if (!s) return "★";
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

export default function Reviews({ onLeadSubmit }) {
  const [sendingReview, setSendingReview] = useState(false);
  const [resultReview, setResultReview] = useState("");

  const [sendingPromo, setSendingPromo] = useState(false);
  const [resultPromo, setResultPromo] = useState("");

  const list = useMemo(() => {
    return [...REVIEWS].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, []);

  async function submitReview(e) {
    e.preventDefault();
    setResultReview("");

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const text = String(fd.get("text") || "").trim();

    if (digitsOnly(phone).length < 10) {
      setResultReview("Введите телефон (минимум 10 цифр).");
      return;
    }
    if (text.length < 10) {
      setResultReview("Напишите пару слов (минимум 10 символов).");
      return;
    }

    try {
      setSendingReview(true);

      await onLeadSubmit({
        name,
        phone,
        comment: `ОТЗЫВ:\n${text}`,
        source: "reviews_form",
        kind: "review",
      });

      setResultReview("Спасибо! Отзыв отправлен ✅ (появится после проверки)");
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      setResultReview("Не удалось отправить. Проверьте интернет/сервер.");
    } finally {
      setSendingReview(false);
    }
  }

  async function submitPromo(e) {
    e.preventDefault();
    setResultPromo("");

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();

    if (digitsOnly(phone).length < 10) {
      setResultPromo("Введите телефон (минимум 10 цифр).");
      return;
    }

    try {
      setSendingPromo(true);

      await onLeadSubmit({
        name,
        phone,
        comment: "КОНСУЛЬТАЦИЯ: Перезвонить по заявке с блока под отзывами.",
        source: "reviews_promo",
        kind: "consult",
      });

      setResultPromo("Заявка отправлена ✅ Перезвоним быстро");
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      setResultPromo("Не удалось отправить. Проверьте интернет/сервер.");
    } finally {
      setSendingPromo(false);
    }
  }

  return (
    <section className="section">
      <div className="wrap">
        <h1 className="pageTitle">Отзывы</h1>
        <p className="muted">
          Спасибо клиентам за доверие. Мы публикуем отзывы после проверки (чтобы не было спама).
        </p>

        <div className="reviewsGrid">
          {list.map((r) => (
            <article className="card reviewCard" key={r.id}>
              <div className="reviewHead">
                <div className="reviewAvatar" aria-hidden="true">{initials(r.name)}</div>
                <div className="reviewMeta">
                  <div className="reviewName">{r.name}</div>
                  <div className="muted small">{r.date ? fmtDate(r.date) : ""}</div>
                </div>
              </div>

              <div className="reviewText">{r.text}</div>

              {r.service && <div className="reviewTag muted small">Тема: {r.service}</div>}
            </article>
          ))}
        </div>

        <div className="section" style={{ paddingTop: 16 }}>
          <div className="card reviewFormCard">
            <div className="cardTitle">Оставьте отзыв</div>
            <p className="muted" style={{ marginTop: 0 }}>
              Имя и телефон нужны для проверки. На странице телефон не публикуем.
            </p>

            <form className="leadForm reviewForm" onSubmit={submitReview}>
              <input className="input" name="name" placeholder="Имя" autoComplete="name" />
              <input className="input" name="phone" placeholder="Телефон" autoComplete="tel" inputMode="tel" required />
              <textarea
                className="input reviewTextarea"
                name="text"
                placeholder="Ваш отзыв (что сделали, как по цене/срокам, всё ли устроило)"
                rows={5}
                required
              />

              <button className="btn btnPrimary" type="submit" disabled={sendingReview}>
                {sendingReview ? "Отправляем..." : "Отправить отзыв"}
              </button>

              {resultReview && <div className="sentOk">{resultReview}</div>}
            </form>
          </div>
        </div>

        {/* IMAGE BREAK (между отзывом и синей стрелкой) */}
        <div className="reviewsBreakImg" aria-hidden="true">
          <div className="reviewsBreakText">
            <div className="reviewsBreakTitle">Спасибо за доверие</div>
            <div className="reviewsBreakSub">Спасибо, что выбираете нас</div>
          </div>
        </div>

        {/* PROMO STRIP (синяя “стрелочка”) */}
        <div className="reviewsPromoTop">
          <div className="reviewsPromoTopInner">Гарантия на все виды работ</div>
        </div>

        {/* PROMO CARD (форма консультации) */}
        <div className="reviewsPromoCard card">
          <div className="reviewsPromoTitle">Бесплатно проконсультируем по телефону</div>

          <form className="reviewsPromoForm" onSubmit={submitPromo}>
            <input className="input" name="name" placeholder="Ваше имя" autoComplete="name" />
            <input className="input" name="phone" placeholder="Ваш телефон" autoComplete="tel" inputMode="tel" required />
            <button className="btn btnPrimary" type="submit" disabled={sendingPromo}>
              {sendingPromo ? "Отправляем..." : "Получить консультацию"}
            </button>
          </form>

          <div className="reviewsPromoBottomText">Перезвоним быстро</div>
          {resultPromo && <div className="sentOk" style={{ marginTop: 10 }}>{resultPromo}</div>}
        </div>
      </div>
    </section>
  );
}