import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { RequestContract } from '@ioc:Adonis/Core/Request'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { OAuth2Client } from 'google-auth-library'

interface ExtendedRequest extends RequestContract {
  session?: any
  user?: any
}

export default class GoogleAuth {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    console.log('GoogleAuth middleware iniciado')
    console.log('URL atual:', ctx.request.url())
    console.log('Método:', ctx.request.method())
    console.log('Query params:', ctx.request.qs())
    
    try {
      // Verifica se as variáveis de ambiente estão configuradas
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
        console.error('Configurações do Google OAuth não encontradas')
        return ctx.response.redirect('/login?error=Configuration missing')
      }

      const client = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_CALLBACK_URL,
      })

      console.log('Client OAuth2 configurado')
      console.log('Redirect URI:', process.env.GOOGLE_CALLBACK_URL)

      // Se estamos na rota de callback
      if (ctx.request.url().includes('/auth/google/callback')) {
        console.log('Processando callback do Google')
        const code = ctx.request.qs().code
        
        if (!code) {
          console.error('Código de autorização não encontrado')
          return ctx.response.redirect('/login?error=No authorization code')
        }

        console.log('Código de autorização recebido')
        
        try {
          const { tokens } = await client.getToken(code)
          console.log('Tokens recebidos do Google')
          
          const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: process.env.GOOGLE_CLIENT_ID
          })
          
          const payload = ticket.getPayload()
          if (!payload || !payload.email) {
            console.error('Payload inválido ou email não encontrado')
            return ctx.response.redirect('/login?error=Invalid payload')
          }

          console.log('Payload do token verificado:', {
            email: payload.email,
            name: payload.name,
            picture: payload.picture
          })

          // Procura ou cria o usuário
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

          // Armazenar informações do usuário na sessão
          ctx.session.put('user', {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.avatar,
            role: user.role
          })

          console.log('Informações do usuário armazenadas na sessão')
          await next()
        } catch (error) {
          console.error('Erro ao processar tokens:', error)
          return ctx.response.redirect('/login?error=Token processing failed')
        }
      }
      // Se estamos iniciando o processo de autenticação
      else if (ctx.request.url().includes('/auth/google')) {
        console.log('Iniciando processo de autenticação com Google')
        const url = client.generateAuthUrl({
          access_type: 'offline',
          scope: ['profile', 'email']
        })
        console.log('URL de autorização gerada:', url)
        return ctx.response.redirect(url)
      }
      // Se estamos em uma rota protegida
      else {
        const user = ctx.session.get('user')
        if (!user) {
          return ctx.response.redirect('/login')
        }

        // Verifica se é a rota do dashboard
        if (ctx.request.url() === '/dashboard') {
          // Busca o usuário no banco para verificar a role
          const dbUser = await User.findBy('email', user.email)
          
          if (!dbUser || dbUser.role !== 'admin') {
            ctx.session.flash('error', 'Acesso restrito a administradores')
            return ctx.response.redirect('/home')
          }
        }

        await next()
      }
    } catch (error) {
      console.error('Erro no middleware:', error)
      return ctx.response.redirect('/login?error=Authentication failed')
    }
  }
}
