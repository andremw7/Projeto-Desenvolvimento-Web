# 🐾 Projeto: ADIMAX PET SHOP

## 👥 Grupo
- André Marcelino Watanabe — NUSP: 14558311
- Renato Spessotto — NUSP: 14605824

---

## 📌 1. Requisitos e Visão Geral

O **ADIMAX PET SHOP** é uma aplicação web de e-commerce voltada para um pet shop fictício. Desenvolvida com **React (Vite)** no frontend e **Node.js + Express + MongoDB** no backend, a plataforma permite uma experiência de compra completa para o cliente e oferece ferramentas administrativas de gerenciamento.

### Usuários:
- **Clientes:** navegam, compram, acompanham pedidos e editam perfil.
- **Administradores:** gerenciam produtos, pedidos e outros administradores.

### Funcionalidades principais:
- Catálogo com filtros por tipo, faixa etária e marca.
- Carrinho persistente por usuário logado.
- Finalização de pedidos com validação de estoque.
- Cadastro/login com controle de sessão.
- Perfil com histórico de compras.
- Área administrativa com gestão de produtos/pedidos.
- Barra de busca inteligente no topo.

---

## 📝 2. Funcionalidades Implementadas

### 🔐 Autenticação
- Registro e login de usuários e administradores.
- Context API com persistência no localStorage.
- Middleware protegendo rotas privadas (admin e user).

### 🛒 Compras e Catálogo
- Lista de produtos com filtros dinâmicos.
- Carrinho interativo com validação de estoque.
- Página de produto com detalhes e imagens.
- Finalização de compra com escolha de método de pagamento.

### 👤 Perfil e Histórico
- Página de perfil com dados do usuário.
- Histórico de pedidos anteriores.
- Edição de informações pessoais.

### 🛠️ Área Administrativa
- Adição, edição e exclusão de produtos.
- Gerenciamento de pedidos realizados.
- Cadastro de novos administradores.
- Upload real de imagem com `multer`.

### 🔎 Busca Inteligente
- Barra de busca com sugestões em tempo real.
- Navegação rápida para produtos filtrados.

---

## 🗺️ 3. Diagrama de Navegação

```mermaid
graph TD
  Home[🏠 Início]
  Produtos[🛍 Produtos]
  Produto[📦 Produto]
  Login[🔐 Login]
  Register[📝 Registrar]
  Carrinho[🛒 Carrinho]
  Checkout[💳 Checkout]
  Status[📦 Status Pedido]
  Perfil[👤 Perfil]
  Pedidos[📄 Meus Pedidos]

  Admin[🛠 Admin Perfil]
  AdminProdutos[📦 Admin Produtos]
  AdminPedidos[📄 Vendas/Pedidos]
  AdminNovo[➕ Novo Produto]
  AdminRegistro[➕📝 Adicionar Administrador]

  %% Fluxo principal do usuário
  Home <--> Produtos <--> Produto 
  Home <--> Login <--> Register
  Login <--> Perfil <--> Pedidos

  %% Admin
  Home <--> Admin <--> AdminProdutos <--> AdminNovo
  Admin <--> AdminPedidos
  Admin <--> AdminRegistro
  Login<--> Carrinho <--> Checkout <--> Status

```

---

## ⚙️ 4. Tecnologias Utilizadas

### Frontend
- React + Vite
- React Router
- Context API
- CSS Modules
- Fetch API

### Backend
- Node.js
- Express
- MongoDB com Mongoose
- Multer (upload de imagens)
- Dotenv
- Nodemon

---

## 🏗️ 5. Estrutura do Projeto

```
Projeto-Desenvolvimento-Web/
├── adimax/                  # Frontend (React)
│   ├── src/
│   │   ├── componentes/     # Componentes visuais
│   │   ├── context/         # AuthContext
│   │   └── App.jsx          # Estrutura principal
├── backend/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/          # Rotas da API
│   │   └── server.js        # Servidor principal
│   ├── uploads/             # Imagens dos produtos
│   └── banco_json/          # Backup local (opcional)
└── README.md
```

---

## 🚀 6. Como Executar o Projeto

### Pré-requisitos
- Node.js instalado
- MongoDB local ativo
- MongoDB Compass (opcional para visualizar dados)

### Backend:

```bash
cd backend
npm install
npm install dotenv
```



### Frontend:

