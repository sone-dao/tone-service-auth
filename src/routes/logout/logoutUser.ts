import { createClient } from '@supabase/supabase-js'
import { Context } from 'hono'
import { Jwt } from 'hono/utils/jwt'

export default async function logoutUser(c: Context, token: string) {
  const sb = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)

  return await new Promise(async (reject, resolve) => {
    const { data: tokenData } = await Jwt.verify(
      token,
      c.env.SESSION_TOKEN_SECRET
    ).catch(() => reject({ status: 401, ok: false, message: 'UNAUTHORIZED' }))

    const { userId } = tokenData

    const { data: user, error: sqlUserError } = await sb
      .from('tone_users')
      .select('*')
      .eq('userId', userId)
      .single()

    if (sqlUserError)
      reject({
        status: 500,
        ok: false,
        message: 'DATABASE_ERROR',
        error: sqlUserError,
      })

    const { activeSessions = [] } = user

    const sessionTokens = activeSessions.map(
      (session: any) => session.sessionToken
    )

    !sessionTokens.includes(token) &&
      reject({ status: 500, ok: false, message: 'TOKEN_NOT_FOUND' })

    const updatedSessions = activeSessions
      .map((session: any) => (session.sessionToken == token ? null : session))
      .filter((x: any) => x)

    const { error: sessionsSqlError } = await sb
      .from('tone_users')
      .update({ activeSessions: updatedSessions })
      .eq('userId', userId)

    if (sessionsSqlError)
      reject({
        status: 500,
        ok: false,
        message: 'DATABASE_ERROR',
        error: sessionsSqlError,
      })

    resolve({
      status: 200,
      ok: true,
      message: 'USER_LOGGED_OUT',
    })
  })
}
