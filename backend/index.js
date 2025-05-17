import cors from "cors"
import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import accountRoutes from "./routes/accountRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// middleware
app.use(cors())  // ✅ Allow all origins
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))


//routes
app.use('/api/v1/user',userRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/transaction", transactionRoutes);

app.get('/', (req,res)=>{
    res.send("Sever is running")
})


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
