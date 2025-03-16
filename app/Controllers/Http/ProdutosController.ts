import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Produto from 'App/Models/Produto'

export default class ProdutosController {
  // Listar todos os produtos
  public async index({ view }: HttpContextContract) {
    const produtos = await Produto.all()
    return view.render('produtos.index', { produtos })
  }

  // Mostrar o formulário de criação
  public async create({ view }: HttpContextContract) {
    return view.render('produtos.produtos', { produto: null })
  }

  // Salvar novo produto
  public async store({ request, response }: HttpContextContract) {
    const dados = request.only(['nome', 'descricao', 'preco', 'quantidade'])
    await Produto.create(dados)
    return response.redirect('/produtos')
  }

  // Exibir formulário de edição
  public async edit({ params, view }: HttpContextContract) {
    const produto = await Produto.findOrFail(params.id)
    return view.render('produtos.editar', { produto })
  }

  // Atualizar produto via AJAX
  public async update({ params, request, response }: HttpContextContract) {
    try {
      console.log("🔍 Recebendo requisição para atualizar produto ID:", params.id);
      
      const produto = await Produto.find(params.id);

      if (!produto) {
        console.error("❌ Produto não encontrado!");
        return response.status(404).json({ error: "Produto não encontrado!" });
      }

      const dados = request.only(["nome", "descricao", "preco", "quantidade"]);
      console.log("📨 Dados recebidos:", dados);

      // Converte preço para float (evita erros com strings)
      dados.preco = parseFloat(dados.preco);
      dados.quantidade = parseInt(dados.quantidade, 10);

      produto.merge(dados);
      await produto.save();

      console.log("✅ Produto atualizado com sucesso!");
      return response.status(200).json({
        message: "Produto atualizado com sucesso!",
        produto
      });

    } catch (error) {
      console.error("❌ Erro ao atualizar produto:", error);
      return response.status(500).json({
        error: "Erro interno ao atualizar o produto.",
        details: error.message
      });
    }
  }
  // Deletar produto
  public async destroy({ params, response }: HttpContextContract) {
    try {
      console.log("🗑️ Tentando excluir o produto ID:", params.id);

      const produto = await Produto.find(params.id);

      if (!produto) {
        console.error("❌ Produto não encontrado!");
        return response.status(404).json({ error: "Produto não encontrado!" });
      }

      await produto.delete();

      console.log("✅ Produto excluído com sucesso!");
      return response.status(200).json({ message: "Produto deletado com sucesso!" });
      
    } catch (error) {
      console.error("❌ Erro ao deletar produto:", error);
      return response.status(500).json({ error: "Erro ao deletar o produto.", details: error.message });
    }
  }
}
