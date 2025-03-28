{
  "name": "desafio_node_adonis",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "node ace serve --watch",
    "build": "node ace build --production",
    "start": "node server.js",
    "test": "node ace test"
  },
  "devDependencies": {
    "@adonisjs/assembler": "^5.9.6",
    "@japa/preset-adonis": "^1.2.0",
    "@japa/runner": "^2.5.1",
    "@types/proxy-addr": "^2.0.3",
    "@types/source-map-support": "^0.5.10",
    "adonis-preset-ts": "^2.1.0",
    "autoprefixer": "^10.4.21",
    "pino-pretty": "^13.0.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.0.12",
    "typescript": "~4.6",
    "youch": "^3.3.4",
    "youch-terminal": "^2.2.3"
  },
  "dependencies": {
    "@adonisjs/core": "^5.9.0",
    "@adonisjs/repl": "^3.1.11",
    "@adonisjs/session": "^6.4.0",
    "@adonisjs/shield": "^7.1.1",
    "@adonisjs/view": "^6.2.0",
    "@tailwindcss/vite": "^4.0.12",
    "proxy-addr": "^2.0.7",
    "reflect-metadata": "^0.2.2",
    "source-map-support": "^0.5.21"
  }
}

nome
whatsapp
cep
logradouro
numero
complemento
bairro
cidade
estado

regex

# configurar migration
node ace configure @adonisjs/lucid


Variables for the PostgreSQL driver
PG_HOST: Env.schema.string({ format: 'host' }),
PG_PORT: Env.schema.number(),
PG_USER: Env.schema.string(),
PG_PASSWORD: Env.schema.string.optional(),
PG_DB_NAME: Env.schema.string(),



Cria o controller de forma automatica
node ace make:controller ProdutoController
node ace make:model Produto
