import { Hono } from 'hono'
import renewAccessToken from './renewAccessToken'

const router = new Hono()

router.get('/renew', async (c) => {
  const token = c.req.header('Authorization').split(' ')[1]

  const data: any = await renewAccessToken(c, token).catch((error) => error)

  return c.json(data, data.status)
})

export default router
