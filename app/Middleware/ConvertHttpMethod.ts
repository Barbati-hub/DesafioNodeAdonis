import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ConvertHttpMethod {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const method = request.input('_method')

    if (method && ['PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      request.request.method = method.toUpperCase() // Converte o método da requisição corretamente
    }

    await next()
  }
}
