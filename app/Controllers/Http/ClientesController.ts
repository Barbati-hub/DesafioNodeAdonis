import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Cliente from 'App/Models/Cliente'
import * as bcrypt from 'bcrypt'

export default class ClientesController {
  // Exibe a lista de clientes
  public async index({ view }: HttpContextContract) {
    const clientes = await Cliente.all()
    return view.render('clientes/index', { clientes })
  }

  // Exibe o formulário de criação
  public async create({ view }: HttpContextContract) {
    console.log('Acessando página de criação de cliente')
    return view.render('clientes/create')
  }

  // Salva um novo cliente
  public async store({ request, response, session }: HttpContextContract) {
    console.log('Iniciando processo de registro de cliente')
    console.log('Dados recebidos:', request.all())

    const validationSchema = schema.create({
      nome: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(3),
        rules.maxLength(100)
      ]),
      email: schema.string({ trim: true }, [
        rules.required(),
        rules.email(),
        rules.unique({ table: 'clientes', column: 'email' })
      ]),
      cpf: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(11),
        rules.maxLength(11),
        rules.unique({ table: 'clientes', column: 'cpf' })
      ]),
      senha: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(6),
        rules.confirmed()
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
      console.log('Iniciando validação dos dados')
      
      // Formata os dados antes da validação
      const dadosFormatados = {
        ...request.all(),
        cpf: request.input('cpf')?.replace(/\D/g, '') || '',
        cep: request.input('cep')?.replace(/\D/g, '') || null,
        whatsapp: request.input('whatsapp')?.replace(/\D/g, '') || ''
      }
      
      console.log('Dados formatados:', dadosFormatados)
      
      const data = await request.validate({ 
        schema: validationSchema,
        data: dadosFormatados,
        messages: {
          'nome.required': 'O nome é obrigatório',
          'nome.minLength': 'O nome deve ter no mínimo 3 caracteres',
          'email.required': 'O email é obrigatório',
          'email.email': 'Email inválido',
          'email.unique': 'Este email já está em uso',
          'cpf.required': 'O CPF é obrigatório',
          'cpf.minLength': 'CPF inválido',
          'cpf.unique': 'Este CPF já está cadastrado',
          'senha.required': 'A senha é obrigatória',
          'senha.minLength': 'A senha deve ter no mínimo 6 caracteres',
          'senha.confirmed': 'As senhas não conferem',
          'whatsapp.required': 'O WhatsApp é obrigatório',
          'whatsapp.minLength': 'WhatsApp inválido',
          'cep.minLength': 'CEP inválido'
        }
      })
      console.log('Dados validados com sucesso:', data)

      // Criar cliente diretamente com os dados validados
      const cliente = await Cliente.create(data)
      console.log('Cliente criado com sucesso:', cliente)

      session.flash('success', 'Cliente cadastrado com sucesso!')
      return response.redirect().toRoute('clientes.index')
    } catch (error) {
      console.log('Erro durante o registro:', error)
      
      if (error.messages) {
        // Erro de validação
        console.log('Erros de validação:', error.messages)
        session.flash('errors', error.messages.errors)
        
        // Flash dos dados do formulário para manter os valores preenchidos
        const formData = request.all()
        Object.keys(formData).forEach(key => {
          if (key !== 'senha' && key !== 'senha_confirmation') {
            session.flash(key, formData[key])
          }
        })
      } else {
        // Outro tipo de erro
        console.log('Erro não esperado:', error)
        session.flash('error', 'Erro ao cadastrar cliente. Tente novamente.')
      }

      return response.redirect().back()
    }
  }

  // Exibe os detalhes de um cliente
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
    const cliente = await Cliente.findOrFail(params.id)
    const data = request.only(['nome', 'email', 'whatsapp', 'cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado'])
    
    cliente.merge(data)
    await cliente.save()

    session.flash('success', 'Cliente atualizado com sucesso!')
    return response.redirect().toRoute('clientes.index')
  }

  // Remove um cliente
  public async destroy({ params, response, session }: HttpContextContract) {
    const cliente = await Cliente.findOrFail(params.id)
    await cliente.delete()

    session.flash('success', 'Cliente removido com sucesso!')
    return response.redirect().toRoute('clientes.index')
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