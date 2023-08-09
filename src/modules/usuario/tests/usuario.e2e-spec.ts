import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';

const params = {
  nome: 'Alan Miranda',
  email: 'teste@miranda.com',
  senha: '12345678',
};

describe('Usuario (e2e)', () => {
  let app: INestApplication;
  let access_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('[POST /api/v1/usuario] Criar um usuário', async () => {
    // Localizar usuário pelo email
    const usuarios = await request(app.getHttpServer())
      .get('/api/v1/usuario?email=' + params.email)
      .set('Authorization', 'Bearer ' + access_token);

    // Remover usuário de teste caso exista
    for (const usuarioExistente of usuarios.body) {
      if (usuarioExistente) {
        await request(app.getHttpServer())
          .delete('/api/v1/usuario/' + usuarioExistente.id)
          .set('Authorization', 'Bearer ' + access_token);
      }
    }

    const retorno = await request(app.getHttpServer())
      .post('/api/v1/usuario')
      .set('Authorization', 'Bearer ' + access_token)
      .send(params)
      .expect(HttpStatus.CREATED);

    expect(retorno.body).toHaveProperty('id');
    params['id'] = retorno.body.id;
  });

  it('[GET /api/v1/usuario/:id] Exibir um usuário', async () => {
    const retorno = await request(app.getHttpServer())
      .get('/api/v1/usuario/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK);

    const usuario = retorno.body;
    expect(usuario).toBeDefined();
    expect(usuario.id).toEqual(params['id']);
    expect(usuario.email).toEqual(params.email);
    expect(usuario.ativo).toEqual(true);
    expect(usuario).not.toHaveProperty('senhaHash');
    expect(usuario).not.toHaveProperty('senhaSalt');
  });

  it('[GET /api/v1/usuario] Listar todos usuários', async () => {
    const retorno = await request(app.getHttpServer())
      .get('/api/v1/usuario')
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK);

    expect(retorno.body.length).toBeGreaterThan(0);
    const usuario = retorno.body[0];
    expect(usuario).toHaveProperty('id');
    expect(usuario).toHaveProperty('ativo');
    expect(usuario).toHaveProperty('email');
    expect(usuario).not.toHaveProperty('senhaHash');
    expect(usuario).not.toHaveProperty('senhaSalt');
  });

  it('[GET /api/v1/usuario?email=???] Pesquisar um usuário pelo email', async () => {
    const retorno = await request(app.getHttpServer())
      .get('/api/v1/usuario?email=' + params.email)
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK);

    const usuarios = retorno.body;
    expect(usuarios.length).toEqual(1);

    const usuario = usuarios[0];
    expect(usuario).toBeDefined();
    expect(usuario.email).toEqual(params.email);
  });

  it('[PATCH /api/v1/usuario/:id] Alterar um usuário', async () => {
    const novoAtivo = false;

    await request(app.getHttpServer())
      .patch('/api/v1/usuario/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .send({ ativo: novoAtivo })
      .expect(HttpStatus.NO_CONTENT)
      .then((value) => {
        expect(value.body).toEqual({});
      });

    return request(app.getHttpServer())
      .get('/api/v1/usuario/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.OK)
      .then((value) => {
        expect(value.body.ativo).toEqual(novoAtivo);
      });
  });

  it('[DELETE /api/v1/usuario/:id] Deletar um usuário', async () => {
    return request(app.getHttpServer())
      .delete('/api/v1/usuario/' + params['id'])
      .set('Authorization', 'Bearer ' + access_token)
      .expect(HttpStatus.NO_CONTENT)
      .then((value) => {
        expect(value.body).toEqual({});
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
