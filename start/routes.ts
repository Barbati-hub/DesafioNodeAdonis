import Route from '@ioc:Adonis/Core/Route'


Route.get('/', async ({ view }) => {
  return view.render('dashboard')
})


Route.get('/home', async ({ view }) => view.render('home'))
Route.get('/usuarios', async ({ view }) => view.render('usuarios/index')) 
Route.get('/relatorios', async ({ view }) => view.render('relatorios'))
Route.get('/configuracoes', async ({ view }) => view.render('configuracoes'))
Route.get('/test', async ({ view }) => view.render('test'))


Route.get('/produtos', 'ProdutosController.index')
Route.get('/produtos/novo', 'ProdutosController.create')
Route.post('/produtos', 'ProdutosController.store')
Route.get('/produtos/:id/editar', 'ProdutosController.edit')
Route.put('/produtos/:id', 'ProdutosController.update')
Route.delete('/produtos/:id', 'ProdutosController.destroy')


Route.get('/usuarios/novo', async ({ view }) => view.render('usuarios/novo'))
