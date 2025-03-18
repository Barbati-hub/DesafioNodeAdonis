import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Usuarios extends BaseSchema {
  protected tableName = 'usuarios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('senha', 255).notNullable()
      table.enum('role', ['usuario', 'admin']).defaultTo('usuario')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())  // REMOVIDO DUPLICAÇÃO
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
