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
const userRouter = require('./routes/userRoutes')

// Admin Router
const authAdminRouter = require('./routes/admin/authAdminRoutes')
const userAdminRouter = require('./routes/admin/userAdminRoutes')
const errorHandlerMiddleware = require('./middleware/error-handler')
const NotFoundMiddleware = require('./middleware/not-found')

const port = process.env.PORT || 5001

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)

//Admin Routes
app.use('/api/v1/admin/auth', authAdminRouter)
app.use('/api/v1/admin/user', userAdminRouter)

app.use(NotFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`server listening on port: ${port}`)
    })
  } catch (error) {
    console.log('error: ', error)
  }
}

start()
