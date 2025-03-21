import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import Produto from 'App/Models/Produto'

export default class ResetProducts extends BaseCommand {
  public static commandName = 'reset:products'
  public static description = 'Reseta os produtos no banco de dados'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    try {
      // Limpa a tabela de produtos
      await Database.from('produtos').delete()
      this.logger.info('Tabela de produtos limpa com sucesso.')

      // Adiciona os produtos iniciais
      await Produto.createMany([
        {
          nome: 'Produto 1',
          descricao: 'Descrição do Produto 1',
          preco: 99.90,
          quantidade: 10
        },
        {
          nome: 'Produto 2',
          descricao: 'Descrição do Produto 2',
          preco: 149.90,
          quantidade: 15
        }
      ])

      this.logger.info('Produtos iniciais adicionados com sucesso.')
      
      // Mostra os produtos cadastrados
      const produtos = await Produto.all()
      this.logger.info('Produtos cadastrados:')
      produtos.forEach(produto => {
        this.logger.info('-------------------')
        this.logger.info(`ID: ${produto.id}`)
        this.logger.info(`Nome: ${produto.nome}`)
        this.logger.info(`Descrição: ${produto.descricao}`)
        this.logger.info(`Preço: R$ ${Number(produto.preco).toFixed(2)}`)
        this.logger.info(`Quantidade: ${produto.quantidade}`)
      })
    } catch (error) {
      this.logger.error('Erro ao resetar produtos:')
      this.logger.error(error)
    }
  }
} 