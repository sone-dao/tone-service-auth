import { Context, Next } from 'hono'

export default async function infraCheck(c: Context, next: Next) {
  const reqToken = c.req.header('X-Tone-Infra')

  if (reqToken !== c.env.INFRA_SECRET) return c.text('401', 401)

  await next()
}
