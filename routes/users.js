const { User } = require("./../models/user")

const express = require("express")
const Router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

Router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash")

  if (!userList) {
    res.status(500).json({
      success: false,
    })
  }

  res.send(userList)
})

Router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    color: req.body.color,
    passwordHash: bcrypt.hashSync(req.body.password, 7),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  })

  user = await user.save()
  if (!user) return res.status(400).send("The user cannot be created")

  res.send(user)
})

Router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash")
  if (!user) {
    res.status(500).json({
      message: "The user with the given  id was not found",
    })
  }
  res.status(200).send(user)
})

Router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("The user cannot be found")
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.secret,
      {
        expiresIn: "1d",
      }
    )
    return res.status(200).send({
      user: user.email,
      token: token,
    })
  } else {
    res.status(400).send("User password or email not found")
  }
})

module.exports = Router
