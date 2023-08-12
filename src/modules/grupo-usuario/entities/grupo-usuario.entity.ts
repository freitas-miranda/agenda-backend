import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'grupo_usuario' })
export class GrupoUsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  static create(descricao: string) {
    const grupoUsuario = new GrupoUsuarioEntity();
    grupoUsuario.descricao = descricao;
    return grupoUsuario;
  }
}
