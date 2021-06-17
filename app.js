const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")
const productsRouter = require("./routes/products")
const categoriesRouter = require("./routes/categories")
const usersRouter = require("./routes/users")
const authJwt = require("./helpers/jwt")

// environment variables
const api = process.env.API_URL
const db = process.env.DB_URL

// import mongoose schema and product model
// const Product = require("./models/products")

// middlewares
app.use(cors())
app.use("*", cors())
app.use(express.json())
app.use(morgan("dev"))
// app.use(authJwt)
app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database ready....")
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(3000, () => {
  console.log("app running on http://localhost:3000")
})
