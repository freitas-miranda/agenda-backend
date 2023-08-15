import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';

const params = {
  descricao: 'Administradores',
};

const paramsUsuario = {
  nome: 'Usuario: Teste e2e grupo de usuário',
  email: 'grupo_usuario@teste.com',
  senha: '12345678',
};

describe('GrupoUsuario (e2e)', () => {
  let app: INestApplication;
  let access_token: string;
  let usuario: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Obter um usuário válido
    const usuarios = await request(app.getHttpServer())
      .get('/api/v1/usuario?email=' + paramsUsuario.email)
      .set('Authorization', 'Bearer ' + access_token);
    if (usuarios.body.length > 0) {
      usuario = usuarios.body[0];
    } else {
      const retorno = await request(app.getHttpServer())
        .post('/api/v1/usuario')
        .set('Authorization', 'Bearer ' + access_token)
        .send(paramsUsuario)
        .expect(HttpStatus.CREATED);
      usuario = retorno.body;
    }

    // Obter uma permissão válida
  });

  it('[POST /api/v1/grupo-usuario] Criar um grupo de usuário', async () => {
    // Localizar grupo usuário pela descrição
    const registros = await request(app.getHttpServer())
      .get('/api/v1/grupo-usuario?descricao=' + params.descricao)
      .set('Authorization', 'Bearer ' + access_token);

    // Remover o grupo de usuário de teste caso exista
    for (const item of registros.body) {
      if (item) {
        await request(app.getHttpServer())
          .delete('/api/v1/grupo-usuario/' + item.id)
          .set('Authorization', 'Bearer ' + access_token);
      }
    }

    const retorno = await request(app.getHttpServer())
      .post('/api/v1/grupo-usuario')
      .set('Authorization', 'Bearer ' + access_token)
      .send(params)
      .expect(HttpStatus.CREATED);

    expect(retorno.body).toHaveProperty('id');
    expect(retorno.body.id).toBeTruthy();
    params['id'] = retorno.body.id;

    expect(retorno.body).not.toHaveProperty('descricao');
  });

  it('[GET /api/v1/grupo-usuario/:id] Exibir um grupo de usuário', async () => {
    const retorno = await request(app.getHttpServer())
      .get('/api/v1/grupo-usuario/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK);

    const registro = retorno.body;
    expect(registro).toBeDefined();
    expect(registro.id).toEqual(params['id']);
    expect(registro.descricao).toEqual(params.descricao);
  });

  it('[GET /api/v1/grupo-usuario] Listar todos grupos de usuários', async () => {
    const retorno = await request(app.getHttpServer())
      .get('/api/v1/grupo-usuario')
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK);

    expect(retorno.body.length).toBeGreaterThan(0);
    const registro = retorno.body[0];
    expect(registro).toHaveProperty('id');
    expect(registro).toHaveProperty('descricao');
  });

  it('[GET /api/v1/grupo-usuario?descricao=???] Pesquisar um usuário pela descrição', async () => {
    const descricaoGrupoParaPesquisar = 'Grupo ABC123 pesquisa';
    await request(app.getHttpServer())
      .post('/api/v1/grupo-usuario')
      .set('Authorization', 'Bearer ' + access_token)
      .send({ descricao: descricaoGrupoParaPesquisar });

    const paramFilter = 'ABC123';
    const retorno = await request(app.getHttpServer())
      .get('/api/v1/grupo-usuario?descricao=' + paramFilter)
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK);

    const registros = retorno.body;
    expect(registros.length).toEqual(1);

    const registro = registros[0];
    expect(registro).toBeDefined();
    expect(registro.descricao).toEqual(descricaoGrupoParaPesquisar);
  });

  it('[PATCH /api/v1/grupo-usuario/:id] Alterar um grupo de usuário', async () => {
    const novaDescricao = 'Nova descrição do grupo de usuários';

    await request(app.getHttpServer())
      .patch('/api/v1/grupo-usuario/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .send({ descricao: novaDescricao })
      .expect(HttpStatus.OK)
      .then((value) => {
        expect(value.body).toEqual({ mensagem: 'Alterado com sucesso!' });
      });

    return request(app.getHttpServer())
      .get('/api/v1/grupo-usuario/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK)
      .then((value) => {
        expect(value.body.descricao).toEqual(novaDescricao);
      });
  });

  it('[DELETE /api/v1/grupo-usuario/:id] Deletar um grupo de usuário', async () => {
    return request(app.getHttpServer())
      .delete('/api/v1/grupo-usuario/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK)
      .then((value) => {
        expect(value.body).toEqual({ mensagem: 'Excluído com sucesso!' });
      });
  });

  it('[POST /api/v1/grupo-usuario/:id/usuario/:usuarioId] Adicionar um usuário no grupo', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/grupo-usuario/' + params['id'] + '/usuario/' + usuario.id)
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.CREATED)
      .then((retorno) => {
        expect(retorno.body).toHaveProperty('id');
        expect(retorno.body.mensagem).toContain('Usuário adicionado ao grupo!');
        expect(retorno.body.id).toBeTruthy();
      });
  });

  it('[DELETE /api/v1/grupo-usuario/:id/usuario/:usuarioId] Adicionar um usuário no grupo', async () => {
    await request(app.getHttpServer())
      .delete('/api/v1/grupo-usuario/' + params['id'] + '/usuario/' + usuario.id)
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK)
      .then((retorno) => {
        expect(retorno.body).toEqual({ mensagem: 'Usuário removido do grupo!' });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
