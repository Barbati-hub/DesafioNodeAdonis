import { Strategy } from 'passport'

declare module 'passport' {
  interface PassportStatic {
    _strategies: {
      [key: string]: Strategy
    }
  }
} 