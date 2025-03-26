import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Produto from 'App/Models/Produto'

// Interface para os itens do carrinho com mais detalhes
interface CarrinhoItem {
  produtoId: number
  quantidade: number
  nome: string
  preco: number
  subtotal: number
  imagem_url?: string
}

export default class CarrinhosController {
  public async show({ view, session }: HttpContextContract) {
<<<<<<< HEAD
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
=======
    const carrinhoItens: CarrinhoItem[] = session.get('carrinhoItens', [])
    const total = carrinhoItens.reduce((acc, item) => acc + item.subtotal, 0)
>>>>>>> 180821922ce7097b70415e4ed765cb57292a3222

    return view.render('carrinho/index', {
      itens: carrinhoItens,
      total,
      totalFormatado: total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    })
  }

  public async adicionar({ request, response, session }: HttpContextContract) {
    try {
      console.log('\n--------- 17 - Requisição recebida no servidor --------');
      console.log('Headers:', request.headers());
      console.log('Body:', request.body());
      console.log('CSRF Token recebido:', request.header('X-CSRF-TOKEN'));
      
      const produtoId = request.input('produtoId');
      const quantidade = request.input('quantidade', 1);
      
      console.log('\n--------- 18 - Dados processados --------');
      console.log('ID do Produto:', produtoId);
      console.log('Quantidade:', quantidade);
      
      const produto = await Produto.find(produtoId);
      console.log('\n--------- 19 - Produto encontrado --------');
      console.log('Produto:', produto ? {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade_estoque: produto.quantidade
      } : 'Produto não encontrado');

      if (!produto) {
        console.log('\n--------- 20 - ERRO: Produto não encontrado --------');
        return response.status(404).json({ error: 'Produto não encontrado' });
      }

      if (quantidade > produto.quantidade) {
        console.log('\n--------- 21 - ERRO: Quantidade insuficiente --------');
        console.log('Solicitada:', quantidade);
        console.log('Disponível:', produto.quantidade);
        return response.status(400).json({ error: 'Quantidade indisponível em estoque' });
      }

      let carrinhoItens: CarrinhoItem[] = session.get('carrinhoItens', []);
      console.log('\n--------- 22 - Carrinho atual --------');
      console.log(carrinhoItens);

      const itemIndex = carrinhoItens.findIndex(item => item.produtoId === produtoId);

      if (itemIndex > -1) {
        console.log('\n--------- 23 - Atualizando item existente --------');
        carrinhoItens[itemIndex].quantidade += quantidade;
        carrinhoItens[itemIndex].subtotal = carrinhoItens[itemIndex].quantidade * carrinhoItens[itemIndex].preco;
        console.log('Item atualizado:', carrinhoItens[itemIndex]);
      } else {
        console.log('\n--------- 23 - Adicionando novo item --------');
        const novoItem: CarrinhoItem = {
          produtoId: produto.id,
          quantidade: quantidade,
          nome: produto.nome,
          preco: produto.preco,
          subtotal: produto.preco * quantidade,
          imagem_url: produto.imagem_url
        };
        carrinhoItens.push(novoItem);
        console.log('Novo item:', novoItem);
      }

      session.put('carrinhoItens', carrinhoItens);
      console.log('\n--------- 24 - Carrinho atualizado na sessão --------');
      console.log(carrinhoItens);

      const totalItens = carrinhoItens.reduce((total, item) => total + item.quantidade, 0);
      const valorTotal = carrinhoItens.reduce((total, item) => total + item.subtotal, 0);
      
      console.log('\n--------- 25 - Preparando resposta --------');
      console.log('Total de itens:', totalItens);
      console.log('Valor total:', valorTotal);

      console.log('\n--------- 26 - Enviando resposta --------');
      return response.json({ 
        message: 'Produto adicionado ao carrinho',
        quantidade: totalItens,
        valorTotal: valorTotal,
        valorTotalFormatado: valorTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      });
    } catch (error) {
      console.error('\n=== ERRO AO ADICIONAR AO CARRINHO ===')
      console.error('Detalhes do erro:', error)
      console.error('================================\n')
      return response.status(500).json({ error: 'Erro ao adicionar produto ao carrinho' })
    }
<<<<<<< HEAD

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
=======
>>>>>>> 180821922ce7097b70415e4ed765cb57292a3222
  }

  public async remover({ request, response, session }: HttpContextContract) {
    const produtoId = request.param('id')
<<<<<<< HEAD
    let carrinho = session.get('carrinho') || []
    
    carrinho = carrinho.filter((item: { produtoId: number }) => item.produtoId !== produtoId)
    session.put('carrinho', carrinho)

    return response.json({ 
      message: 'Produto removido do carrinho',
      quantidade: carrinho.reduce((total: number, item: { quantidade: number }) => total + item.quantidade, 0)
=======
    let carrinhoItens: CarrinhoItem[] = session.get('carrinhoItens', [])
    
    carrinhoItens = carrinhoItens.filter(item => item.produtoId !== produtoId)
    session.put('carrinhoItens', carrinhoItens)

    const totalItens = carrinhoItens.reduce((total, item) => total + item.quantidade, 0)
    const valorTotal = carrinhoItens.reduce((total, item) => total + item.subtotal, 0)

    return response.json({ 
      message: 'Produto removido do carrinho',
      quantidade: totalItens,
      valorTotal: valorTotal,
      valorTotalFormatado: valorTotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
>>>>>>> 180821922ce7097b70415e4ed765cb57292a3222
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

<<<<<<< HEAD
    let carrinho = session.get('carrinho') || []
    const itemIndex = carrinho.findIndex((item: { produtoId: number }) => item.produtoId === produtoId)
=======
    let carrinhoItens: CarrinhoItem[] = session.get('carrinhoItens', [])
    const itemIndex = carrinhoItens.findIndex(item => item.produtoId === produtoId)
>>>>>>> 180821922ce7097b70415e4ed765cb57292a3222

    if (itemIndex > -1) {
      if (quantidade <= 0) {
        carrinhoItens.splice(itemIndex, 1)
      } else {
        carrinhoItens[itemIndex].quantidade = quantidade
        carrinhoItens[itemIndex].subtotal = quantidade * carrinhoItens[itemIndex].preco
      }
    }

    session.put('carrinhoItens', carrinhoItens)
    
    const totalItens = carrinhoItens.reduce((total, item) => total + item.quantidade, 0)
    const valorTotal = carrinhoItens.reduce((total, item) => total + item.subtotal, 0)

    return response.json({ 
      message: 'Carrinho atualizado',
<<<<<<< HEAD
      quantidade: carrinho.reduce((total: number, item: { quantidade: number }) => total + item.quantidade, 0)
=======
      quantidade: totalItens,
      valorTotal: valorTotal,
      valorTotalFormatado: valorTotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
>>>>>>> 180821922ce7097b70415e4ed765cb57292a3222
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
