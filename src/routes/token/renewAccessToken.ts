import { createClient } from '@supabase/supabase-js'
import { Context } from 'hono'
import { Jwt } from 'hono/utils/jwt'
import { genAccessToken } from '../../utils/tokens'

export default async function renewAccessToken(c: Context, token: string) {
  const sb = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)

  return await new Promise(async (resolve, reject) => {
    const { data: tokenData } = await Jwt.verify(
      token,
      c.env.SESSION_TOKEN_SECRET
    ).catch((error) =>
      reject({ status: 401, ok: false, message: 'INVALID_TOKEN', error })
    )

    const { userId } = tokenData

    const { data: userData, error: userSqlError } = await sb
      .from('tone_users')
      .select('*')
      .eq('userId', userId)
      .single()

    if (userSqlError)
      reject({
        status: 500,
        ok: false,
        message: 'DATABASE_ERROR',
        error: userSqlError,
      })

    const { activeSessions } = userData

    const sessionTokens = activeSessions.map(
      (session: any) => session.sessionToken
    )

    !sessionTokens.includes(token) &&
      reject({ status: 500, ok: false, message: 'UNAUTHORIZED' })

    const accessToken = await genAccessToken(
      { userId: userData.userId, roles: userData.roles },
      c.env.ACCESS_TOKEN_SECRET
    )

    resolve({
      status: 200,
      ok: true,
      message: 'ACCESS_TOKEN_GENERATED',
      tokens: {
        access: accessToken,
      },
    })
  })
}
