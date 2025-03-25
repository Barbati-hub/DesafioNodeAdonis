import Route from '@ioc:Adonis/Core/Route'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import Produto from 'App/Models/Produto'
import Cliente from 'App/Models/Cliente'
import * as bcrypt from 'bcrypt'

// Página inicial mostra os produtos
Route.get('/', async ({ view, session }) => {
  const produtos = await Produto.all()
  const user = session.get('user')
  return view.render('home.index', { produtos, auth: { user } })
})

// Rotas de autenticação
Route.get('/login', async ({ view, session, response }) => {
  const user = session.get('user')
  if (user) {
    return response.redirect('/home')
  }
  return view.render('welcome')
})

Route.post('/login', async ({ request, response, session }) => {
  try {
    const { email, senha } = request.only(['email', 'senha'])
    console.log('Tentativa de login:', { email, senha })
    
    const cliente = await Cliente.query().where('email', email).first()
    
    if (!cliente) {
      console.log('Cliente não encontrado')
      session.flash('error', 'E-mail ou senha inválidos')
      return response.redirect().back()
    }

    console.log('Cliente encontrado:', {
      id: cliente.id,
      email: cliente.email,
      senha_hash: cliente.senha
    })

    // Usando bcrypt.compare diretamente
    const senhaValida = await bcrypt.compare(senha, cliente.senha)
    console.log('Resultado da verificação:', senhaValida)

    if (!senhaValida) {
      console.log('Senha inválida')
      session.flash('error', 'E-mail ou senha inválidos')
      return response.redirect().back()
    }

    // Se chegou aqui, o login foi bem sucedido
    console.log('Login bem-sucedido')
    session.put('user', {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      role: 'cliente'
    })
    
    return response.redirect('/home')
  } catch (error) {
    console.error('Erro durante o login:', error)
    session.flash('error', 'Ocorreu um erro durante o login')
    return response.redirect().back()
  }
})

// Rotas de registro de cliente
Route.get('/register', 'ClientesController.create').as('clientes.create')
Route.post('/register', 'ClientesController.store').as('clientes.store')

// CRUD de Clientes
Route.get('/clientes', 'ClientesController.index').as('clientes.index')
Route.get('/clientes/:id', 'ClientesController.show').as('clientes.show')
Route.get('/clientes/:id/editar', 'ClientesController.edit').as('clientes.edit')
Route.put('/clientes/:id', 'ClientesController.update').as('clientes.update')
Route.delete('/clientes/:id', 'ClientesController.destroy').as('clientes.destroy')

Route.get('/auth/google', async ({ response }) => {
  return response.redirect().toPath('/auth/google/redirect')
})

Route.get('/auth/google/redirect', 'AuthController.google')
Route.get('/auth/google/callback', 'AuthController.googleCallback')
Route.get('/logout', 'AuthController.logout')

// Rotas protegidas
Route.group(() => {
  // Dashboard (apenas admin)
  Route.get('/dashboard', async ({ view }) => {
    return view.render('dashboard')
  })

  // Home (usuários autenticados)
  Route.get('/home', async ({ view }) => {
    const produtos = await Produto.all()
    return view.render('home.index', { produtos })
  })
}).middleware('googleAuth')

// Rotas do Carrinho
Route.group(() => {
  Route.post('/carrinho/adicionar', 'CarrinhosController.adicionar').as('carrinho.adicionar')
  Route.get('/carrinho', 'CarrinhosController.show').as('carrinho.show')
  Route.delete('/carrinho/:id', 'CarrinhosController.remover').as('carrinho.remover')
  Route.put('/carrinho/atualizar', 'CarrinhosController.atualizar').as('carrinho.atualizar')
}).middleware('auth')

// API para obter detalhes do produto em JSON
Route.get('/api/produtos/:id', async ({ params, response }) => {
  const produto = await Produto.find(params.id)
  if (!produto) {
    return response.status(404).json({ error: 'Produto não encontrado' })
  }
  return response.json(produto)
})

// CRUD de Produtos
Route.get('/produtos', 'ProdutosController.index')
Route.get('/produtos/novo', 'ProdutosController.create')
Route.post('/produtos', 'ProdutosController.store')
Route.get('/produtos/:id', 'ProdutosController.show')
Route.get('/produtos/:id/editar', 'ProdutosController.edit')
Route.put('/produtos/:id', 'ProdutosController.update')
Route.delete('/produtos/:id', 'ProdutosController.destroy')

// API: Rotas de Autenticação
Route.post('/api/login', async ({ request, response, session }) => {
  const { email, senha } = request.only(['email', 'senha'])
  const user = await User.query().where('email', email).first()
  if (!user) {
    return response.unauthorized({ message: 'E-mail ou senha inválidos' })
  }
  if (!user.senha) {
    return response.unauthorized({ message: 'E-mail ou senha inválidos' })
  }
  const senhaValida = await Hash.verify(user.senha, senha)
  if (!senhaValida) {
    return response.unauthorized({ message: 'E-mail ou senha inválidos' })
  }
  session.put('user', { id: user.id, nome: user.name, role: user.role })
  return response.ok({ message: '✅ Login realizado com sucesso', user })
})

Route.post('/api/logout', async ({ session, response }) => {
  session.clear()
  return response.ok({ message: 'Logout realizado com sucesso' })
})

// API: CRUD de Usuários
Route.group(() => {
  Route.get('/usuarios', 'UsuariosController.index')
  Route.post('/usuarios', 'UsuariosController.store')
  Route.get('/usuarios/:id', 'UsuariosController.show')
  Route.put('/usuarios/:id', 'UsuariosController.update')
  Route.delete('/usuarios/:id', 'UsuariosController.destroy')
}).prefix('/api')
