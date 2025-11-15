export type User = {
	phone: string
	role: string
	email: string
	username: string
	avatar?: string
	error?: string
	_id: string;
}

export type EditUser = Omit<User, "avatar">

export type UpdateMeRequest = {
  name?: string;
  lastname?: string;
  phone?: string;
  city?: string;
  warehoseNumber?: number;
};
