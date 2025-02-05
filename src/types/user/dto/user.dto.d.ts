export class ICreateUserDto {
	username: string;
	email: string;
	password: string;
	avatarUrl?: string;
}

export class IUpdateUserDto {
	username?: string;
	email?: string;
	password?: string;
	avatarUrl?: string;
}
