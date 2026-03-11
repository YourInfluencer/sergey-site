// src/pages/Reviews.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import Seo from "../components/Seo.jsx";
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

/* =========================
   Anti-spam (front-only)
   ========================= */
const LS_REVIEW_CD = "review_cooldown_until_v1";
const LS_REVIEW_START = "review_started_at_v1";

const COOLDOWN_MS = 60_000;     // 60 сек между отзывами
const MIN_FILL_MS = 3_500;      // минимум 3.5 сек “на заполнение” (антибот)

function cooldownLeftSec() {
  const until = Number(localStorage.getItem(LS_REVIEW_CD) || 0);
  const now = Date.now();
  if (now >= until) return 0;
  return Math.ceil((until - now) / 1000);
}

function setCooldown() {
  localStorage.setItem(LS_REVIEW_CD, String(Date.now() + COOLDOWN_MS));
}

function ensureStartTime() {
  if (!localStorage.getItem(LS_REVIEW_START)) {
    localStorage.setItem(LS_REVIEW_START, String(Date.now()));
  }
}

function tooFast() {
  const t = Number(localStorage.getItem(LS_REVIEW_START) || 0);
  if (!t) return false;
  return Date.now() - t < MIN_FILL_MS;
}

function clearStartTime() {
  localStorage.removeItem(LS_REVIEW_START);
}

export default function Reviews({ onLeadSubmit }) {
  const [sendingReview, setSendingReview] = useState(false);
  const [resultReview, setResultReview] = useState("");

  const [sendingPromo, setSendingPromo] = useState(false);
  const [resultPromo, setResultPromo] = useState("");

  // простая “капча”: галочка
  const [human, setHuman] = useState(false);

  // чтобы кулдаун “тикал” и текст обновлялся
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // pageTs — отметка открытия страницы (можно использовать на сервере)
  const pageTsRef = useRef(Date.now());

  const list = useMemo(() => {
    return [...REVIEWS].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, []);

  const cdLeft = cooldownLeftSec(); // будет обновляться из-за tick

  async function submitReview(e) {
    e.preventDefault();
    setResultReview("");

    // антиспам: кулдаун
    const left = cooldownLeftSec();
    if (left > 0) {
      setResultReview(`Подождите ${left} сек. (защита от спама)`);
      return;
    }

    // антибот: слишком быстро
    if (tooFast()) {
      setResultReview("Слишком быстро 🙂 Подождите пару секунд и отправьте ещё раз.");
      return;
    }

    // капча: галочка
    if (!human) {
      setResultReview("Поставьте галочку «Я не робот» 🙂");
      return;
    }

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // honeypot: если заполнено — бот
    const hp = String(fd.get("company") || "").trim();
    if (hp) return;

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
        page: "/reviews",
        pageTitle: "Отзывы",
        pageTs: pageTsRef.current,
      });

      setResultReview("Спасибо! Отзыв отправлен ✅ (появится после проверки)");
      formEl.reset();
      setHuman(false);
      setCooldown();
      clearStartTime();
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

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

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
        page: "/reviews",
        pageTitle: "Отзывы — блок «Получить консультацию»",
        pageTs: pageTsRef.current,
      });

      setResultPromo("Заявка отправлена ✅ Перезвоним быстро");
      formEl.reset();
    } catch (err) {
      console.error(err);
      setResultPromo("Не удалось отправить. Проверьте интернет/сервер.");
    } finally {
      setSendingPromo(false);
    }
  }

  return (
    <>
    <Seo
        title="Отзывы"
        description="Отзывы клиентов о ремонте и настройке техники во Владивостоке. Можно оставить отзыв — публикуем после проверки."
        path="/reviews"
      />
    <section className="section">
      

      <div className="wrap">
        <h1 className="pageTitle">Отзывы</h1>
        <p className="muted">
          Спасибо вам за доверие. Отзыв появляется после проверки (чтобы не было спама).
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
              Имя и телефон нужны для проверки. На странице телефон не публикуется.
            </p>

            <form
              className="leadForm reviewForm"
              onSubmit={submitReview}
              onChange={ensureStartTime}
              onFocus={ensureStartTime}
            >
              {/* honeypot */}
              <input className="hp" name="company" tabIndex={-1} autoComplete="off" />

              <input className="input" name="name" placeholder="Имя" autoComplete="name" />
              <input className="input" name="phone" placeholder="Телефон" autoComplete="tel" inputMode="tel" required />

              <textarea
                className="input reviewTextarea"
                name="text"
                placeholder="Ваш отзыв (что сделали, всё ли устроило)"
                rows={5}
                required
              />

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <label className="reviewCaptcha">
                  <input type="checkbox" checked={human} onChange={(e) => setHuman(e.target.checked)} />
                  <span>Я не робот</span>
                </label>

                {cdLeft > 0 && (
                  <div className="muted small">
                    Защита от спама: можно отправить ещё через <b>{cdLeft} сек</b>.
                  </div>
                )}
              </div>

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
            <div className="reviewsBreakTitle">Спасибо, что выбираете нас</div>
            <div className="reviewsBreakSub"></div>
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
    </>
  );
}