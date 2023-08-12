-- Active: 1690573514770@@mariadb@3306@agenda
create database `agenda`;
create database `agenda_test`;

select * from `usuario`;
select * from `grupo_usuario`;
select * from `permissao`;



drop table if exists `usuario`;
create table `usuario` (
  `id`         bigint(20)    not null auto_increment,
  `ativo`      tinyint(1)    not null default 1 comment 'Permitir ou não o login',
  `email`      varchar(255)  not null comment 'Endereço de email do usuário',
  `senha_hash` varchar(255)  not null comment 'Senha criptografada',
  `senha_salt` varchar(255)  not null comment 'Salt para composição da senha',
  `created_at` datetime(6)   not null default current_timestamp(6),
  `updated_at` datetime(6)   default null on update current_timestamp(6),
  `deleted_at` datetime(6)   default null,
  primary key (`id`)
) engine = innodb default charset = utf8mb4 collate = utf8mb4_general_ci;


drop table if exists `grupo_usuario`;
create table `grupo_usuario` (
  `id`         bigint(20)    not null auto_increment,
  `descricao`  varchar(255)  not null comment 'Descrição do grupo de usuário',
  `created_at` datetime(6)   not null default current_timestamp(6),
  `updated_at` datetime(6)   default null on update current_timestamp(6),
  `deleted_at` datetime(6)   default null,
  primary key (`id`)
) engine = innodb default charset = utf8mb4 collate = utf8mb4_general_ci;


drop table if exists `permissao`;
create table `permissao` (
  `id`         bigint(20)    not null auto_increment,
  `key`        varchar(255)  not null comment 'Key para encontrar a permissão, ex: admin, usuario_manutencao...',
  `descricao`  varchar(255)  not null comment 'Descrição da permissão, quando usar, para que foi criada...',
  `created_at` datetime(6)   not null default current_timestamp(6),
  `updated_at` datetime(6)   default null on update current_timestamp(6),
  `deleted_at` datetime(6)   default null,
  primary key (`id`)
) engine = innodb default charset = utf8mb4 collate = utf8mb4_general_ci;
