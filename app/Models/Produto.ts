import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Produto extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public descricao: string

  @column()
  public preco: number

  @column()
  public quantidade: number

  // Mapeando a coluna 'imagem_url'
  @column({ columnName: 'imagem_url' })
  public imagemUrl?: string
}
