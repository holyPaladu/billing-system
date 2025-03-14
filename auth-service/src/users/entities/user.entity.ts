import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  ottp: number;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ nullable: true })
  stripeCustomerId: string; // ID клиента в Stripe

  @Column({ nullable: true })
  stripePaymentMethodId: string; // Токен платежного метода

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
