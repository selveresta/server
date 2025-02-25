import { NotFoundException } from '@nestjs/common';
import { ErrorsCode } from 'arli_schema';

export class UserNotFoundException extends NotFoundException {
	constructor(identifier: string) {
		super({
			code: ErrorsCode.USER_NOT_FOUND,
			message: `User with ${identifier} not found`,
		});
	}
}
