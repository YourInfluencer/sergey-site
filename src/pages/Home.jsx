import { useEffect, useRef, useState } from "react";

function digitsOnly(s) {
  return String(s || "").replace(/[^\d]/g, "");
}

const QUICK_ISSUES = [
  "Телевизор не включается (индикатор / щелчки / мигает).",
  "Телевизор: есть звук, нет изображения / темный экран.",
  "Телевизор: проблемы с HDMI / не видит приставку.",
  "Компьютер/ноутбук: тормозит / долго включается.",
  "Компьютер/ноутбук: не включается / нет изображения.",
  "Ноутбук: греется / шумит / выключается.",
  "Принтер: не печатает / полосы / захватывает бумагу.",
  "Принтер: не подключается по Wi-Fi / не видит ПК.",
  "Wi-Fi: слабый сигнал / пропадает интернет / настройки роутера.",
  "IP-камера: нет удалённого доступа / не пишет / не подключается.",
];

export default function Home({ phone, tg, wa, onOpenContacts, onLeadSubmit }) {
  const [resultText, setResultText] = useState("");
  const [sending, setSending] = useState(false);

  // состояние для комментария, чтобы мы могли “подставлять” текст кнопками
  const [comment, setComment] = useState("");

  // honeypot (ловушка для ботов) — человек не заполнит, бот часто заполнит
  const [hp, setHp] = useState("");

  // отметка времени открытия страницы — добавим в payload (позволяет отсеять “мгновенный” спам)
  const [pageTs] = useState(() => Date.now());

  const commentRef = useRef(null);

  useEffect(() => {
    // если comment меняется кнопками — ставим курсор в конец textarea
    if (!commentRef.current) return;
    commentRef.current.focus();
    const el = commentRef.current;
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, [comment]);

  function addIssueText(text) {
    setResultText("");
    setComment((prev) => {
      if (!prev) return text + "\n";
      // если уже есть текст — аккуратно добавим новой строкой
      return prev.trimEnd() + "\n" + text + "\n";
    });
  }

  async function submit(e) {
    e.preventDefault();
    setResultText("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      comment: String(fd.get("comment") || ""),
      // антиспам поля:
      hp: String(fd.get("hp") || ""), // honeypot
      pageTs,
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
        e.currentTarget.reset();
        setComment("");
        setHp("");
      }
    } catch (err) {
      console.error(err);
      setResultText("Не удалось отправить. Попробуйте ещё раз или нажмите «Контакты».");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section className="hero" id="home">
        <div className="wrap heroGrid">
          <div>
            <h1>Ремонт техники и IT-помощь во Владивостоке</h1>
            <p className="muted">
              Телевизоры • компьютеры • ноутбуки • принтеры • сеть/Wi-Fi • IP-камеры • другая техника.
            </p>

            <div className="cta">
              <a className="btn btnPrimary" href="/#/call">Вызвать мастера</a>
              <a className="btn btnGhost" href={`tel:${digitsOnly(phone)}`}>Позвонить</a>
              <button className="btn btnGhost" type="button" onClick={onOpenContacts}>Контакты</button>
            </div>

            <div className="miniInfo">
              <span className="pill">Согласуем цену до работ</span>
              <span className="pill">Гарантия</span>
              <span className="pill">Выезд по городу</span>
            </div>
          </div>

          <div className="card">
            <div className="cardTitle">Как получить помощь быстро</div>
            <ol className="miniList">
              <li>Напишите модель и что происходит</li>
              <li>Мы скажем варианты и ориентир по цене</li>
              <li>Согласуем время — и решаем</li>
            </ol>

            <div className="cta" style={{ marginTop: 12 }}>
              <a className="btn btnPrimary" href={tg} target="_blank" rel="noreferrer">Написать в Telegram</a>
              <a className="btn btnGhost" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ISSUES */}
      <section className="section" id="issues">
        <div className="wrap">
          <h2>Частые проблемы</h2>
          <p className="muted">Нажмите на подходящее — текст подставится в заявку ниже.</p>

          <div className="issuesGrid">
            {QUICK_ISSUES.map((t) => (
              <button key={t} className="issueBtn" type="button" onClick={() => addIssueText(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="trust">
        <div className="wrap">
          <h2>Почему нам доверяют</h2>
          <p className="muted">Без сложных слов. Наша задача — чтобы вам было понятно, удобно и спокойно.</p>

          <div className="trustGrid">
            <div className="trustCard">
              <div className="trustIcon">✅</div>
              <div className="trustTitle">Цена до начала работ</div>
              <div className="trustText">Сначала диагностика и варианты — потом решение. Без сюрпризов.</div>
            </div>

            <div className="trustCard">
              <div className="trustIcon">🧾</div>
              <div className="trustTitle">Понятно объясняем</div>
              <div className="trustText">Простыми словами: что сломалось и что можно сделать.</div>
            </div>

            <div className="trustCard">
              <div className="trustIcon">🛡️</div>
              <div className="trustTitle">Гарантия</div>
              <div className="trustText">На выполненные работы. Если вопрос по нашей части — разберёмся.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="consult">
        <div className="wrap">
          <h2>Консультация</h2>
          <div className="card">
            <p className="muted">
              Чтобы мы ответили быстро — напишите: <b>модель</b>, <b>что происходит</b>, <b>после чего началось</b>.
            </p>
            <div className="cta">
              <a className="btn btnPrimary" href={tg} target="_blank" rel="noreferrer">Telegram</a>
              <a className="btn btnGhost" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
              <button className="btn btnGhost" type="button" onClick={onOpenContacts}>Контакты</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="feedback">
        <div className="wrap">
          <h2>Оставьте заявку — мы перезвоним</h2>
          <div className="card">
            <p className="muted">Опишите проблему — мы уточним детали и предложим решение.</p>

            <form className="leadForm" onSubmit={submit}>
              <input className="input" name="name" placeholder="Имя" autoComplete="name" />
              <input className="input" name="phone" placeholder="Телефон" autoComplete="tel" inputMode="tel" required />

              {/* Honeypot: скрытое поле. Человек его не увидит. */}
              <input
                className="hp"
                name="hp"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <textarea
                ref={commentRef}
                className="input"
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Что сломалось? (модель, симптомы)"
                rows={3}
              />

              <button className="btn btnPrimary" type="submit" disabled={sending}>
                {sending ? "Отправляем..." : "Отправить"}
              </button>

              {resultText && <div className="sentOk">{resultText}</div>}
            </form>
          </div>
        </div>
      </section>

      <section className="section" id="call">
        <div className="wrap">
          <h2>Вызвать мастера</h2>
          <div className="card">
            <p className="muted">Нажмите «Контакты» — можно сразу позвонить или написать.</p>
            <div className="cta">
              <button className="btn btnPrimary" type="button" onClick={onOpenContacts}>Контакты</button>
              <a className="btn btnGhost" href={`tel:${digitsOnly(phone)}`}>Позвонить</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}