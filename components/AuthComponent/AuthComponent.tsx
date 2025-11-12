"use client";

import Link from "next/link";
import css from "./AuthComponent.module.css";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
// import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthComponentProps {
  login?: boolean;
}

interface AuthValues {
  name?: string;
  phone: string;
  password: string;
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

export default function AuthComponent({ login = false }: AuthComponentProps) {
  //   const router = useRouter();

  const handleSubmit = async (
    values: AuthValues,
    { setSubmitting }: FormikHelpers<AuthValues>
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(values);
      toast.success(
        login ? "Ви успішно увійшли!" : "Ви успішно зареєструвалися!"
      );
    } catch (err) {
      console.error(err);
      toast.error("Щось пішло не так");
    } finally {
      setSubmitting(false);
    }
  };

  const initLoginValues: AuthValues = {
    phone: "",
    password: "",
  };
  const initRegValues: AuthValues = {
    name: "",
    phone: "",
    password: "",
  };

  return (
    <div className={css.wrapper}>
      <div className={css.content}>
        <div className={css.buttonsBlock}>
          <div className={`${css.authBtn} ${!login ? css.active : ""} `}>
            <Link href="/sign-up">Реєстрація</Link>
          </div>
          <div className={`${css.authBtn} ${login ? css.active : ""} `}>
            <Link href="/sign-in">Вхід</Link>
          </div>
        </div>

        <Formik
          initialValues={login ? initLoginValues : initRegValues}
          onSubmit={handleSubmit}
          validationSchema={login ? SignInSchema : SignUpSchema}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <h2 className={css.title}>{login ? "Вхід" : "Реєстрація"}</h2>
              {!login ? (
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
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className={css.error}
                  />
                </div>
              ) : (
                ""
              )}
              <div className={css.formGroup}>
                <label htmlFor="phone">Номер телефону*</label>
                <Field
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`${css.input} ${
                    errors.phone && touched.phone ? css.inputError : ""
                  }`}
                  placeholder="+38 (0__) ___-__-__"
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
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className={css.error}
                />
              </div>
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
