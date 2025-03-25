import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddAuthFieldsToClientes extends BaseSchema {
  protected tableName = 'clientes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email').unique()
      table.string('cpf').unique()
      table.string('senha')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email')
      table.dropColumn('cpf')
      table.dropColumn('senha')
    })
  }
}
