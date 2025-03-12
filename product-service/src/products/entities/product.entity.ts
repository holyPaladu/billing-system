import { Category } from 'src/categories/entyties/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

export enum BillingPlan {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  QUARTERLY = 'quarterly',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: false })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: BillingPlan,
    default: BillingPlan.MONTHLY,
  })
  plan: BillingPlan;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  category: Category;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
