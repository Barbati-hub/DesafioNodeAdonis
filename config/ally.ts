import Env from '@ioc:Adonis/Core/Env'

const allyConfig = {
  google: {
    driver: 'google',
    clientId: Env.get('GOOGLE_CLIENT_ID'),
    clientSecret: Env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: Env.get('GOOGLE_CALLBACK_URL'),
  },
}

export default allyConfig;