import { Hono } from 'hono'
import logoutUser from './logoutUser'

const router = new Hono()

router.get('/', async (c) => {
  const token = c.req.header('Authorization').split(' ')[1]

  const data: any = await logoutUser(c, token).catch((error) => error)
  return c.json(data, data.status)
})

export default router
