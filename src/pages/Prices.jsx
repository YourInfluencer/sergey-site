import { useState } from "react";
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

  const formEl = e.currentTarget;          // ✅ сохранить ссылку на форму
  const fd = new FormData(formEl);

  const payload = {
    name: String(fd.get("name") || ""),
    phone: String(fd.get("phone") || ""),
    comment: String(fd.get("comment") || ""),
    source: "prices_form",
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

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.ok === false) throw new Error(data?.error || `HTTP_${resp.status}`);

    setResultText(`Заявка отправлена ✅ №${data.id ?? ""}`.trim());
    formEl.reset();                         // ✅ теперь не null
  } catch (err) {
    console.error(err);
    setResultText("Не удалось отправить. Проверь, что сервер запущен.");
  } finally {
    setSending(false);
  }
}

  return (
    <main>
      <section className="section">
        <div className="wrap">
          <h1 className="pageTitle">Цены</h1>
          <p className="muted">
            Здесь — ориентиры по стоимости. Точная цена зависит от модели и симптомов,
            но мы всегда <b>согласуем стоимость до начала работ</b>.
          </p>

          <div className="priceGrid">
            {/* 1) Ставим консультацию первой */}
            <div className="priceCard priceCardHighlight">
              <div className="priceName">Консультация по телефону и в мессенджере</div>
              <div className="priceFrom">Бесплатно!</div>
              <div className="muted small">
                Консультация по телефону и в мессенджере — бесплатно. Напишите модель и симптомы — подскажем варианты и ориентир по стоимости.
              </div>
            </div>

            {/* 2) Выезд + диагностика с уточнением */}
            <div className="priceCard">
              <div className="priceName">Выезд + диагностика</div>
              <div className="priceFrom">от 1 500 ₽</div>
              <div className="muted small">
                Приезд мастера и первичная проверка <b>без вскрытия устройства</b>:
                уточняем симптомы и называем варианты решения/стоимости.
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
              <div className="priceFrom">от 3 000 ₽</div>
              <div className="muted small">
                Замена комплектующих, ремонт разъёмов/питания, восстановление после залития (по ситуации).
              </div>
            </div>
          </div>

          {/* PHOTO BANNER (между прайсом и пояснениями) */}
          <div style={{ paddingTop: 14 }}>
            <div className="wrap">
              <div className="photoBanner photoBannerSm">
                <img
                  className="photoBannerImg"
                  src="/img/prices-banner.webp"
                  alt="Диагностика и согласование цены"
                  loading="lazy"
                />
                <div className="photoBannerOverlay">
                  <div className="photoBannerTitle">Цену согласуем до начала работ</div>
                  <div className="photoBannerText">
                    Сразу называем варианты и стоимость — без “внезапных” доплат.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 14 }}>
            <div className="card">
              <div className="cardTitle">Что влияет на стоимость</div>
              <ul className="miniList">
                <li><b>Модель и сложность разборки</b> (ультрабуки, моноблоки, тонкие ТВ и т.д.).</li>
                <li><b>Симптомы</b>: “не включается” обычно сложнее, чем “настроить”.</li>
                <li><b>Нужны ли детали</b>: стоимость зависит от наличия и цены запчастей.</li>
                <li><b>Срочность</b> и объём работ (одна задача или комплекс).</li>
              </ul>
              <p className="muted small" style={{ marginTop: 10 }}>
                Мы не делаем “втихаря”. Если по ходу диагностики появляются варианты —
                объясняем и согласуем до продолжения.
              </p>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 0 }}>
            <div className="card priceNote">
              <div className="priceNoteTitle">Важно про цены</div>
              <p className="muted" style={{ margin: 0 }}>
                Не гонитесь за слишком низкой ценой у «мастеров» и на сайтах. Нередко за этим стоят
                скрытые доплаты и недомолвки, а итоговый счёт получается выше ожидаемого.
                Мы предлагаем честную среднюю цену по рынку и качество, которое зарекомендовало себя годами.
              </p>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 0 }}>
            <div className="card">
              <div className="cardTitle">Популярные работы (ориентиры)</div>
              <div className="row"><span>Установка/настройка Windows + базовый набор программ</span><b>от 3 000 ₽</b></div>
              <div className="row"><span>Чистка ноутбука + термопаста (если требуется)</span><b>от 2 000 ₽</b></div>
              <div className="row"><span>Подключение принтера/МФУ, настройка печати/сканирования</span><b>от 1 500 ₽</b></div>
              <div className="row"><span>Настройка Wi-Fi/роутера, устранение “пропадает интернет”</span><b>от 1 500 ₽</b></div>
              <div className="row"><span>Телевизор: настройка Smart TV / приложений / приставки</span><b>от 1 500 ₽</b></div>
              <div className="row"><span>Телевизор: диагностика “нет изображения / не включается”</span><b>от 1 500 ₽</b></div>
              <p className="muted small" style={{ marginTop: 10 }}>
                Это ориентиры. Иногда проблема решается быстро, а иногда нужна диагностика и варианты.
              </p>
            </div>
          </div>

          <div className="section" style={{ paddingTop: 0 }}>
            <div className="card pricesLeadCard">
              <div className="cardTitle">Оставьте заявку — мы перезвоним</div>
              <p className="muted">
                Напишите модель и что случилось — мы скажем варианты и примерную вилку цены.
              </p>

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
                <li>Напишите <b>модель</b> (или фото шильдика) и <b>симптомы</b>.</li>
                <li>Если ТВ/монитор — скажите: есть ли звук, реагирует ли на пульт, мигает ли индикатор.</li>
                <li>Если ПК/ноут — скажите: включается ли, есть ли картинка, что менялось “до” (обновления/падение/залитие).</li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}