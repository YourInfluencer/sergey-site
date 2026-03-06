import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { TvIcon, LaptopIcon, PrinterIcon, WifiIcon, CctvIcon, ToolsIcon } from "../components/Icons.jsx";

export default function Home({ phone, tg, wa, onOpenContacts }) {
  const nav = useNavigate();
  const phoneDigits = useMemo(() => String(phone || "").replace(/[^\d+]/g, ""), [phone]);

  function goRequest(prefill, meta) {
    nav("/request", { state: { prefill, ...meta } });
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

  return (
    <>
      {/* HERO */}
      <section className="hero" id="home">
        <div className="wrap heroGrid">
          <div>
            <h1>Ремонт техники во Владивостоке</h1>
            <p className="muted">
              Быстро и понятно: выезд • согласование цены до работ • гарантия.
            </p>

            <div className="cta">
              <button className="btn btnPrimary" type="button" onClick={onOpenContacts}>
                Вызвать мастера
              </button>
              <Link className="btn btnGhost" to="/services">Услуги</Link>
              <Link className="btn btnGhost" to="/prices">Цены</Link>
            </div>

            <div className="miniInfo">
              <span className="pill">Цена до начала работ</span>
              <span className="pill">Выезд по городу</span>
              <span className="pill">Гарантия</span>
              <span className="pill">Без скрытых доплат</span>
            </div>

            <div className="freeConsult">
              <span className="freeConsultIcon">💬</span>
              <span><b>Консультация по телефону и в мессенджере — бесплатно!</b></span>
            </div>
          </div>

          {/* HERO справа */}
          <div className="heroMedia">
            <div className="heroMediaCard">
              <div>
                <div className="heroMediaTitle">Оставьте заявку — мы перезвоним</div>
                <div className="muted small">
                  Или выберите устройство ниже — подставим подсказки в заявку.
                </div>

                <div className="heroSteps">
                  <div className="heroStep"><span className="heroStepNum">1</span>Выберите устройство</div>
                  <div className="heroStep"><span className="heroStepNum">2</span>Коротко опишите проблему</div>
                  <div className="heroStep"><span className="heroStepNum">3</span>Получите варианты и цену</div>
                </div>
              </div>

              <div className="cta" style={{ marginTop: 12 }}>
                <button
                  className="btn btnPrimary"
                  type="button"
                  onClick={() => goRequest("", {
                    title: "Заявка",
                    hint: "Укажите модель и симптомы. Чем точнее — тем быстрее ответим.",
                  })}
                >
                  Оставить заявку
                </button>
                <Link className="btn btnGhost" to="/prices">Посмотреть цены</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIG BANNER */}
      <section className="section">
        <div className="wrap">
          <div className="photoBanner">
            <img className="photoBannerImg" src="/img/banner-1.webp" alt="Ремонт техники" loading="lazy" />
            <div className="photoBannerOverlay">
              <div className="photoBannerTitle">Работаем аккуратно и прозрачно</div>
              <div className="photoBannerText">Покажем причину, согласуем цену до начала работ.</div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVICE TILES */}
      <section className="section">
        <div className="wrap">
          <h2>Выберите устройство</h2>
          <p className="muted">Нажмите на плитку — откроется заявка с подсказками.</p>

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
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>

                <div className="muted small deviceSub">Откроем форму с подсказками</div>
              </button>
            ))}
          </div>

          <div className="cta" style={{ marginTop: 36 }}>
            <Link className="btn btnPrimary" to="/services">Все услуги</Link>
            <Link className="btn btnGhost" to="/prices">Цены</Link>
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
              <div className="trustTitle">Цена заранее</div>
              <div className="trustText">Согласуем стоимость до начала работ.</div>
            </div>

            <div className="trustCard">
              <img className="trustImg" src="/img/trust-2.webp" alt="" loading="lazy" />
              <div className="trustTitle">Понятно</div>
              <div className="trustText">Объясняем простыми словами — без “умных” слов.</div>
            </div>

            <div className="trustCard">
              <img className="trustImg" src="/img/trust-3.webp" alt="" loading="lazy" />
              <div className="trustTitle">Гарантия</div>
              <div className="trustText">На выполненные работы предоставляем гарантию.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Как мы работаем</h2>
          <p className="muted">Несколько реальных фото процесса.</p>

          <div className="photoGrid">
            {["1","2","3","4","5","6"].map((n) => (
              <a key={n} className="photoTile" href={`/img/gallery-${n}.webp`} target="_blank" rel="noreferrer">
                <img className="photoImg" src={`/img/gallery-${n}.webp`} alt="" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT + FAQ */}
      <section className="section" id="about">
        <div className="wrap">
          <h2>Как работаем и ответы на вопросы</h2>

          <div className="faq">
            <details className="faqItem" open>
              <summary>Как мы работаем</summary>
              <div className="steps" style={{ marginTop: 10 }}>
                <div className="step"><div className="stepNum">1</div><div><div className="stepTitle">Заявка</div><div className="muted">Уточняем модель и симптомы.</div></div></div>
                <div className="step"><div className="stepNum">2</div><div><div className="stepTitle">Диагностика</div><div className="muted">Понимаем причину и предлагаем варианты.</div></div></div>
                <div className="step"><div className="stepNum">3</div><div><div className="stepTitle">Согласование</div><div className="muted">Цена до начала работ — без сюрпризов.</div></div></div>
                <div className="step"><div className="stepNum">4</div><div><div className="stepTitle">Решаем</div><div className="muted">Ремонт/настройка + проверка результата.</div></div></div>
              </div>
            </details>

            <details className="faqItem">
              <summary>Сколько стоит ремонт?</summary>
              <p className="muted">Точная цена понятна после диагностики. Мы называем стоимость до начала работ.</p>
            </details>

            <details className="faqItem">
              <summary>Выезд на дом или в сервис?</summary>
              <p className="muted">Многие задачи решаем на месте. Если нужен сложный ремонт — согласуем вариант.</p>
            </details>

            <details className="faqItem">
              <summary>Можно просто консультацию?</summary>
              <p className="muted"><b>Да — бесплатно.</b> Напишите модель и симптомы, подскажем варианты.</p>
            </details>
          </div>

          <div className="cta" style={{ marginTop: 12 }}>
            <button className="btn btnPrimary" type="button" onClick={onOpenContacts}>
              Вызвать мастера
            </button>
            <Link className="btn btnGhost" to="/services">Услуги</Link>
          </div>
        </div>
      </section>
    </>
  );
}