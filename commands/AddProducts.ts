import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import Produto from 'App/Models/Produto'

export default class AddProducts extends BaseCommand {
  public static commandName = 'add:products'
  public static description = 'Adiciona produtos ao banco de dados mantendo os existentes'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    try {
      // Adiciona os produtos
      await Produto.createMany([
        {
          nome: 'Refrigerante',
          descricao: 'Refrigerante gelado de 2L',
          preco: 8.90,
          quantidade: 50,
          imagemUrl: 'https://images.unsplash.com/photo-1622483767028-3f908a1f3ca9?q=80&w=500&auto=format&fit=crop'
        },
        {
          nome: 'Batata Frita',
          descricao: 'Porção de batata frita crocante',
          preco: 15.90,
          quantidade: 30,
          imagemUrl: 'https://images.unsplash.com/photo-1630389917978-9d9a91a873ad?q=80&w=500&auto=format&fit=crop'
        },
        {
          nome: 'Pizza Margherita',
          descricao: 'Pizza tradicional com molho de tomate, mussarela e manjericão',
          preco: 45.90,
          quantidade: 20,
          imagemUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=500&auto=format&fit=crop'
        },
        {
          nome: 'Hambúrguer Clássico',
          descricao: 'Hambúrguer com queijo, alface, tomate e molho especial',
          preco: 25.90,
          quantidade: 40,
          imagemUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop'
        }
      ])

      this.logger.info('Novos produtos adicionados com sucesso.')
      
      // Mostra todos os produtos cadastrados
      const produtos = await Produto.all()
      this.logger.info('Produtos cadastrados:')
      produtos.forEach(produto => {
        this.logger.info('-------------------')
        this.logger.info(`ID: ${produto.id}`)
        this.logger.info(`Nome: ${produto.nome}`)
        this.logger.info(`Descrição: ${produto.descricao}`)
        this.logger.info(`Preço: R$ ${Number(produto.preco).toFixed(2)}`)
        this.logger.info(`Quantidade: ${produto.quantidade}`)
        this.logger.info(`URL da Imagem: ${produto.imagemUrl}`)
      })
    } catch (error) {
      this.logger.error('Erro ao adicionar produtos:')
      this.logger.error(error)
    }
  }
} 