import { Hono } from 'hono'
import authEmail from './authEmail'
import generateNonce from './generateNonce'

const router = new Hono()

router.get('/', async (c) => {
  const { email } = c.req.query()

  const data: any = await generateNonce(c, email).catch((error) => error)
  return c.json(data, data.status)
})

router.get('/login', async (c) => {
  const { email, nonce } = c.req.query()

  const data: any = await authEmail(c, email, nonce).catch((error) => error)
  return c.json(data, data.status)
})

export default router
