import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <main className="public-page public-not-found">
      <section aria-labelledby="not-found-title">
        <p className="vh-kicker">404</p>
        <h1 id="not-found-title">
          {t("errors.notFoundTitle", "No encontramos esta página")}
        </h1>
        <p>
          {t(
            "errors.notFoundText",
            "La dirección puede ser incorrecta o la página ya no está disponible.",
          )}
        </p>
        <Link className="vh-button vh-button--light" to="/">
          {t("errors.backHome", "Volver al inicio")}
        </Link>
      </section>
    </main>
  );
}
