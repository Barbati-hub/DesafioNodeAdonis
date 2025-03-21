import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async google({ response }: HttpContextContract) {
    console.log('Iniciando método google do AuthController')
    try {
      // O middleware GoogleAuth já cuida do redirecionamento
      console.log('Delegando para o middleware GoogleAuth')
    } catch (error) {
      console.error('Erro no método google:', error)
      return response.redirect('/login?error=Authentication failed')
    }
  }

  public async googleCallback({ response, session }: HttpContextContract) {
    console.log('Iniciando método googleCallback do AuthController')
    try {
      const userData = session.get('user')
      console.log('Dados do usuário na sessão:', userData)

      if (!userData || !userData.email) {
        console.error('Dados do usuário não encontrados na sessão')
        return response.redirect('/login?error=Authentication failed')
      }

      // Procura ou cria o usuário
      let user = await User.findBy('email', userData.email)
      console.log('Usuário encontrado no banco:', user)

      if (!user) {
        console.log('Criando novo usuário')
        user = await User.create({
          email: userData.email,
          name: userData.name,
          googleId: userData.sub || userData.email,
          avatar: userData.picture,
          role: 'user' // Por padrão, novos usuários são 'user'
        })
        console.log('Novo usuário criado:', user)
      }

      // Atualiza a sessão com os dados do usuário do banco
      session.put('user', {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: userData.picture,
        avatar: user.avatar,
        role: user.role // Inclui a role na sessão
      })
      console.log('Sessão atualizada com dados do usuário')

      // Se for admin, redireciona para o dashboard, senão para a home
      if (user.role === 'admin') {
        return response.redirect('/dashboard')
      } else {
        return response.redirect('/home')
      }
    } catch (error) {
      console.error('Erro no callback do Google:', error)
      return response.redirect('/login?error=Authentication failed')
    }
  }

  public async logout({ response, session }: HttpContextContract) {
    console.log('Iniciando logout')
    session.clear()
    console.log('Sessão limpa')
    return response.redirect('/')
  }
} 