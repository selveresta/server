// user.model.ts
import { IUser } from 'arli_schema';
import * as bcrypt from 'bcrypt';
import {
	BeforeCreate,
	BeforeUpdate,
	Column,
	DataType,
	Model,
	Table,
	Unique,
} from 'sequelize-typescript';
@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> implements IUser {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	id: string;

	@Unique
	@Column({ type: DataType.STRING, allowNull: false })
	username: string;

	@Unique
	@Column({ type: DataType.STRING, allowNull: false })
	email: string;

	@Column({ type: DataType.STRING, allowNull: false })
	password: string;

	@Column({ type: DataType.STRING, allowNull: true })
	avatarUrl: string;

	@BeforeCreate
	@BeforeUpdate
	static async hashPassword(instance: User) {
		if (instance.changed('password')) {
			const salt = await bcrypt.genSalt(10);
			instance.password = await bcrypt.hash(instance.password, salt);
		}
	}
}
