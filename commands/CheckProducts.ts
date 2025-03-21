import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CheckProducts extends BaseCommand {
  public static commandName = 'check:products'
  public static description = 'Verifica os produtos cadastrados no banco de dados'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    try {
      // Busca os produtos diretamente do banco
      const produtos = await Database
        .from('produtos')
        .select('*')

      if (produtos.length === 0) {
        this.logger.info('Nenhum produto cadastrado no banco de dados.')
        return
      }

      this.logger.info(`Total de produtos cadastrados: ${produtos.length}`)
      this.logger.info('Produtos:')
      
      produtos.forEach(produto => {
        this.logger.info('-------------------')
        this.logger.info(`ID: ${produto.id}`)
        this.logger.info(`Nome: ${produto.nome}`)
        this.logger.info(`Descrição: ${produto.descricao}`)
        this.logger.info(`Preço: R$ ${Number(produto.preco).toFixed(2)}`)
        this.logger.info(`Quantidade: ${produto.quantidade}`)
        this.logger.info(`Criado em: ${produto.created_at}`)
        this.logger.info(`Atualizado em: ${produto.updated_at}`)
      })
    } catch (error) {
      this.logger.error('Erro ao verificar produtos:')
      this.logger.error(error)
    }
  }
} 