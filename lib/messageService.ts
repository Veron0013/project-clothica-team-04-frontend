import { toast, type ToastPosition } from 'react-hot-toast';

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
    position: 'top-right',
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