```bash
cd adimax
npm install
npm run dev
```

 **Acesse a aplicação em:**
```
http://localhost:3000
```

### Visualizando no MongoDB Compass
- Abra o Compass
- Conecte com a string:
```
mongodb://localhost:27017
```
- Escolha o banco `adimax-petshop` e visualize as coleções como `produtos`, `usuarios`, `pedidos` e `carrinho`.


---

## 🧪 7. Testes Realizados

Os testes foram realizados manualmente, com foco nas funcionalidades principais da aplicação, garantindo o comportamento esperado nas interações de usuários comuns e administradores. Abaixo estão os cenários testados, divididos por áreas da aplicação:

---

### 🔐 Autenticação e Registro

- ✅ **Cadastro de usuário (cliente e admin)**:
  - Testado com campos válidos e inválidos (ex: email sem `@`, senhas muito curtas).
  - Verificado redirecionamento correto após cadastro/login.
- ✅ **Login**:
  - Login com credenciais válidas.
  - Exibição de mensagem de erro para credenciais inválidas.
  - Persistência de sessão via `localStorage`.

---

### 🛍️ Catálogo e Busca

- ✅ **Listagem de produtos**:
  - Todos os produtos cadastrados são exibidos corretamente.
  - Filtros por tipo, marca e faixa etária aplicados com sucesso.
- ✅ **Busca inteligente (header)**:
  - Sugestões aparecem dinamicamente ao digitar.
  - Busca por nome parcial ou completo funcionando em tempo real.

---

### 🛒 Carrinho de Compras

- ✅ **Adição ao carrinho**:
  - Produto adicionado com quantidade padrão.
  - Vários itens diferentes adicionados corretamente.
- ✅ **Remoção e atualização**:
  - Produtos removidos individualmente.
  - Atualização de quantidades respeita o estoque disponível.
- ✅ **Persistência**:
  - Carrinho permanece ao atualizar a página ou após login/logout.

---

### 💳 Finalização de Pedido (Checkout)

- ✅ **Fluxo de checkout**:
  - Simulação de pagamento com PIX e cartão.
  - Geração de pedido com ID único.
  - Estoque é atualizado automaticamente.
- ✅ **Validação de estoque**:
  - Compra impedida se produto estiver com estoque zerado.

---

### 🧑‍💼 Painel Administrativo

- ✅ **Gestão de produtos**:
  - Cadastro de novos produtos com todos os campos obrigatórios.
  - Edição de produtos refletida na listagem.
  - Exclusão (soft delete) remove da visualização sem apagar do JSON.
- ✅ **Gestão de pedidos**:
  - Todos os pedidos podem ser visualizados com seus respectivos detalhes.
  - Informações do comprador e produtos exibidas corretamente.

---

### 👤 Perfil do Usuário

- ✅ **Edição de dados pessoais**:
  - Alteração de nome, email e senha funciona corretamente.
- ✅ **Histórico de pedidos**:
  - Listagem dos pedidos em ordem cronológica (mais recentes no topo).
  - Detalhes completos do pedido exibidos com precisão.

---

### 🧪 Considerações Finais

- Os testes foram executados manualmente em ambiente local.
- Foram usados diferentes tipos de usuário (cliente e admin) para verificar permissões.
- Testes realizados nos navegadores **Google Chrome** e **Mozilla Firefox**.
- Nenhuma inconsistência visual ou funcional foi detectada durante os testes.

---

### 🍃 Integração com MongoDB (Teste Local com MongoDB Compass)

- ✅ **Conexão com banco MongoDB local**:
  - O backend foi configurado para se conectar a um banco de dados MongoDB local utilizando a biblioteca `mongoose`.
  - A string de conexão foi definida via variável de ambiente no arquivo `.env`, no formato:
    ```env
    MONGO_URL=mongodb://localhost:27017/adimax-petshop
    ```

- ✅ **Criação e persistência de dados**:
  - Ao cadastrar um novo produto via rota POST (`/produtos`), os dados foram inseridos corretamente na coleção `produtos` do banco.
  - A verificação foi feita diretamente no **MongoDB Compass**, observando a criação automática da base de dados e das coleções.

- ✅ **Leitura dos dados**:
  - Ao acessar a rota GET (`/produtos`), todos os documentos armazenados no MongoDB foram retornados e exibidos no frontend corretamente.

