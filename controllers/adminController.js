const db = require("../models")
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const fs = require("fs")

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] }).then((restaurants) => {
      return res.render("admin/restaurants", { restaurants: restaurants })
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true,
    }).then((categories) => {
      return res.render("admin/create", {
        categories: categories,
      })
    })
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "name didn't exist")
      return res.redirect("back")
    }

    const { file } = req // equal to const file = req.file
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log("Error: ", err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? `/upload/${file.originalname}` : null,
            CategoryId: req.body.categoryId,
          }).then((restaurant) => {
            req.flash("success_messages", "restaurant was successfully created")
            return res.redirect("/admin/restaurants")
          })
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId,
      }).then((restaurant) => {
        req.flash("success_messages", "restaurant was successfully created")
        return res.redirect("/admin/restaurants")
      })
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then((restaurant) => {
      console.log("=============")
      console.log(restaurant)
      return res.render("admin/restaurant", {
        restaurant: restaurant.toJSON(),
      })
    })
  },

  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true,
    }).then((categories) => {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        return res.render("admin/create", {
          categories: categories,
          restaurant: restaurant.toJSON(),
        })
      })
    })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "name didn't exist")
      return res.redirect("back")
    }

    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log("Error: ", err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(req.params.id).then((restaurant) => {
            restaurant
              .update({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: file ? `/upload/${file.originalname}` : restaurant.image,
                CategoryId: req.body.categoryId,
              })
              .then((restaurant) => {
                req.flash("success_messages", "restaurant was successfully to update")
                res.redirect("/admin/restaurants")
              })
          })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId,
          })
          .then((restaurant) => {
            req.flash("success_messages", "restaurant was successfully to update")
            res.redirect("/admin/restaurants")
          })
      })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy().then((restaurant) => {
        res.redirect("/admin/restaurants")
      })
    })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then((users) => {
      return res.render("admin/users", { users: users })
    })
  },

  toggleAdmin: (req, res) => {
    //訪問的user必定 isAdmin===true
    return User.findByPk(req.params.id).then((user) => {
      const userData = user.dataValues
      if (userData.email === "root@example.com") {
        req.flash("error_messages", "禁止變更管理者權限")
        return res.redirect("back")
      }
      user.update({ isAdmin: !userData.isAdmin }).then((user) => {
        req.flash("success_messages", "使用者權限變更成功")
        res.redirect("/admin/users")
      })
    })
  },
}

module.exports = adminController
