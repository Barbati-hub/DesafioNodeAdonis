declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    ally: import('@ioc:Adonis/Addons/Ally').AllyContract
  }
} 