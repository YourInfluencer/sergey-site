import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home({ phone, tg, wa }) {
  const nav = useNavigate();

  const phoneDigits = useMemo(() => String(phone || "").replace(/[^\d+]/g, ""), [phone]);

  function goRequest(prefill, meta) {
    nav("/request", { state: { prefill, ...meta } });
  }

  return (
    <>
      {/* HERO */}
      <section className="hero" id="home">
        <div className="wrap heroGrid">
          <div>
            <h1>Ремонт техники и IT-помощь во Владивостоке</h1>
            <p className="muted">
              Телевизоры • компьютеры • ноутбуки • принтеры • Wi-Fi/сеть • IP-камеры • другая техника.
            </p>

            <div className="cta">
              <Link className="btn btnPrimary" to="/services">
                Выбрать услугу
              </Link>
              <a className="btn btnGhost" href={`tel:${phoneDigits}`}>
                Позвонить
              </a>
              <a className="btn btnGhost" href={tg} target="_blank" rel="noreferrer">
                Telegram
              </a>
              <a className="btn btnGhost" href={wa} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>

            <div className="miniInfo">
              <span className="pill">Согласуем цену до работ</span>
              <span className="pill">Гарантия</span>
              <span className="pill">Выезд по городу</span>
            </div>
          </div>

          <div className="card">
            <div className="cardTitle">С чего начать</div>
            <ol className="miniList">
              <li>Откройте «Услуги» и выберите проблему</li>
              <li>Опишите модель и симптомы (1–2 строки)</li>
              <li>Мы перезвоним или ответим в мессенджере</li>
            </ol>

            <div className="cta" style={{ marginTop: 12 }}>
              <button
                className="btn btnPrimary"
                type="button"
                onClick={() =>
                  goRequest("", {
                    title: "Заявка",
                    hint:
                      "Совет: укажите модель и симптомы. Если ТВ — есть ли звук/мигает ли индикатор. Если ПК/ноут — включается ли и есть ли изображение.",
                  })
                }
              >
                Оставить заявку
              </button>
              <Link className="btn btnGhost" to="/prices">
                Посмотреть цены
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section">
        <div className="wrap">
          <h2>Почему нам доверяют</h2>

          <div className="trustGrid">
            <div className="trustCard">
              <div className="trustIcon">✅</div>
              <div className="trustTitle">Цена до начала работ</div>
              <div className="trustText">
                Перед ремонтом озвучиваем варианты и согласуем стоимость. Без «внезапных доплат».
              </div>
            </div>

            <div className="trustCard">
              <div className="trustIcon">🧾</div>
              <div className="trustTitle">Понятно объясняем</div>
              <div className="trustText">
                Скажем простыми словами, что сломалось и почему. Подберём решение под бюджет.
              </div>
            </div>

            <div className="trustCard">
              <div className="trustIcon">🛠️</div>
              <div className="trustTitle">Гарантия</div>
              <div className="trustText">
                Даём гарантию на выполненные работы. Если вопрос повторится — разберёмся.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / HOW WE WORK (for top button) */}
      <section className="section" id="about">
        <div className="wrap">
          <h2>Как работаем</h2>

          <div className="steps">
            <div className="step">
              <div className="stepNum">1</div>
              <div>
                <div className="stepTitle">Заявка</div>
                <div className="muted">Звонок или сообщение. Уточняем модель и симптомы.</div>
              </div>
            </div>

            <div className="step">
              <div className="stepNum">2</div>
              <div>
                <div className="stepTitle">Диагностика</div>
                <div className="muted">Понимаем причину и предлагаем варианты решения.</div>
              </div>
            </div>

            <div className="step">
              <div className="stepNum">3</div>
              <div>
                <div className="stepTitle">Согласование цены</div>
                <div className="muted">Назовём стоимость до начала работ — вы решаете, делать или нет.</div>
              </div>
            </div>

            <div className="step">
              <div className="stepNum">4</div>
              <div>
                <div className="stepTitle">Ремонт / настройка</div>
                <div className="muted">Делаем, проверяем результат, даём рекомендации.</div>
              </div>
            </div>

            <div className="step">
              <div className="stepNum">5</div>
              <div>
                <div className="stepTitle">Гарантия</div>
                <div className="muted">На выполненные работы предоставляем гарантию.</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <div className="cardTitle">Важно</div>
            <p className="muted" style={{ margin: 0 }}>
              Если ремонт нецелесообразен — честно скажем. Мы не «уговариваем любой ценой».
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="wrap">
          <h2>Частые вопросы</h2>

          <div className="faq">
            <details className="faqItem">
              <summary>Выезд на дом или в сервис?</summary>
              <p className="muted">
                Настройка, обслуживание и часть ремонтов — на месте. Если нужен сложный ремонт — согласуем вариант.
              </p>
            </details>

            <details className="faqItem">
              <summary>Сколько стоит ремонт?</summary>
              <p className="muted">
                Точная цена понятна после диагностики. Мы объясняем причину и называем цену до начала работ.
              </p>
            </details>

            <details className="faqItem">
              <summary>Можно просто консультацию?</summary>
              <p className="muted">
                Да. Напишите модель и симптомы — подскажем варианты и что можно сделать.
              </p>
            </details>

            <details className="faqItem">
              <summary>Нужны ли документы/чек?</summary>
              <p className="muted">
                По договорённости. Для “офиса/организаций” обычно делаем документы и список работ.
              </p>
            </details>
          </div>

          <div className="cta" style={{ marginTop: 12 }}>
            <Link className="btn btnPrimary" to="/services">
              Перейти к услугам
            </Link>
            <button
              className="btn btnGhost"
              type="button"
              onClick={() =>
                goRequest("", {
                  title: "Заявка",
                  hint:
                    "Совет: укажите модель и симптомы. Чем точнее описание — тем быстрее ответим.",
                })
              }
            >
              Оставить заявку
            </button>
          </div>
        </div>
      </section>

      {/* CALL anchor for header buttons */}
      <section className="section" id="call">
        <div className="wrap">
          <h2>Вызвать мастера</h2>
          <div className="card">
            <p className="muted" style={{ marginTop: 0 }}>
              Быстрее всего — выбрать категорию в «Услугах» и оставить заявку: мы получим её в Telegram-группу.
            </p>
            <div className="cta">
              <Link className="btn btnPrimary" to="/services">
                Выбрать услугу
              </Link>
              <a className="btn btnGhost" href={`tel:${phoneDigits}`}>
                Позвонить
              </a>
              <a className="btn btnGhost" href={tg} target="_blank" rel="noreferrer">
                Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULT anchor for header buttons */}
      <section className="section" id="consult">
        <div className="wrap">
          <h2>Консультация</h2>
          <div className="card">
            <p className="muted" style={{ marginTop: 0 }}>
              Напишите модель и симптомы — ответим, какие есть варианты и примерный ориентир по цене.
            </p>
            <div className="cta">
              <a className="btn btnPrimary" href={tg} target="_blank" rel="noreferrer">
                Telegram
              </a>
              <a className="btn btnGhost" href={wa} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <Link className="btn btnGhost" to="/request">
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}