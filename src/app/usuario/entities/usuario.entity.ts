import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Senha } from './senha.entity';

@Entity({ name: 'usuario' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ativo: boolean;

  @Column()
  email: string;

  @Column({ name: 'senha_hash' })
  senhaHash: string;

  @Column({ name: 'senha_salt' })
  senhaSalt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  constructor(usuario?: Partial<UsuarioEntity>) {
    this.id = usuario?.id;
    this.ativo = usuario?.ativo || true;
    this.email = usuario?.email;
    this.senhaHash = usuario?.senhaHash;
    this.senhaSalt = usuario?.senhaSalt;
    this.createdAt = usuario?.createdAt;
    this.updatedAt = usuario?.updatedAt;
    this.deletedAt = usuario?.deletedAt;
  }

  static create(email: string, senhaAberta: string) {
    const senha = Senha.create(senhaAberta);

    return new UsuarioEntity({
      email,
      senhaHash: senha.hash,
      senhaSalt: senha.salt,
    });
  }
}
