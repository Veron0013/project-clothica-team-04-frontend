import { redirect } from 'next/navigation';

const BasketPage = () => {
  redirect('/order');
  return null;
};

export default BasketPage;
