import { BaseCommand } from '@adonisjs/core/build/standalone'
import Produto from 'App/Models/Produto'

export default class ResetProducts extends BaseCommand {
  public static commandName = 'reset:products'
  public static description = 'Reseta e popula produtos com imagens'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    try {
      // Limpa todos os produtos existentes
      await Produto.query().delete()
      
      // Lista de produtos para inserir
      const produtos = [
        {
          nome: 'Placa de Vídeo RTX 4090',
          descricao: 'NVIDIA GeForce RTX 4090 24GB GDDR6X',
          preco: 12999.90,
          quantidade: 5,
          imagemUrl: 'https://images.kabum.com.br/produtos/fotos/384645/placa-de-video-rtx-4090-gaming-x-trio-msi-nvidia-geforce-24-gb-gddr6x-dlss-ray-tracing-912-v510-015_1665062361_gg.jpg'
        },
        {
          nome: 'Processador Ryzen 9 7950X',
          descricao: 'AMD Ryzen 9 7950X, 5.7GHz Max Turbo, 16 Cores',
          preco: 4999.90,
          quantidade: 10,
          imagemUrl: 'https://images.kabum.com.br/produtos/fotos/386545/processador-amd-ryzen-9-7950x-5-7ghz-max-turbo-cache-80mb-am5-16-nucleos-32-threads-100-100000514wof_1663251220_gg.jpg'
        },
        {
          nome: 'Monitor Gamer 32" 4K',
          descricao: 'Monitor Gamer 32" 4K UHD 144Hz HDR',
          preco: 3499.90,
          quantidade: 8,
          imagemUrl: 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/465995/Monitor-Gamer-32-Polegadas-LED-4K-UHD-144Hz-HDR-FreeSync-Premium-Pro-HDMI-DP-Altura-Ajust-vel-VESA-Preto_1692902613_gg.jpg'
        },
        {
          nome: 'SSD 2TB NVMe',
          descricao: 'SSD 2TB NVMe PCIe Gen4 x4 M.2',
          preco: 1299.90,
          quantidade: 15,
          imagemUrl: 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/373947/SSD-2TB-Nvme-Pcie-Gen4-X4-M-2-2280-Leitura-7400mb-S-Grava-o-6900mb-S_1683729254_gg.jpg'
        }
      ]

      // Insere os novos produtos
      for (const produto of produtos) {
        await Produto.create(produto)
        this.logger.info(`Produto criado: ${produto.nome}`)
      }

      this.logger.success('Produtos resetados com sucesso!')
    } catch (error) {
      this.logger.error('Erro ao resetar produtos:')
      this.logger.error(error)
    }
  }
} 