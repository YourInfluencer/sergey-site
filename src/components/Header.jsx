import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header({ theme, onToggleTheme, onOpenContacts }) {
  const location = useLocation();
  const navigate = useNavigate();

  function goHomeTop() {
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
        {/* Лого + тема рядом */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="brand brandBtn" type="button" onClick={goHomeTop} aria-label="На главную">
            <div className="brandText">Лого</div>
          </button>

          <button
            className="btnIcon"
            type="button"
            onClick={onToggleTheme}
            aria-label="Переключить тему"
            title="Светлая / тёмная"
          >
            {theme === "light" ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Навигация */}
        <nav className="navDesktop" aria-label="Навигация">
          <button className="navLink navBtn" type="button" onClick={goHomeTop}>
            Главная
          </button>

          <Link className="navLink" to="/services">Услуги</Link>
          <Link className="navLink" to="/prices">Цены</Link>
          <Link className="navLink" to="/consult">Консультация</Link>
          <Link className="navLink" to="/request">Вызвать мастера</Link>

          <button className="btn btnPrimary" type="button" onClick={onOpenContacts}>
            Контакты
          </button>
        </nav>

        {/* Мобилка (минимально) */}
        <div className="navMobile">
          <button className="btn btnPrimary" type="button" onClick={onOpenContacts}>
            Контакты
          </button>
        </div>
      </div>

      <div className="topbarDivider" />
    </header>
  );
}