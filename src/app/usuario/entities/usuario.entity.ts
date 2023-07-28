import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuario' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @BeforeInsert()
  hashPassword() {
    this.senha = this.senha;
  }

  constructor(usuario?: Partial<UsuarioEntity>) {
    this.id = usuario?.id;
    this.email = usuario?.email;
    this.senha = usuario?.senha;
    this.ativo = usuario?.ativo;
    this.createdAt = usuario?.createdAt;
    this.updatedAt = usuario?.updatedAt;
    this.deletedAt = usuario?.deletedAt;
  }
}
