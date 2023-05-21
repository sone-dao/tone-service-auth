import { Context, Next } from 'hono'
import { Jwt } from 'hono/utils/jwt'

export default async function authToken(c: Context, next: Next) {
  const authHeader = c.req.header('authorization') || ''

  const token = authHeader.split(' ')[1] || ''

  if (!token) return c.json({ ok: false, message: 'INVALID_TOKEN' }, 401)

  if (token.split('.').length !== 3)
    return c.json({ ok: false, message: 'INVALID_TOKEN' }, 401)

  const isTokenValid = await Jwt.verify(
    token,
    c.env.ACCESS_TOKEN_SECRET!
  ).catch(() => false)

  if (!isTokenValid) return c.json({ ok: false, message: 'INVALID_TOKEN' }, 403)

  const payload = Jwt.decode(token).payload || ''

  console.log({ authHeader, token, isTokenValid, payload })

  if (!payload) return c.json({ ok: false, message: 'INVALID_TOKEN' }, 403)

  c.set('user', payload.data)

  await next()
}
