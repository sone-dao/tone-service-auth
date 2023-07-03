import { Hono } from 'hono'
import authEmail from './authEmail'

const router = new Hono()

router.post('/', async (c) => {
  const body: any = await c.req.json()
  const { email } = body

  const data = await authEmail(c, email).catch((error) => error)
  return c.json(data)
})

export default router
