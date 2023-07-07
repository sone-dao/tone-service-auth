import { createClient } from '@supabase/supabase-js'
import { Context } from 'hono'
import { v4 as uuidv4 } from 'uuid'
import { sendMail } from '../../utils/email'

export default async function generateNonce(c: Context, email: string = '') {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)

  return await new Promise(async (resolve, reject) => {
    const { data: users, error: usersSqlError } = await supabase
      .from('tone_users')
      .select('*')

    if (usersSqlError)
      reject({ ok: false, message: 'DATABASE_ERROR', error: usersSqlError })

    if (!users.length)
      reject({ ok: false, message: 'NO_USER_FOUND', error: usersSqlError })

    const nonce = uuidv4() || ''

    const { error: nonceSqlError } = await supabase
      .from('tone_users')
      .update({ nonce })
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
      .then((response) => resolve({ ok: true, response }))
      .catch((error) => reject({ ok: false, error }))
  })
}
