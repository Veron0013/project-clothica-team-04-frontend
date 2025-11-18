"use client"

import Link from "next/link";
import css from "./RecoveryPassword.module.css";
import { useId, useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup"
import toastMessage, { MyToastType } from "@/lib/messageService";
import { passwordSendMail } from "@/lib/api/clientApi";

export default function RecoveryPassword() {
  const fieldId = useId();
//   const [err, setError] = useState("")
  const [isSending, setIsSending] = useState(false);

  interface SendMailFormValues {
		email: string
	}
const initialValues: SendMailFormValues = {
		email: "",
}
  const SendMailSchema = Yup.object().shape({
		email: Yup.string().email("Невалідний формат e-mail").required(),
	})
  const handleSubmit = async (values: SendMailFormValues, formikHelpers: FormikHelpers<SendMailFormValues>) => {
		console.log("submit")

		setIsSending(true)
		formikHelpers.resetForm()

		try {
			const res = await passwordSendMail(values)

			if (!res.data.message || res?.status !== 200) {
				toastMessage(MyToastType.error, `E-mail не надіслано. Сервер на технічному обслуговуванні.`)
				// setError("Сервер на технічному обслуговуванні.")
			} else if (res) {
				toastMessage(MyToastType.success, res.data.message)
				formikHelpers.resetForm()
			} else {
				toastMessage(MyToastType.error, "Упппс... виникла помилка")
			}
		} catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Упппс... виникла помилка";
      toastMessage(
        MyToastType.error,
        `E-mail не надіслано. Виникла помилка. ${message}`
      );
      // setError("Oops... some error");
		} finally {
			setIsSending(false)
		}
}
  return (
    <div className={css.wrapper}>
      <header className={css.header}>
        <Link href="/" className={css.logo} aria-label="Clothica logo">
          <svg width="84" height="36" aria-hidden="true">
            <use href="/sprite.svg#icon-company-logo" />
          </svg>
        </Link>
      </header>
      <Formik initialValues={initialValues} validationSchema={SendMailSchema} onSubmit={handleSubmit}>
					<Form className={css.form}>
						<div className={css.formGroup}>
							<label htmlFor="email">Введіть свій e-mail</label>
							<Field
								id={`${fieldId}-email`}
								type="text"
								name="email"
								placeholder=""
								className={css.input}
							/>
						</div>

						<div className={css.actions}>
							<button type="submit" className={css.button} disabled={isSending}>
								{isSending ? `Відправляю...` : "Відправити"}
							</button>
						</div>
					</Form>
				</Formik>
      <footer className={css.footer}>
				<p>&copy; {new Date().getFullYear()} Clothica. Всі права захищені.</p>
			</footer>
    </div>
  );
}

