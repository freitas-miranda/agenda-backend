-- Active: 1690573514770@@127.0.0.1@3306@marcaja
create database marcaja;

select * from usuario;
drop table if exists usuario;
create table `usuario` (
  `id`         uuid          not null,
  `email`      varchar(255)  not null comment 'Endereço de email do usuário',
  `senha`      varchar(255)  not null comment 'Senha criptografada',
  `ativo`      tinyint(1)    not null default 1 comment 'Permitir ou não o login',
  `created_at` datetime(6)   not null default current_timestamp(6),
  `updated_at` datetime(6)   default null on update current_timestamp(6),
  `deleted_at` datetime(6)   default null,
  primary key (`id`)
) engine = innodb default charset = utf8mb4 collate = utf8mb4_general_ci;
