export type User = {
	phone: string
	role: string
	email: string
	username: string
	avatar?: string
	error?: string
}

export type EditUser = Omit<User, "avatar">
