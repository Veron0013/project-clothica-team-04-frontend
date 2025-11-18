'use client';

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import css from './UserOrderInfoForm.module.css';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { sendOrder } from '@/lib/api/clientApi';
import { DELIVERY_PRICE, PHONE_REGEXP } from '@/lib/vars';
import { useAuthStore } from '@/stores/authStore';
import toastMessage, {
  MyToastType,
  normalizePhone,
} from '@/lib/messageService';
import { debounce } from 'lodash';
import { useState, useEffect, useMemo } from 'react';
import {
  CityRespNP,
  searchCities,
  searchWarehouses,
  WarehoseRespNP,
} from '@/lib/api/nPostApi';
import { Order } from '@/types/orders';
import { UserOrderInfoFormValues } from '@/types/user';
import { useBasket } from '@/stores/basketStore';

const UserInfoFormSchema = Yup.object().shape({
  name: Yup.string().min(2).max(20).required('Це поле обовʼязкове!'),
  lastname: Yup.string().min(3).max(20).required('Це поле обовʼязкове!'),
  phone: Yup.string()
    .matches(PHONE_REGEXP, 'Введіть коректний номер телефону')
    .required('Це поле обовʼязкове!'),
  city: Yup.string().min(3).required('Це поле обовʼязкове!'),
  //warehoseNumber: Yup.string().min(1).required('Це поле обовʼязкове!'),
  warehoseNumber: Yup.number()
    .typeError('Вкажіть номер відділення цифрами')
    .min(1, 'Номер не може бути меншим за 1')
    .required('Це поле обовʼязкове!'),
});

export default function UserOrderInfoForm() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const basketGoods = useBasket(state => state.goods);

  const [cityQuery, setCityQuery] = useState(''); // що вводить користувач
  const [cities, setCities] = useState<CityRespNP[]>([]);
  const [selectedCityRef, setSelectedCityRef] = useState<string | null>(null);

  const [warehouses, setWarehouses] = useState<WarehoseRespNP[]>([]);
  //const [loadingCities, setLoadingCities] = useState(false)
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  console.log('form-user', user, user?.name);

  useEffect(() => {
    debouncedSearch(cityQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityQuery]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (str: string) => {
        if (str.length < 3) return;

        const data = await searchCities(str);
        setCities(data);
      }, 400),
    []
  );

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityQuery(e.target.value);
    debouncedSearch(e.target.value);
    setSelectedCityRef(null); // якщо юзер почав писати знову — скидаємо вибране місто
  };

  const loadWarehouses = async (cityRef: string) => {
    setLoadingWarehouses(true);
    try {
      const data = await searchWarehouses(cityRef);
      setWarehouses(data);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: Order) => sendOrder(data),
    onSuccess: () => {
      toastMessage(
        MyToastType.success,
        'Ви успішно відправили замовлення! Очікуйте на доставку'
      );
      router.push('/');
    },
  });

  const handleSubmit = (
    values: UserOrderInfoFormValues,
    actions: FormikHelpers<UserOrderInfoFormValues>
  ) => {
    if (basketGoods.length === 0) {
      toastMessage(MyToastType.error, 'Кошик порожній!');
      actions.setSubmitting(false);
      return;
    }

    // Формуємо об'єкт Order
    const order: Order = {
      userId: user?._id || null,
      items: basketGoods.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount:
        DELIVERY_PRICE +
        basketGoods.reduce((sum, i) => sum + i.quantity * i.price, 0),
      deliveryDetails: {
        address: `${values.city}, ${values.warehoseNumber}`,
        phone: normalizePhone(values.phone) || values.phone,
        fullName: `${values.name} ${values.lastname.toUpperCase()}`,
      },
      comment: values.comment || '',
    };

    //console.log('order', order);

    //mutation.mutate(order, {
    //  onSettled: () => actions.setSubmitting(false),
    //  onSuccess: () => actions.resetForm({ values }),
    //});
  };

  //console.log("fetch", cities, warehouses)

  const getInputClass = (error: unknown, touched: boolean | undefined) => {
    return error && touched ? `${css.input} ${css.inputError}` : css.input;
  };

  return (
    <div className={css.order_container}>
      <Formik
        enableReinitialize
        initialValues={{
          name: user?.name || '',
          lastname: user?.lastName || '',
          phone: user?.phone || '',
          city: user?.city || '',
          warehoseNumber: '',
          comment: '',
        }}
        validationSchema={UserInfoFormSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={css.form}>
            <fieldset className={css.form}>
              <legend className={css.text}>Особиста інформація</legend>
              <div className={css.label_wrapper}>
                <div className={css.label}>
                  <label htmlFor="name" aria-placeholder="name">
                    Імʼя*
                  </label>
                  <Field
                    id="name"
                    className={getInputClass(errors.name, touched.name)}
                    type="text"
                    name="name"
                    placeholder="Ваше імʼя"
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className={css.error}
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
                    name="city"
                    type="text"
                    //value={cityQuery}
                    //onChange={handleCityInputChange}
                    className={css.input}
                  />
                  <ErrorMessage
                    name="city"
                    component="p"
                    className={css.error}
                  />

                  {/*{cities.length > 0 && (
                    <ul className={css.suggestions}>
                      {cities.map(c => (
                        <li key={c.Ref} onClick={() => loadWarehouses(c.Ref)}>
                          {c.Description}
                        </li>
                      ))}
                    </ul>
                  )}*/}
                </div>
                <div className={css.label}>
                  <label htmlFor="warehoseNumber">
                    Номер відділення Нової Пошти*
                  </label>

                  <Field
                    id="warehoseNumber"
                    name="warehoseNumber"
                    //as="select"
                    type="text"
                    //disabled={!selectedCityRef || loadingWarehouses}
                    className={css.input}
                  >
                    {/*<option value="">Оберіть відділення</option>
                    {warehouses.map(wh => (
                      <option key={wh.Number} value={wh.Number}>
                        {`№ ${wh.Number} – ${wh.ShortAddress}`}
                      </option>
                    ))}*/}
                  </Field>

                  <ErrorMessage
                    name="warehoseNumber"
                    component="p"
                    className={css.error}
                  />
                </div>
              </div>

              <div className={css.label}>
                <label htmlFor="comment">Коментар</label>

                <Field
                  as="textarea"
                  id="comment"
                  className={`${getInputClass(
                    errors.comment,
                    touched.comment
                  )} ${css.comment}`}
                  name="comment"
                  placeholder="Введіть ваш коментар"
                  rows={6}
                />
                <ErrorMessage
                  name="comment"
                  component="p"
                  className={css.error}
                />
              </div>
            </fieldset>

            <button
              className={css.button}
              type="submit"
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending
                ? 'Оформлення замовлення...'
                : 'Оформити замовлення'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
