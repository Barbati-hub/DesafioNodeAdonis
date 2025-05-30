import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Produto from 'App/Models/Produto'
import cloudinary from 'Config/cloudinary'

interface ProdutoData {
  nome: string
  descricao: string
  preco: number
  quantidade: number
  imagemUrl?: string
}

export default class ProdutosController {
  // 1. Listar todos os produtos
  public async index({ view }: HttpContextContract) {
    const produtos = await Produto.all()
    console.log('Produtos cadastrados:', produtos)
    // Renderiza 'resources/views/produtos/index.edge'
    return view.render('produtos/index', { produtos })
  }

  // 2. Mostrar o formulário de criação
  public async create({ view }: HttpContextContract) {
    // Renderiza 'resources/views/produtos/novo.edge'
    return view.render('produtos/novo', { produto: null })
  }

  // 3. Salvar novo produto
  public async store({ request, response }: HttpContextContract) {
    // Recebe os dados do formulário
    const dados: ProdutoData = request.only(['nome', 'descricao', 'preco', 'quantidade'])
    
    // Trata o upload do arquivo, se existir
    const imagemFile = request.file('imagem', {
      extnames: ['jpg', 'jpeg', 'png', 'gif'],
      size: '2mb',
    })

    if (imagemFile) {
      // Faz o upload para o Cloudinary
      try {
        const uploadResponse = await cloudinary.uploader.upload(imagemFile.tmpPath!, {
          folder: 'produtos',
        })
        
        // Armazena a URL retornada
        dados.imagemUrl = uploadResponse.secure_url
      } catch (error) {
        console.error('Erro no upload:', error)
        return response.status(500).json({ error: 'Erro ao fazer upload da imagem.' })
      }
    }

    await Produto.create(dados)
    return response.redirect('/produtos')
  }

// Exibir formulário de edição
public async edit({ params, view, response }: HttpContextContract) {
  const produto = await Produto.find(params.id)
  if (!produto) {
    return response.redirect('/produtos')
  }
  return view.render('produtos/editar', { produto })
}


  // 5. Atualizar produto via AJAX ou via form
  public async update({ params, request, response }: HttpContextContract) {
    try {
      console.log('🔍 Recebendo requisição para atualizar produto ID:', params.id)

      const produto = await Produto.find(params.id)
      if (!produto) {
        console.error('❌ Produto não encontrado!')
        return response.status(404).json({ error: 'Produto não encontrado!' })
      }

      const dados = request.only(['nome', 'descricao', 'preco', 'quantidade'])
      console.log('📨 Dados recebidos:', dados)

      // Converte preço para float e quantidade para inteiro
      dados.preco = parseFloat(dados.preco)
      dados.quantidade = parseInt(dados.quantidade, 10)

      produto.merge(dados)
      await produto.save()

      console.log('✅ Produto atualizado com sucesso!')
      return response.status(200).json({
        message: 'Produto atualizado com sucesso!',
        produto,
      })
    } catch (error) {
      console.error('❌ Erro ao atualizar produto:', error)
      return response.status(500).json({
        error: 'Erro interno ao atualizar o produto.',
        details: error.message,
      })
    }
  }

  // 6. Deletar produto
  public async destroy({ params, response }: HttpContextContract) {
    try {
      console.log('🗑️ Tentando excluir o produto ID:', params.id)

      const produto = await Produto.find(params.id)
      if (!produto) {
        console.error('❌ Produto não encontrado!')
        return response.status(404).json({ error: 'Produto não encontrado!' })
      }

      await produto.delete()
      console.log('✅ Produto excluído com sucesso!')
      return response.status(200).json({ message: 'Produto deletado com sucesso!' })
    } catch (error) {
      console.error('❌ Erro ao deletar produto:', error)
      return response.status(500).json({
        error: 'Erro ao deletar o produto.',
        details: error.message,
      })
    }
  }

  // 7. Exibir detalhes do produto
  public async show({ params, view, response }: HttpContextContract) {
    const produto = await Produto.find(params.id)
    if (!produto) {
      // Se o produto não for encontrado, redirecione ou exiba uma mensagem
      return response.redirect('/produtos')
    }

    // Renderiza 'resources/views/produtos/show.edge'
    return view.render('produtos/show', { produto })
  }
}
