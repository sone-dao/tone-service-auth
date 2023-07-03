import { Context } from 'hono'
import { initDb } from '../../utils/db'
import { sendMail } from '../../utils/email'

export default async function authEmail(
  c: Context,
  email: string,
  nonce: string
) {
  const db = initDb(c, { database: 'tone' })
  const mailPlaceholder = sendMail

  return await new Promise(async (resolve, reject) => {
    if (!email)
      reject({
        ok: false,
        message: 'MISSING_PARAMS',
        params: { email: email || '' },
      })

    const user = await db('tone_users')
      .where({ email })
      .then((users) => {
        !users.length && reject({ ok: false, message: 'NO_USERS_FOUND', email })
        return user[0]
      })
      .catch((error) => reject({ ok: false, message: 'DATABASE_ERROR', error }))

    nonce !== user.nonce && reject({ ok: false, message: 'INVALID_NONCE' })

    /*await sendMail(c, {
      from: 'concierge@tone.audio',
      to: email,
      subject: 'Test e-mail from Cloudflare worker.',
      body: {
        html: '<strong>Hey, Postmark seems pretty great.',
        text: 'Hey, Postmark seems pretty great.',
      },
    })
      .then((response) => resolve({ ok: true, response }))
      .catch((error) => reject({ ok: false, error }))*/
  })
}
