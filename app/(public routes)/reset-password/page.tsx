"use client";

import Link from "next/link";
import css from "./ResetPassword.module.css";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!token) {
      setMessage("Недійсне або відсутнє посилання для зміни паролю.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data?.message || "Не вдалося змінити пароль.");
      } else {
        setMessage("Пароль успішно змінено! Увійдіть з новим паролем 💚");
      }
    } catch {
      setMessage("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={css.wrapper}>
      <header className={css.header}>
        <Link href="/" className={css.logo} aria-label="Clothica logo">
          <svg width="84" height="36" aria-hidden="true">
            <use href="/sprite.svg#icon-company-logo" />
          </svg>
        </Link>
      </header>

      <div className={css.formCont}>
        <form className={css.form} onSubmit={handleSubmit}>
          <label htmlFor="password">Ввести новий пароль</label>
          <input
            name="password"
            type="password"
            placeholder="Введіть новий пароль"
            className={css.input}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className={css.button}>
            {isSubmitting ? "Зберігаю..." : "Зберегти новий пароль"}
          </button>
        </form>

        {message && <p className={css.message}>{message}</p>}
      </div>
    </div>
  );
}
