// src/pages/Prices.jsx
import { useMemo, useState } from "react";
import Seo from "../components/Seo.jsx";
import "../styles/Prices.css";

function digitsOnly(s) {
  return String(s || "").replace(/[^\d]/g, "");
}

export default function Prices() {
  const [sending, setSending] = useState(false);
  const [resultText, setResultText] = useState("");

  async function submit(e) {
    e.preventDefault();
    setResultText("");

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      comment: String(fd.get("comment") || "").trim(),
      source: "prices_form",
      page: "/prices",
      pageTitle: "Цены",
    };

    const d = digitsOnly(payload.phone);
    if (d.length < 10) {
      setResultText("Введите телефон (минимум 10 цифр).");
      return;
    }

    try {
      setSending(true);
      const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

      const resp = await fetch(`${API}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // устойчиво читаем ответ (на случай, если backend отдаст пустое тело)
      const raw = await resp.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (!resp.ok) {
        const msg = data?.error || raw || `HTTP_${resp.status}`;
        throw new Error(msg);
      }

      // если сервер вернул ok:false — ошибка
      if (data && data.ok === false) {
        throw new Error(data?.error || "UNKNOWN_SERVER_ERROR");
      }

      setResultText(`Заявка отправлена ✅ №${data?.id ?? ""}`.trim());
      formEl.reset();
    } catch (err) {
      console.error(err);
      setResultText("Не удалось отправить. Проверь, что сервер запущен.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
    <Seo
        title="Цены"
        description="Ориентиры по стоимости ремонта и настройки техники во Владивостоке. Консультация бесплатно, цену согласуем до начала работ."
        path="/prices"
      />
    <main>
      

      <section className="section">
        <div className="wrap">
          <h1 className="pageTitle">Цены</h1>
          <p className="muted">
            Здесь — ориентиры по стоимости. Точная цена зависит от модели и симптомов, но мы всегда{" "}
            <b>согласуем стоимость до начала работ</b>.
          </p>

          <div className="priceGrid">
            <div className="priceCard priceCardHighlight">
              <div className="priceName">Консультация</div>
              <div className="priceFrom">Бесплатно</div>
              <div className="muted small">
                Бесплатная консультация. Напишите модель и симптомы, перезвоним и дадим рекомендации.
              </div>
            </div>

            <div className="priceCard">
              <div className="priceName">Выезд + диагностика</div>
              <div className="priceFrom">Бесплатно</div>
              <div className="muted small">
                Если выполняем ремонт — выезд и диагностика бесплатны.
                Если нужна только диагностика/выезд без ремонта — 1500 ₽.
              </div>
            </div>

            <div className="priceCard">
              <div className="priceName">Настройка / обслуживание</div>
              <div className="priceFrom">от 1 500 ₽</div>
              <div className="muted small">
                Настройка Windows/программ, ускорение, драйверы, Wi-Fi/роутер, базовые проблемы.
              </div>
            </div>

            <div className="priceCard">
              <div className="priceName">Ремонт / замена деталей</div>
              <div className="priceFrom">от 2 000 ₽</div>
              <div className="muted small">
                Замена комплектующих, ремонт разъёмов/питания, восстановление после залития и прочее.
              </div>
            </div>
          </div>

          {/* PHOTO BANNER (между прайсом и пояснениями) */}
          <div style={{ paddingTop: 14 }}>
            <div className="photoBanner photoBannerSm">
              <img
                className="photoBannerImg"
                src="/img/prices-banner.webp"
                alt="Диагностика и согласование цены"
                loading="lazy"
              />
              <div className="photoBannerOverlay">
                <div className="photoBannerTitle">Цену согласуем до начала работ</div>
                <div className="photoBannerText"></div>
              </div>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 14 }}>
            <div className="card">
              <div className="cardTitle">Что влияет на стоимость</div>
              <ul className="miniList">
                <li>
                  <b>Модель и сложность разборки</b> (ультрабуки, моноблоки, тонкие ТВ и т.д.).
                </li>
                <li>
                  <b>Симптомы</b>: “не включается” обычно сложнее, чем “настроить”.
                </li>
                <li>
                  <b>Нужны ли детали</b>: стоимость зависит от наличия и цены запчастей.
                </li>
                <li>
                  <b>Срочность</b> и объём работ (одна задача или комплекс).
                </li>
              </ul>
              <p className="muted small" style={{ marginTop: 10 }}>
              
              </p>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 0 }}>
            <div className="card priceNote">
              <div className="priceNoteTitle">Важно про цены</div>
              <p className="muted" style={{ margin: 0 }}>
                Не гонитесь за слишком низкой ценой, многие "мастера" при первичном обращении ориентируют на стоимость от 500 ₽. Нередко за этим стоят скрытые доплаты и
                недомолвки, а итоговый счёт получается на много выше ожидаемого. Мы предлагаем честную среднюю цену по рынку и
                качество, которое зарекомендовало себя годами.
              </p>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 0 }}>
            <div className="card">
              <div className="cardTitle">Популярные работы (ориентиры)</div>
              <div className="row">
                <span>Установка Windows XP / 7 / 8 / 10 / 11 </span>
                <b>от 1 000 ₽</b>
              </div>
              <div className="row">
                <span>Установка дистрибутивов Linux (Ubuntu / MacOS) </span>
                <b>от 2 000 ₽</b>
              </div>
              <div className="row">
                <span>Обучение (ПК грамотность / Интернет безопасность / Работе с программами и устройствами)</span>
                <b>от 800 ₽</b>
              </div>
              <div className="row">
                <span>Базовый набор программ (Архиватор / браузер / Плеер)</span>
                <b>от 900 ₽</b>
              </div>
              <div className="row">
                <span>Пакет офисных программ</span>
                <b>от 1 200 ₽</b>
              </div>
              <div className="row">
                <span>Чистка ноутбука от пыли</span>
                <b>от 1 500 ₽</b>
              </div>
              <div className="row">
                <span>Подключение принтера/МФУ, настройка печати / сканирования</span>
                <b>от 1 500 ₽</b>
              </div>
              <div className="row">
                <span>Настройка Wi-Fi/роутера</span>
                <b>от 1 100 ₽</b>
              </div>
              <div className="row">
                <span>Телевизор: настройка Smart TV / приложений / приставки</span>
                <b>от 1 000 ₽</b>
              </div>
              <div className="row">
                <span>Телевизор: диагностика “нет изображения / не включается”</span>
                <b>от 1 000 ₽</b>
              </div>
              <p className="muted small" style={{ marginTop: 10 }}>
                Это ориентиры. Иногда проблема решается быстро, а иногда нужна сложная диагностика.
              </p>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 0 }}>
            <div className="card pricesLeadCard">
              <div className="cardTitle">Оставьте заявку — мы перезвоним</div>
              <p className="muted">Напишите модель и что случилось — мы перезвоним и дадим консультацию.</p>

              <form className="leadForm" onSubmit={submit}>
                <input className="input" name="name" placeholder="Имя" autoComplete="name" />
                <input className="input" name="phone" placeholder="Телефон" autoComplete="tel" inputMode="tel" required />
                <textarea
                  className="input"
                  name="comment"
                  placeholder="Модель и симптомы (например: LG 50, не включается; ноут шумит и греется)"
                  rows={3}
                />

                <button className="btn btnPrimary" type="submit" disabled={sending}>
                  {sending ? "Отправляем..." : "Отправить"}
                </button>

                {resultText && <div className="sentOk">{resultText}</div>}
              </form>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 0 }}>
            <div className="card">
              <div className="cardTitle">Как подготовиться, чтобы мы помогли быстрее</div>
              <ul className="miniList">
                <li>
                  Напишите <b>модель</b> (или фото модели с наклейки на обратной стороне устройства) и <b>симптомы</b>.
                </li>
                <li>Если ТВ/монитор — сообщите: есть ли звук, реагирует ли на пульт, мигает ли индикатор.</li>
                <li>Если ПК/ноут — сообщите: включается ли, есть ли картинка, что менялось до неисправности (обновление/падение/залитие).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}