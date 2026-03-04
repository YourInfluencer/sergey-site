import { useEffect, useState } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home.jsx";
import Prices from "./pages/Prices.jsx";

const PHONE = "+7 (914) 774-24-68";
const TG = "https://t.me/SergejVladimirovichVDK";
const WA = "https://wa.me/70000000000"; // заглушка

function getTheme() {
  const saved = localStorage.getItem("theme");
  return saved === "dark" ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function scrollToHomeTopSmooth() {
  // ждём, пока отрисуется главная, и скроллим к #home
  setTimeout(() => {
    const el = document.getElementById("home");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, 0);
}

export default function App() {
  const [theme, setThemeState] = useState(getTheme());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [sent, setSent] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setTheme(theme), [theme]);

  // Закрываем моб. меню при смене маршрута
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Esc закрывает всё
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsContactsOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function goHomeTop() {
    // Если уже на главной — просто скроллим
    if (location.pathname === "/") {
      scrollToHomeTopSmooth();
      return;
    }
    // Если на другой странице — переходим на главную и скроллим
    navigate("/");
    scrollToHomeTopSmooth();
  }

  function openContacts() {
    setSent(false);
    setIsContactsOpen(true);
  }
  function closeContacts() {
    setIsContactsOpen(false);
  }

  function onSubmitModal(e) {
    e.preventDefault();
    console.log("LEAD (modal stub):", form);
    setSent(true);
    setForm({ name: "", phone: "" });
  }

  // Заглушка “отправки” с главной (позже будет fetch на сервер)
  function onLeadSubmit(payload) {
    console.log("LEAD (home stub):", payload);
    return true;
  }

  return (
    <>
      <header className="topbar">
        <div className="wrap topbarInner">
          {/* Лого = главная = скролл к началу */}
          <button className="brand brandBtn" type="button" onClick={goHomeTop} aria-label="На главную">
            <div className="brandText">Лого</div>
          </button>

          {/* Десктоп-меню */}
          <nav className="navDesktop" aria-label="Навигация">
            <button className="navLink navBtn" type="button" onClick={goHomeTop}>Главная</button>
            <a className="navLink" href="/#/call">Вызвать мастера</a>
            <Link className="navLink" to="/prices">Цены</Link>
            <a className="navLink" href="/#/consult">Консультация</a>

            <button className="btn btnPrimary" type="button" onClick={openContacts}>Контакты</button>

            <button
              className="btnIcon"
              type="button"
              onClick={() => setThemeState(theme === "light" ? "dark" : "light")}
              aria-label="Переключить тему"
              title="Светлая / тёмная"
            >
              {theme === "light" ? "☀️" : "🌙"}
            </button>
          </nav>

          {/* Мобильная шапка */}
          <div className="navMobile">
            <button className="btn btnPrimary" type="button" onClick={openContacts}>Контакты</button>

            <button
              className="btnIcon"
              type="button"
              onClick={() => setThemeState(theme === "light" ? "dark" : "light")}
              aria-label="Переключить тему"
              title="Светлая / тёмная"
            >
              {theme === "light" ? "☀️" : "🌙"}
            </button>

            <button
              className="btnIcon"
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Меню"
              title="Меню"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Dropdown меню на мобилке */}
        {isMenuOpen && (
          <div className="mobileMenu" onMouseDown={() => setIsMenuOpen(false)}>
            <div className="wrap mobileMenuInner" onMouseDown={(e) => e.stopPropagation()}>
              <button className="mobileLink mobileBtn" type="button" onClick={() => { setIsMenuOpen(false); goHomeTop(); }}>
                Главная
              </button>

              <a className="mobileLink" href="/#/call" onClick={() => setIsMenuOpen(false)}>Вызвать мастера</a>
              <Link className="mobileLink" to="/prices">Цены</Link>
              <a className="mobileLink" href="/#/consult" onClick={() => setIsMenuOpen(false)}>Консультация</a>

              <div className="mobileCtaRow">
                <a className="btn btnPrimary" href="/#/call" onClick={() => setIsMenuOpen(false)}>Вызвать мастера</a>
                <a className="btn btnGhost" href={`tel:${PHONE.replace(/[^\d+]/g, "")}`}>Позвонить</a>
              </div>
            </div>
          </div>
        )}
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Home
                phone={PHONE}
                tg={TG}
                wa={WA}
                onOpenContacts={openContacts}
                onLeadSubmit={onLeadSubmit}
              />

              <footer className="footer">
                <div className="wrap footerRow">
                  <div className="muted">© {new Date().getFullYear()} Сергей — сервис</div>
                  <div className="muted"><Link to="/prices">Цены</Link></div>
                </div>
              </footer>
            </main>
          }
        />

        <Route
          path="/prices"
          element={
            <>
              <Prices />
              <footer className="footer">
                <div className="wrap footerRow">
                  <div className="muted">© {new Date().getFullYear()} Сергей — сервис</div>
                  <div className="muted">
                    <button className="linkBtn" type="button" onClick={goHomeTop}>На главную</button>
                  </div>
                </div>
              </footer>
            </>
          }
        />
      </Routes>

      {/* Модалка контактов */}
      {isContactsOpen && (
        <div className="modalOverlay" role="dialog" aria-modal="true" onMouseDown={closeContacts}>
          <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <div className="modalTitle">Контакты</div>
              <button className="btnIcon" type="button" onClick={closeContacts} aria-label="Закрыть">✕</button>
            </div>

            <div className="contactLinks">
              <a className="contactLink" href={`tel:${PHONE.replace(/[^\d+]/g, "")}`}>{PHONE}</a>
              <a className="contactLink" href={TG} target="_blank" rel="noreferrer">Telegram</a>
              <a className="contactLink" href={WA} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>

            <div className="orDivider">
              <span className="orLine" />
              <span className="orText">или</span>
              <span className="orLine" />
            </div>

            <div className="formTitle">Оставьте контакты — мы перезвоним</div>

            <form className="leadForm" onSubmit={onSubmitModal}>
              <input
                className="input"
                placeholder="Имя"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                autoComplete="name"
              />
              <input
                className="input"
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                autoComplete="tel"
                inputMode="tel"
                required
              />
              <button className="btn btnPrimary" type="submit">Отправить</button>
              {sent && <div className="sentOk">Заявка отправлена (пока это заглушка).</div>}
            </form>
          </div>
        </div>
      )}
      {/* Мобильная нижняя панель CTA */}
<div className="mobileBar">
  <a className="btn btnPrimary mobileBarBtn" href={`tel:${PHONE.replace(/[^\d+]/g, "")}`}>
    Позвонить
  </a>
  <button className="btn btnGhost mobileBarBtn" type="button" onClick={openContacts}>
    Контакты
  </button>
</div>
    </>
  );
}