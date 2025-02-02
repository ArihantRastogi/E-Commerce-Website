import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cookieParser from 'cookie-parser';
import sellerRouter from './routes/sellerRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import chatRouter from './routes/chatRoute.js'

const app = express()
const port = process.env.PORT || 4000
connectDB()

app.use(express.json())
app.use(cors())
app.use(cookieParser());


app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/sell', sellerRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter)
app.use('/api/chat', chatRouter)

app.get('/', (req, res) => {
    res.send("API is running")
})

app.listen(port, () => console.log(`Server is running on port ${port}`))