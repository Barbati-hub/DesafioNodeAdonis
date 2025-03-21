import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OAuth2Client } from 'google-auth-library'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class GoogleAuth {
  private client: OAuth2Client

  constructor() {
    const clientId = Env.get('GOOGLE_CLIENT_ID')
    const clientSecret = Env.get('GOOGLE_CLIENT_SECRET')
    const callbackUrl = Env.get('GOOGLE_CALLBACK_URL')

    console.log('🔧 Configuração OAuth:', { clientId, callbackUrl })

    this.client = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri: callbackUrl,
    })
  }

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    try {
      console.log('📍 URL atual:', ctx.request.url())
      console.log('🔑 Sessão atual:', ctx.session.get('user'))

      // Se estamos na rota de login, permitir acesso
      if (ctx.request.url() === '/login') {
        console.log('✅ Rota de login, permitindo acesso')
        return next()
      }

      // Se já existe uma sessão válida
      const sessionUser = ctx.session.get('user')
      if (sessionUser?.id) {
        console.log('👤 Usuário autenticado:', sessionUser)
        // Verifica se é rota do dashboard
        if (ctx.request.url() === '/dashboard' && sessionUser.role !== 'admin') {
          console.log('🚫 Acesso negado ao dashboard para não-admin')
          return ctx.response.redirect('/home')
        }
        return next()
      }

      // Se estamos no callback do Google
      if (ctx.request.url().includes('/auth/google/callback')) {
        console.log('🔄 Processando callback do Google')
        return this.handleCallback(ctx)
      }

      // Se estamos iniciando autenticação com Google
      if (ctx.request.url().includes('/auth/google')) {
        console.log('🚀 Iniciando autenticação com Google')
        return this.handleAuth(ctx)
      }

      // Se chegou aqui, não está autenticado
      console.log('⚠️ Usuário não autenticado, redirecionando para login')
      return ctx.response.redirect('/login')
    } catch (error) {
      console.error('❌ Erro no middleware:', error)
      // Limpa a sessão em caso de erro
      await ctx.session.clear()
      return ctx.response.redirect('/login?error=auth_failed')
    }
  }

  private async handleCallback(ctx: HttpContextContract) {
    const { code } = ctx.request.qs()
    console.log('🎫 Código recebido:', code ? 'Presente' : 'Ausente')
    
    if (!code) {
      console.log('❌ Código ausente no callback')
      return ctx.response.redirect('/login?error=missing_code')
    }

    try {
      console.log('🔄 Obtendo tokens...')
      // Obter tokens
      const { tokens } = await this.client.getToken(code)
      console.log('🎟️ Tokens obtidos:', tokens ? 'Sucesso' : 'Falha')
      
      if (!tokens?.id_token) {
        console.error('❌ Tokens inválidos')
        throw new Error('Tokens inválidos')
      }

      // Verificar token
      console.log('🔍 Verificando token...')
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: Env.get('GOOGLE_CLIENT_ID')
      })

      const payload = ticket.getPayload()
      console.log('📦 Payload:', payload ? 'Recebido' : 'Ausente')
      
      if (!payload?.email) {
        console.error('❌ Payload inválido')
        throw new Error('Payload inválido')
      }

      // Procura ou cria usuário
      console.log('🔍 Buscando usuário:', payload.email)
      let user = await User.findBy('email', payload.email)
      
      if (!user) {
        console.log('➕ Criando novo usuário')
        user = await User.create({
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          googleId: payload.sub,
          avatar: payload.picture,
          role: 'user'
        })
        console.log('✅ Novo usuário criado:', user.id)
      } else {
        console.log('✅ Usuário existente encontrado:', user.id)
      }

      // Limpa sessão antiga e cria nova
      await ctx.session.clear()
      await ctx.session.put('user', {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role
      })

      // Força gravação da sessão
      await ctx.session.commit()
      console.log('💾 Sessão atualizada')

      // Redireciona baseado na role
      const redirectUrl = user.role === 'admin' ? '/dashboard' : '/home'
      console.log('➡️ Redirecionando para:', redirectUrl)
      return ctx.response.redirect(redirectUrl)
    } catch (error) {
      console.error('❌ Erro ao processar callback:', error)
      return ctx.response.redirect('/login?error=token_processing')
    }
  }

  private async handleAuth(ctx: HttpContextContract) {
    try {
      console.log('🔄 Gerando URL de autenticação...')
      const url = this.client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        response_type: 'code',
        state: Math.random().toString(36).substring(7)
      })
      console.log('🔗 URL gerada:', url)
      return ctx.response.redirect(url)
    } catch (error) {
      console.error('❌ Erro ao gerar URL de autenticação:', error)
      return ctx.response.redirect('/login?error=auth_failed')
    }
  }
}
