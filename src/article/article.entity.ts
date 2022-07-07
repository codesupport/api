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
	PENDING = "pending",
	APROVED = "aproved",
	REJECTED = "rejected",
}

@Entity()
export class Article {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	modified: Date;

	@ManyToOne(() => User)
	user: User;

	@Column()
	title: string;

	@Column()
	slug: string;

	@Column({ length: 250 })
	description: string;

	@Column()
	content: string;

	@Column({ type: "enum", enum: ArticleStatus, default: ArticleStatus.PENDING })
	status: string;
}
