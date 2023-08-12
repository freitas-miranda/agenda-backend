import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'grupo_usuario_usuario' })
export class GrupoUsuarioUsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grupoUsuarioId: number;

  @Column()
  usuarioId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  static create(grupoUsuarioId: number, usuarioId: number) {
    const relacionamento = new GrupoUsuarioUsuarioEntity();
    relacionamento.grupoUsuarioId = grupoUsuarioId;
    relacionamento.usuarioId = usuarioId;
    return relacionamento;
  }
}
