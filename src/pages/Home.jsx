import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home({ phone, tg, wa, onOpenContacts }) {
  const nav = useNavigate();
  const phoneDigits = useMemo(() => String(phone || "").replace(/[^\d+]/g, ""), [phone]);

  function goRequest(prefill, meta) {
    nav("/request", { state: { prefill, ...meta } });
  }

  // Плитки устройств (под них потом поставишь картинки)
  const tiles = [
    {
      title: "Телевизоры",
      icon: "📺",
      img: "/img/tv.webp", // положишь позже
      prefill: "Телевизоры: ",
      hint: "Укажите модель ТВ, есть ли звук, как ведёт себя индикатор, были ли щелчки. Если можете — фото/видео.",
    },
    {
      title: "Компьютеры и ноутбуки",
      icon: "💻",
      img: "/img/laptop.webp",
      prefill: "Компьютеры/ноутбуки: ",
      hint: "Укажите модель, симптомы и что было «до» (обновление/падение/залитие). Если знаете — SSD/HDD и ОЗУ.",
    },
    {
      title: "Принтеры и МФУ",
      icon: "🖨️",
      img: "/img/printer.webp",
      prefill: "Принтер/МФУ: ",
      hint: "Укажите модель, тип подключения (USB/Wi-Fi) и что пишет в ошибке. Если есть — фото результата печати.",
    },
    {
      title: "Wi-Fi / интернет",
      icon: "📶",
      img: "/img/wifi.webp",
      prefill: "Wi-Fi/интернет: ",
      hint: "Укажите модель роутера, где плохо ловит, сколько устройств и что именно происходит (обрывы/нет интернета).",
    },
    {
      title: "IP-камеры",
      icon: "📷",
      img: "/img/cctv.webp",
      prefill: "IP-камеры: ",
      hint: "Укажите сколько камер, где нужно смотреть (телефон/ПК), нужна ли запись и какое приложение/модель.",
    },
    {
      title: "Другое",
      icon: "🛠️",
      img: "/img/tools.webp",
      prefill: "Другое устройство: ",
      hint: "Напишите модель и симптомы. Подскажем варианты и стоит ли ремонтировать.",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero" id="home">
        <div className="wrap heroGrid">
          <div>
            <h1>Ремонт техники во Владивостоке</h1>
            <p className="muted">
              Быстро, понятно и без лишних услуг. Выезд • согласование цены до работ • гарантия.
            </p>

            <div className="cta">
              <button className="btn btnPrimary" type="button" onClick={onOpenContacts}>
                Вызвать мастера
              </button>

              <Link className="btn btnGhost" to="/services">
                Услуги
              </Link>

              <Link className="btn btnGhost" to="/prices">
                Цены
              </Link>
            </div>

            <div className="miniInfo">
              <span className="pill">Цена до начала работ</span>
              <span className="pill">Выезд</span>
              <span className="pill">Гарантия</span>
            </div>
          </div>

          {/* Место под hero-картинку */}
          <div className="heroMedia">
            <div className="heroMediaCard">
              <div className="heroMediaTitle">Оставьте заявку — мы перезвоним</div>
              <div className="muted small">
                Или выберите устройство ниже — подставим подсказки в заявку.
              </div>
              <div className="cta" style={{ marginTop: 12 }}>
                <Link className="btn btnGhost" to="/services">
                  Услуги
                </Link>
                <Link className="btn btnGhost" to="/prices">
                  Цены
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVICE TILES */}
      <section className="section">
        <div className="wrap">
          <h2>Выберите устройство</h2>
          <p className="muted">Нажмите на плитку — откроется заявка с подсказками.</p>

          <div className="flow">
            <div className="flowStep"><span className="flowNum">1</span>Выберите устройство</div>
            <div className="flowArrow">→</div>
            <div className="flowStep"><span className="flowNum">2</span>Выберите проблему</div>
            <div className="flowArrow">→</div>
            <div className="flowStep"><span className="flowNum">3</span>Отправьте заявку</div>
            <div className="flowArrow">→</div>
            <div className="flowStep"><span className="flowNum">4</span>Мы перезвоним</div>
          </div>

          <div className="deviceGrid">
            {tiles.map((t) => (
              <button
                key={t.title}
                type="button"
                className="deviceTile"
                onClick={() => goRequest(t.prefill, { title: t.title, icon: t.icon, hint: t.hint })}
              >
                <div className="deviceTop">
                  <div className="deviceIcon">{t.icon}</div>
                  <div className="deviceTitle">{t.title}</div>
                </div>

                <div className="deviceImgWrap">
                  <img
                    className="deviceImg"
                    src={t.img}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="deviceHint muted small">Открыть заявку →</div>
              </button>
            ))}
          </div>

          <div className="cta" style={{ marginTop: 12 }}>
            <Link className="btn btnPrimary" to="/services">
              Все услуги
            </Link>
            <Link className="btn btnGhost" to="/prices">
              Цены
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST (compact) */}
      <section className="section">
        <div className="wrap">
          <h2>Почему нам доверяют</h2>
          <div className="trustGrid">
            <div className="trustCard">
              <div className="trustIcon">✅</div>
              <div className="trustTitle">Цена заранее</div>
              <div className="trustText">Согласуем стоимость до начала работ.</div>
            </div>
            <div className="trustCard">
              <div className="trustIcon">🧾</div>
              <div className="trustTitle">Понятно</div>
              <div className="trustText">Объясняем простыми словами — без “умных” слов.</div>
            </div>
            <div className="trustCard">
              <div className="trustIcon">🛠️</div>
              <div className="trustTitle">Гарантия</div>
              <div className="trustText">На выполненные работы предоставляем гарантию.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT + FAQ collapsed */}
      <section className="section" id="about">
        <div className="wrap">
          <h2>Как работаем и ответы на вопросы</h2>

          <div className="faq">
            <details className="faqItem" open>
              <summary>Как мы работаем</summary>
              <div className="steps" style={{ marginTop: 10 }}>
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
                    <div className="muted">Понимаем причину и предлагаем варианты.</div>
                  </div>
                </div>
                <div className="step">
                  <div className="stepNum">3</div>
                  <div>
                    <div className="stepTitle">Согласование</div>
                    <div className="muted">Цена до начала работ — без сюрпризов.</div>
                  </div>
                </div>
                <div className="step">
                  <div className="stepNum">4</div>
                  <div>
                    <div className="stepTitle">Решаем</div>
                    <div className="muted">Ремонт/настройка + проверка результата.</div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginTop: 12 }}>
                <div className="cardTitle">Важно</div>
                <p className="muted" style={{ margin: 0 }}>
                  Если ремонт нецелесообразен — честно скажем. Без давления.
                </p>
              </div>
            </details>

            <details className="faqItem">
              <summary>Сколько стоит ремонт?</summary>
              <p className="muted">
                Точная цена понятна после диагностики. Мы называем стоимость до начала работ.
              </p>
            </details>

            <details className="faqItem">
              <summary>Выезд на дом или в сервис?</summary>
              <p className="muted">
                Многие задачи решаем на месте. Если нужен сложный ремонт — согласуем вариант.
              </p>
            </details>

            <details className="faqItem">
              <summary>Можно просто консультацию?</summary>
              <p className="muted">
                Да. Напишите модель и симптомы — подскажем варианты и ориентир по цене.
              </p>
            </details>
          </div>

          <div className="cta" style={{ marginTop: 12 }}>
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() =>
                goRequest("", {
                  title: "Заявка",
                  hint: "Укажите модель и симптомы — мы перезвоним.",
                })
              }
            >
              Оставить заявку
            </button>
            <a className="btn btnGhost" href={`tel:${phoneDigits}`}>
              Позвонить
            </a>
          </div>
        </div>
      </section>

      {/* anchors to keep old header links working if needed */}
      <section className="section" id="call" style={{ paddingTop: 0 }} />
      <section className="section" id="consult" style={{ paddingTop: 0 }} />
    </>
  );
}