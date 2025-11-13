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
