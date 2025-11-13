"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import css from "./AuthComponent.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { callAuth, type AuthValues } from "@/lib/api/authApi";
import toastMessage, { MyToastType } from "@/lib/messageService";
import { useAuthStore } from "@/stores/authStore";

interface AuthComponentProps {
  login?: boolean;
}

const phoneRegExp = /^\+?3?8?(0\d{9})$/;

const SignUpSchema = Yup.object().shape({
  name: Yup.string().min(2).max(20).required("Це поле обовʼязкове!"),
  phone: Yup.string()
    .matches(phoneRegExp, "Введіть коректний номер телефону")
    .required("Це поле обовʼязкове!"),
  password: Yup.string().min(8).max(40).required("Це поле обовʼязкове!"),
});

const SignInSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(phoneRegExp, "Введіть коректний номер телефону!")
    .required("Це поле обовʼязкове!"),
  password: Yup.string().min(8).max(40).required("Це поле обовʼязкове!"),
});

export default function AuthComponent({ login = false }: { login?: boolean }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (
    values: AuthValues,
    { setSubmitting, setFieldError, setStatus, resetForm }: any
  ) => {
    setStatus(null);
    const loadingId = toastMessage(
      MyToastType.loading,
      login ? "Вхід..." : "Реєстрація..."
    );

    try {
      const data = await callAuth(login, values);
      const userObj = login ? data?.user : data;
      if (!userObj) {
        setStatus("Невідома помилка: користувача не отримано");
        toastMessage(MyToastType.error, "Сталася помилка. Спробуйте ще раз.");
        return;
      }

      setUser(userObj);

      resetForm();

      queryClient.invalidateQueries({ queryKey: ["me"] });

      toastMessage(
        MyToastType.success,
        login ? "Ви успішно увійшли!" : "Ви успішно зареєструвалися!"
      );
      router.push("/");
    } catch (e: any) {
      const msg = e?.message || "Oops... some error";
      if (msg.includes("Phone and password required")) {
        setFieldError("phone", "Вкажіть телефон");
        setFieldError("password", "Вкажіть пароль");
      } else if (msg.includes("Invalid phone number")) {
        setFieldError("phone", "Некоректний номер телефону");
      } else if (msg.includes("Phone already in use")) {
        setFieldError("phone", "Цей номер вже використовується");
      } else if (msg.includes("Invalid phone or password")) {
        setFieldError("phone", "Невірний телефон або пароль");
        setFieldError("password", "Невірний телефон або пароль");
      } else {
        setStatus(msg);
      }
      toastMessage(MyToastType.error, msg);
    } finally {
      try {
        const { toast } = await import("react-hot-toast");
        toast.dismiss(loadingId);
      } catch {}
      setSubmitting(false);
    }
  };

  const initLoginValues: AuthValues = { phone: "", password: "" };
  const initRegValues: AuthValues = { name: "", phone: "", password: "" };

  return (
    <div className={css.wrapper}>
      <div className={css.content}>
        <div className={css.buttonsBlock}>
          <div className={`${css.authBtn} ${!login ? css.active : ""}`}>
            <Link href="/sign-up">Реєстрація</Link>
          </div>
          <div className={`${css.authBtn} ${login ? css.active : ""}`}>
            <Link href="/sign-in">Вхід</Link>
          </div>
        </div>

        <Formik
          initialValues={login ? initLoginValues : initRegValues}
          validationSchema={login ? SignInSchema : SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, status }) => (
            <Form>
              <h2 className={css.title}>{login ? "Вхід" : "Реєстрація"}</h2>

              {!login && (
                <div className={css.formGroup}>
                  <label htmlFor="name">Імʼя*</label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className={`${css.input} ${
                      errors.name && touched.name ? css.inputError : ""
                    }`}
                    placeholder="Ваше імʼя"
                    autoComplete="name"
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className={css.error}
                  />
                </div>
              )}

              <div className={css.formGroup}>
                <label htmlFor="phone">Номер телефону*</label>
                <Field
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  className={`${css.input} ${
                    errors.phone && touched.phone ? css.inputError : ""
                  }`}
                  placeholder="+38 (0__) ___-__-__"
                  autoComplete="tel"
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className={css.error}
                />
              </div>

              <div className={css.formGroup}>
                <label htmlFor="password">Пароль*</label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`${css.input} ${
                    errors.password && touched.password ? css.inputError : ""
                  }`}
                  placeholder="********"
                  autoComplete={login ? "current-password" : "new-password"}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className={css.error}
                />
              </div>

              {status && <p className={css.error}>{status}</p>}

              <button
                className={css.submitBtn}
                type="submit"
                disabled={isSubmitting}
              >
                {login
                  ? isSubmitting
                    ? "Вхід..."
                    : "Увійти"
                  : isSubmitting
                  ? "Реєстрація..."
                  : "Зареєструватися"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
