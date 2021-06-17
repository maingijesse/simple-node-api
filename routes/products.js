const express = require("express")
const { Category } = require("../models/category.js")
const mongoose = require("mongoose")
const Router = express.Router()
const { Product } = require("./../models/products.js")

Router.get(`/`, async (req, res) => {
  let filter = {}
  if (req.params.categories) {
    filter = { category: req.params.categories.split(",") }
  }
  const productList = await Product.find(filter)
  if (!productList) {
    res.status(500).json({
      success: false,
    })
  }
  res.send(productList)
})

Router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category")
  if (!product) {
    res.status(500).json({
      success: false,
    })
  }
  res.send(product)
})

Router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Product ID")
  }
  const category = await Category.findById(req.body.category)
  if (!category) {
    res.status(500).json({
      message: "The category with the given  id was not found",
    })
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  )
  if (!product) {
    return res.status(500).send("the category cannot be updated")
  }
  res.send(product)
})

Router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: "The product was successfully deleted",
        })
      } else {
        return res.status(404).json({
          success: false,
          message: "the product could not be found",
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

Router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).send("Invalid Category")
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  })

  product = await product.save()

  if (!product) {
    return res.status(500).send("The product cannot be created")
  }
  res.send(product)
  // product
  //   .save()
  //   .then((product) => res.status(201).json(product))
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: err._message,
  //       success: false,
  //     })
  //   })
})

Router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments((count) => count)
  if (!productCount) {
    res.status(500).json({
      success: false,
    })
  }
  res.send({ count: productCount })
})

Router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({ isFeatured: true }).limit(+count) //the + makes the param a number instead of a string
  if (!products) {
    res.status(500).json({
      success: false,
    })
  }
  res.send(products)
})

module.exports = Router
