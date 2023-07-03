import { Context } from 'hono'
import { knex } from 'knex'

interface IInitDbConfig {
  database: string
}

export function initDb(c: Context, config: IInitDbConfig) {
  return knex({
    client: 'pg',
    connection: `postgres://${c.env.DB_USER}:${c.env.DB_PASS}@${c.env.DB_HOST}:${c.env.DB_PORT}/${config.database}`,
    searchPath: ['knex', 'public'],
  })
}
