import { Context } from 'hono'
import * as postmark from 'postmark'
import { sendMail } from '../../utils/email'

export default async function authEmail(c: Context, email: string) {
  //const db = initDb(c, { database: 'tone' })
  const mailer = new postmark.ServerClient(c.env.POSTMARK_TOKEN)

  return await new Promise(async (resolve, reject) => {
    if (!email)
      reject({
        ok: false,
        message: 'MISSING_PARAMS',
        params: { email: email || '' },
      })

    /*await db('tone_users')
      .where({ email })
      .then(
        (users) =>
          !users.length &&
          reject({ ok: false, message: 'NO_USERS_FOUND', email })
      )
      .catch((error) => reject({ ok: false, message: 'DATABASE_ERROR', error }))*/

    await sendMail(c, {
      from: 'front-gate@tone.audio',
      to: email,
      subject: 'Test e-mail from Cloudflare worker.',
      body: {
        html: '<strong>Hey, Postmark seems pretty great.',
        text: 'Hey, Postmark seems pretty great.',
      },
    })
      .then((response) => resolve({ ok: true, response }))
      .catch((error) => reject({ ok: false, error }))

    /*mailer
      .sendEmail({
        From: 'front-gate@tone.audio',
        To: email,
        Subject: 'Test email from a Cloudflare worker.',
        HtmlBody: '<strong>Hey, Postmark seems pretty great.',
        //TextBody: 'Hey, Postmark seems pretty great.',
        MessageStream: 'outbound',
      })
      .then((response) =>
        resolve({ ok: true, message: 'E-mail sent successfully', response })
      )
      .catch((error) =>
        reject({ ok: false, message: 'E-mail failed to send', email, error })
      )*/
  })
}
