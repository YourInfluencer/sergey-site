import { useState } from "react";

export default function Home({ phone, tg, wa, onOpenContacts, onLeadSubmit }) {
  const [ok, setOk] = useState(false);

  function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      comment: String(fd.get("comment") || ""),
    };
    const res = onLeadSubmit(payload);
    if (res) {
      setOk(true);
      e.currentTarget.reset();
    }
  }

  return (
    <>
      {/* Главный якорь для “Лого/Главная” */}
      <section className="hero" id="home">
        <div className="wrap heroGrid">
          <div>
            <h1>Ремонт техники и IT-помощь во Владивостоке</h1>
            <p className="muted">
              Телевизоры • компьютеры • ноутбуки • принтеры • сеть/Wi-Fi • IP-камеры • другая техника.
            </p>

            <div className="cta">
              <a className="btn btnPrimary" href="/#/call">Вызвать мастера</a>
              <a className="btn btnGhost" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>Позвонить</a>
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

      <section className="section" id="help">
        <div className="wrap">
          <h2>Чем помогаем</h2>
          <div className="card">
            <ul className="list">
              <li><b>Телевизоры</b> — не включается, нет изображения/звука, подсветка, HDMI, Smart TV.</li>
              <li><b>Компьютеры/ноутбуки</b> — тормозит, перегрев, не включается, ошибки, апгрейд, система.</li>
              <li><b>Принтеры/МФУ</b> — не печатает/не сканирует, Wi-Fi, драйверы, подключение.</li>
              <li><b>Wi-Fi/роутер</b> — слабый сигнал, обрывы, настройка сети.</li>
              <li><b>IP-камеры</b> — настройка, удалённый доступ, запись.</li>
              <li><b>Другая техника</b> — подскажем по модели/симптомам, стоит ли ремонтировать.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="wrap">
          <h2>Как мы работаем</h2>
          <div className="steps">
            <div className="step"><div className="stepNum">1</div><div><div className="stepTitle">Заявка</div><div className="muted">Звонок или сообщение.</div></div></div>
            <div className="step"><div className="stepNum">2</div><div><div className="stepTitle">Диагностика</div><div className="muted">Понимаем причину и варианты.</div></div></div>
            <div className="step"><div className="stepNum">3</div><div><div className="stepTitle">Согласование</div><div className="muted">Цена до начала работ.</div></div></div>
            <div className="step"><div className="stepNum">4</div><div><div className="stepTitle">Решаем</div><div className="muted">Ремонт/настройка + проверка.</div></div></div>
            <div className="step"><div className="stepNum">5</div><div><div className="stepTitle">Гарантия</div><div className="muted">На выполненные работы.</div></div></div>
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

      {/* Развёрнутая обратная связь */}
      <section className="section" id="feedback">
        <div className="wrap">
          <h2>Оставьте заявку — мы перезвоним</h2>
          <div className="card">
            <p className="muted">
              Опишите проблему в двух словах — мы уточним детали и предложим решение.
              (Сейчас это заглушка, позже подключим сервер.)
            </p>

            <form className="leadForm" onSubmit={submit}>
              <input className="input" name="name" placeholder="Имя" autoComplete="name" />
              <input className="input" name="phone" placeholder="Телефон" autoComplete="tel" inputMode="tel" required />
              <textarea className="input" name="comment" placeholder="Что сломалось? (модель, симптомы)" rows={3} />

              <button className="btn btnPrimary" type="submit">Отправить</button>

              {ok && (
                <div className="sentOk">
                  Спасибо! Заявка принята (пока в тестовом режиме). Можно также написать в Telegram/WhatsApp.
                </div>
              )}
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
              <a className="btn btnGhost" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>Позвонить</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}