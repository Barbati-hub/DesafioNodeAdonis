import { ViewConfig } from '@ioc:Adonis/Core/View'

const viewConfig: ViewConfig = {
  /*
  |--------------------------------------------------------------------------
  | Cache views
  |--------------------------------------------------------------------------
  |
  | Define whether or not to cache the compiled view templates. We recommend
  | not to cache views in development.
  |
  */
  cache: false,

  /*
  |--------------------------------------------------------------------------
  | Cache includes
  |--------------------------------------------------------------------------
  |
  | Define whether or not to cache include files as well. We recommend
  | not to cache includes in development.
  |
  */
  cacheIncludes: false,
}

export default viewConfig 