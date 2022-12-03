require('dotenv').config()
const express = require('express')
const app = express()
require('express-async-errors')

// ConnectDB
const connectDB = require('./db/connect')

// Extra Packages 
const morgan = require('morgan')
const cors = require('cors')

// Router
const authRouter = require('./routes/authRoutes')
const authAdminRouter = require('./routes/admin/authRoutes')

const port = process.env.PORT || 5001


app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/auth/admin', authAdminRouter)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`server listening on port: ${port}`)
    })
  } catch (error) {
    console.log('error: ', error);
  }
}

start()
