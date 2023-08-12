import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'grupo_usuario_permissao' })
export class GrupoUsuarioPermissaoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grupoUsuarioId: number;

  @Column()
  permissaoId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  static create(grupoUsuarioId: number, permissaoId: number) {
    const relacionamento = new GrupoUsuarioPermissaoEntity();
    relacionamento.grupoUsuarioId = grupoUsuarioId;
    relacionamento.permissaoId = permissaoId;
    return relacionamento;
  }
}
