import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Produtos extends BaseSchema {
  protected tableName = 'produtos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Chave Primária
      table.string('nome').notNullable()
      table.text('descricao').nullable()
      table.decimal('preco', 10, 2).notNullable()
      table.integer('quantidade').notNullable().defaultTo(0)
      table.string('imagem_url').nullable() 
      
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
