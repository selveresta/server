import { IStream } from 'arli_schema';
import {
	AllowNull,
	BelongsTo,
	Column,
	DataType,
	Default,
	ForeignKey,
	Model,
	Table,
	Unique,
} from 'sequelize-typescript';

import { User } from '../user/user.model';

@Table({ tableName: 'streams', timestamps: true })
export class Stream extends Model<Stream> implements IStream {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	id: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	title: string;

	@Column({ type: DataType.STRING, allowNull: true })
	description: string;

	@Unique
	@AllowNull(false)
	@Column({ type: DataType.STRING })
	streamKey: string;

	@Default(false)
	@Column({ type: DataType.BOOLEAN })
	isLive: boolean;

	@Default(0)
	@Column({ type: DataType.INTEGER })
	viewerCount: number;

	@ForeignKey(() => User)
	@AllowNull(false)
	@Column({
		type: DataType.UUID,
		onDelete: 'CASCADE', // коли видаляємо user, стрім теж буде видалено
	})
	userId: string;

	@BelongsTo(() => User)
	user: User;
}
