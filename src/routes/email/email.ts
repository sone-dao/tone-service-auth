import { Hono } from 'hono'
import authEmail from './authEmail'
import generateNonce from './generateNonce'

const router = new Hono()

router.get('/', async (c) => {
  const body: any = await c.req.json()
  const { email } = body

  const data = await generateNonce(c, email).catch((error) => error)
  return c.json(data)
})

router.post('/', async (c) => {
  const body: any = await c.req.json()
  const { email, nonce } = body

  const data = await authEmail(c, email, nonce).catch((error) => error)
  return c.json(data)
})

export default router
