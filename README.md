# 🏋️ Academia E.M.

> Sistema web para gerenciamento de academia desenvolvido com **Node.js**, **Express**, **TypeScript** e **EJS**.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-8BC34A)
![License](https://img.shields.io/badge/License-Acadêmico-blue)

---

## Sobre

O **Academia E.M.** é um sistema desenvolvido para auxiliar no gerenciamento de uma academia. O projeto foi criado para fins acadêmicos, aplicando conceitos de desenvolvimento web com arquitetura MVC, autenticação por sessão, manipulação de arquivos JSON e testes automatizados.

---

## Funcionalidades

- Login de usuários
- Gerenciamento de alunos
- Gerenciamento de exercícios
- Gerenciamento de treinos
- Dashboard
- Página de perfil
- ℹPágina de informações
- Modo escuro
- Upload de arquivos
- Testes automatizados

---

## Tecnologias

### Backend

- Node.js
- Express
- TypeScript
- Express Session
- Multer
- Socket.IO
- UUID

### Frontend

- EJS
- HTML5
- CSS3
- JavaScript

### Testes

- Jest
- Supertest

---

## Estrutura do projeto

```text
academia-em
│
├── dados/
│   ├── alunos.json
│   ├── exercicios.json
│   ├── treinos.json
│   ├── usuarios.json
│   └── conclusoes.json
│
├── public/
│   ├── css/
│   ├── img/
│   ├── js/
│   └── uploads/
│
├── src/
│   ├── entities/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── views/
│   ├── server.ts
│   └── app.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/antoniolucas-dev/sistema-academia-e.m.git
```

Entre na pasta:

```bash
cd sistema-academia-e.m
```

Instale as dependências:

```bash
npm install
```

---

## Executando

Modo de desenvolvimento:

```bash
npm run dev
```

Compilar:

```bash
npm run build
```

Executar versão compilada:

```bash
npm start
```

---

## Testes

Executar todos os testes:

```bash
npm test
```

---

## Arquitetura

O projeto utiliza o padrão **MVC (Model-View-Controller)** para separar responsabilidades.

- **Models:** acesso aos dados e regras de negócio.
- **Views:** páginas renderizadas em EJS.
- **Routes:** gerenciamento das rotas.
- **Middlewares:** autenticação e validações.
- **Entities:** representação das entidades do sistema.

---

## Objetivo

Este projeto foi desenvolvido como atividade acadêmica para colocar em prática conhecimentos de:

- Desenvolvimento Web
- Node.js
- Express
- TypeScript
- Arquitetura MVC
- Sessões
- Upload de arquivos
- Testes automatizados

---

## Desenvolvedores

- André Fernandes
- Antonio Lucas
- Erick Felipe
- Matheus Felipe

---

## Licença

Projeto desenvolvido exclusivamente para fins acadêmicos.