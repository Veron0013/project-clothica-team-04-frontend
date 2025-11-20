'use client';

import Link from 'next/link';
import css from './RecoveryPassword.module.css';
import { useId, useState } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toastMessage, { MyToastType } from '@/lib/messageService';
import { passwordSendMail } from '@/lib/api/clientApi';
import { PHONE_REGEXP } from '@/lib/vars';

export default function RecoveryPassword() {
  const fieldId = useId();
  //   const [err, setError] = useState("")
  const [isSending, setIsSending] = useState(false);

  interface SendMailFormValues {
    email: string;
    phone: string;
  }
  const initialValues: SendMailFormValues = {
    email: '',
    phone: '',
  };
  const SendMailSchema = Yup.object().shape({
    email: Yup.string().email('Невалідний формат e-mail').required('Це поле обовʼязкове!'),
    phone: Yup.string()
      .matches(PHONE_REGEXP, 'Введіть коректний номер телефону')
      .required('Це поле обовʼязкове!'),
  });


  const getInputClass = (error: unknown, touched: boolean | undefined) => {
    return error && touched ? `${css.input} ${css.inputError}` : css.input;
  };


  const handleSubmit = async (
    values: SendMailFormValues,
    formikHelpers: FormikHelpers<SendMailFormValues>
  ) => {
    //console.log('submit');

    setIsSending(true);
    formikHelpers.resetForm();

    try {
      const res = await passwordSendMail(values);
      //console.log(res);

      if (!res.message || res?.status !== 200) {
        toastMessage(
          MyToastType.error,
          `E-mail не надіслано. Сервер на технічному обслуговуванні.`
        );
        // setError("Сервер на технічному обслуговуванні.")
      } else if (res) {
        toastMessage(MyToastType.success, res.message);
        formikHelpers.resetForm();
      } else {
        toastMessage(MyToastType.error, 'Упппс... виникла помилка');
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
{({ isSubmitting, errors, touched}) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="phone">Введіть свій номер телефону</label>
            <Field
              id={`${fieldId}-phone`}
              type="tel"
              name="phone"
              placeholder="+38 (0__) ___-__-__"
              className={getInputClass(errors.phone, touched.phone)}
            />
            
          </div>
<ErrorMessage name="phone" component="p" className={css.error} />
          <div className={css.formGroup}>
            <label htmlFor="email">Введіть свій e-mail</label>
            <Field
              id={`${fieldId}-email`}
              type="text"
              name="email"
              placeholder=""
              className={`${css.input} ${errors.email && touched.email ? css.inputError : ""}`}
            />
          </div>
<ErrorMessage name="email" component="p" className={css.error} />
          <div className={css.actions}>
            <button type="submit" className={css.button} disabled={isSending}>
              {isSubmitting ? `Відправляю...` : 'Відправити'}
            </button>
          </div>
        </Form>)}
      </Formik>
      <footer className={css.footer}>
        <p>&copy; {new Date().getFullYear()} Clothica. Всі права захищені.</p>
      </footer>
    </div>
  );
}
