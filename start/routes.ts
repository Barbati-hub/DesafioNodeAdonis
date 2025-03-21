import Route from '@ioc:Adonis/Core/Route'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import Produto from 'App/Models/Produto'

// Página inicial mostra os produtos
Route.get('/', async ({ view }) => {
  const produtos = await Produto.all()
  return view.render('home.index', { produtos })
})

// Rotas de autenticação
Route.get('/login', async ({ view, session, response }) => {
  const user = session.get('user')
  if (user) {
    return response.redirect('/home')
  }
  return view.render('welcome')
})

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
