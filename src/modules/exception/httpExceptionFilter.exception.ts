import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { ErrorsCode } from 'arli_schema';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		let code = ErrorsCode.UNKNOWN_ERROR;
		let message = 'Something went wrong';

		// За умовчанням exception.getResponse() може бути: string | object
		// Якщо це об’єкт, NestJS зберігає там message, error тощо
		if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
			const resObj = exceptionResponse as Record<string, any>;

			// Якщо ми передавали { code: 'USER_NOT_FOUND', message: '...' }
			if (resObj.code) {
				code = resObj.code;
			}
			if (resObj.message) {
				// message може бути string або масив string'ів (валидаційні помилки).
				message = Array.isArray(resObj.message)
					? resObj.message.join(', ')
					: resObj.message;
			}
		} else if (typeof exceptionResponse === 'string') {
			// Якщо це просто текст
			message = exceptionResponse;
		}

		response.status(status).json({
			statusCode: status,
			code,
			message,
		});
	}
}
