import { BaseCommand } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'

export default class MakeAdmin extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'make:admin'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Promove um usuário para administrador usando o email'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const email = await this.prompt.ask('Digite o email do usuário que deseja promover a administrador')

    try {
      // Busca o usuário pelo email
      const user = await User.findBy('email', email)

      if (!user) {
        this.logger.error(`Usuário com email ${email} não encontrado`)
        return
      }

      // Verifica se já é admin
      if (user.role === 'admin') {
        this.logger.info(`Usuário ${email} já é administrador`)
        return
      }

      // Atualiza a role para admin
      user.role = 'admin'
      await user.save()

      this.logger.success(`Usuário ${email} foi promovido a administrador com sucesso!`)

    } catch (error) {
      this.logger.error('Erro ao promover usuário:')
      this.logger.error(error)
    }
  }
}
