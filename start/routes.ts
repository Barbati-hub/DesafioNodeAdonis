import Route from '@ioc:Adonis/Core/Route'
import Hash from '@ioc:Adonis/Core/Hash'
import Usuario from 'App/Models/Usuario'
import Produto from 'App/Models/Produto'

// Página inicial leva para login
Route.get('/', async ({ view }) => {
  return view.render('login')
})

// Rota protegida da Dashboard (apenas logados podem acessar)
Route.get('/dashboard', async ({ view, session, response }) => {
  const usuario = session.get('usuario')
  console.log('Sessão atual:', session.all())
  if (!usuario) {
    return response.redirect('/')
  }
  return view.render('dashboard', { usuario })
})

// Outras páginas (acessíveis sem login)
Route.get('/home', async ({ view }) => {
  const produtos = await Produto.all()
  return view.render('home.index', { produtos })
})


Route.get('/usuarios', async ({ view }) => view.render('usuarios/index'))
Route.get('/usuarios/novo', async ({ view }) => view.render('usuarios/novo'))
Route.get('/relatorios', async ({ view }) => view.render('relatorios'))
Route.get('/configuracoes', async ({ view }) => view.render('configuracoes'))

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
  const usuario = await Usuario.query().where('email', email).first()
  if (!usuario) {
    return response.unauthorized({ message: 'E-mail ou senha inválidos' })
  }
  const senhaValida = await Hash.verify(usuario.senha, senha)
  if (!senhaValida) {
    return response.unauthorized({ message: 'E-mail ou senha inválidos' })
  }
  session.put('usuario', { id: usuario.id, nome: usuario.nome, role: usuario.role })
  return response.ok({ message: '✅ Login realizado com sucesso', usuario })
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
