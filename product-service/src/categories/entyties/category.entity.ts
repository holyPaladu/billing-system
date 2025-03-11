import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent_id: Category | null;

  @OneToMany(() => Category, (category) => category.parent_id)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category_id)
  products_id: Product[];

  @UpdateDateColumn()
  updatedAt: Date;
}
