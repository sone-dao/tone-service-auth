import { Context } from 'hono'
import { initDb } from '../../utils/db'

export default async function generateNonce(c: Context, email: string) {
  const db = initDb(c, { database: 'tone' })

  return await new Promise(async (resolve, reject) => {
    const user = await db('tone_users')
      .where({ email })
      .then((users) => {
        !users.length && reject({ ok: false, message: 'NO_USERS_FOUND', email })
        return user[0]
      })
      .catch((error) => reject({ ok: false, message: 'DATABASE_ERROR', error }))
  })
}
