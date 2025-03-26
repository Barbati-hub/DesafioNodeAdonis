import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ViewGlobals {
  public async handle({ view, session }: HttpContextContract, next: () => Promise<void>) {
    // Compartilha a variável auth com todas as views
    view.share({
      auth: {
        user: session.get('user')
      }
    })

    await next()
  }
} 