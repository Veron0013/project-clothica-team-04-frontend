"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./Footer.module.css";

import toastMessage, { MyToastType } from "@/lib/messageService";
import { toast } from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const isDisabled = isSubmitting || isLocked;

  const API = process.env.NEXT_PUBLIC_API_URL;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isDisabled) return;

    setIsLocked(true);
    const unlockEarly = setTimeout(() => setIsLocked(false), 1200);

    if (!API) {
      toastMessage(
        MyToastType.error,
        "Не налаштовано NEXT_PUBLIC_API_URL на фронтенді."
      );
      clearTimeout(unlockEarly);
      setIsLocked(false);
      return;
    }

    const normalized = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
    if (!isValid) {
      toastMessage(MyToastType.error, "Введіть коректний email.");
      clearTimeout(unlockEarly);
      setIsLocked(false);
      return;
    }

    let loadingId: string | undefined;

    try {
      setIsSubmitting(true);

      loadingId = toastMessage(
        MyToastType.loading,
        "Відправляю підписку…"
      ) as unknown as string;

      const res = await fetch(`${API}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || `Помилка підписки (статус ${res.status}).`
        );
      }

      setEmail("");
      toastMessage(MyToastType.success, "Готово! Ви підписані на розсилку.");
    } catch (err: any) {
      toastMessage(
        MyToastType.error,
        err?.message || "Щось пішло не так. Спробуйте пізніше."
      );
    } finally {
      if (loadingId) toast.dismiss(loadingId);
      setIsSubmitting(false);
      clearTimeout(unlockEarly);

      setIsLocked(true);
      setTimeout(() => setIsLocked(false), 800);
    }
  };

  return (
    <footer className={css.section}>
      <div className="container">
        <div className={css.containerWrap}>
          <div className={css.linksContainer}>
            <Link href="/" aria-label="На головну" className={css.logo}>
              <svg width="84" height="36" aria-hidden="true">
                <use href="/sprite.svg#icon-company-logo"></use>
              </svg>
            </Link>

            <div className={css.navigationList}>
              <h2 className={css.menu}>Меню</h2>
              <ul className={css.navigationList}>
                <li className={css.navigation}>
                  <Link href="/">Головна</Link>
                </li>
                <li className={css.navigation}>
                  <Link href="/goods">Товари</Link>
                </li>
                <li className={css.navigation}>
                  <Link href="/categories">Категорії</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={css.subscribeContainer}>
            <h3 className={css.subscribe}>Підписатися</h3>
            <p className={css.text}>
              Приєднуйтесь до нашої розсилки, щоб бути в курсі новин та акцій.
            </p>

            <form onSubmit={onSubmit} className={css.containerSubscribe}>
              <input
                name="email"
                type="email"
                placeholder="Введіть ваш email"
                className={css.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email для підписки"
                disabled={isSubmitting}
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              />
              <button
                type="submit"
                className={css.button}
                disabled={isDisabled}
                aria-disabled={isDisabled}
              >
                {isSubmitting ? "Відправляю..." : "Підписатися"}
              </button>
            </form>
          </div>
        </div>

        <div className={css.socials}>
          <p className={css.rights}>
            © {new Date().getFullYear()} Clothica. Всі права захищені.
          </p>
          <ul className={css.socialContainer}>
            <li>
              <Link
                href="https://www.facebook.com"
                aria-label="facebook"
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                className={`${css.socialLinks} ${css.someOther} ${
                  isDisabled ? css.disabled : ""
                }`}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault();
                }}
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
                rel="noopener noreferrer"
                prefetch={false}
                className={`${css.socialLinks} ${css.someOther} ${
                  isDisabled ? css.disabled : ""
                }`}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault();
                }}
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
                rel="noopener noreferrer"
                prefetch={false}
                className={`${css.socialLinks} ${css.someOther} ${
                  isDisabled ? css.disabled : ""
                }`}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault();
                }}
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
                rel="noopener noreferrer"
                prefetch={false}
                className={`${css.socialLinks} ${css.someOther} ${
                  isDisabled ? css.disabled : ""
                }`}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault();
                }}
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
