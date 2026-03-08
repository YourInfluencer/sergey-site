import { Link } from "react-router-dom";

function digitsPhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

export default function Footer({ phone, tg, wa }) {
  return (
    <footer className="footer footerBar" role="contentinfo">
      <div className="wrap footerBarInner">
        {/* слева: как работаем */}
        <div className="footerLeft">
          <Link className="footerLink" to="/#about">
            Как работаем
          </Link>
        </div>

        {/* центр: контакты */}
        <div className="footerCenter" aria-label="Контакты">
          <div className="footerCenterTitle">Контакты:</div>
          <div className="footerCenterLinks">
            <a className="footerLink" href={`tel:${digitsPhone(phone)}`}>{phone}</a>
            <span className="sep" aria-hidden="true" />
            <a className="footerLink" href={tg} target="_blank" rel="noreferrer">Telegram</a>
            <span className="sep" aria-hidden="true" />
            <a className="footerLink" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>

        {/* справа: копирайт */}
        <div className="footerRight muted">
          © {new Date().getFullYear()} Сергей — сервис
        </div>
      </div>
    </footer>
  );
}