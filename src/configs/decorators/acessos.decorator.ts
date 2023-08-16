import { SetMetadata } from '@nestjs/common';

export const PERMISSOES_NECESSARIAS = 'permissoesNecessarias';
export const Permissoes = (...permissoes: string[]) => SetMetadata(PERMISSOES_NECESSARIAS, permissoes);
