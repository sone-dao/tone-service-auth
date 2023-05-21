import { Hono } from 'hono'
import emailRouter from './routes/email/email'

const app = new Hono()

app.get('/', (c) => c.json({ ok: true, message: 'OK' }))

app.route('/email', emailRouter)

export default app
