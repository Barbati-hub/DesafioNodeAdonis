import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public email: string

  @column({ serializeAs: null }) // Esconde a senha no JSON
  public senha: string

  @column()
  public role: 'usuario' | 'admin'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(usuario: Usuario) {
    if (usuario.$dirty.senha) {
      usuario.senha = await Hash.make(usuario.senha) // 🔥 Garante que a senha seja criptografada
    }
  }
}
