'use client';

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import css from './UserInfoForm.module.css';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { updateMe } from '@/lib/api/clientApi';
import { PHONE_REGEXP } from '@/lib/vars';
import { useAuthStore } from '@/stores/authStore';
import toastMessage, {
  MyToastType,
  normalizePhone,
} from '@/lib/messageService';

const UserInfoFormSchema = Yup.object().shape({
  name: Yup.string().min(2).max(20).required('Це поле обовʼязкове!'),
  lastname: Yup.string().min(3).max(20).required('Це поле обовʼязкове!'),
  phone: Yup.string()
    .matches(PHONE_REGEXP, 'Введіть коректний номер телефону')
    .required('Це поле обовʼязкове!'),
  city: Yup.string().min(3).required('Це поле обовʼязкове!'),
  warehoseNumber: Yup.number()
    .typeError('Вкажіть номер відділення цифрами')
    .min(1, 'Номер не може бути меншим за 1')
    .required('Це поле обовʼязкове!'),
});

interface UserInfoFormValues {
  name: string;
  lastname: string;
  phone: string;
  city: string;
  comment?: string;
  warehoseNumber: string;
}

export default function UserInfoForm() {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  //console.log("form-user", user, user?.name)

  const initialValues: UserInfoFormValues = {
    name: user?.name || '',
    lastname: user?.lastname || user?.lastname || '',
    phone: user?.phone || '',
    city: user?.city || '',
    warehoseNumber: user?.warehoseNumber || user?.warehoseNumber || '',
  };
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: UserInfoFormValues) => updateMe(data),
    onSuccess: updatedUser => {
      toastMessage(MyToastType.success, 'Ви успішно відредагували дані!');
      router.push('/');
      setUser(updatedUser);
    },
  });

  const handleSubmit = (
    values: UserInfoFormValues,
    actions: FormikHelpers<UserInfoFormValues>
  ) => {
    const userValues = { ...values };
    userValues.phone = normalizePhone(userValues.phone) || userValues.phone;

    mutation.mutate(userValues, {
      onSettled: () => {
        actions.setSubmitting(false);
      },
      onSuccess: () => {
        actions.resetForm({ values });
      },
    });
  };

  const getInputClass = (error: unknown, touched: boolean | undefined) => {
    return error && touched ? `${css.input} ${css.inputError}` : css.input;
  };

  return (
    <div className={css.order_container}>
      <Formik
        initialValues={initialValues}
        validationSchema={UserInfoFormSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={css.form}>
            <fieldset className={css.form}>
              <legend className={css.text}>Особиста інформація</legend>
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
