// src/pages/Home.jsx
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { TvIcon, LaptopIcon, PrinterIcon, WifiIcon, CctvIcon, ToolsIcon } from "../components/Icons.jsx";
import Seo from "../components/Seo.jsx";

function digitsPhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

/* ====== красивее SVG-иконки для преимуществ (один стиль, stroke, rounded) ====== */
function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 2.8 20 6.6v6.1c0 5-3.3 9-8 10.5C7.3 21.7 4 17.7 4 12.7V6.6L12 2.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M8.4 12.4l2.4 2.4 4.8-5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M12 7.3v5l3.4 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3.5v.6M4.7 12H4.1M19.9 12h-.6M12 19.9v.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity=".65"
      />
    </svg>
  );
}

function IconRub(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M10 4h4.2a4.2 4.2 0 1 1 0 8.4H10V4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.4h6.8M10 16h6.2M10 20v-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M20 7.5 10.2 18 4 11.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChat(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M6.5 18.5 4 20V6.8C4 5.3 5.2 4 6.8 4h10.4C18.8 4 20 5.3 20 6.8v7.4c0 1.6-1.2 2.8-2.8 2.8H8.2L6.5 18.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.8h8M8 12h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTools(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      {/* отвертка */}
      <path
        d="M14.4 4.6 19.4 9.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M10.2 8.8l4.9-4.9 2 2-4.9 4.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M6 13l4.9-4.9 2 2L8 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* ключ */}
      <path
        d="M20 14.2a4 4 0 0 1-5.7 3.6L9.2 23l-2.2-2.2 5.1-5.1A4 4 0 0 1 20 14.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M16.7 14.5h.01"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHomeWrench(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 11.2 12 4l8 7.2V20a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 20v-8.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M10 21.8v-6.2c0-1.1.9-2 2-2s2 .9 2 2v6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M17.2 9.8l2.2 2.2m-3.4.1 2.7-2.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBulb(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 3.2a7 7 0 0 0-4 12.7V18c0 .7.6 1.3 1.3 1.3h5.4c.7 0 1.3-.6 1.3-1.3v-2.1A7 7 0 0 0 12 3.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 21h5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M9.6 14.6h4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity=".8"
      />
    </svg>
  );
}

function IconChip(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.5h6A2.5 2.5 0 0 1 17.5 9v6A2.5 2.5 0 0 1 15 17.5H9A2.5 2.5 0 0 1 6.5 15V9A2.5 2.5 0 0 1 9 6.5Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 10h4v4h-4v-4Z"
      />
      {/* pins */}
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M9 4v2.5M12 4v2.5M15 4v2.5" />
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M9 17.5V20M12 17.5V20M15 17.5V20" />
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 9h2.5M4 12h2.5M4 15h2.5" />
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M17.5 9H20M17.5 12H20M17.5 15H20" />
    </svg>
  );
}

function IconPhoneChat(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      {/* chat bubble */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 16.5H6.2c-1.2 0-2.2-1-2.2-2.2V7.4c0-1.2 1-2.2 2.2-2.2h11.6c1.2 0 2.2 1 2.2 2.2v6.9c0 1.2-1 2.2-2.2 2.2H12l-3.2 2.3c-.6.4-1.3 0-1.3-.7v-2.6Z"
      />
      {/* headset */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 11.2a3.9 3.9 0 0 1 7.8 0"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.6 11.7v1.6c0 .8-.7 1.5-1.5 1.5H6.6M17.4 11.7v1.6c0 .8.7 1.5 1.5 1.5h.5"
      />
    </svg>
  );
}

function IconTruck(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M3 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2h2.6a2 2 0 0 1 1.6.8l1.6 2.1c.4.5.6 1.2.6 1.8V17a2 2 0 0 1-2 2h-1.1a2.5 2.5 0 0 1-4.8 0H10.9a2.5 2.5 0 0 1-4.8 0H5a2 2 0 0 1-2-2V6Zm2 0v11h.8a2.5 2.5 0 0 1 4.4 0h6.6a2.5 2.5 0 0 1 4.4 0H21v-2h-5a1 1 0 0 1-1-1V6H5Zm12 1v6h5v-.5a1 1 0 0 0-.2-.6L20.4 10H17Zm-8 12a1.5 1.5 0 1 0 0 .01V19Zm10 0a1.5 1.5 0 1 0 0 .01V19Z"
      />
    </svg>
  );
}

function IconSparkle(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 3l1.2 4.1L17.3 9l-4.1 1.2L12 14.3l-1.2-4.1L6.7 9l4.1-1.2L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M18.4 12.8l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        opacity=".85"
      />
      <path
        d="M3.6 14.2l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        opacity=".75"
      />
    </svg>
  );
}

/* ====== Маркиза преимуществ: автоскролл + пауза по клику/ховеру + drag ====== */
function BenefitsMarquee({ items, speedSec = 28 }) {
  const wrapRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // drag-scroll
  const drag = useRef({ on: false, x: 0, left: 0 });

  function onPointerDown(e) {
    const el = wrapRef.current;
    if (!el) return;

    // клик = пауза/плей
    setPaused((p) => !p);

    drag.current.on = true;
    drag.current.x = e.clientX;
    el.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    const el = wrapRef.current;
    if (!el || !drag.current.on) return;
    const dx = e.clientX - drag.current.x;
  }
  function onPointerUp(e) {
    drag.current.on = false;
    const el = wrapRef.current;
    el?.releasePointerCapture?.(e.pointerId);
  }

  return (
    <div className="benefits">
      <div className="benefitsHead">
        <div className="benefitsTitle">Преимущества</div>
      </div>

      <div
        className={`benefitsMarquee ${paused ? "isPaused" : ""}`}
        ref={wrapRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="benefitsTrack" style={{ ["--marqueeDur"]: `${speedSec}s` }}>
          {[...items, ...items].map((it, idx) => (
            <div className="benefitItem" key={`${it.text}-${idx}`}>
              <div className="benefitIconWrap" aria-hidden="true">{it.icon}</div>
              <div className="benefitLabel">{it.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home({ phone, tg, wa, onOpenContacts }) {
  const nav = useNavigate();
  const phoneHref = useMemo(() => digitsPhone(phone), [phone]);

  function goRequest(prefill, meta) {
    nav("/request", { state: { prefill, ...meta } });
  }

  function scrollToDevices() {
    const el = document.getElementById("devices");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const tiles = [
    {
      title: "Телевизоры",
      icon: <TvIcon className="deviceIconSvg" />,
      img: "/img/tv.webp",
      prefill: "Телевизоры: ",
      hint: "Укажите модель ТВ, есть ли звук, как ведёт себя индикатор, были ли щелчки.",
    },
    {
      title: "Компьютеры и ноутбуки",
      icon: <LaptopIcon className="deviceIconSvg" />,
      img: "/img/laptop.webp",
      prefill: "Компьютеры/ноутбуки: ",
      hint: "Укажите модель, симптомы и что было «до» (обновление/падение/залитие). Если знаете — SSD/HDD и ОЗУ.",
    },
    {
      title: "Принтеры и МФУ",
      icon: <PrinterIcon className="deviceIconSvg" />,
      img: "/img/printer.webp",
      prefill: "Принтер/МФУ: ",
      hint: "Укажите модель, тип подключения (USB/Wi-Fi) и что пишет в ошибке.",
    },
    {
      title: "Wi-Fi / интернет",
      icon: <WifiIcon className="deviceIconSvg" />,
      img: "/img/wifi.webp",
      prefill: "Wi-Fi/интернет: ",
      hint: "Укажите модель роутера, где плохо ловит, сколько устройств и что происходит (обрывы/нет интернета).",
    },
    {
      title: "IP-камеры",
      icon: <CctvIcon className="deviceIconSvg" />,
      img: "/img/cctv.webp",
      prefill: "IP-камеры: ",
      hint: "Сколько камер, где нужно смотреть (телефон/ПК), нужна ли запись и какая модель/приложение.",
    },
    {
      title: "Другое",
      icon: <ToolsIcon className="deviceIconSvg" />,
      img: "/img/tools.webp",
      prefill: "Другое устройство: ",
      hint: "Напишите модель и симптомы. Подскажем варианты и стоит ли ремонтировать.",
    },
  ];

  // ✅ преимущества для бегущей строки
  const benefits = [
  { icon: <IconRub className="benefitSvg" />, text: "Бесплатная диагностика" },
  { icon: <IconClock className="benefitSvg" />, text: "Скорость обслуживания" },
  { icon: <IconShield className="benefitSvg" />, text: "Гарантия на выполненные работы" },
  { icon: <IconTruck className="benefitSvg" />, text: "Бесплатная доставка" },

  // ✅ ОДНА галочка — оставляем тут (логично = “без доплат”)
  { icon: <IconCheck className="benefitSvg" />, text: "Индивидуальный подход" },

  // 🔧 вместо “ремонт на месте” — делаем понятнее: “домик + ключ”
  { icon: <IconHomeWrench className="benefitSvg" />, text: "Срочный ремонт" },

  // 💬 консультация — чат/телефон
  { icon: <IconPhoneChat className="benefitSvg" />, text: "Бесплатная консультация" },

  // 🧠 “понятно объясняем”
  { icon: <IconBulb className="benefitSvg" />, text: "Оригинальные запчасти" },

  // 🧼 “аккуратно и чисто”
  { icon: <IconChip className="benefitSvg" />, text: "Профессиональный инструмент" },
  
];

  return (
    <>
      <Seo
        title="Ремонт техники во Владивостоке"
        description="Ремонт и настройка техники во Владивостоке: телевизоры, компьютеры/ноутбуки, принтеры, Wi-Fi, IP-камеры. Выезд, согласование цены до работ, гарантия."
        path="/"
      />

      {/* HERO */}
      <section className="hero" id="home">
        <div className="wrap heroGrid">
          <div>
            <h1>Ремонт техники во Владивостоке</h1>
            <p className="muted">Быстро и понятно: выезд • диагностика • согласование цены • гарантия</p>

            <div className="cta">
              <button className="btn btnPrimary headerActionBtn" type="button" onClick={onOpenContacts}>
                Вызвать мастера
              </button>
              <Link className="btn btnGhost " to="/services">
                Услуги
              </Link>
              <Link className="btn btnGhost" to="/prices">
                Цены
              </Link>
            </div>

            {/* ✅ УБРАЛИ miniInfo отсюда */}

            <div className="freeConsult">
              <span className="freeConsultIcon">💬</span>
              <span>
                <b>Бесплатная консультация круглосуточно!</b>
              </span>
            </div>

            {/* микро-SEO / доверие */}
            <div className="heroContactsLine">
              <span className="heroContactsLabel">Телефон:</span>

              <a className="heroPhoneLink" href={`tel:${phoneHref}`}>
                {phone}
              </a>

              <span className="heroDot">•</span>

              <a className="heroSocialLink" href={tg} target="_blank" rel="noreferrer">
                Telegram
              </a>

              <span className="heroDot">•</span>

              <a className="heroSocialLink" href={wa} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </div>

          {/* HERO справа */}
          <div className="heroMedia">
            <div className="heroMediaCard">
              <div>
                <div className="heroMediaTitle">Оставьте заявку — мы перезвоним</div>
                <div className="muted small">Или выберите устройство ниже</div>

                <div className="heroSteps">
                  <div className="heroStep">
                    <span className="heroStepNum">1</span>Выберите устройство
                  </div>
                  <div className="heroStep">
                    <span className="heroStepNum">2</span>Коротко опишите проблему
                  </div>
                  <div className="heroStep">
                    <span className="heroStepNum">3</span>Получите варианты и цену
                  </div>
                </div>
              </div>

              <div className="heroRightCta" style={{ marginTop: 12 }}>
                <button className="btn btnGhost headerActionBtn" type="button" onClick={scrollToDevices}>
                  К устройствам
                </button>
                <Link className="btn btnGhost headerActionBtn" to="/prices">
                  Посмотреть цены
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Преимущества — бегущая строка */}
      <section className="section" id="benefits">
        <div className="wrap">
          <BenefitsMarquee items={benefits} speedSec={80} />
        </div>
      </section>

      {/* BIG BANNER */}
      <section className="section">
        <div className="wrap">
          <div className="photoBanner">
            <img
              className="photoBannerImg"
              src="/img/banner-1.webp"
              alt="Ремонт техники"
              loading="eager"
              fetchPriority="high"
            />
            <div className="photoBannerOverlay">
              <div className="photoBannerTitle">Работаем аккуратно и прозрачно</div>
              <div className="photoBannerText">Покажем причину, согласуем цену до начала работ.</div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVICE TILES */}
      <section className="section" id="devices">
        <div className="wrap">
          <h2>Выберите устройство</h2>
          <p className="muted">Выберите устройство — откроется форма заявки с подсказками.</p>

          <div className="deviceGrid">
            {tiles.map((t) => (
              <button
                key={t.title}
                type="button"
                className="deviceTile"
                onClick={() => goRequest(t.prefill, { title: t.title, hint: t.hint })}
              >
                <div className="deviceTop">
                  <div className="deviceIcon" aria-hidden="true">
                    {t.icon}
                  </div>
                  <div className="deviceTitle">{t.title}</div>
                  <div className="deviceArrow">→</div>
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

                <div className="muted small deviceSub"></div>
              </button>
            ))}
          </div>

          <div className="cta" style={{ marginTop: 36 }}>
            <Link className="btn btnPrimary" to="/services">
              Все услуги
            </Link>
            <Link className="btn btnGhost" to="/prices">
              Цены
            </Link>
            <Link className="btn btnGhost" to="/reviews">
              Отзывы
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section">
        <div className="wrap">
          <h2>Почему нам доверяют</h2>
          <div className="trustGrid">
            <div className="trustCard">
              <img className="trustImg" src="/img/trust-1.webp" alt="" loading="lazy" />
              <div className="trustTitle">Более 10 лет в сфере</div>
              <div className="trustText">Около 120 тысяч довольных клиентов.</div>
            </div>

            <div className="trustCard">
              <img className="trustImg" src="/img/trust-2.webp" alt="" loading="lazy" />
              <div className="trustTitle">Доступность</div>
              <div className="trustText">Объясняем простыми словами — без “сложных” терминов.</div>
            </div>

            <div className="trustCard">
              <img className="trustImg" src="/img/trust-3.webp" alt="" loading="lazy" />
              <div className="trustTitle">Гарантия</div>
              <div className="trustText">На выполненные работы предоставляем гарантию до 2-х лет.</div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section">
        <div className="wrap">
          <h2>Несколько фото процесса работ</h2>
          <p className="muted"></p>

          <div className="photoGrid">
            {[
              { id: "1", label: "Открыть фото ремонта платы" },
              { id: "2", label: "Открыть фото процесса пайки платы" },
              { id: "3", label: "Открыть фото настройки роутера" },
              { id: "4", label: "Открыть фото ремонта принтера" },
              { id: "5", label: "Открыть фото установки камеры" },
              { id: "6", label: "Открыть фото ремонта ноутбука" },
            ].map((item) => (
              <a
                key={item.id}
                className="photoTile"
                href={`/img/gallery-${item.id}.webp`}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
              >
                <img
                  className="photoImg"
                  src={`/img/gallery-${item.id}.webp`}
                  alt=""
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT + FAQ */}
      <section className="section" id="about">
        <div className="wrap">
          <h2>Частые вопросы</h2>

          <div className="faq">
            <details className="faqItem" open>
              <summary>Как мы работаем</summary>
              <div className="steps" style={{ marginTop: 10 }}>
                <div className="step">
                  <div className="stepNum">1</div>
                  <div>
                    <div className="stepTitle">Обращение</div>
                    <div className="muted">Уточняем модель и симптомы.</div>
                  </div>
                </div>
                <div className="step">
                  <div className="stepNum">2</div>
                  <div>
                    <div className="stepTitle">Выезд</div>
                    <div className="muted">В течение 1–2 часов (зависит от района).</div>
                  </div>
                </div>
                <div className="step">
                  <div className="stepNum">3</div>
                  <div>
                    <div className="stepTitle">Диагностика</div>
                    <div className="muted">Устанавливаем причину и предлагаем варианты решения.</div>
                  </div>
                </div>
                <div className="step">
                  <div className="stepNum">4</div>
                  <div>
                    <div className="stepTitle">Согласование</div>
                    <div className="muted">Цена оговаривается до начала работ.</div>
                  </div>
                </div>
                <div className="step">
                  <div className="stepNum">5</div>
                  <div>
                    <div className="stepTitle">Решаем задачу</div>
                    <div className="muted">Ремонт/настройка + проверка результата.</div>
                  </div>
                </div>
              </div>
            </details>

            <details className="faqItem">
              <summary>Сколько стоит ремонт?</summary>
              <p className="muted">Точная цена известна после диагностики. Сориентируем по стоимости до начала работ.</p>
            </details>

            <details className="faqItem">
              <summary>Выезд на дом или в сервис?</summary>
              <p className="muted">Многие задачи решаем за один визит. Если ремонт сложный — предложим варианты решения.</p>
            </details>

            <details className="faqItem">
              <summary>Можно просто консультацию?</summary>
              <p className="muted">
                <b>Да, консультация бесплатна.</b> Напишите модель и симптомы, перезвоним и дадим рекомендации.
              </p>
            </details>
          </div>

          <div className="cta" style={{ marginTop: 12 }}>
            <button className="btn btnPrimary" type="button" onClick={onOpenContacts}>
              Вызвать мастера
            </button>
            <Link className="btn btnGhost" to="/services">
              Услуги
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}