- ✅ **Atualização de documentos**:
  - Utilizando a rota PUT (`/produtos/:id`), foi possível atualizar campos como nome, descrição, preço e estoque de um produto.
  - A alteração foi confirmada tanto no frontend quanto visualmente no MongoDB Compass.

- ✅ **Remoção (soft delete)**:
  - Ao excluir um produto via rota DELETE (`/produtos/:id`), ele não foi removido fisicamente do banco, mas sim marcado como "inativo" (dependendo da lógica de negócio).
  - Isso permite manter o histórico no banco e evitar inconsistências.

- ✅ **Teste com dados reais**:
  - Foram cadastrados produtos com dados reais, e confirmada a consistência da estrutura:
    ```json
    {
      "nome": "Ração Premium Cães Adultos",
      "marca": "Adimax",
      "preco": 129.99,
      "estoque": 20,
      "faixaEtaria": "Adulto",
      "tipo": "Ração",
      "descricao": "Ração completa para cães adultos de médio porte.",
      "imagem": "link-da-imagem"
    }
    ```

- ✅ **Ambiente visual para validação**:
  - Todo o conteúdo do banco foi visualizado em tempo real através do **MongoDB Compass**, permitindo validação rápida de inserções, alterações e exclusões.

---

### ✅ Considerações sobre o MongoDB

- A utilização do MongoDB possibilitou simular um banco de dados real, com persistência completa dos dados criados no frontend.
- A separação por coleções (`produtos`, `usuarios`, `pedidos`, `carrinho`) foi essencial para organização e testes isolados.
- Em uma futura versão, a hospedagem no MongoDB Atlas permitirá testes e uso remoto, sem necessidade de instalação local.


---

## 📈 8. Funcionalidade Especial

A barra de **busca inteligente no header** permite que o usuário visualize sugestões de produtos em tempo real, conforme digita o nome. É sensível a maiúsculas/minúsculas e filtra automaticamente por nome parcial. Também, os filtros presentes na página principal de produtos que permitem buscar determinados produtos de acordo com sua classificação.

---

## 📊 9. Melhorias Futuras

- Armazenamento em nuvem para imagens
- Integração com banco remoto (ex: MongoDB Atlas)

---


## 🧠 10. Comentários Sobre o Código

- Estrutura modular e bem separada (componentes, contexto, rotas)
- Comentários explicativos nas rotas e componentes críticos
- Uso de Context API e hooks do React
- Middleware de autenticação reutilizável

---

## 🔬 11. Plano de Testes

- 🧪 Testar login/cadastro com dados válidos e inválidos
- 🛒 Testar fluxo de compra completo
- 📥 Testar upload de imagem real
- 🔍 Validar busca por nome parcial
- 🧰 Visualizar persistência via MongoDB Compass
- 🧼 Testar responsividade em dispositivos móveis

---

## 🔢 12. Resultados dos Testes

| Área               | Teste Realizado                                     | Resultado |
|--------------------|-----------------------------------------------------|-----------|
| **Autenticação**   | Cadastro, login e persistência de sessão            | ✅ Sucesso |
| **Catálogo**       | Filtros, busca por nome, visualização de produto    | ✅ Sucesso |
| **Carrinho**       | Adição, remoção, atualização de quantidade          | ✅ Sucesso |
| **Checkout**       | Simulação de pagamento, validação de estoque        | ✅ Sucesso |
| **Perfil do Usuário** | Edição de dados, exibição de pedidos anteriores | ✅ Sucesso |
| **Painel Admin**   | Cadastro, edição e exclusão de produtos/pedidos     | ✅ Sucesso |
| **MongoDB**        | Inserção, leitura, atualização e soft delete        | ✅ Sucesso |

---

## ⚠️ 13. Problemas Encontrados

- Erros de formatação no `.json` durante testes iniciais
- Integração do formulário com upload de imagem exigiu ajustes de rota e `multer`
- Confusões no controle de permissões (resolvidas com middleware)

---
## 📄 14. Comentários Finais do Projeto

O projeto **ADIMAX PET SHOP** entrega uma experiência completa de e-commerce, com autenticação, gerenciamento de produtos, carrinho e painel administrativo. O uso de arquivos JSON facilita a prototipação e testes, e a arquitetura modular permite fácil evolução para banco de dados real e novas features.

---



💖 **ADIMAX PET SHOP — Cuidando do seu pet como família!**
