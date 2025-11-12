"use client";

import { useRouter } from "next/navigation";
import css from "./UserInfoForm.module.css";

export default function UserInfoForm() {
  const router = useRouter();

  const handleSubmit = (FormData: FormData) => {
    const text = FormData.get("text") as string;
    console.log(text);
  };
  return (
    <div className="container">
      <h3 className={css.text}>Особиста інформація</h3>
      <form className={css.form} action={handleSubmit}>
        <label className={css.label} htmlFor="">
          Імʼя*
          <input
            className={css.input}
            type="text"
            name="name"
            placeholder="Ваше імʼя"
            required
          />
        </label>
        <label className={css.label} htmlFor="">
          Прізвище*
          <input
            className={css.input}
            type="text"
            name="surname"
            placeholder="Ваше прізвище"
            required
          />
        </label>
        <label className={css.label} htmlFor="">
          Номер телефону*
          <input
            className={css.inputTel}
            type="tel"
            name="phone"
            placeholder="+38 (0__) ___-__-__"
            required
          />
        </label>
        <label className={css.label} htmlFor="">
          Місто доставки*
          <input
            className={css.input}
            type="text"
            name="city"
            placeholder="Ваше місто"
            required
          />
        </label>
        <label className={css.label} htmlFor="">
          Номер відділення Нової Пошти*
          <input className={css.input} type="number" name="novaBranch" placeholder="1" required />
        </label>
        <label className={css.labelText}>
          Коментар
          <textarea
            className={css.textarea}
            name="comment"
            placeholder="Введіть ваш коментар"
          />
        </label>
        <button
          className={css.button}
          type="button"
          onClick={() => router.push("/")}
        >
         Зберегти зміни
        </button>
      </form>
    </div>
  );
}
