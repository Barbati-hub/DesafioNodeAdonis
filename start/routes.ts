import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('dashboard')
})

Route.get('/home', async ({ view }) => {
    return view.render('home')
  })
  


Route.get('/usuarios', async ({ view }) => {
  return view.render('usuarios')
})

Route.get('/relatorios', async ({ view }) => {
  return view.render('relatorios')
})

Route.get('/configuracoes', async ({ view }) => {
  return view.render('configuracoes')
})

Route.get('/test', async ({ view }) => {
  return view.render('test')
})
