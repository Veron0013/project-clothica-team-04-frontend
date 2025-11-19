'use client';
import { useRouter, useSearchParams } from 'next/navigation';

import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { useId, useState } from 'react';
import css from './ResetPassword.module.css';
import * as Yup from 'yup';
import { resetPassword } from '@/lib/api/clientApi';
import toastMessage, { MyToastType } from '@/lib/messageService';
import Link from 'next/link';
import { BiHide, BiShow } from "react-icons/bi"

const ResetPassword = () => {
  interface ResetPasswordFormValues {
    password: string;
  }

  const initialValues: ResetPasswordFormValues = {
    password: '',
  };

  const SendMailSchema = Yup.object().shape({
    password: Yup.string().min(8).max(36).required('Це поле обовʼязкове!'),
  });

  const fieldId = useId();
  const router = useRouter();
  // const [error, setError] = useState("")
  const [show, setShow] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  //console.log(token)

  const handleSubmit = async (
    values: ResetPasswordFormValues,
    formikHelpers: FormikHelpers<ResetPasswordFormValues>
  ) => {
    setIsSending(true);
    formikHelpers.resetForm();

    try {
      const res = await resetPassword({ ...values, token: String(token) });

      //console.log(res);

      if (!res.message || res?.status !== 200) {
        toastMessage(
          MyToastType.error,
          `Пароль не змінено. Сервер на технічному обслуговуванні.`
        );
        // setError("Server under maintanance")
      } else if (res) {
        toastMessage(MyToastType.success, res.message);
        router.push('/sign-in');
        formikHelpers.resetForm();
      } else {
        // setError("Упппс... виникла помилка")
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Упппс... виникла помилка';
      toastMessage(
        MyToastType.error,
        `E-mail не надіслано. Виникла помилка. ${message}`
      );
      // setError("Oops... some error");
    } finally {
      setIsSending(false);
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
      <Formik
        initialValues={initialValues}
        validationSchema={SendMailSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched}) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="password">Введіть свій новий пароль</label>
            <div className={css.passwordWrapper}>
              <Field
                id={`${fieldId}-password`}
                type={!show ? 'password' : 'text'}
                name="password"
                placeholder=""
                autoComplete="off"
                className={`${css.input} ${errors.password && touched.password ? css.inputError : ""}`}
              />
              
              <span className={css.toggleIcon} onClick={() => setShow(!show)}>
								{!show ? <BiHide /> : <BiShow />}
									</span>
            </div>
            <ErrorMessage name="password" component="p" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.button} disabled={isSending}>
              {isSending ? `Міняю пароль` : 'Поміняти пароль'}
            </button>
          </div>
        </Form>
        )}
      </Formik>
      <footer className={css.footer}>
        <p>&copy; {new Date().getFullYear()} Clothica. Всі права захищені.</p>
      </footer>
    </div>
  );
};

export default ResetPassword;
