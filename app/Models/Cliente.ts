import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public whatsapp: string

  @column()
  public cep: string | null

  @column()
  public logradouro: string | null

  @column()
  public numero: string | null

  @column()
  public complemento: string | null

  @column()
  public bairro: string | null

  @column()
  public cidade: string | null

  @column()
  public estado: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Método para formatar o WhatsApp antes de salvar
  public static formatWhatsApp(whatsapp: string): string {
    return whatsapp.replace(/\D/g, '')
  }

  // Método para formatar o CEP antes de salvar
  public static formatCep(cep: string): string {
    return cep.replace(/\D/g, '')
  }
} 