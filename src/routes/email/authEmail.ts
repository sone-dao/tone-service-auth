import { createClient } from '@supabase/supabase-js'
import { Context } from 'hono'
import { genAccessToken, genSessionToken } from '../../utils/tokens'

export default async function authEmail(
  c: Context,
  email: string,
  nonce: string
) {
  const sb = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)

  return await new Promise(async (resolve, reject) => {
    const { data: user, error: userSqlError } = await sb
      .from('tone_users')
      .select('*')
      .eq('email', email)
      .single()

    if (userSqlError || !user.nonce)
      reject({ ok: false, message: 'DATABASE_ERROR', error: userSqlError })

    if (user.nonce !== nonce)
      reject({ status: 500, ok: false, message: 'INVALID_NONCE' })

    const tokenPayload = { userId: user.userId, roles: user.roles }

    const sessionToken = await genSessionToken(
      tokenPayload,
      c.env.SESSION_TOKEN_SECRET
    )

    const accessToken = await genAccessToken(
      tokenPayload,
      c.env.ACCESS_TOKEN_SECRET
    )

    const activeSessions = user.activeSessions || []

    const updatedSessions = [
      ...activeSessions,
      { sessionToken, createdOn: Date.now() },
    ]

    const { error: updateSessionsSqlError } = await sb
      .from('tone_users')
      .update({ activeSessions: updatedSessions })
      .eq('userId', user.userId)

    if (updateSessionsSqlError)
      reject({
        status: 500,
        ok: false,
        message: 'DATABASE_ERROR',
        error: updateSessionsSqlError,
      })

    resolve({
      ok: true,
      message: 'USER_LOGGED_IN',
      tokens: {
        access: accessToken,
        session: sessionToken,
      },
    })
  })
}
