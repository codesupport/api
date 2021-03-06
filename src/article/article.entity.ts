import { User } from "../user/user.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";

export enum ArticleStatus {
	PENDING = "PENDING",
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
}

@Entity()
export class Article {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	modified: Date;

	@ManyToOne(() => User, { eager: true })
	user: User;

	@Column()
	title: string;

	@Column({ unique: true })
	slug: string;

	@Column({ length: 250 })
	description: string;

	@Column()
	content: string;

	@Column({ type: "enum", enum: ArticleStatus, default: ArticleStatus.PENDING })
	status: string;
}
