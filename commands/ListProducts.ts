import { BaseCommand } from '@adonisjs/core/build/standalone'
import Produto from 'App/Models/Produto'

export default class ListProducts extends BaseCommand {
  public static commandName = 'list:products'
  public static description = 'Lista todos os produtos cadastrados'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    try {
      const produtos = await Produto.all()
      if (produtos.length === 0) {
        this.logger.info('Nenhum produto cadastrado.')
        return
      }

      this.logger.info('Produtos cadastrados:')
      produtos.forEach(produto => {
        this.logger.info(`ID: ${produto.id}`)
        this.logger.info(`Nome: ${produto.nome}`)
        this.logger.info(`Descrição: ${produto.descricao}`)
        this.logger.info(`Preço: R$ ${Number(produto.preco).toFixed(2)}`)
        this.logger.info(`Quantidade: ${produto.quantidade}`)
        this.logger.info('-------------------')
      })
    } catch (error) {
      this.logger.error('Erro ao listar produtos:')
      this.logger.error(error)
    }
  }
} 