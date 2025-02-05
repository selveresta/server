import {
	Injectable,
	NotFoundException,
	ConflictException,
	BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import { Stream } from './stream.model';
import { UniqueConstraintError } from 'sequelize';
import { Op } from 'sequelize';
// Імпортуємо crypto для генерації ключа
import { randomBytes } from 'crypto';

@Injectable()
export class StreamService {
	constructor(
		@InjectModel(Stream)
		private readonly streamModel: typeof Stream,
	) {}

	async create(createStreamDto: CreateStreamDto): Promise<Stream> {
		// Генеруємо унікальний streamKey:
		const generatedKey = randomBytes(16).toString('hex');
		// Або, якщо хочете UUID, можна використати:
		// const generatedKey = uuidv4();

		try {
			const stream = await this.streamModel.create({
				...createStreamDto,
				streamKey: generatedKey,
			});
			return stream;
		} catch (error) {
			if (error instanceof UniqueConstraintError) {
				throw new ConflictException('Stream key is already in use');
			}
			throw new BadRequestException(error.message);
		}
	}

	async findAll(): Promise<Stream[]> {
		return this.streamModel.findAll();
	}

	async findOne(id: string): Promise<Stream> {
		const stream = await this.streamModel.findByPk(id);
		if (!stream) {
			throw new NotFoundException(`Stream with id "${id}" not found`);
		}
		return stream;
	}

	async update(id: string, updateStreamDto: UpdateStreamDto): Promise<Stream> {
		const stream = await this.findOne(id);

		if (stream.streamKey && stream.streamKey !== stream.streamKey) {
			const duplicate = await this.streamModel.findOne({
				where: { streamKey: stream.streamKey, id: { [Op.ne]: id } },
			});
			if (duplicate) {
				throw new ConflictException(
					`streamKey "${stream.streamKey}" is already in use`,
				);
			}
		}

		try {
			await stream.update(updateStreamDto);
			return stream;
		} catch (error) {
			if (error instanceof UniqueConstraintError) {
				throw new ConflictException('Stream key is already in use');
			}
			throw new BadRequestException(error.message);
		}
	}

	async remove(id: string): Promise<void> {
		const stream = await this.findOne(id);
		await stream.destroy();
	}
}
