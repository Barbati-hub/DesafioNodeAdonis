import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Produto from 'App/Models/Produto'

export default class ProdutoSeeder extends BaseSeeder {
  public async run() {
    await Produto.createMany([
      {
        nome: 'Hambúrguer Clássico',
        descricao: 'Pão, carne 180g, queijo, alface, tomate e molho especial',
        preco: 25.90,
        quantidade: 50
      },
      {
        nome: 'Pizza Margherita',
        descricao: 'Molho de tomate, mussarela, manjericão fresco e azeite',
        preco: 45.90,
        quantidade: 30
      },
      {
        nome: 'Batata Frita',
        descricao: 'Porção de batatas fritas crocantes com sal',
        preco: 15.90,
        quantidade: 100
      },
      {
        nome: 'Refrigerante',
        descricao: 'Lata 350ml',
        preco: 6.90,
        quantidade: 200
      }
    ])
  }
} 