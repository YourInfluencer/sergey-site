// src/pages/Consult.jsx
import { useEffect, useMemo, useState } from "react";
import "../styles/Consult.css";
import Seo from "../components/Seo.jsx";

const LS_KEY = "consult_template_v2";

const QUICK = [
  { label: "ТВ: есть звук, нет изображения", device: "ТВ", symptoms: "есть звук, нет изображения / тёмный экран" },
  { label: "ТВ: не включается / мигает", device: "ТВ", symptoms: "не включается / мигает индикатор / щёлкает" },
  { label: "ПК/ноут: тормозит / долго включается", device: "ПК/ноут", symptoms: "тормозит / долго включается / зависает" },
  { label: "Ноут: греется / шумит / выключается", device: "ноутбук", symptoms: "греется / шумит / выключается" },
  { label: "Wi-Fi: пропадает интернет", device: "роутер / Wi-Fi", symptoms: "пропадает интернет / слабый сигнал" },
  { label: "Телефон/планшет: экран / зарядка", device: "телефон/планшет", symptoms: "экран/сенсор/зарядка" },
  { label: "Принтер: не печатает / полосы", device: "принтер/МФУ", symptoms: "не печатает / полосы / бледно / ошибка" },
  { label: "IP-камера: нет доступа / не пишет", device: "IP-камера", symptoms: "нет доступа / не пишет / не подключается / пропадает" },
];

const CHECKLIST = [
  "Какое устройство",
  "Модель (или фото шильдика)",
  "Симптомы: что именно происходит",
  "После чего началось (обновление/падение/залитие/скачок)",
  "Есть ли звук/картинка/индикатор",
  "Что уже пробовали",
  
];

function safeCopy(text) {
  try {
    navigator.clipboard?.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function replaceLine(text, label, value) {
  const re = new RegExp(`(^${label}:).*?$`, "mi");
  if (re.test(text)) return text.replace(re, `$1 ${value}`);

  const anchor = /Здравствуйте!\s*\n/i;
  if (anchor.test(text)) return text.replace(anchor, (m) => `${m}${label}: ${value}\n`);

  return `${label}: ${value}\n` + text;
}

function applyPreset(prevText, preset) {
  let t = prevText;

  // миграции на всякий
  t = t.replace(/^Адрес\/район:\s*.*$/gmi, "Адрес:");
  t = t.replace(/^Устройство\s*—\s*/gmi, "Устройство: ");

  // замена полей (НЕ добавление в конец)
  t = replaceLine(t, "Устройство", preset.device);
  t = replaceLine(t, "Симптомы", preset.symptoms);

  return t;
}

export default function Consult({ tg, wa, onOpenContacts }) {
  const defaultTemplate = useMemo(
    () => `Здравствуйте!
Устройство:
Модель:
Симптомы:
После чего началось:
Есть ли звук/картинка/индикатор:
Что уже пробовали:
Адрес:
Когда удобно:
Дополнительно:`,
    []
  );

  const [text, setText] = useState(defaultTemplate);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && saved.trim()) setText(saved);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(LS_KEY, text), 250);
    return () => clearTimeout(t);
  }, [text]);

  function onCopy() {
    const ok = safeCopy(text);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1100);
  }

  function onReset() {
    setText(defaultTemplate);
    localStorage.setItem(LS_KEY, defaultTemplate);
  }

  return (
    <>
    <Seo
        title="Консультация"
        description="Бесплатная консультация по ремонту техники во Владивостоке: напишите модель, симптомы и после чего началось — подскажем варианты и цену."
        path="/consult"
      />
    <section className="section">
      

      <div className="wrap">
        <h1 className="pageTitle">Консультация</h1>
        <p className="muted">
          Консультация будет точнее, когда есть <b>модель</b>, <b>симптомы</b> и <b>после чего началось</b>.
        </p>

        <div className="consultTop">
          <div className="card consultMain">
            <div className="cardTitle">Сообщение-шаблон (автосохранение)</div>

            <textarea
              className="consultTextarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
            />

            <div className="consultCta">
              <button className="btn btnPrimary" type="button" onClick={onCopy}>
                {copied ? "Скопировано ✅" : "Скопировать"}
              </button>

              <a className="btn btnGhost" href={tg} target="_blank" rel="noreferrer">
                Telegram
              </a>

              <a className="btn btnGhost" href={wa} target="_blank" rel="noreferrer">
                WhatsApp
              </a>

              <button className="btn btnGhost" type="button" onClick={onOpenContacts}>
                Контакты
              </button>

              <button className="btn btnGhost" type="button" onClick={onReset}>
                Сброс
              </button>
            </div>

            <div className="muted small consultNote">
              Шаблон сохраняется автоматически (можно закрыть страницу и вернуться).
            </div>
          </div>

          <div className="card consultQuick">
            <div className="cardTitle">Частые ситуации (Шаблоны)</div>

            <div className="quickList">
              {QUICK.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  className="quickBtn"
                  onClick={() => setText((prev) => applyPreset(prev, q))}
                >
                  <span className="quickLabel">{q.label}</span>
                  <span className="quickArrow">→</span>
                </button>
              ))}
            </div>

            <div className="muted small" style={{ marginTop: 10 }}>
              Нажмите — <b>заменим</b> поля “Устройство” и “Симптомы” в шаблоне.
            </div>
          </div>
        </div>

        <div className="consultBreak" aria-hidden="true">
          <div className="consultBreakCard">
            <div className="consultBreakOverlay">
              <div className="consultBreakTitle">Объясним без лишней терминологии</div>
              <div className="consultBreakText"></div>
            </div>
          </div>
        </div>

        <div className="consultBottom">
          <div className="card">
            <div className="cardTitle">Что желательно сообщить</div>
            <div className="checkList">
              {CHECKLIST.map((x) => (
                <div key={x} className="checkItem">
                  <span className="checkMark">✓</span>
                  <span>{x}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="consultBottomRight">
            <div className="card">
              <div className="cardTitle">Если не хотите писать</div>
              <p className="muted" style={{ marginTop: 0 }}>
                Просто нажмите “Контакты” — проконсультируем по телефону.
              </p>

              <button className="btn btnPrimary" type="button" onClick={onOpenContacts}>
                Открыть контакты
              </button>

              <div className="consultInlinePhoto" aria-hidden="true">
                <img className="consultInlinePhotoImg" src="/img/consult-call.webp" alt="" loading="lazy" />
                <div className="consultInlinePhotoOverlay" />
                <div className="consultInlinePhotoText">
                  <div className="consultInlinePhotoTitle">Можно просто позвонить</div>
                  <div className="consultInlinePhotoSub"></div>
                </div>
              </div>

              <div className="muted small" style={{ marginTop: 10 }}>
                Если удобнее — можно сразу отправить фото шильдика/экрана в Telegram или WhatsApp.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}