export type User = {
	_id: string
	email: string
	name?: string
	username?: string
	role: string
	phone?: string
	lastName?: string
	warehoseNumber?: string
	city?: string
	avatar?: string
	error?: string
}

export type EditUser = Omit<User, "avatar">
