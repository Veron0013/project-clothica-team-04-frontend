import Link from "next/link";
import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.section}>
      <div className="container">
        <div className={css.containerWrap}>
          <div className={css.linksContainer}>
            <a href="" aria-label="На головну" className={css.logo}>
              <svg width="84" height="36" aria-hidden="true">
                <use href="/sprite.svg#icon-company-logo"></use>
              </svg>
            </a>
            <div className={css.navigationList}>
              <h2 className={css.menu}>Меню</h2>
              <ul className={css.navigationList}>
                <li className={css.navigation}>
                  <a href="">Головна</a>
                </li>
                <li className={css.navigation}>
                  <a href="">Товари</a>
                </li>
                <li className={css.navigation}>
                  <a href="">Категорії</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={css.subscribeContainer}>
            <h3 className={css.subscribe}>Підписатися</h3>
            <p className={css.text}>
              Приєднуйтесь до нашої розсилки, щоб бути в курсі новин та акцій.
            </p>
            <div className={css.containerSubscribe}>
              <form action="" className={css.containerSubscribe}>
                <input
                  type="mail"
                  placeholder="Введіть ваш email"
                  className={css.input}
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                />
                <button type="submit" className={css.button}>
                  Підписатися
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className={css.socials}>
          <p className={css.rights}>
            {new Date().getFullYear()} Clothica. Всі права захищені.
          </p>
          <ul className={css.socialContainer}>
            <li>
              <Link
                href="https://www.facebook.com"
                aria-label="facebook"
                target="_blank"
                className={css.socialLinks}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href="/sprite.svg#Facebook"></use>
                </svg>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com"
                aria-label="Instagram"
                target="_blank"
                className={css.socialLinks}
              >
                <svg
                  className={css.svgInstagram}
                  width="32"
                  height="32"
                  aria-hidden="true"
                >
                  <use href="/sprite.svg#Instagram"></use>
                </svg>
              </Link>
            </li>
            <li>
              <Link
                href="https://x.com"
                aria-label="x"
                target="_blank"
                className={css.socialLinks}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href="/sprite.svg#X"></use>
                </svg>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com"
                aria-label="youtube"
                target="_blank"
                className={css.socialLinks}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href="/sprite.svg#Youtube"></use>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
