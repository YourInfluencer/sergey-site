// src/components/Seo.jsx
import { Helmet } from "react-helmet-async";
import { SITE as CFG } from "../config/site.config.js";

export default function Seo({ title, description, path = "/", noindex = false }) {
  const canonical = `${CFG.domain}${path}`;
  const fullTitle = title ? `${title} — ${CFG.brand}` : CFG.brand;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={CFG.brand} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />

      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
    </Helmet>
  );
}