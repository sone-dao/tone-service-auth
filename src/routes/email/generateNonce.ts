import { createClient } from '@supabase/supabase-js'
import { Context } from 'hono'
import { v4 as uuidv4 } from 'uuid'
import { sendMail } from '../../utils/email'

export default async function generateNonce(c: Context, email: string = '') {
  const sb = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)

  return await new Promise(async (resolve, reject) => {
    const { data: user, error: usersSqlError } = await sb
      .from('tone_users')
      .select('*')
      .eq('email', email)
      .single()

    if (usersSqlError)
      reject({ ok: false, message: 'DATABASE_ERROR', error: usersSqlError })

    const nonce = uuidv4() || ''

    //TODO: Clean-up old/expired attempts here

    const attempt = {
      createdOn: Date.now(),
      nonce,
    }

    const loginAttempts = user.loginAttempts || []

    const updatedAttempts = [...loginAttempts, attempt]

    const { error: nonceSqlError } = await sb
      .from('tone_users')
      .update({ loginAttempts: updatedAttempts })
      .eq('email', email)

    if (nonceSqlError)
      reject({
        ok: false,
        message: 'ERROR_UPDATING_NONCE',
        error: nonceSqlError,
      })

    await sendMail(c, {
      from: 'auth@tone.audio',
      to: email,
      subject: `Login code for ${email}`,
      body: {
        html: nonce,
        text: nonce,
      },
    })
      .then((response) => resolve({ status: 200, ok: true, response }))
      .catch((error) => reject({ status: 500, ok: false, error }))
  })
}
