import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ ok: true, message: 'OK' })
})

export default app
