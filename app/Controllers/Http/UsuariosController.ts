import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario'

export default class UsuariosController {
  // 📌 Listar todos os usuários
  public async index({ response }: HttpContextContract) {
    const usuarios = await Usuario.all()
    return response.ok(usuarios)
  }

  // 📌 Criar um novo usuário
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['nome', 'email', 'senha', 'role'])

    try {
      const usuario = await Usuario.create(data)
      return response.created(usuario)
    } catch (error) {
      return response.badRequest({ message: 'Erro ao criar usuário', error })
    }
  }

  // 📌 Exibir um usuário específico
  public async show({ params, response }: HttpContextContract) {
    const usuario = await Usuario.find(params.id)

    if (!usuario) {
      return response.notFound({ message: 'Usuário não encontrado' })
    }

    return response.ok(usuario)
  }

  // 📌 Atualizar um usuário
  public async update({ params, request, response }: HttpContextContract) {
    const usuario = await Usuario.find(params.id)

    if (!usuario) {
      return response.notFound({ message: 'Usuário não encontrado' })
    }

    const data = request.only(['nome', 'email', 'senha', 'role'])
    usuario.merge(data)
    await usuario.save()

    return response.ok(usuario)
  }

  // 📌 Deletar um usuário
  public async destroy({ params, response }: HttpContextContract) {
    const usuario = await Usuario.find(params.id)

    if (!usuario) {
      return response.notFound({ message: 'Usuário não encontrado' })
    }

    await usuario.delete()
    return response.ok({ message: 'Usuário removido com sucesso' })
  }
}
