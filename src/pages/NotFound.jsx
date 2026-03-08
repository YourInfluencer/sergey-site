// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import "../styles/Base.css";

export default function NotFound() {
  return (
    <main>
      <Seo
        title="Страница не найдена"
        description="Такой страницы нет. Перейдите на главную или посмотрите услуги."
        path="/404"
        noindex
      />

      <section className="section">
        <div className="wrap">
          <div className="card notFoundCard">
            <div className="notFoundCode">404</div>
            <div className="cardTitle" style={{ marginBottom: 6 }}>Страница не найдена</div>
            <p className="muted" style={{ marginTop: 0 }}>
              Возможно, ссылка устарела или страница была перенесена.
            </p>

            <div className="cta" style={{ marginTop: 12 }}>
              <Link className="btn btnPrimary" to="/">На главную</Link>
              <Link className="btn btnGhost" to="/services">Услуги</Link>
              <Link className="btn btnGhost" to="/prices">Цены</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}