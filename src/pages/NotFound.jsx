// src/pages/NotFound.jsx
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import "../styles/NotFound.css";

export default function NotFound() {
  const nav = useNavigate();

  return (
    <>
      <Seo
        title="Страница не найдена"
        description="Ошибка 404. Такой страницы нет. Вернитесь на главную или выберите раздел."
        path="/404"
        noindex
      />

      <main className="section">
        <div className="wrap">
          <div className="card nfCard">
            <div className="nfTop">
              <div className="nfCode">404</div>
              <div>
                <h1 className="nfTitle">Страница не найдена</h1>
                <p className="muted nfText">
                  Возможно, ссылка устарела или страница была перенесена.
                </p>
              </div>
            </div>

            <div className="nfActions">
              <button className="btn btnPrimary" type="button" onClick={() => nav("/")}>
                На главную
              </button>
              <Link className="btn btnGhost" to="/services">Услуги</Link>
              <Link className="btn btnGhost" to="/prices">Цены</Link>
              <Link className="btn btnGhost" to="/reviews">Отзывы</Link>
              <Link className="btn btnGhost" to="/consult">Консультация</Link>
            </div>

            <div className="nfHint muted small">
              Если вы открывали ссылку из закладки — попробуйте обновить её.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}