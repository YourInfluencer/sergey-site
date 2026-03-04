import { useNavigate } from "react-router-dom";

const QUICK = [
  { label: "ТВ не включается", text: "Телевизор не включается. (индикатор / щелчки / мигает)" },
  { label: "ТВ нет изображения", text: "Телевизор: есть звук, нет изображения / тёмный экран." },
  { label: "ТВ HDMI/приставка", text: "Телевизор: проблемы с HDMI / не видит приставку." },
  { label: "ПК/ноут тормозит", text: "Компьютер/ноутбук: тормозит / долго включается." },
  { label: "ПК/ноут не включается", text: "Компьютер/ноутбук: не включается / нет изображения." },
  { label: "Ноут греется/шумит", text: "Ноутбук: греется / шумит / выключается." },
  { label: "Принтер не печатает", text: "Принтер: не печатает / полосы / не захватывает бумагу." },
  { label: "Принтер Wi-Fi/драйверы", text: "Принтер: не подключается по Wi-Fi / не видит ПК / драйверы." },
  { label: "Wi-Fi/интернет", text: "Wi-Fi: слабый сигнал / пропадает интернет / настройка роутера." },
  { label: "IP-камера", text: "IP-камера: нет доступа / не пишет / не подключается." },
];

const CATS = [
  {
    title: "Телевизоры",
    icon: "📺",
    items: [
      "не включается, мигает индикатор, щёлкает",
      "нет изображения/звука, подсветка",
      "HDMI, приставка, Smart TV, приложения",
      "настройка каналов / IPTV / онлайн-кинотеатры",
    ],
    hint: "Если можете — напишите модель ТВ и что именно происходит при включении.",
  },
  {
    title: "Компьютеры и ноутбуки",
    icon: "💻",
    items: [
      "тормозит, долго включается, зависает",
      "не включается / нет изображения",
      "перегрев, шум, выключается",
      "Windows, драйверы, программы, вирусы",
      "апгрейд: SSD/ОЗУ, перенос данных",
    ],
    hint: "По возможности: модель + что менялось “до” (обновление, падение, залитие).",
  },
  {
    title: "Принтеры и МФУ",
    icon: "🖨️",
    items: [
      "не печатает / не сканирует",
      "полосы, бледная печать, замятия",
      "подключение к ПК, драйверы",
      "Wi-Fi, печать по сети",
    ],
    hint: "Лучше сразу назвать модель (например HP M111a / Epson L3250).",
  },
  {
    title: "Интернет и сеть",
    icon: "📶",
    items: [
      "Wi-Fi слабый/обрывы/не ловит в комнате",
      "роутер настройка/смена пароля/гостевая сеть",
      "подключение ТВ/приставки/ПК к сети",
      "домашняя сеть для принтера и камер",
    ],
    hint: "Если есть — напишите модель роутера.",
  },
  {
    title: "IP-камеры",
    icon: "📷",
    items: [
      "настройка камер и регистратора",
      "удалённый просмотр (телефон/ПК)",
      "запись, уведомления, доступ извне",
      "сеть, IP-адреса, стабильность",
    ],
    hint: "Уточните: сколько камер и где нужно смотреть (телефон/ПК).",
  },
];

export default function Services() {
  const navigate = useNavigate();

  function goRequest(prefill) {
    navigate("/request", { state: { prefill } });
  }

  return (
    <section className="section">
      <div className="wrap">
        <h1 className="pageTitle">Услуги</h1>
        <p className="muted">
          Здесь собраны основные направления. Если вашей проблемы нет в списке — это нормально:
          оставьте заявку, напишите модель и симптомы, мы подскажем.
        </p>

        <div className="card">
          <div className="cardTitle">Частые проблемы — выберите, и мы подставим текст в заявку</div>
          <div className="quickGrid">
            {QUICK.map((q) => (
              <button
                key={q.label}
                className="quickBtn"
                type="button"
                onClick={() => goRequest(q.text)}
              >
                <span className="quickLabel">{q.label}</span>
                <span className="quickArrow">→</span>
              </button>
            ))}
          </div>

          <div className="cta" style={{ marginTop: 12 }}>
            <button className="btn btnPrimary" type="button" onClick={() => goRequest("")}>
              Оставить заявку
            </button>
            <span className="muted small">или выберите категорию ниже и уточните проблему</span>
          </div>
        </div>

        <div className="servicesGrid">
          {CATS.map((c) => (
            <div className="serviceCard2" key={c.title}>
              <div className="serviceHead">
                <div className="serviceIcon2">{c.icon}</div>
                <div className="serviceTitle2">{c.title}</div>
              </div>

              <ul className="serviceList">
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>

              <div className="muted small" style={{ marginTop: 10 }}>
                {c.hint}
              </div>

              <div className="cta" style={{ marginTop: 12 }}>
                <button
                  className="btn btnPrimary"
                  type="button"
                  onClick={() => goRequest(`${c.title}: `)}
                >
                  Оставить заявку по теме
                </button>
                <button
                  className="btn btnGhost"
                  type="button"
                  onClick={() => goRequest(`${c.title}: нужна консультация. `)}
                >
                  Нужна консультация
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="cardTitle">Как написать, чтобы мы ответили быстрее</div>
          <ul className="miniList">
            <li><b>Модель</b> устройства (или фото шильдика)</li>
            <li><b>Симптомы</b>: что происходит, горит ли индикатор, есть ли звук/картинка</li>
            <li><b>После чего началось</b>: обновление, падение, залитие, скачок напряжения</li>
          </ul>
        </div>
      </div>
    </section>
  );
}