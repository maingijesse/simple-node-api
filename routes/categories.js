const { Category } = require("../models/category")
const express = require("express")
const Router = express.Router()

Router.get("/", async (req, res) => {
  const categoryList = await Category.find()

  if (!categoryList) {
    res.status(500).json({
      success: false,
    })
  }
  res.send(categoryList)
})

Router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) {
    res.status(500).json({
      message: "The category with the given  id was not found",
    })
  }
  res.status(200).send(category)
})

Router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  )
  if (!category) {
    return res.status(400).send("the category cannot be updated")
  }
  res.send(category)
})

Router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  })

  category = await category.save()
  if (!category) {
    return res.status(404).send("The Category Cannot Be Created")
  }
  res.status(200).send(category)
})

Router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: "The category was successfully deleted",
        })
      } else {
        return res.status(404).json({
          success: false,
          message: "the category could not be found",
        })
      }
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        error: err.message,
      })
    })
})

module.exports = Router

// progrss --- start no 5 folder 4
