import { useNavigate } from "react-router-dom";

const QUICK = [
  { label: "ТВ не включается", prefill: "Телевизор не включается. (индикатор / щелчки / мигает)", cat: "Телевизоры" },
  { label: "ТВ нет изображения", prefill: "Телевизор: есть звук, нет изображения / тёмный экран.", cat: "Телевизоры" },
  { label: "ТВ HDMI/приставка", prefill: "Телевизор: проблемы с HDMI / не видит приставку.", cat: "Телевизоры" },
  { label: "ПК/ноут тормозит", prefill: "Компьютер/ноутбук: тормозит / долго включается.", cat: "Компьютеры и ноутбуки" },
  { label: "ПК/ноут не включается", prefill: "Компьютер/ноутбук: не включается / нет изображения.", cat: "Компьютеры и ноутбуки" },
  { label: "Ноут греется/шумит", prefill: "Ноутбук: греется / шумит / выключается.", cat: "Компьютеры и ноутбуки" },
  { label: "Принтер не печатает", prefill: "Принтер: не печатает / полосы / не захватывает бумагу.", cat: "Принтеры и МФУ" },
  { label: "Принтер Wi-Fi/драйверы", prefill: "Принтер: не подключается по Wi-Fi / драйверы.", cat: "Принтеры и МФУ" },
  { label: "Wi-Fi/интернет", prefill: "Wi-Fi: слабый сигнал / пропадает интернет.", cat: "Интернет и сеть" },
  { label: "IP-камера", prefill: "IP-камера: нет доступа / не пишет / не подключается.", cat: "IP-камеры" },
];

const CATS = [
  {
    title: "Телевизоры",
    icon: "📺",
    items: [
      "не включается, мигает индикатор, щёлкает",
      "нет изображения/звука, подсветка",
      "HDMI, приставка, Smart TV, приложения",
      "каналы / IPTV / онлайн-кинотеатры",
    ],
    hint: "Если можете — напишите модель ТВ и что именно происходит при включении.",
    prefill: "Телевизоры: ",
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
    hint: "По возможности: модель + что было “до” (обновление, падение, залитие).",
    prefill: "Компьютеры/ноутбуки: ",
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
    hint: "Лучше сразу назвать модель (например: HP M111a / Epson L3250).",
    prefill: "Принтер/МФУ: ",
  },
  {
    title: "Интернет и сеть",
    icon: "📶",
    items: [
      "Wi-Fi слабый / обрывы / не ловит в комнате",
      "настройка роутера / смена пароля",
      "подключение ТВ/приставки/ПК к сети",
      "домашняя сеть для принтера и камер",
    ],
    hint: "Если есть — напишите модель роутера.",
    prefill: "Wi-Fi/сеть: ",
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
    prefill: "IP-камеры: ",
  },
];

export default function Services() {
  const navigate = useNavigate();

  function goRequest(prefill, meta) {
    navigate("/request", { state: { prefill, ...meta } });
  }

  return (
    <section className="section">
      <div className="wrap">
        <h1 className="pageTitle">Услуги</h1>
        <p className="muted">
          Выберите категорию — мы подставим подсказку в заявку. Если вашей проблемы нет в списке — просто напишите модель и симптомы.
        </p>

        <div className="card">
          <div className="cardTitle">Быстрый выбор проблемы</div>
          <div className="quickGrid">
            {QUICK.map((q) => (
              <button
                key={q.label}
                className="quickBtn"
                type="button"
                onClick={() =>
                  goRequest(q.prefill, {
                    title: q.cat,
                    hint: "Напишите модель и симптомы — так мы быстрее скажем варианты.",
                  })
                }
              >
                <span className="quickLabel">{q.label}</span>
                <span className="quickArrow">→</span>
              </button>
            ))}
          </div>

          <div className="cta" style={{ marginTop: 12 }}>
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => goRequest("", { title: "Заявка", hint: "Укажите модель и симптомы — и мы перезвоним." })}
            >
              Оставить заявку
            </button>
            <span className="muted small">или выберите категорию ниже</span>
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
                  onClick={() =>
                    goRequest(c.prefill, {
                      title: c.title,
                      icon: c.icon,
                      items: c.items,
                      hint: c.hint,
                    })
                  }
                >
                  Оставить заявку по теме
                </button>

                <button
                  className="btn btnGhost"
                  type="button"
                  onClick={() =>
                    goRequest(`${c.prefill}Нужна консультация. `, {
                      title: c.title,
                      icon: c.icon,
                      items: c.items,
                      hint: c.hint,
                    })
                  }
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