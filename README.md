# DCFlix API

[![NPM](https://img.shields.io/npm/l/react)](https://github.com/DCastro2110/dcflix-server/blob/master/LICENSE)

## 📜 Sobre o Projeto

Back-end do aplicativo WEB DCFlix. O sistema consite em uma API RESTful desenvolvida em NodeJS usando Express.

## ✔️ Funcionalidades

- [x] Sistema de Login usando JWT
- [x] Sistema de recuperação de senha com envio de email usando o Nodemailer
- [x] Utilização do Yup para validar o envio de dados da requisição
- [x] Uso de rotas públicas e privadas por meio do JWT
- [x] Sistema de rotas com diferentes verbos HTTP
- [x] Integração com um banco de dados SQL (PlanetScale) usando o ORM Prisma

## ⌛ Funcionalidades Pendentes

- [ ] Refresh Token

## Tecnologias

✔️ NodeJS

✔️ Express

✔️ Typescript

✔️ Prisma

✔️ PlanetScale

✔️ Yup


## ⚙️ Configurações

### Definições iniciais

Para que o projeto execute conforme o esperado, é necessário criar um arquivo ".env" com as variáveis presentes no arquivo ".env.example" junto a seus respectivos valores.

### 🗔 Clonando o projeto:

```bash
git clone https://github.com/DCastro2110/dcflix-server.git
cd ./dcflix-server
```

### ⌛ Instalando as dependências

```bash
yarn
```

### 🔨 Build do projeto

```bash
yarn postinstall
```

### 🚀 Rodando o projeto em desenvolvimento

```bash
yarn dev
```

### 🚀 Rodando o projeto em produção

```bash
yarn start
```

### ☁️ Realizando commits de forma padronizada

```bash
yarn commit
```
