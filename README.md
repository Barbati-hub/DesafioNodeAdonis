# Desafio Node AdonisJS

Sistema de gerenciamento de produtos com autenticação Google OAuth2.

## Funcionalidades

- Autenticação com Google OAuth2
- Gerenciamento de produtos (CRUD)
- Controle de acesso baseado em roles (admin/user)
- Interface responsiva com Tailwind CSS

## Requisitos

- Node.js >= 14.x
- PostgreSQL >= 12
- NPM ou Yarn

## Configuração

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd DesafioNodeAdonis
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure as seguintes variáveis no arquivo .env:
```
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3333/auth/google/callback
```

5. Execute as migrações:
```bash
node ace migration:run
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

- `app/` - Contém os controllers, models e middleware
- `config/` - Arquivos de configuração
- `database/` - Migrações e seeds
- `resources/` - Views e assets
- `start/` - Arquivos de inicialização e rotas

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm start` - Inicia o servidor em modo produção
- `npm test` - Executa os testes

## Licença

MIT 