import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDb } from './lib/db.js'
import { apiRouter } from './routes/api.js'

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: false
  })
)
app.use(express.json({ limit: '2mb' }))

app.use('/api', apiRouter)

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err)
  res.status(500).send('Server error')
})

const port = Number(process.env.PORT || 5174)

await connectDb()
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})

