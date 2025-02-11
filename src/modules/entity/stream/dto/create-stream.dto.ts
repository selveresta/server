import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Min,
} from 'class-validator';

export class CreateStreamDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsBoolean()
	isLive?: boolean;

	@IsOptional()
	@IsInt()
	@Min(0)
	viewerCount?: number;

	@IsUUID('4')
	@IsNotEmpty()
	userId: string;
}
