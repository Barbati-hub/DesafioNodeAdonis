declare module '@ioc:Adonis/Addons/Auth' {
  import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

  export interface AuthContract {
    use(guard: string): AuthContract
    login(user: any): Promise<void>
    logout(): Promise<void>
    authenticate(): Promise<void>
  }

  export interface AuthConfig {
    guard: string
    guards: {
      [key: string]: {
        driver: string
        provider: {
          driver: string
          identifierKey: string
          uids: string[]
          model: () => Promise<{ default: LucidModel }>
        }
      }
    }
  }
} 