import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OAuth2Client } from 'google-auth-library'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class AuthController {
  private client: OAuth2Client

  constructor() {
    const clientId = Env.get('GOOGLE_CLIENT_ID')
    const clientSecret = Env.get('GOOGLE_CLIENT_SECRET')
    const callbackUrl = Env.get('GOOGLE_CALLBACK_URL')

    this.client = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri: callbackUrl,
    })
  }

  public async google({ response }: HttpContextContract) {
    try {
      const url = this.client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        response_type: 'code'
      })
      return response.redirect(url)
    } catch (error) {
      console.error('Erro ao gerar URL de autenticação:', error)
      return response.redirect('/login?error=auth_failed')
    }
  }

  public async googleCallback({ request, response, session }: HttpContextContract) {
    const { code } = request.qs()
    
    if (!code) {
      return response.redirect('/login?error=missing_code')
    }

    try {
      // Obter tokens
      const { tokens } = await this.client.getToken(code)
      if (!tokens?.id_token) {
        throw new Error('Tokens inválidos')
      }

      // Verificar token
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: Env.get('GOOGLE_CLIENT_ID')
      })

      const payload = ticket.getPayload()
      if (!payload?.email) {
        throw new Error('Payload inválido')
      }

      // Procura ou cria usuário
      let user = await User.findBy('email', payload.email)
      if (!user) {
        user = await User.create({
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          googleId: payload.sub,
          avatar: payload.picture,
          role: 'user'
        })
      }

      // Atualiza a sessão
      await session.clear()
      await session.put('user', {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role
      })

      // Força gravação da sessão
      await session.commit()

      return response.redirect('/home')
    } catch (error) {
      console.error('Erro ao processar callback:', error)
      return response.redirect('/login?error=token_processing')
    }
  }

  public async logout({ response, session }: HttpContextContract) {
    await session.clear()
    return response.redirect('/login')
  }
} 