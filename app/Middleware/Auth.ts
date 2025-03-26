import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
  public async handle({ session, response, view }: HttpContextContract, next: () => Promise<void>) {
    const user = session.get('user')
    
    if (!user) {
      session.flash('error', 'Você precisa fazer login para acessar esta página')
      return response.redirect('/login')
    }

    // Compartilha o usuário com todas as views
    view.share({ auth: { user } })

    await next()
  }
}
