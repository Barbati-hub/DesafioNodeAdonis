/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'
import { join } from 'path'

sourceMapSupport.install({ handleUncaughtExceptions: false })

// Force port 3333
process.env.PORT = '3333'
process.env.HOST = 'localhost'

new Ignitor(__dirname)
  .httpServer()
  .start()
  .catch(console.error)
