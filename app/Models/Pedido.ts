import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import ItemPedido from './ItemPedido'

export default class Pedido extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public total: number

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => ItemPedido)
  public items: HasMany<typeof ItemPedido>

  @computed()
  public get totalFormatado() {
    return this.total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }
}
