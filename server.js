import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/authRouter.js';
import connectDB from './config/mongodb.js';
import cors from 'cors'

dotenv.config();

const app = express();
app.use(express.json());
connectDB();

const allowedOrigins = ['https://portfolio-frontend-liart-omega.vercel.app/'];
app.use(cors({origin:'*', credentials: true}))

const PORT = process.env.PORT || 5000;

app.get('/', (req, res)=> res.send("app is running here...."))
app.use('/api/v1', authRouter)

app.listen(PORT,
    console.log(`App is running of port: ${PORT}`)
)
