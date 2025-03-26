import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Produto from 'App/Models/Produto'

export default class CarrinhosController {
  public async show({ view, session }: HttpContextContract) {
    const carrinho = session.get('carrinho') || []
    const itens = []
    let total = 0

    for (const item of carrinho) {
      const produto = await Produto.find(item.produtoId)
      if (produto) {
        const subtotal = produto.preco * item.quantidade
        itens.push({
          produto,
          quantidade: item.quantidade,
          subtotal,
          subtotalFormatado: subtotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        })
        total += subtotal
      }
    }

    return view.render('carrinho/index', {
      itens,
      total,
      totalFormatado: total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    })
  }

  public async adicionar({ request, response, session }: HttpContextContract) {
    const produtoId = request.input('produtoId')
    const quantidade = request.input('quantidade', 1)
    
    const produto = await Produto.find(produtoId)
    if (!produto) {
      return response.status(404).json({ error: 'Produto não encontrado' })
    }

    if (quantidade > produto.quantidade) {
      return response.status(400).json({ error: 'Quantidade indisponível em estoque' })
    }

    let carrinho = session.get('carrinho') || []
    const itemIndex = carrinho.findIndex((item: { produtoId: number }) => item.produtoId === produtoId)

    if (itemIndex > -1) {
      carrinho[itemIndex].quantidade += quantidade
    } else {
      carrinho.push({ produtoId, quantidade })
    }

    session.put('carrinho', carrinho)
    return response.json({ 
      message: 'Produto adicionado ao carrinho',
      quantidade: carrinho.reduce((total: number, item: { quantidade: number }) => total + item.quantidade, 0)
    })
  }

  public async remover({ request, response, session }: HttpContextContract) {
    const produtoId = request.param('id')
    let carrinho = session.get('carrinho') || []
    
    carrinho = carrinho.filter((item: { produtoId: number }) => item.produtoId !== produtoId)
    session.put('carrinho', carrinho)

    return response.json({ 
      message: 'Produto removido do carrinho',
      quantidade: carrinho.reduce((total: number, item: { quantidade: number }) => total + item.quantidade, 0)
    })
  }

  public async atualizar({ request, response, session }: HttpContextContract) {
    const produtoId = request.input('produtoId')
    const quantidade = request.input('quantidade')

    const produto = await Produto.find(produtoId)
    if (!produto) {
      return response.status(404).json({ error: 'Produto não encontrado' })
    }

    if (quantidade > produto.quantidade) {
      return response.status(400).json({ error: 'Quantidade indisponível em estoque' })
    }

    let carrinho = session.get('carrinho') || []
    const itemIndex = carrinho.findIndex((item: { produtoId: number }) => item.produtoId === produtoId)

    if (itemIndex > -1) {
      if (quantidade <= 0) {
        carrinho.splice(itemIndex, 1)
      } else {
        carrinho[itemIndex].quantidade = quantidade
      }
    }

    session.put('carrinho', carrinho)
    return response.json({ 
      message: 'Carrinho atualizado',
      quantidade: carrinho.reduce((total: number, item: { quantidade: number }) => total + item.quantidade, 0)
    })
  }

  public async addToCart({ request, response, session }: HttpContextContract) {
    const productId = request.input('productId')
    console.log('Recebendo requisição para adicionar produto:', productId)

    // Lógica para adicionar o produto ao carrinho
    const cart = session.get('cart') || []
    console.log('Estado atual do carrinho:', cart)

    cart.push(productId)
    session.put('cart', cart)
    console.log('Produto adicionado ao carrinho. Novo estado do carrinho:', cart)

    return response.json({ success: true, message: 'Produto adicionado ao carrinho' })
  }
}
