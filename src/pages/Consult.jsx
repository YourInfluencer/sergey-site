// src/pages/Consult.jsx
import { useEffect, useMemo, useState } from "react";
import "../styles/Consult.css";

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
  "Адрес (куда приехать) и когда удобно",
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

  // миграция на всякий случай
  t = t.replace(/^Адрес\/район:\s*.*$/gmi, "Адрес:");

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

  // load saved
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && saved.trim()) setText(saved);
  }, []);

  // autosave
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
    <section className="section">
      <div className="wrap">
        <h1 className="pageTitle">Консультация</h1>
        <p className="muted">
          Быстрее всего отвечаем, когда есть <b>модель</b>, <b>симптомы</b> и <b>после чего началось</b>.
        </p>

        {/* TOP (template + quick) */}
        <div className="consultTop">
          {/* MAIN */}
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

          {/* QUICK */}
          <div className="card consultQuick">
            <div className="cardTitle">Частые ситуации (1 клик)</div>

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

        {/* BREAK SLOT (перебивка) */}
        <div className="consultBreak" aria-hidden="true">
          <div className="consultBreakCard">
            <div className="consultBreakOverlay">
              <div className="consultInlinePhotoText">
                <div className="consultBreakTitle">Объясним просто и без лишних сложностей</div>
                <div className="consultBreakText">Подскажем, что делать дальше, и договоримся по времени.</div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM (checklist + right column) */}
        <div className="consultBottom">
          {/* LEFT */}
          <div className="card">
            <div className="cardTitle">Что мы уточним</div>
            <div className="checkList">
              {CHECKLIST.map((x) => (
                <div key={x} className="checkItem">
                  <span className="checkMark">✓</span>
                  <span>{x}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT (stack) */}
          <div className="consultBottomRight">
            {/* TEXT BLOCK */}
            <div className="card">
              <div className="cardTitle">Если не хотите писать</div>
              <p className="muted" style={{ marginTop: 0 }}>
                Просто нажмите “Контакты” — мы подскажем по телефону и договоримся по времени.
              </p>
              <button className="btn btnPrimary" type="button" onClick={onOpenContacts}>
                Открыть контакты
              </button>

              {/* PHOTO (inside same card) */}
              <div className="consultInlinePhoto" aria-hidden="true">
  <img
    className="consultInlinePhotoImg"
    src="/img/consult-call.webp"
    alt=""
    loading="lazy"
  />

  {/* затемнение для читаемости */}
  <div className="consultInlinePhotoOverlay" />

  {/* текст поверх */}
  <div className="consultInlinePhotoText">
    <div className="consultInlinePhotoTitle">Можно просто позвонить</div>
    <div className="consultInlinePhotoSub">Быстро уточним детали и подскажем по цене</div>
  </div>
</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}