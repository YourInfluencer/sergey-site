import { Link } from "react-router-dom";

function digitsPhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

export default function Footer({ phone, tg, wa }) {
  return (
    <footer className="footer footerBar">
      <div className="wrap footerBarInner">
        {/* левый блок */}
        <div className="footerLeft muted">© {new Date().getFullYear()} Сергей — сервис</div>

        {/* центр: контакты */}
        <div className="footerCenter">
          <a className="footerLink" href={`tel:${digitsPhone(phone)}`}>{phone}</a>
          <span className="dot">•</span>
          <a className="footerLink" href={tg} target="_blank" rel="noreferrer">Telegram</a>
          <span className="dot">•</span>
          <a className="footerLink" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>

        {/* справа: как работаем */}
        <div className="footerRight">
          <Link className="footerLink" to="/#about">Как работаем</Link>
        </div>
      </div>
    </footer>
  );
}