import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ShareAuth {
  public async handle({ session, view }: HttpContextContract, next: () => Promise<void>) {
    const user = session.get('user')
    view.share({ auth: { user } })
    await next()
  }
} 