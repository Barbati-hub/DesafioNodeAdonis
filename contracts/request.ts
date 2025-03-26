declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    cliente?: import('App/Models/Cliente').default
  }
}

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    session: {
      put(key: string, value: any): void
      get(key: string): any
      forget(key: string): void
      flash(key: string, value: any): void
      all(): Record<string, any>
    }
    request: {
      session: {
        put(key: string, value: any): void
        get(key: string): any
        forget(key: string): void
        flash(key: string, value: any): void
        all(): Record<string, any>
      }
    }
  }
} 