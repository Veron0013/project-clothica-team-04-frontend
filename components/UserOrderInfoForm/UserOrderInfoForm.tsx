'use client';

import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
} from 'formik';
import css from './UserOrderInfoForm.module.css';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { sendOrder } from '@/lib/api/clientApi';
import { DELIVERY_PRICE } from '@/lib/vars';
import { useAuthStore } from '@/stores/authStore';
import toastMessage, {
  ExportUserInfoFormSchema,
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

export default function UserOrderInfoForm() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const basketGoods = useBasket(state => state.goods);
  const clearBasket = useBasket(state => state.clearBasket);

  const [cityQuery, setCityQuery] = useState(''); // що вводить користувач
  const [cities, setCities] = useState<CityRespNP[]>([]);
  const [selectedCityRef, setSelectedCityRef] = useState<string | null>(null);
  const [showCitiesList, setShowCitiesList] = useState(false);

  const [warehouses, setWarehouses] = useState<WarehoseRespNP[]>([]);
  const [warehouseQuery, setWarehouseQuery] = useState('');
  //const [loadingCities, setLoadingCities] = useState(false)
  //const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [showWarehousesList, setShowWarehousesList] = useState(false);

  //console.log('form-user', user, user?.name);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (str: string) => {
        if (str.length < 3) return;

        const data = await searchCities(str);
        setCities(data);
      }, 400),
    []
  );

  const debouncedSearchWh = useMemo(
    () =>
      debounce(async (ref: string, search: string) => {
        if (!ref || search.length === 0) return;
        //setLoadingWarehouses(true);

        try {
          const data = await searchWarehouses(ref, search); // API-based search
          setWarehouses(data);
        } finally {
          //setLoadingWarehouses(false);
        }
      }, 400),
    []
  );

  useEffect(() => {
    if (!selectedCityRef) return;

    if (warehouseQuery.length === 0) {
      setWarehouses([]);
      setShowWarehousesList(false);
      return;
    }
    debouncedSearchWh(selectedCityRef, warehouseQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warehouseQuery, selectedCityRef]);

  useEffect(() => {
    debouncedSearch(cityQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityQuery]);

  const handleCityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const value = e.target.value;

    setCityQuery(value);
    setFieldValue('city', value);

    setSelectedCityRef(null);
    setWarehouses([]);
    setFieldValue('warehoseNumber', '');

    if (value.length >= 3) {
      setShowCitiesList(true);
    } else {
      setShowCitiesList(false);
    }
  };

  const loadWarehouses = async (ref: string, search: string) => {
    //setLoadingWarehouses(true);

    try {
      const data = await searchWarehouses(ref, search);
      setWarehouses(data);
      setShowWarehousesList(true);
    } finally {
      //setLoadingWarehouses(false);
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
      clearBasket();
    },
  });

  const handleSubmit = (
    values: UserOrderInfoFormValues,
    actions: FormikHelpers<UserOrderInfoFormValues>
  ) => {
    //console.log(values);
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

    mutation.mutate(order, {
      onSettled: () => actions.setSubmitting(false),
      onSuccess: () => {
        actions.resetForm({ values });
        router.push(user ? '/profile' : '/');
      },
    });
  };

  //console.log('fetch', cities, warehouses);

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
          comment: '',
        }}
        validationSchema={ExportUserInfoFormSchema}
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
                  <Field name="city">
                    {({ field, form }: FieldProps<string>) => (
                      <div className={css.inputWrapper}>
                        <input
                          id="city"
                          type="text"
                          name={field.name}
                          value={field.value ?? ''}
                          onChange={e =>
                            handleCityChange(e, form.setFieldValue)
                          }
                          onBlur={field.onBlur}
                          autoComplete="off"
                          placeholder="Ваше місто"
                          className={getInputClass(errors.city, touched.city)}
                        />

                        {field.value.length > 0 && (
                          <button
                            type="button"
                            className={css.clearButton}
                            onClick={() => {
                              form.setFieldValue('city', '');
                              setCityQuery('');
                              setSelectedCityRef(null);
                              setShowCitiesList(false);
                              setCities([]);
                              setWarehouses([]);
                            }}
                          >
                            ×
                          </button>
                        )}

                        {showCitiesList && cities.length > 0 && (
                          <ul className={css.customOptionsList}>
                            {cities.map(city => (
                              <li
                                key={city.Ref}
                                className={css.customOptionItem}
                                onClick={async () => {
                                  form.setFieldValue('city', city.Description);
                                  setCityQuery(city.Description);
                                  setSelectedCityRef(city.Ref);

                                  setShowCitiesList(false);
                                  setCities([]);

                                  await loadWarehouses(city.Ref, '');
                                }}
                              >
                                {city.Description}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </Field>

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
                  <Field name="warehoseNumber">
                    {({ field, form }: FieldProps<string>) => (
                      <div className={css.inputWrapper}>
                        {/* INPUT */}
                        <input
                          id="warehoseNumber"
                          type="text"
                          name={field.name}
                          value={field.value ?? ''}
                          onChange={e => {
                            form.setFieldValue(
                              'warehoseNumber',
                              e.target.value
                            );
                            setWarehouseQuery(e.target.value);
                            setShowWarehousesList(true);
                          }}
                          onBlur={field.onBlur}
                          autoComplete="off"
                          disabled={!selectedCityRef}
                          placeholder={
                            selectedCityRef
                              ? 'Пошук відділення'
                              : 'Спочатку оберіть місто'
                          }
                          className={getInputClass(
                            errors.warehoseNumber,
                            touched.warehoseNumber
                          )}
                        />

                        {/* CLEAR BUTTON */}
                        {field.value.length > 0 && (
                          <button
                            type="button"
                            className={css.clearButton}
                            onClick={() => {
                              form.setFieldValue('warehoseNumber', '');
                              setWarehouseQuery('');
                              setShowWarehousesList(false);
                              setWarehouses([]);
                            }}
                          >
                            ×
                          </button>
                        )}

                        {/* OPTIONS LIST */}
                        {showWarehousesList && warehouses.length > 0 && (
                          <ul className={css.customOptionsList}>
                            {warehouses.map(wh => (
                              <li
                                key={wh.Number}
                                className={css.customOptionItem}
                                onClick={() => {
                                  form.setFieldValue(
                                    'warehoseNumber',
                                    wh.Number
                                  );
                                  setWarehouseQuery(wh.Number);
                                  setShowWarehousesList(false); // <-- важливо
                                }}
                              >
                                № {wh.Number} — {wh.ShortAddress}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
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
