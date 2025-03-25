import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    // O erro estava aqui: View.engine.global não existe mais.
    // Apenas mantenha a importação do View, se necessário no futuro.
    const View = this.app.container.use('Adonis/Core/View')
  }
}

export const providers = [
  '@adonisjs/core',
  '@adonisjs/session',
  '@adonisjs/view',
  '@adonisjs/shield',
  '@adonisjs/lucid',
  '@adonisjs/view/providers/ViewProvider'
]
