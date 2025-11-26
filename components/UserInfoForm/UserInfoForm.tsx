'use client';

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import css from './UserInfoForm.module.css';
import { useMutation } from '@tanstack/react-query';
import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/stores/authStore';
import toastMessage, {
  ExportUserInfoFormSchema,
  MyToastType,
  normalizePhone,
} from '@/lib/messageService';
import AvatarEditor from '../AvatarEditor/AvatarEditor';
import React, { useState } from 'react';
import { requestEmailChange } from '@/lib/api/api';

interface UserInfoFormValues {
  name: string;
  lastname: string;
  phone: string;
  city: string;
  comment?: string;
  warehoseNumber: string;
  email: string;
  newEmail: string;
}

export default function UserInfoForm() {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  // початковий email, щоб порівнювати зміни
  const initialEmail = user?.email || '';

  // стан  редагування поля пошти
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: UserInfoFormValues) => updateMe(data),
    onSuccess: updatedUser => {
      toastMessage(MyToastType.success, 'Ви успішно відредагували дані!');
      setUser(updatedUser);
    },
  });

  const handleSubmit = async (
    values: UserInfoFormValues,
    actions: FormikHelpers<UserInfoFormValues>
  ) => {
    const normalizedPhone = normalizePhone(values.phone) || values.phone;

    const payloadForUpdate: UserInfoFormValues = {
      name: values.name,
      lastname: values.lastname,
      phone: normalizedPhone,
      city: values.city,
      warehoseNumber: values.warehoseNumber,
      comment: values.comment,
      // включаємо email (поточний) і порожній newEmail, щоб відповідати типу
      email: values.email,
      newEmail: '',
    };

    const isNewEmailProvided = !!values.newEmail;

    mutation.mutate(payloadForUpdate, {
      onSettled: () => {
        actions.setSubmitting(false);
      },
      onSuccess: async () => {
        if (isNewEmailProvided) {
          try {
            await requestEmailChange(values.newEmail);
            toastMessage(
              MyToastType.success,
              'На вашу нову адресу надіслано лист для підтвердження!'
            );
            actions.setFieldValue('newEmail', '');
            setIsEditingEmail(false);
          } catch {
            toastMessage(
              MyToastType.error,
              'Не вдалося відправити лист для підтвердження email.'
            );
          }
        }
        // оновлюємо форму (залишаєюнову Email порожнім)
        actions.resetForm({ values: { ...values, newEmail: '' } });
      },
      onError: () => {
        toastMessage(
          MyToastType.error,
          'Не вдалося оновити основну інформацію профілю.'
        );
      },
    });
  };

  const getInputClass = (error: unknown, touched: boolean | undefined) => {
    return error && touched ? `${css.input} ${css.inputError}` : css.input;
  };

  return (
    <div className={css.order_container}>
      <Formik
        enableReinitialize
        initialValues={{
          name: user?.name || '',
          lastname: user?.lastname || '',
          phone: user?.phone || '',
          city: user?.city || '',
          warehoseNumber: user?.warehoseNumber || '',
          email: user?.email || '',
          newEmail: '',
        }}
        validationSchema={ExportUserInfoFormSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={css.form}>
            <fieldset className={css.form}>
              <legend className={css.text}>Особиста інформація</legend>
              <AvatarEditor />

              {/* NAME*/}
              <div className={css.label_wrapper}>
                <div className={css.label}>
                  <label htmlFor="name">Імʼя*</label>
                  <ErrorMessage
                    name="name"
                    component="p"
                    className={css.error}
                  />
                  <Field
                    id="name"
                    className={getInputClass(errors.name, touched.name)}
                    type="text"
                    name="name"
                    placeholder="Ваше імʼя"
                  />
                </div>
                <div className={css.label}>
                  <label htmlFor="lastname">Прізвище*</label>
                  <Field
                    id="lastname"
                    type="text"
                    name="lastname"
                    placeholder="Ваше прізвище"
                    className={getInputClass(errors.lastname, touched.lastname)}
                  />
                  <ErrorMessage
                    name="lastname"
                    component="p"
                    className={css.error}
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className={css.label}>
                <label htmlFor="phone">Номер телефону*</label>
                <Field
                  id="phone"
                  className={getInputClass(errors.phone, touched.phone)}
                  type="tel"
                  name="phone"
                  placeholder="+38(0__) ___- __ - __"
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className={css.error}
                />
              </div>

              {/* EMAIL */}
              <div className={css.label_wrapper}>
                <div className={css.label}>
                  <label htmlFor="email">Поточний email</label>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className={css.error}
                  />
                  {/* Це поле лише відображає поточну пошту */}
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    // className={можна задати постійний стиль}
                    disabled={true}
                  />
                </div>

                {!isEditingEmail && (
                  <div className={css.label}>
                    <button
                      type="button"
                      onClick={() => setIsEditingEmail(true)}
                      className={css.change_button}
                    >
                      {initialEmail ? 'Змінити email ✉️' : 'Додати email ✉️'}
                    </button>
                  </div>
                )}
              </div>
              {/* ПОЛЕ ДЛЯ ВВЕДЕННЯ НОВОЇ ПОШТИ */}
              {isEditingEmail && (
                <div className={css.label_wrapper}>
                  <div className={css.label}>
                    <label htmlFor="newEmail">Новий email</label>
                    <ErrorMessage
                      name="newEmail"
                      component="p"
                      className={css.error}
                    />
                    <Field
                      id="newEmail"
                      type="email"
                      name="newEmail"
                      className={getInputClass(
                        errors.newEmail,
                        touched.newEmail
                      )}
                      placeholder="Введіть новий email"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingEmail(false);
                    }}
                  >
                    Скасувати зміну пошти
                  </button>
                </div>
              )}
              {/* CITY */}
              <div className={css.label_wrapper}>
                <div className={css.label}>
                  <label htmlFor="city">Місто доставки*</label>
                  <Field
                    id="city"
                    type="text"
                    name="city"
                    className={getInputClass(errors.city, touched.city)}
                    placeholder="Ваше місто"
                  />
                  <ErrorMessage
                    name="city"
                    component="p"
                    className={css.error}
                  />
                </div>
                <div className={css.label}>
                  <label htmlFor="warehoseNumber">
                    Номер відділення Нової Пошти*
                  </label>

                  <Field
                    id="warehoseNumber"
                    type="text"
                    name="warehoseNumber"
                    placeholder="Ваш номер відділення"
                    className={getInputClass(
                      errors.warehoseNumber,
                      touched.warehoseNumber
                    )}
                  />
                  <ErrorMessage
                    name="warehoseNumber"
                    component="p"
                    className={css.error}
                  />
                </div>
              </div>
            </fieldset>
            <button
              className={css.button}
              type="submit"
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
