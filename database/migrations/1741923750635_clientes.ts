import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clientes extends BaseSchema {
  protected tableName = 'clientes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Chave Primária
      table.string('nome').notNullable()
      table.string('whatsapp').notNullable()
      table.string('cep').nullable()
      table.string('logradouro').nullable()
      table.string('numero').nullable()
      table.string('complemento').nullable()
      table.string('bairro').nullable()
      table.string('cidade').nullable()
      table.string('estado').nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
