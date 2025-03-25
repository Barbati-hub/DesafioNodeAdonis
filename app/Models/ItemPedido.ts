import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Pedido from './Pedido'
import Produto from './Produto'

export default class ItemPedido extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pedidoId: number

  @column()
  public produtoId: number

  @column()
  public quantidade: number

  @column()
  public precoUnitario: number

  @column()
  public subtotal: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Pedido)
  public pedido: BelongsTo<typeof Pedido>

  @belongsTo(() => Produto)
  public produto: BelongsTo<typeof Produto>

  @computed()
  public get precoUnitarioFormatado() {
    return this.precoUnitario.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  @computed()
  public get subtotalFormatado() {
    return this.subtotal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }
}
