import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    try {
      await auth.use('web').authenticate()
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      await next()
    }
  }
} 