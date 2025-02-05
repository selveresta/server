import {
	IsString,
	IsNotEmpty,
	IsOptional,
	IsUUID,
	IsBoolean,
	IsInt,
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
