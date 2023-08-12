import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';

const params = {
  key: 'admin',
  descricao: 'Descrição da permissão',
};

describe('Permissão (e2e)', () => {
  let app: INestApplication;
  let access_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('[POST /api/v1/permissao] Criar uma permissão', async () => {
    // Localizar permissão pela key
    const permissao = await request(app.getHttpServer())
      .get('/api/v1/permissao?key=' + params.key)
      .set('Authorization', 'Bearer ' + access_token);

    // Remover permissão de teste caso exista
    for (const permissaoExistente of permissao.body) {
      if (permissaoExistente) {
        await request(app.getHttpServer())
          .delete('/api/v1/permissao/' + permissaoExistente.id)
          .set('Authorization', 'Bearer ' + access_token);
      }
    }

    const retorno = await request(app.getHttpServer())
      .post('/api/v1/permissao')
      .set('Authorization', 'Bearer ' + access_token)
      .send(params)
      .expect(HttpStatus.CREATED);

    expect(retorno.body).toHaveProperty('id');
    expect(retorno.body.id).toBeTruthy();
    params['id'] = retorno.body.id;

    expect(retorno.body).not.toHaveProperty('key');
    expect(retorno.body).not.toHaveProperty('descricao');
  });

  it('[GET /api/v1/permissao/:id] Exibir uma permissão', async () => {
    const retorno = await request(app.getHttpServer())
      .get('/api/v1/permissao/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK);

    const permissao = retorno.body;
    expect(permissao).toBeDefined();
    expect(permissao.id).toEqual(params['id']);
    expect(permissao.descricao).toEqual(params.descricao);
  });

  it('[GET /api/v1/permissao] Listar todas permissões', async () => {
    const retorno = await request(app.getHttpServer())
      .get('/api/v1/permissao')
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK);

    expect(retorno.body.length).toBeGreaterThan(0);
    const permissao = retorno.body[0];
    expect(permissao).toHaveProperty('id');
    expect(permissao).toHaveProperty('key');
    expect(permissao).toHaveProperty('descricao');
  });

  it('[GET /api/v1/permissao?] Testar pesquisas da permissão', async () => {
    const paramFilter = 'ABCP123';

    const permissaoParaPesquisar = {
      key: paramFilter,
      descricao: `Permissão ${paramFilter} para pesquisar`,
    };
    await request(app.getHttpServer())
      .post('/api/v1/permissao')
      .set('Authorization', 'Bearer ' + access_token)
      .send(permissaoParaPesquisar);

    await request(app.getHttpServer())
      .get('/api/v1/permissao?key=' + paramFilter)
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK)
      .then((data) => {
        expect(data.body.length).toEqual(1);
        expect(data.body[0]).toBeDefined();
        expect(data.body[0].key).toEqual(permissaoParaPesquisar.key);
      });

    await request(app.getHttpServer())
      .get('/api/v1/permissao?descricao=' + paramFilter)
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK)
      .then((data) => {
        expect(data.body.length).toEqual(1);
        expect(data.body[0]).toBeDefined();
        expect(data.body[0].descricao).toEqual(permissaoParaPesquisar.descricao);
      });
  });

  it('[PATCH /api/v1/permissao/:id] Alterar uma permissão', async () => {
    const novaDescricao = 'Nova descricão da permissão';

    await request(app.getHttpServer())
      .patch('/api/v1/permissao/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .send({ descricao: novaDescricao })
      .expect(HttpStatus.OK)
      .then((value) => {
        expect(value.body).toEqual({ mensagem: 'Alterado com sucesso!' });
      });

    return request(app.getHttpServer())
      .get('/api/v1/permissao/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK)
      .then((value) => {
        expect(value.body.descricao).toEqual(novaDescricao);
      });
  });

  it('[DELETE /api/v1/permissao/:id] Deletar uma permissão', async () => {
    return request(app.getHttpServer())
      .delete('/api/v1/permissao/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK)
      .then((value) => {
        expect(value.body).toEqual({ mensagem: 'Excluído com sucesso!' });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
