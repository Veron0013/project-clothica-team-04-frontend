import { toast, type ToastPosition } from 'react-hot-toast';
import * as Yup from 'yup';
import { PHONE_REGEXP } from './vars';
import css from '../components/UserInfoForm/UserInfoForm.module.css';

export enum MyToastType {
  success = 'success',
  error = 'error',
  loading = 'loading',
  custom = 'custom',
}

interface ToastProps {
  duration: number;
  position: ToastPosition;
}

export default function toastMessage(toastType: MyToastType, text: string) {
  const toastProps: ToastProps = {
    duration: 3000,
    position: 'top-center',
  };

  return toast[toastType](text, toastProps);
}

export function normalizePhone(phone: string): string | null {
  if (!phone) return null;

  // залишаємо тільки цифри
  const digits = phone.replace(/\D/g, '');

  // кейс 1: 380XXXXXXXXX (11 цифр)
  if (/^380\d{9}$/.test(digits)) {
    return digits;
  }

  // кейс 2: 0XXXXXXXXX (10 цифр)
  if (/^0\d{9}$/.test(digits)) {
    return '38' + digits;
  }

  // кейс 3: 80XXXXXXXXX (10 цифр, без +3)
  if (/^80\d{8}$/.test(digits)) {
    return '3' + digits;
  }

  // кейс 4: 8XXXXXXXXX (починається з 8)
  if (/^8\d{9}$/.test(digits)) {
    return '38' + digits;
  }

  return null;
}

export const ExportUserInfoFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Ім`я має бути більше 2 символів')
    .max(36)
    .required('Це поле обовʼязкове!'),
  lastname: Yup.string()
    .min(2, 'Прізвище має бути быльше 2 символів')
    .max(36)
    .required('Це поле обовʼязкове!'),
  phone: Yup.string()
    .matches(PHONE_REGEXP, 'Введіть коректний номер телефону')
    .required('Це поле обовʼязкове!'),
  city: Yup.string()
    .min(3, 'Назва міста має бути быльша 3 символів')
    .required('Це поле обовʼязкове!'),
  //warehoseNumber: Yup.string().min(1).required('Це поле обовʼязкове!'),
  warehoseNumber: Yup.number()
    .typeError('Вкажіть номер відділення цифрами')
    .min(1, 'Номер не може бути меншим за 1')
    .required('Це поле обовʼязкове!'),
});

export const getInputClass = (error: unknown, touched: boolean | undefined) => {
  return error && touched ? `${css.input} ${css.inputError}` : css.input;
};
