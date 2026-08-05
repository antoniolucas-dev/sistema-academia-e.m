# 🏋️‍♂️ Academia E.M - Sistema de Gestão Fitness

![Status do Projeto](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen )
![Node.js](https://img.shields.io/badge/Node.js-18%2B-blue )
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue )
![Express](https://img.shields.io/badge/Express-4.18-lightgrey )
![MVC](https://img.shields.io/badge/Arquitetura-MVC-orange )

O **Academia E.M** é uma plataforma web moderna desenvolvida para o gerenciamento completo de academias. O sistema permite o controle eficiente de alunos, treinos e exercícios, oferecendo uma experiência fluida tanto para administradores quanto para alunos.

Este projeto foi desenvolvido como parte da disciplina de Informática, aplicando conceitos avançados de **Node.js**, **TypeScript** e o padrão arquitetural **MVC**.

---

## ✨ Novidades da Versão 2.0 (Refatoração de UI)

Recentemente, o sistema passou por uma grande atualização visual para melhorar a usabilidade:

-  **Navegação Simplificada**: Remoção do painel lateral redundante em favor de uma **Navbar Superior** moderna e intuitiva.
-  **Identidade Visual**: Adição de ícones semânticos em todas as abas de navegação e na logo principal.
-  **Design Responsivo**: Layout otimizado para diferentes tamanhos de tela, garantindo que o sistema seja utilizável em desktops e dispositivos móveis.
-  **Foco na Experiência**: Centralização de formulários críticos (como a edição de perfil) para reduzir a carga cognitiva e melhorar o fluxo do usuário.
-  **Dark Mode Nativo**: Interface otimizada para visualização em ambientes escuros, reduzindo a fadiga ocular.

---

## 🛠️ Funcionalidades Principais

| Módulo | Descrição |
| :--- | :--- |
| **Segurança** | Sistema de login robusto com autenticação baseada em sessões. |
| **Dashboard** | Visão geral em tempo real com estatísticas de alunos e treinos. |
| **Gestão de Alunos** | Cadastro completo, incluindo upload de foto e controle de progresso. |
| **Treinos & Exercícios** | CRUD completo com atribuição dinâmica de treinos para alunos. |
| **Perfil do Usuário** | Edição de dados pessoais, troca de foto e definição de metas mensais. |
| **Informações** | Espaço dedicado a detalhes da academia, horários e planos. |

---

## 🚀 Tecnologias Utilizadas

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Linguagem:** TypeScript
- **Segurança:** Express Session
- **Uploads:** Multer
- **Testes:** Jest

### **Frontend**
- **Template Engine:** EJS
- **Estilização:** CSS3 (Variáveis, Flexbox, Grid)
- **Ícones:** Font Awesome 6
- **Tipografia:** Poppins (Google Fonts)

---

## 📂 Estrutura do Projeto

O projeto utiliza o padrão **MVC** com **Repository Pattern** para garantir código limpo e manutenível:

```bash
sistema-academia/
├── src/
│   ├── entities/      # Definição das classes e tipos
│   ├── models/        # Lógica de negócio e acesso a dados (JSON)
│   ├── routes/        # Definição dos endpoints
│   ├── middlewares/   # Filtros de autenticação e upload
│   ├── views/         # Templates EJS (Interface)
│   └── app.ts         # Configuração da aplicação
├── public/
│   ├── css/           # Estilos (incluindo fix-global.css)
│   ├── js/            # Scripts frontend
│   └── uploads/       # Fotos de perfil dos usuários
└── dados/             # Persistência em arquivos JSON
