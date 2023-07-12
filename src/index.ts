import { infraCheck } from '@sone-dao/tone-middleware'
import { Hono } from 'hono'
import emailRouter from './routes/email/email'
import logoutRouter from './routes/logout/logout'
import tokenRouter from './routes/token/token'

const app = new Hono()

app.use('*', infraCheck)

app.get('/', (c) => c.json({ ok: true, message: 'OK' }))

app.route('/email', emailRouter)
app.route('/token', tokenRouter)
app.route('/logout', logoutRouter)

export default app
