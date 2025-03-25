import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Cliente from 'App/Models/Cliente'

export default class ClientesController {
  // Exibe a lista de clientes
  public async index({ view }: HttpContextContract) {
    const clientes = await Cliente.all()
    return view.render('clientes/index', { clientes })
  }

  // Exibe o formulário de criação
  public async create({ view }: HttpContextContract) {
    return view.render('clientes/create')
  }

  // Salva um novo cliente
  public async store({ request, response, session }: HttpContextContract) {
    const validationSchema = schema.create({
      nome: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(3),
        rules.maxLength(100)
      ]),
      whatsapp: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(10),
        rules.maxLength(15)
      ]),
      cep: schema.string.optional({ trim: true }, [
        rules.minLength(8),
        rules.maxLength(8)
      ]),
      logradouro: schema.string.optional({ trim: true }, [
        rules.maxLength(255)
      ]),
      numero: schema.string.optional({ trim: true }, [
        rules.maxLength(20)
      ]),
      complemento: schema.string.optional({ trim: true }, [
        rules.maxLength(255)
      ]),
      bairro: schema.string.optional({ trim: true }, [
        rules.maxLength(100)
      ]),
      cidade: schema.string.optional({ trim: true }, [
        rules.maxLength(100)
      ]),
      estado: schema.string.optional({ trim: true }, [
        rules.maxLength(2)
      ])
    })

    try {
      const data = await request.validate({ schema: validationSchema })

      // Formata os dados antes de salvar
      const clienteData = {
        ...data,
        whatsapp: data.whatsapp.replace(/\D/g, ''),
        cep: data.cep ? data.cep.replace(/\D/g, '') : null
      }

      await Cliente.create(clienteData)

      session.flash('success', 'Cliente cadastrado com sucesso!')
      return response.redirect().toPath('/')
    } catch (error) {
      session.flash('errors', error.messages)
      session.flash('nome', request.input('nome'))
      session.flash('whatsapp', request.input('whatsapp'))
      session.flash('cep', request.input('cep'))
      session.flash('logradouro', request.input('logradouro'))
      session.flash('numero', request.input('numero'))
      session.flash('complemento', request.input('complemento'))
      session.flash('bairro', request.input('bairro'))
      session.flash('cidade', request.input('cidade'))
      session.flash('estado', request.input('estado'))
      return response.redirect().back()
    }
  }

  // Exibe um cliente específico
  public async show({ params, view }: HttpContextContract) {
    const cliente = await Cliente.findOrFail(params.id)
    return view.render('clientes/show', { cliente })
  }

  // Exibe o formulário de edição
  public async edit({ params, view }: HttpContextContract) {
    const cliente = await Cliente.findOrFail(params.id)
    return view.render('clientes/edit', { cliente })
  }

  // Atualiza um cliente
  public async update({ params, request, response, session }: HttpContextContract) {
    try {
      const cliente = await Cliente.findOrFail(params.id)

      const validationSchema = schema.create({
        nome: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(3),
          rules.maxLength(100)
        ]),
        whatsapp: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(10),
          rules.maxLength(15)
        ]),
        cep: schema.string.optional({ trim: true }, [
          rules.minLength(8),
          rules.maxLength(8)
        ]),
        logradouro: schema.string.optional({ trim: true }, [
          rules.maxLength(255)
        ]),
        numero: schema.string.optional({ trim: true }, [
          rules.maxLength(20)
        ]),
        complemento: schema.string.optional({ trim: true }, [
          rules.maxLength(255)
        ]),
        bairro: schema.string.optional({ trim: true }, [
          rules.maxLength(100)
        ]),
        cidade: schema.string.optional({ trim: true }, [
          rules.maxLength(100)
        ]),
        estado: schema.string.optional({ trim: true }, [
          rules.maxLength(2)
        ])
      })

      const data = await request.validate({ schema: validationSchema })

      // Formata os dados antes de atualizar
      const clienteData = {
        ...data,
        whatsapp: Cliente.formatWhatsApp(data.whatsapp),
        cep: data.cep ? Cliente.formatCep(data.cep) : null
      }

      cliente.merge(clienteData)
      await cliente.save()

      session.flash('success', 'Cliente atualizado com sucesso!')
      return response.redirect().toRoute('clientes.index')
    } catch (error) {
      session.flash('errors', error.messages)
      return response.redirect().back()
    }
  }

  // Remove um cliente
  public async destroy({ params, response, session }: HttpContextContract) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      await cliente.delete()
      session.flash('success', 'Cliente removido com sucesso!')
      return response.redirect().toRoute('clientes.index')
    } catch (error) {
      session.flash('error', 'Erro ao remover cliente')
      return response.redirect().back()
    }
  }

  // API Endpoints
  public async apiIndex({ response }: HttpContextContract) {
    const clientes = await Cliente.all()
    return response.ok(clientes)
  }

  public async apiShow({ params, response }: HttpContextContract) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      return response.ok(cliente)
    } catch (error) {
      return response.notFound({ message: 'Cliente não encontrado' })
    }
  }

  public async apiStore({ request, response }: HttpContextContract) {
    try {
      const validationSchema = schema.create({
        nome: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(3),
          rules.maxLength(100)
        ]),
        whatsapp: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(10),
          rules.maxLength(15)
        ]),
        cep: schema.string.optional({ trim: true }, [
          rules.minLength(8),
          rules.maxLength(8)
        ]),
        logradouro: schema.string.optional({ trim: true }, [
          rules.maxLength(255)
        ]),
        numero: schema.string.optional({ trim: true }, [
          rules.maxLength(20)
        ]),
        complemento: schema.string.optional({ trim: true }, [
          rules.maxLength(255)
        ]),
        bairro: schema.string.optional({ trim: true }, [
          rules.maxLength(100)
        ]),
        cidade: schema.string.optional({ trim: true }, [
          rules.maxLength(100)
        ]),
        estado: schema.string.optional({ trim: true }, [
          rules.maxLength(2)
        ])
      })

      const data = await request.validate({ schema: validationSchema })

      const clienteData = {
        ...data,
        whatsapp: Cliente.formatWhatsApp(data.whatsapp),
        cep: data.cep ? Cliente.formatCep(data.cep) : null
      }

      const cliente = await Cliente.create(clienteData)
      return response.created(cliente)
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async apiUpdate({ params, request, response }: HttpContextContract) {
    try {
      const cliente = await Cliente.findOrFail(params.id)

      const validationSchema = schema.create({
        nome: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(3),
          rules.maxLength(100)
        ]),
        whatsapp: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(10),
          rules.maxLength(15)
        ]),
        cep: schema.string.optional({ trim: true }, [
          rules.minLength(8),
          rules.maxLength(8)
        ]),
        logradouro: schema.string.optional({ trim: true }, [
          rules.maxLength(255)
        ]),
        numero: schema.string.optional({ trim: true }, [
          rules.maxLength(20)
        ]),
        complemento: schema.string.optional({ trim: true }, [
          rules.maxLength(255)
        ]),
        bairro: schema.string.optional({ trim: true }, [
          rules.maxLength(100)
        ]),
        cidade: schema.string.optional({ trim: true }, [
          rules.maxLength(100)
        ]),
        estado: schema.string.optional({ trim: true }, [
          rules.maxLength(2)
        ])
      })

      const data = await request.validate({ schema: validationSchema })

      const clienteData = {
        ...data,
        whatsapp: Cliente.formatWhatsApp(data.whatsapp),
        cep: data.cep ? Cliente.formatCep(data.cep) : null
      }

      cliente.merge(clienteData)
      await cliente.save()

      return response.ok(cliente)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Cliente não encontrado' })
      }
      return response.badRequest(error.messages)
    }
  }

  public async apiDestroy({ params, response }: HttpContextContract) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      await cliente.delete()
      return response.ok({ message: 'Cliente removido com sucesso' })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Cliente não encontrado' })
      }
      return response.internalServerError({ message: 'Erro ao remover cliente' })
    }
  }
} 