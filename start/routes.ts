import Route from '@ioc:Adonis/Core/Route'
import Hash from '@ioc:Adonis/Core/Hash'
import Usuario from 'App/Models/Usuario'

// Página inicial leva para login
Route.get('/', async ({ view }) => {
  return view.render('login')
})

// Rota protegida da Dashboard (apenas logados podem acessar)
Route.get('/dashboard', async ({ view, session, response }) => {
  const usuario = session.get('usuario')

  console.log('Sessão atual:', session.all()) // Debug para ver o que está armazenado

  if (!usuario) {
    return response.redirect('/') // Redireciona para login se não estiver autenticado
  }

  return view.render('dashboard', { usuario }) // Enviando usuário para a view
})


// Outras páginas (acessíveis sem login)
Route.get('/home', async ({ view }) => view.render('home'))
Route.get('/usuarios', async ({ view }) => view.render('usuarios/index'))
Route.get('/usuarios/novo', async ({ view }) => view.render('usuarios/novo'))
Route.get('/relatorios', async ({ view }) => view.render('relatorios'))
Route.get('/configuracoes', async ({ view }) => view.render('configuracoes'))

// CRUD de Produtos
Route.get('/produtos', async ({ view }) => view.render('produtos/index'))
Route.get('/produtos/novo', async ({ view }) => view.render('produtos/editar'))

// API: Rotas de Autenticação
Route.post('/api/login', async ({ request, response, session }) => {
  const { email, senha } = request.only(['email', 'senha'])

  // Buscar usuário pelo email
  const usuario = await Usuario.query().where('email', email).first()

  if (!usuario) {
    return response.unauthorized({ message: 'E-mail ou senha inválidos' })
  }

  // Verificar a senha
  const senhaValida = await Hash.verify(usuario.senha, senha)
  if (!senhaValida) {
    return response.unauthorized({ message: 'E-mail ou senha inválidos' })
  }

  // Criar a sessão do usuário
  session.put('usuario', { id: usuario.id, nome: usuario.nome, role: usuario.role })

  return response.ok({ message: '✅ Login realizado com sucesso', usuario })
})


// Logout
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
