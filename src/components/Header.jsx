import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header({ theme, onToggleTheme, onOpenContacts }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function goHomeTop() {
    setMenuOpen(false);

    if (location.pathname === "/") {
      const el = document.getElementById("home");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate("/");
    setTimeout(() => {
      const el = document.getElementById("home");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }

  return (
    <header className="topbar">
      <div className="wrap topbarInner">
        <div className="topbarLeft">
          <button className="brandBtn" type="button" onClick={goHomeTop} aria-label="На главную">
            <span className="brandLogoImg" aria-hidden="true" />
            <span className="srOnly">Алгоритм</span>
          </button>

          <button className="btnIcon" type="button" onClick={onToggleTheme} aria-label="Переключить тему">
            {theme === "light" ? "☀️" : "🌙"}
          </button>
        </div>

        <nav className="navDesktop" aria-label="Навигация">
          <button className="navLink navBtn" type="button" onClick={goHomeTop}>Главная</button>
          <Link className="navLink" to="/services">Услуги</Link>
          <Link className="navLink" to="/prices">Цены</Link>
          <Link className="navLink" to="/reviews">Отзывы</Link>
          <Link className="navLink" to="/consult">Консультация</Link>
          <Link className="btn btnPrimary" to="/request">Вызвать мастера</Link>
          <button className="btn btnGhost headerContactsBtn" type="button" onClick={onOpenContacts}>
            Контакты
          </button>
        </nav>

        <div className="navMobile">
          <button className="btn btnGhost" type="button" onClick={() => setMenuOpen((v) => !v)}>
            Меню
          </button>
          <button className="btn btnGhost headerContactsBtn" type="button" onClick={onOpenContacts}>
            Контакты
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobileMenu" onMouseDown={() => setMenuOpen(false)}>
          <div className="wrap mobileMenuInner" onMouseDown={(e) => e.stopPropagation()}>
            <button className="mobileLink mobileBtn" type="button" onClick={goHomeTop}>Главная</button>
            <Link className="mobileLink" to="/services" onClick={() => setMenuOpen(false)}>Услуги</Link>
            <Link className="mobileLink" to="/prices" onClick={() => setMenuOpen(false)}>Цены</Link>
            <Link className="mobileLink" to="/reviews" onClick={() => setMenuOpen(false)}>Отзывы</Link>
            <Link className="mobileLink" to="/consult" onClick={() => setMenuOpen(false)}>Консультация</Link>
            <Link className="mobileLink" to="/request" onClick={() => setMenuOpen(false)}>Вызвать мастера</Link>
          </div>
        </div>
      )}
    </header>
  );
}