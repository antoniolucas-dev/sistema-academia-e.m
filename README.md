# Academia E.M.
Sistema web desenvolvido para gerenciamento de uma academia, permitindo o cadastro e gerenciamento de alunos, treinos e exercícios. O projeto foi desenvolvido como atividade da disciplina de Informatica, utilizando Node.js, Express, TypeScript e arquitetura MVC.

---

# Funcionalidades
- Login e autenticação de usuários
- Cadastro de usuários
- Gerenciamento de alunos
- Cadastro, edição e exclusão de treinos
- Cadastro, edição e exclusão de exercícios
- Dashboard com informações gerais
- Upload de fotos dos alunos
- Interface responsiva
- Testes automatizados com Jest

---

# Tecnologias Utilizadas

## Backend
- Node.js
- Express
- TypeScript
- Express Session
- Multer
- Jest

## Frontend
- HTML5
- CSS3
- JavaScript
- EJS

## Arquitetura
- MVC (Model-View-Controller)
- Programação Orientada a Objetos (POO)
- Repository Pattern

## Persistência
- Arquivos JSON

---

# Estrutura do Projeto

```
academia-em/
│
├── src/
│   ├── entities/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── views/
│   ├── __tests__/
│   ├── app.ts
│   └── server.ts
│
├── public/
│   ├── css/
│   ├── js/
│   ├── img/
│   └── uploads/
│
├── dados/
│
├── package.json
├── tsconfig.json
├── README.md
└── .env
```

---

# Requisitos
- Node.js 18 ou superior
- npm

---

# Instalação
Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta do projeto:

```bash
cd academia-em
```

Instale as dependências:

```bash
npm install
```

---

# Executando o Projeto
Modo de desenvolvimento:

```bash
npm run dev
```

Modo de produção:

```bash
npm start
```

---

# Executando os Testes
```bash
npm test
```

---

# Organização das Branches
- `main` → versão principal do projeto.
- `auth` → autenticação.
- `alunos` → gerenciamento de alunos.
- `treinos` → gerenciamento de treinos.
- `frontend` → interface gráfica.

---

# Arquitetura
O projeto segue a arquitetura MVC (Model-View-Controller), separando responsabilidades entre:

- **Entities:** representam as entidades do sistema.
- **Models:** acesso e manipulação dos dados.
- **Routes:** gerenciamento das rotas da aplicação.
- **Views:** interface do usuário utilizando EJS.
- **Middlewares:** autenticação e upload de arquivos.
- **Utils:** funções auxiliares reutilizáveis.

---

# Licença
Projeto desenvolvido exclusivamente para fins acadêmicos.