import { Jwt } from 'hono/utils/jwt'

declare global {
  const ACCESS_TOKEN_SECRET: string
  const SESSION_TOKEN_SECRET: string
}

export async function genAccessToken(userData: any, secret: string) {
  if (!secret) return false

  const expires = new Date()

  expires.setMinutes(expires.getMinutes() + 15)

  const expiresIn = expires.getTime()

  return await Jwt.sign(
    { data: userData, createdOn: Date.now(), expiresIn },
    secret
  )
}

export async function genSessionToken(userData: any, secret: string) {
  if (!secret) return false

  return await Jwt.sign({ data: userData, createdOn: Date.now() }, secret)
}
