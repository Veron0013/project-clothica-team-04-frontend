export type User = {
  _id: string;
  email: string;
  name?: string;
  username?: string;
  role: string;
  phone?: string;
  lastname?: string;
  warehoseNumber?: string;
  city?: string;
  avatar?: string;
  error?: string;
};

export interface UserOrderInfoFormValues {
  name: string;
  lastname: string;
  phone: string;
  city: string;
  comment: string;
  warehoseNumber: string;
}

export type EditUser = Omit<User, 'avatar'>;
